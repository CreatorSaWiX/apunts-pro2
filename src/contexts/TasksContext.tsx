import React, { createContext, useContext, useEffect, useRef, useMemo } from 'react';
import { createStore, useStore } from 'zustand';
import { useAuth, type User } from './AuthContext';
import type { Task, Subject, TaskPriority } from '../types/tasks';
import subjectsData from '../data/subjects.json';
import { useSettingsStore } from '../stores/useSettingsStore';

export type DateRangeFilter = 'ALL' | 'TODAY' | 'THIS_WEEK' | 'THIS_MONTH' | 'THIS_TERM';

export interface TaskFilters {
    subjects: string[];
    priorities: TaskPriority[];
    dateRange: DateRangeFilter;
}

export interface TasksState {
    tasks: Task[];
    subjects: Subject[];
    filters: TaskFilters;
    isLoading: boolean;
    error: string | null;
    user: User | null; // Stored user from AuthContext
    deletedTasks: Task[]; // internal

    filteredTasks: Task[]; // Derived state

    setTasks: (tasks: Task[]) => void;
    setSubjects: (subjects: Subject[]) => void;
    setIsLoading: (v: boolean) => void;
    setError: (e: string | null) => void;
    setFilters: (f: TaskFilters | ((prev: TaskFilters) => TaskFilters)) => void;
    clearFilters: () => void;
    setUser: (u: User | null) => void;

    addTask: (task: Omit<Task, 'id' | 'userId' | 'createdAt'>) => Promise<string>;
    updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
    deleteTask: (taskId: string, task?: Task) => Promise<void>;
    undoDelete: () => Promise<void>;
    addBatchTasks: (tasks: Omit<Task, 'id' | 'userId' | 'createdAt'>[]) => Promise<void>;
}

type TasksStore = ReturnType<typeof createTasksStore>;

