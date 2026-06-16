export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETE' | string;
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';
export type TaskSource = 'MANUAL' | 'AI';

export interface Subject {
    id: string;
    name: string;
    colorToken: string;
}

// TAILWIND SAFELIST PER ALS COLORS DE LES ASSIGNATURES:
// bg-amber-400 text-amber-400 border-amber-400/20 bg-amber-400/10 text-amber-300
// bg-blue-400 text-blue-400 border-blue-400/20 bg-blue-400/10 text-blue-300
// bg-cyan-400 text-cyan-400 border-cyan-400/20 bg-cyan-400/10 text-cyan-300
// bg-emerald-400 text-emerald-400 border-emerald-400/20 bg-emerald-400/10 text-emerald-300
// bg-fuchsia-400 text-fuchsia-400 border-fuchsia-400/20 bg-fuchsia-400/10 text-fuchsia-300
// bg-green-400 text-green-400 border-green-400/20 bg-green-400/10 text-green-300
// bg-indigo-400 text-indigo-400 border-indigo-400/20 bg-indigo-400/10 text-indigo-300
// bg-lime-400 text-lime-400 border-lime-400/20 bg-lime-400/10 text-lime-300
// bg-orange-400 text-orange-400 border-orange-400/20 bg-orange-400/10 text-orange-300
// bg-pink-400 text-pink-400 border-pink-400/20 bg-pink-400/10 text-pink-300
// bg-purple-400 text-purple-400 border-purple-400/20 bg-purple-400/10 text-purple-300
// bg-red-400 text-red-400 border-red-400/20 bg-red-400/10 text-red-300
// bg-rose-400 text-rose-400 border-rose-400/20 bg-rose-400/10 text-rose-300
// bg-sky-400 text-sky-400 border-sky-400/20 bg-sky-400/10 text-sky-300
// bg-slate-400 text-slate-400 border-slate-400/20 bg-slate-400/10 text-slate-300
// bg-teal-400 text-teal-400 border-teal-400/20 bg-teal-400/10 text-teal-300
// bg-violet-400 text-violet-400 border-violet-400/20 bg-violet-400/10 text-violet-300
// bg-yellow-400 text-yellow-400 border-yellow-400/20 bg-yellow-400/10 text-yellow-300
// (Afegeix aquí els nous colors si modifiques subjects.json)

export interface Task {
    id: string;
    userId: string;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    
    // Using string for ISO format to keep types serializable across Context, 
    // we'll convert to Date/Timestamp on the edges (Firebase/UI)
    dueDate: string | null;     
    startDate: string | null;   
    
    estimatedMinutes: number;   
    
    source: TaskSource;
    createdAt: string;
    
    subjectId?: string;
}
