import React, { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useAuth } from './AuthContext';
import type { Task, Subject, TaskPriority } from '../types/tasks';
import subjectsData from '../data/subjects.json';

export type DateRangeFilter = 'ALL' | 'TODAY' | 'THIS_WEEK' | 'THIS_MONTH' | 'THIS_TERM';

export interface TaskFilters {
    subjects: string[];
    priorities: TaskPriority[];
    dateRange: DateRangeFilter;
}

interface TasksContextType {
    tasks: Task[];
    filteredTasks: Task[];
    isLoading: boolean;
    error: string | null;
    addTask: (task: Omit<Task, 'id' | 'userId' | 'createdAt'>) => Promise<string>;
    updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
    deleteTask: (taskId: string, task?: Task) => Promise<void>;
    undoDelete: () => Promise<void>;
    addBatchTasks: (tasks: Omit<Task, 'id' | 'userId' | 'createdAt'>[]) => Promise<void>;
    subjects: Subject[];
    filters: TaskFilters;
    setFilters: React.Dispatch<React.SetStateAction<TaskFilters>>;
    clearFilters: () => void;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const TasksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const deletedTasksRef = useRef<Task[]>([]);
    
    // Using subjects from the data file
    const subjects: Subject[] = subjectsData;
    
    const [filters, setFilters] = useState<TaskFilters>({
        subjects: [],
        priorities: [],
        dateRange: 'ALL'
    });

    const clearFilters = useCallback(() => {
        setFilters({ subjects: [], priorities: [], dateRange: 'ALL' });
    }, []);

    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            // Subject Filter
            if (filters.subjects.length > 0 && (!task.subjectId || !filters.subjects.includes(task.subjectId))) {
                return false;
            }

            // Priority Filter
            if (filters.priorities.length > 0 && !filters.priorities.includes(task.priority)) {
                return false;
            }

            // Date Range Filter
            if (filters.dateRange !== 'ALL') {
                if (!task.dueDate) return false; // Hide tasks without due dates when a specific date range is selected
                
                const due = new Date(task.dueDate);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                const dueTime = due.getTime();
                // const todayTime = today.getTime();
                
                if (filters.dateRange === 'TODAY') {
                    // Today or overdue
                    const endOfToday = new Date(today);
                    endOfToday.setHours(23, 59, 59, 999);
                    if (dueTime > endOfToday.getTime()) return false;
                } else if (filters.dateRange === 'THIS_WEEK') {
                    const nextWeek = new Date(today);
                    nextWeek.setDate(today.getDate() + 7);
                    nextWeek.setHours(23, 59, 59, 999);
                    if (dueTime > nextWeek.getTime()) return false;
                } else if (filters.dateRange === 'THIS_MONTH') {
                    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
                    if (dueTime > endOfMonth.getTime() || dueTime < new Date(today.getFullYear(), today.getMonth(), 1).getTime()) return false;
                } else if (filters.dateRange === 'THIS_TERM') {
                    // Example logic for "This Term": Next 4 months
                    const endOfTerm = new Date(today);
                    endOfTerm.setMonth(today.getMonth() + 4);
                    if (dueTime > endOfTerm.getTime()) return false;
                }
            }

