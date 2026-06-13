export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETE' | string;
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';
export type TaskSource = 'MANUAL' | 'AI';

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
}