const computeFilteredTasks = (tasks: Task[], filters: TaskFilters): Task[] => {
    return tasks.filter(task => {
        if (filters.subjects.length > 0 && (!task.subjectId || !filters.subjects.includes(task.subjectId))) return false;
        if (filters.priorities.length > 0 && !filters.priorities.includes(task.priority)) return false;
        if (filters.dateRange !== 'ALL') {
            if (!task.dueDate) return false;
            const due = new Date(task.dueDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const dueTime = due.getTime();
            
            if (filters.dateRange === 'TODAY') {
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
                const endOfTerm = new Date(today);
                endOfTerm.setMonth(today.getMonth() + 4);
                if (dueTime > endOfTerm.getTime()) return false;
            }
        }
        return true;
    });
};

const createTasksStore = () =>
    createStore<TasksState>((set, get) => ({
        tasks: [],
        subjects: [],
        filters: { subjects: [], priorities: [], dateRange: 'ALL' },
        isLoading: true,
        error: null,
        user: null,
        deletedTasks: [],
        filteredTasks: [],

        setTasks: (tasks) => set(state => ({ tasks, filteredTasks: computeFilteredTasks(tasks, state.filters) })),
        setSubjects: (subjects) => set({ subjects }),
        setIsLoading: (isLoading) => set({ isLoading }),
        setError: (error) => set({ error }),
        setUser: (user) => set({ user }),
        
        setFilters: (filtersUpdater) => set((state) => {
            const newFilters = typeof filtersUpdater === 'function' ? filtersUpdater(state.filters) : filtersUpdater;
            return { filters: newFilters, filteredTasks: computeFilteredTasks(state.tasks, newFilters) };
        }),
        clearFilters: () => set(state => {
            const newFilters: TaskFilters = { subjects: [], priorities: [], dateRange: 'ALL' };
            return { filters: newFilters, filteredTasks: computeFilteredTasks(state.tasks, newFilters) };
        }),

        addTask: async (taskData) => {
            const { user } = get();
            if (!user) throw new Error("No user logged in");
            const [{ db }, { collection, addDoc }] = await Promise.all([
                import('../lib/firebase'),
                import('firebase/firestore')
            ]);
            
            const newTask = {
                ...taskData,
                userId: user.id,
                title: taskData.title.trim() === '' ? 'Nova Tasca' : taskData.title,
                createdAt: new Date().toISOString()
            };
            const cleanTask = Object.fromEntries(Object.entries(newTask).filter(([_, v]) => v !== undefined));
            const docRef = await addDoc(collection(db, 'users', user.id, 'tasks'), cleanTask);
            return docRef.id;
        },

        addBatchTasks: async (tasksData) => {
            const { user } = get();
            if (!user) throw new Error("No user logged in");
            const [{ db }, { collection, writeBatch, doc }] = await Promise.all([
                import('../lib/firebase'),
                import('firebase/firestore')
            ]);
            
            const batch = writeBatch(db);
            const tasksRef = collection(db, 'users', user.id, 'tasks');
            tasksData.forEach(taskData => {
                const newDocRef = doc(tasksRef);
                const newTask = {
                    ...taskData,
                    userId: user.id,
                    title: taskData.title.trim() === '' ? 'Nova Tasca' : taskData.title,
                    createdAt: new Date().toISOString()
                };
                const cleanTask = Object.fromEntries(Object.entries(newTask).filter(([_, v]) => v !== undefined));
                batch.set(newDocRef, cleanTask);
            });
            await batch.commit();
        },

        updateTask: async (taskId, updates) => {
            const { user, tasks, filters } = get();
            // Optimistic update locally
            const newTasks = tasks.map(t => t.id === taskId ? { ...t, ...updates } : t);
            set({ tasks: newTasks, filteredTasks: computeFilteredTasks(newTasks, filters) });
            
            if (!user) throw new Error("No user logged in");
            const [{ db }, { doc, updateDoc }] = await Promise.all([
                import('../lib/firebase'),
                import('firebase/firestore')
            ]);
            const taskRef = doc(db, 'users', user.id, 'tasks', taskId);
            await updateDoc(taskRef, updates);
        },

        deleteTask: async (taskId, task) => {
            const { user, tasks, deletedTasks, filters } = get();
            if (!user) throw new Error("No user logged in");
            
            const found = task || tasks.find(t => t.id === taskId);
            const newTasks = tasks.filter(t => t.id !== taskId);
            const newDeleted = found ? [...deletedTasks, found] : deletedTasks;
            
            set({ tasks: newTasks, deletedTasks: newDeleted, filteredTasks: computeFilteredTasks(newTasks, filters) });
            
            const [{ db }, { doc, deleteDoc }] = await Promise.all([
                import('../lib/firebase'),
                import('firebase/firestore')
            ]);
            await deleteDoc(doc(db, 'users', user.id, 'tasks', taskId));
        },

        undoDelete: async () => {
            const { user, deletedTasks } = get();
            if (!user || deletedTasks.length === 0) return;
            
            const lastDeleted = deletedTasks[deletedTasks.length - 1];
            const newDeleted = deletedTasks.slice(0, -1);
            set({ deletedTasks: newDeleted });
            
            try {
                const [{ db }, { doc, setDoc }] = await Promise.all([
                    import('../lib/firebase'),
                    import('firebase/firestore')
                ]);
                await setDoc(doc(db, 'users', user.id, 'tasks', lastDeleted.id), {
                    userId: lastDeleted.userId,
                    title: lastDeleted.title,
                    description: lastDeleted.description,
                    status: lastDeleted.status,
                    priority: lastDeleted.priority,
                    dueDate: lastDeleted.dueDate,
                    startDate: lastDeleted.startDate,
                    estimatedMinutes: lastDeleted.estimatedMinutes,
                    createdAt: lastDeleted.createdAt
                });
            } catch (err) {
                console.error("Error undoing delete:", err);
                set(s => ({ deletedTasks: [...s.deletedTasks, lastDeleted] })); // put it back on failure
            }
        }
    }));

const TasksContext = createContext<TasksStore | null>(null);

export const TasksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const { customSubjectColors } = useSettingsStore();
    
    const storeRef = useRef<TasksStore>(null);
    if (!storeRef.current) {
        storeRef.current = createTasksStore();
    }

    const store = storeRef.current;

    // Sync user
    useEffect(() => {
        store.getState().setUser(user);
    }, [user, store]);

    // Sync subjects
    useEffect(() => {
        const subjects: Subject[] = (subjectsData as Subject[]).map((sub: Subject) => {
            if (customSubjectColors && customSubjectColors[sub.name]) {
                return { ...sub, colorToken: `${customSubjectColors[sub.name]}-500` };
            }
            return sub;
        });
        store.getState().setSubjects(subjects);
    }, [customSubjectColors, store]);

    // Listen to Firebase
    useEffect(() => {
        if (!user) {
            store.getState().setTasks([]);
            store.getState().setIsLoading(false);
            return;
        }

        let unsubscribe: (() => void) | undefined;

        const loadTasks = async () => {
            try {
                store.getState().setIsLoading(true);
                const [{ db }, { collection, query, onSnapshot }] = await Promise.all([
                    import('../lib/firebase'),
                    import('firebase/firestore')
                ]);
                
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
                            createdAt: data.createdAt,
                            subjectId: data.subjectId
                        });
                    });
                    store.getState().setTasks(loadedTasks);
                    store.getState().setIsLoading(false);
                }, (err) => {
                    console.error("Error loading tasks:", err);
                    store.getState().setError("Failed to load tasks.");
                    store.getState().setIsLoading(false);
                });

            } catch (err) {
                console.error("Failed to initialize tasks listener", err);
                store.getState().setError("Initialization error.");
                store.getState().setIsLoading(false);
            }
        };

        loadTasks();

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [user, store]);

    // Global KeyDown for Undo
    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
                if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
                e.preventDefault();
                store.getState().undoDelete();
            }
        };
        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, [store]);

    return (
        <TasksContext.Provider value={store}>
            {children}
        </TasksContext.Provider>
    );
};

export function useTasks(): TasksState;
export function useTasks<T>(selector: (state: TasksState) => T): T;
export function useTasks<T>(selector?: (state: TasksState) => T): T | TasksState {
    const store = useContext(TasksContext);
    if (!store) {
        throw new Error('useTasks must be used within a TasksProvider');
    }
    const defaultSelector = (state: TasksState) => state;
    return useStore(store, selector || (defaultSelector as any));
}