            return true;
        });
    }, [tasks, filters]);

    useEffect(() => {
        if (!user) {
            setTasks([]);
            setIsLoading(false);
            return;
        }

        let unsubscribe: (() => void) | undefined;

        const loadTasks = async () => {
            try {
                setIsLoading(true);
                const { db } = await import('../lib/firebase');
                const { collection, query, onSnapshot } = await import('firebase/firestore');

                // Ens assegurem de consultar la subcol·lecció correcta
                const q = query(collection(db, 'users', user.id, 'tasks'));
                
                unsubscribe = onSnapshot(q, (snapshot) => {
                    const loadedTasks: Task[] = [];
                    snapshot.forEach((doc) => {
                        const data = doc.data();
                        loadedTasks.push({
                            id: doc.id,
                            userId: data.userId,
                            title: data.title,
                            description: data.description,
                            status: data.status,
                            priority: data.priority,
                            dueDate: data.dueDate,
                            startDate: data.startDate,
                            estimatedMinutes: data.estimatedMinutes,
                            source: data.source,
                            createdAt: data.createdAt,
                            subjectId: data.subjectId
                        });
                    });
                    setTasks(loadedTasks);
                    setIsLoading(false);
                }, (err) => {
                    console.error("Error loading tasks:", err);
                    setError("Failed to load tasks.");
                    setIsLoading(false);
                });

            } catch (err) {
                console.error("Failed to initialize tasks listener", err);
                setError("Initialization error.");
                setIsLoading(false);
            }
        };

        loadTasks();

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [user]);

    const addTask = useCallback(async (taskData: Omit<Task, 'id' | 'userId' | 'createdAt'>): Promise<string> => {
        if (!user) throw new Error("No user logged in");
        
        try {
            const { db } = await import('../lib/firebase');
            const { collection, addDoc } = await import('firebase/firestore');
            
            const newTask = {
                ...taskData,
                userId: user.id,
                title: taskData.title.trim() === '' ? 'Nova Tasca' : taskData.title,
                createdAt: new Date().toISOString()
            };

            const docRef = await addDoc(collection(db, 'users', user.id, 'tasks'), newTask);
            return docRef.id;
        } catch (err) {
            console.error("Error adding task:", err);
            throw err;
        }
    }, [user]);

    const addBatchTasks = useCallback(async (tasksData: Omit<Task, 'id' | 'userId' | 'createdAt'>[]) => {
        if (!user) throw new Error("No user logged in");
        
        try {
            const { db } = await import('../lib/firebase');
            const { collection, writeBatch, doc } = await import('firebase/firestore');
            
            const batch = writeBatch(db);
            const tasksRef = collection(db, 'users', user.id, 'tasks');

            tasksData.forEach(taskData => {
                const newDocRef = doc(tasksRef);
                batch.set(newDocRef, {
                    ...taskData,
                    userId: user.id,
                    title: taskData.title.trim() === '' ? 'Nova Tasca' : taskData.title,
                    createdAt: new Date().toISOString()
                });
            });

            await batch.commit();
        } catch (err) {
            console.error("Error adding batch tasks:", err);
            throw err;
        }
    }, [user]);

    const updateTask = useCallback(async (taskId: string, updates: Partial<Task>) => {
        console.log("updateTask called for", taskId, "with updates:", updates);
        
        // Optimistic update locally (SYNCHRONOUS to avoid flickering)
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates } : t));
                try {
                if (!user) throw new Error("No user logged in");
                const { db } = await import('../lib/firebase');
                const { doc, updateDoc } = await import('firebase/firestore');
                
                const taskRef = doc(db, 'users', user.id, 'tasks', taskId);
            await updateDoc(taskRef, updates);
        } catch (err) {
            console.error("Error updating task:", err);
            // Revert would go here in a robust implementation
            throw err;
        }
    }, [user]);

    const deleteTask = useCallback(async (taskId: string, task?: Task) => {
        try {
            if (!user) throw new Error("No user logged in");
            const { db } = await import('../lib/firebase');
            const { doc, deleteDoc } = await import('firebase/firestore');
            
            setTasks(prev => {
                const found = task || prev.find(t => t.id === taskId);
                if (found) deletedTasksRef.current.push(found);
                return prev.filter(t => t.id !== taskId);
            });
            
            await deleteDoc(doc(db, 'users', user.id, 'tasks', taskId));
        } catch (err) {
            console.error("Error deleting task:", err);
            throw err;
        }
    }, [user]);

    const undoDelete = useCallback(async () => {
        const lastDeleted = deletedTasksRef.current.pop();
        if (!lastDeleted) return;

        try {
            if (!user) throw new Error("No user logged in");
            const { db } = await import('../lib/firebase');
            const { doc, setDoc } = await import('firebase/firestore');
            
            await setDoc(doc(db, 'users', user.id, 'tasks', lastDeleted.id), {
                userId: lastDeleted.userId,
                title: lastDeleted.title,
                description: lastDeleted.description,
                status: lastDeleted.status,
                priority: lastDeleted.priority,
                dueDate: lastDeleted.dueDate,
                startDate: lastDeleted.startDate,
                estimatedMinutes: lastDeleted.estimatedMinutes,
                source: lastDeleted.source,
                createdAt: lastDeleted.createdAt
            });
        } catch (err) {
            console.error("Error undoing delete:", err);
            deletedTasksRef.current.push(lastDeleted); // put it back on failure
        }
    }, [user]);

    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
                // Preveiem que desfaci accions dins d'un input si està escrivint
                if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
                e.preventDefault();
                undoDelete();
            }
        };
        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, [undoDelete]);

    return (
        <TasksContext.Provider value={{ tasks, filteredTasks, isLoading, error, addTask, updateTask, deleteTask, undoDelete, addBatchTasks, subjects, filters, setFilters, clearFilters }}>
            {children}
        </TasksContext.Provider>
    );
};

export const useTasks = () => {
    const context = useContext(TasksContext);
    if (context === undefined) {
        throw new Error('useTasks must be used within a TasksProvider');
    }
    return context;
};
