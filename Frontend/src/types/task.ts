
export interface TaskProps {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'completed';
  dueDate?: string;
  timeLogged?: number; // in seconds
  lastUpdated?: string; // ISO date string
}

export type TaskStatus = 'todo' | 'in-progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';


export interface Widget {
  id: string;
  title: string;
  enabled: boolean;
  type?: string; 
  color?: string;
}



export interface RoleData {
  [key: string]: unknown; 
}

