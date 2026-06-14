import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import type { Task, Subject } from '../types/tasks';
import subjectsData from '../data/subjects.json';

interface TasksContextType {
    tasks: Task[];
    isLoading: boolean;
    error: string | null;
    addTask: (task: Omit<Task, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
    updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
    deleteTask: (taskId: string, task?: Task) => Promise<void>;
    undoDelete: () => Promise<void>;
    addBatchTasks: (tasks: Omit<Task, 'id' | 'userId' | 'createdAt'>[]) => Promise<void>;
    subjects: Subject[];
    activeSubjectId: string | null;
    setActiveSubjectId: (id: string | null) => void;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const TasksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const deletedTasksRef = useRef<Task[]>([]);
    
    // Using subjects from the data file
    const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null);
    const subjects: Subject[] = subjectsData;

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
                const { collection, query, where, onSnapshot } = await import('firebase/firestore');

                const q = query(collection(db, 'tasks'), where('userId', '==', user.id));
                
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

    const addTask = useCallback(async (taskData: Omit<Task, 'id' | 'userId' | 'createdAt'>) => {
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

            await addDoc(collection(db, 'tasks'), newTask);
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
            const tasksRef = collection(db, 'tasks');

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
            const { db } = await import('../lib/firebase');
            const { doc, updateDoc } = await import('firebase/firestore');
            
            const taskRef = doc(db, 'tasks', taskId);
            await updateDoc(taskRef, updates);
        } catch (err) {
            console.error("Error updating task:", err);
            // Revert would go here in a robust implementation
            throw err;
        }
    }, []);

    const deleteTask = useCallback(async (taskId: string, task?: Task) => {
        try {
            const { db } = await import('../lib/firebase');
            const { doc, deleteDoc } = await import('firebase/firestore');
            
            setTasks(prev => {
                const found = task || prev.find(t => t.id === taskId);
                if (found) deletedTasksRef.current.push(found);
                return prev.filter(t => t.id !== taskId);
            });
            
            await deleteDoc(doc(db, 'tasks', taskId));
        } catch (err) {
            console.error("Error deleting task:", err);
            throw err;
        }
    }, []);

    const undoDelete = useCallback(async () => {
        const lastDeleted = deletedTasksRef.current.pop();
        if (!lastDeleted) return;

        try {
            const { db } = await import('../lib/firebase');
            const { doc, setDoc } = await import('firebase/firestore');
            
            await setDoc(doc(db, 'tasks', lastDeleted.id), {
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
    }, []);

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
        <TasksContext.Provider value={{ tasks, isLoading, error, addTask, updateTask, deleteTask, undoDelete, addBatchTasks, subjects, activeSubjectId, setActiveSubjectId }}>
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
