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

export type TaskHistoryAction =
    | { type: 'UPDATE'; taskId: string; before: Partial<Task>; after: Partial<Task>; title: string }
    | { type: 'CREATE'; task: Task; title: string }
    | { type: 'DELETE'; task: Task; title: string };

export interface TasksState {
    tasks: Task[];
    subjects: Subject[];
    filters: TaskFilters;
    isLoading: boolean;
    error: string | null;
    user: User | null; // Stored user from AuthContext
    deletedTasks: Task[]; // internal
    undoStack: TaskHistoryAction[];
    redoStack: TaskHistoryAction[];

    filteredTasks: Task[]; // Derived state

    setTasks: (tasks: Task[]) => void;
    setSubjects: (subjects: Subject[]) => void;
    setIsLoading: (v: boolean) => void;
    setError: (e: string | null) => void;
    setFilters: (f: TaskFilters | ((prev: TaskFilters) => TaskFilters)) => void;
    clearFilters: () => void;
    setUser: (u: User | null) => void;

    addTask: (task: Omit<Task, 'id' | 'userId' | 'createdAt'>, recordHistory?: boolean) => Promise<string>;
    updateTask: (taskId: string, updates: Partial<Task>, recordHistory?: boolean) => Promise<void>;
    deleteTask: (taskId: string, task?: Task, recordHistory?: boolean) => Promise<void>;
    undo: () => Promise<TaskHistoryAction | null>;
    redo: () => Promise<TaskHistoryAction | null>;
    undoDelete: () => Promise<void>;
    addBatchTasks: (tasks: Omit<Task, 'id' | 'userId' | 'createdAt'>[]) => Promise<void>;
}

type TasksStore = ReturnType<typeof createTasksStore>;

const computeFilteredTasks = (tasks: Task[], filters: TaskFilters): Task[] => {
    if (tasks.length === 0) return [];
    
    // Pre-calculate date boundaries outside the loop for O(1) date operations
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfToday = new Date(today);
    endOfToday.setHours(23, 59, 59, 999);
    const endOfTodayTime = endOfToday.getTime();
    
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    nextWeek.setHours(23, 59, 59, 999);
    const nextWeekTime = nextWeek.getTime();
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getTime();
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999).getTime();
    
    const endOfTerm = new Date(today);
    endOfTerm.setMonth(today.getMonth() + 4);
    const endOfTermTime = endOfTerm.getTime();

    return tasks.filter(task => {
        if (filters.subjects.length > 0 && (!task.subjectId || !filters.subjects.includes(task.subjectId))) return false;
        if (filters.priorities.length > 0 && !filters.priorities.includes(task.priority)) return false;
        
        if (filters.dateRange !== 'ALL') {
            if (!task.dueDate) return false;
            const dueTime = new Date(task.dueDate).getTime();
            
            if (filters.dateRange === 'TODAY') {
                if (dueTime > endOfTodayTime) return false;
            } else if (filters.dateRange === 'THIS_WEEK') {
                if (dueTime > nextWeekTime) return false;
            } else if (filters.dateRange === 'THIS_MONTH') {
                if (dueTime > endOfMonth || dueTime < startOfMonth) return false;
            } else if (filters.dateRange === 'THIS_TERM') {
                if (dueTime > endOfTermTime) return false;
            }
        }
        return true;
    });
};

const MAX_HISTORY = 50;

const createTasksStore = () =>
    createStore<TasksState>((set, get) => ({
        tasks: [],
        subjects: [],
        filters: { subjects: [], priorities: [], dateRange: 'ALL' },
        isLoading: true,
        error: null,
        user: null,
        deletedTasks: [],
        undoStack: [],
        redoStack: [],
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

        addTask: async (taskData, recordHistory = true) => {
            const { user, tasks, filters, undoStack } = get();
            if (!user) throw new Error("No user logged in");
            const [{ db }, { collection, doc, setDoc }] = await Promise.all([
                import('../lib/firebase'),
                import('firebase/firestore')
            ]);
            
            const tasksRef = collection(db, 'users', user.id, 'tasks');
            const newDocRef = doc(tasksRef);
            const newTask: Task = {
                ...taskData,
                id: newDocRef.id,
                userId: user.id,
                title: taskData.title !== undefined ? taskData.title : 'Nova Tasca',
                createdAt: new Date().toISOString()
            };
            const newTasks = [...tasks, newTask];
            
            let newUndoStack = undoStack;
            let newRedoStack = get().redoStack;
            if (recordHistory) {
                const historyAction: TaskHistoryAction = {
                    type: 'CREATE',
                    task: newTask,
                    title: newTask.title || 'Nova Tasca'
                };
                newUndoStack = [...undoStack.slice(-(MAX_HISTORY - 1)), historyAction];
                newRedoStack = [];
            }

            set({ 
                tasks: newTasks, 
                filteredTasks: computeFilteredTasks(newTasks, filters),
                undoStack: newUndoStack,
                redoStack: newRedoStack
            });

            const { id: _ignore, ...dataToSave } = newTask;
            const cleanTask = Object.fromEntries(Object.entries(dataToSave).filter(([_, v]) => v !== undefined));
            await setDoc(newDocRef, cleanTask);
            return newDocRef.id;
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

        updateTask: async (taskId, updates, recordHistory = true) => {
            const { user, tasks, filters, undoStack } = get();
            const existing = tasks.find(t => t.id === taskId);

            let hasChanges = false;
            const before: Partial<Task> = {};
            const after: Partial<Task> = {};

            if (existing && recordHistory) {
                for (const [k, v] of Object.entries(updates) as [keyof Task, any][]) {
                    if (existing[k] !== v) {
                        (before as any)[k] = existing[k];
                        (after as any)[k] = v;
                        hasChanges = true;
                    }
                }
            }

            // Optimistic update locally
            const newTasks = tasks.map(t => t.id === taskId ? { ...t, ...updates } : t);

            let newUndoStack = undoStack;
            let newRedoStack = get().redoStack;
            if (hasChanges && existing && recordHistory) {
                const historyAction: TaskHistoryAction = {
                    type: 'UPDATE',
                    taskId,
                    before,
                    after,
                    title: existing.title || updates.title || 'Tasca'
                };
                newUndoStack = [...undoStack.slice(-(MAX_HISTORY - 1)), historyAction];
                newRedoStack = [];
            }

            set({ 
                tasks: newTasks, 
                filteredTasks: computeFilteredTasks(newTasks, filters),
                undoStack: newUndoStack,
                redoStack: newRedoStack
            });
            
            if (!user) throw new Error("No user logged in");
            const [{ db }, { doc, updateDoc, deleteField }] = await Promise.all([
                import('../lib/firebase'),
                import('firebase/firestore')
            ]);
            const taskRef = doc(db, 'users', user.id, 'tasks', taskId);
            const sanitizedUpdates: Record<string, any> = {};
            for (const [k, v] of Object.entries(updates)) {
                sanitizedUpdates[k] = v === undefined ? deleteField() : v;
            }
            await updateDoc(taskRef, sanitizedUpdates);
        },

        deleteTask: async (taskId, task, recordHistory = true) => {
            const { user, tasks, deletedTasks, filters, undoStack } = get();
            if (!user) throw new Error("No user logged in");
            
            const found = task || tasks.find(t => t.id === taskId);
            const newTasks = tasks.filter(t => t.id !== taskId);
            const newDeleted = found ? [...deletedTasks, found] : deletedTasks;

            let newUndoStack = undoStack;
            let newRedoStack = get().redoStack;
            if (found && recordHistory) {
                const historyAction: TaskHistoryAction = {
                    type: 'DELETE',
                    task: found,
                    title: found.title || 'Tasca'
                };
                newUndoStack = [...undoStack.slice(-(MAX_HISTORY - 1)), historyAction];
                newRedoStack = [];
            }
            
            set({ 
                tasks: newTasks, 
                deletedTasks: newDeleted, 
                filteredTasks: computeFilteredTasks(newTasks, filters),
                undoStack: newUndoStack,
                redoStack: newRedoStack
            });
            
            const [{ db }, { doc, deleteDoc }] = await Promise.all([
                import('../lib/firebase'),
                import('firebase/firestore')
            ]);
            await deleteDoc(doc(db, 'users', user.id, 'tasks', taskId));
        },

        undo: async () => {
            const { user, tasks, filters, undoStack, redoStack } = get();
            if (undoStack.length === 0) return null;

            const action = undoStack[undoStack.length - 1];
            const newUndoStack = undoStack.slice(0, -1);
            const newRedoStack = [...redoStack.slice(-(MAX_HISTORY - 1)), action];

            if (action.type === 'UPDATE') {
                const existing = tasks.find(t => t.id === action.taskId);
                if (existing) {
                    const newTasks = tasks.map(t => t.id === action.taskId ? { ...t, ...action.before } : t);
                    set({
                        tasks: newTasks,
                        filteredTasks: computeFilteredTasks(newTasks, filters),
                        undoStack: newUndoStack,
                        redoStack: newRedoStack
                    });

                    if (user) {
                        const [{ db }, { doc, updateDoc, deleteField }] = await Promise.all([
                            import('../lib/firebase'),
                            import('firebase/firestore')
                        ]);
                        const taskRef = doc(db, 'users', user.id, 'tasks', action.taskId);
                        const sanitizedUpdates: Record<string, any> = {};
                        for (const [k, v] of Object.entries(action.before)) {
                            sanitizedUpdates[k] = v === undefined ? deleteField() : v;
                        }
                        await updateDoc(taskRef, sanitizedUpdates);
                    }
                }
            } else if (action.type === 'CREATE') {
                const newTasks = tasks.filter(t => t.id !== action.task.id);
                set({
                    tasks: newTasks,
                    filteredTasks: computeFilteredTasks(newTasks, filters),
                    undoStack: newUndoStack,
                    redoStack: newRedoStack
                });

                if (user) {
                    const [{ db }, { doc, deleteDoc }] = await Promise.all([
                        import('../lib/firebase'),
                        import('firebase/firestore')
                    ]);
                    await deleteDoc(doc(db, 'users', user.id, 'tasks', action.task.id));
                }
            } else if (action.type === 'DELETE') {
                const newTasks = [...tasks, action.task];
                set({
                    tasks: newTasks,
                    filteredTasks: computeFilteredTasks(newTasks, filters),
                    undoStack: newUndoStack,
                    redoStack: newRedoStack
                });

                if (user) {
                    const [{ db }, { doc, setDoc }] = await Promise.all([
                        import('../lib/firebase'),
                        import('firebase/firestore')
                    ]);
                    const { id: _ignore, ...dataToSave } = action.task;
                    const cleanTask = Object.fromEntries(Object.entries(dataToSave).filter(([_, v]) => v !== undefined));
                    await setDoc(doc(db, 'users', user.id, 'tasks', action.task.id), cleanTask);
                }
            }

            return action;
        },

        redo: async () => {
            const { user, tasks, filters, undoStack, redoStack } = get();
            if (redoStack.length === 0) return null;

            const action = redoStack[redoStack.length - 1];
            const newRedoStack = redoStack.slice(0, -1);
            const newUndoStack = [...undoStack.slice(-(MAX_HISTORY - 1)), action];

            if (action.type === 'UPDATE') {
                const existing = tasks.find(t => t.id === action.taskId);
                if (existing) {
                    const newTasks = tasks.map(t => t.id === action.taskId ? { ...t, ...action.after } : t);
                    set({
                        tasks: newTasks,
                        filteredTasks: computeFilteredTasks(newTasks, filters),
                        undoStack: newUndoStack,
                        redoStack: newRedoStack
                    });

                    if (user) {
                        const [{ db }, { doc, updateDoc, deleteField }] = await Promise.all([
                            import('../lib/firebase'),
                            import('firebase/firestore')
                        ]);
                        const taskRef = doc(db, 'users', user.id, 'tasks', action.taskId);
                        const sanitizedUpdates: Record<string, any> = {};
                        for (const [k, v] of Object.entries(action.after)) {
                            sanitizedUpdates[k] = v === undefined ? deleteField() : v;
                        }
                        await updateDoc(taskRef, sanitizedUpdates);
                    }
                }
            } else if (action.type === 'CREATE') {
                const newTasks = [...tasks, action.task];
                set({
                    tasks: newTasks,
                    filteredTasks: computeFilteredTasks(newTasks, filters),
                    undoStack: newUndoStack,
                    redoStack: newRedoStack
                });

                if (user) {
                    const [{ db }, { doc, setDoc }] = await Promise.all([
                        import('../lib/firebase'),
                        import('firebase/firestore')
                    ]);
                    const { id: _ignore, ...dataToSave } = action.task;
                    const cleanTask = Object.fromEntries(Object.entries(dataToSave).filter(([_, v]) => v !== undefined));
                    await setDoc(doc(db, 'users', user.id, 'tasks', action.task.id), cleanTask);
                }
            } else if (action.type === 'DELETE') {
                const newTasks = tasks.filter(t => t.id !== action.task.id);
                set({
                    tasks: newTasks,
                    filteredTasks: computeFilteredTasks(newTasks, filters),
                    undoStack: newUndoStack,
                    redoStack: newRedoStack
                });

                if (user) {
                    const [{ db }, { doc, deleteDoc }] = await Promise.all([
                        import('../lib/firebase'),
                        import('firebase/firestore')
                            ]);
                    await deleteDoc(doc(db, 'users', user.id, 'tasks', action.task.id));
                }
            }

            return action;
        },

        undoDelete: async () => {
            await get().undo();
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

export function useTasksStore(): TasksStore {
    const store = useContext(TasksContext);
    if (!store) {
        throw new Error('useTasksStore must be used within a TasksProvider');
    }
    return store;
}
