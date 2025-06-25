import axios from 'axios';
import { format } from 'date-fns';
import { TaskProps } from '@/types/task';

// Backend response interface
interface BackendTaskResponse {
  id: number;
  title: string;
  description?: string;
  status: string;
  priority: string;
  startTime?: string;
  endTime?: string;
  timeSpent?: number;
  timerAccumulated?: number;
  assignedUserId?: number;
  dependencyIds?: number[];
}

// Use the correct backend port (default Spring Boot is 8080)
const API_URL = 'http://localhost:8080/api/tasks';

// Fetch all tasks from backend
export const fetchTasksFromBackend = async (): Promise<TaskProps[]> => {
  const res = await axios.get<BackendTaskResponse[]>(API_URL);
  // Defensive: only return array if valid
  if (!Array.isArray(res.data)) return [];
  
  // Map backend data to frontend format
  return res.data.map((task: BackendTaskResponse) => ({
    ...task,
    id: task.id.toString(), // Ensure id is always a string
    status: (task.status === 'DONE' ? 'completed' : task.status === 'IN_PROGRESS' ? 'in-progress' : 'todo') as 'todo' | 'in-progress' | 'completed',
    priority: (task.priority?.toLowerCase() || 'medium') as 'low' | 'medium' | 'high',
    dueDate: task.endTime ? format(new Date(task.endTime), 'MMM d, yyyy') : undefined,
    timeLogged: task.timerAccumulated || 0
  }));
};

// Create a new task in backend
export const createTaskInBackend = async (task: TaskProps): Promise<TaskProps> => {
  // Map frontend TaskProps to backend Task entity structure
  const backendTask = {
    title: task.title,
    description: task.description,
    priority: task.priority?.toUpperCase() || 'MEDIUM',
    status: task.status === 'completed' ? 'DONE' : task.status === 'in-progress' ? 'IN_PROGRESS' : 'TODO',
    // Map dueDate to endTime if provided
    endTime: task.dueDate ? new Date(task.dueDate).toISOString() : undefined,
    // Let backend handle startTime if not provided
  };
  try {
    const res = await axios.post<BackendTaskResponse>(API_URL, { task: backendTask, dependencyIds: [] });
    if (res.data && typeof res.data === 'object' && 'title' in res.data && 'priority' in res.data) {
      // Map backend response back to frontend format
      const frontendTask = {
        ...res.data,
        id: res.data.id.toString(), // Ensure id is always a string
        status: (res.data.status === 'DONE' ? 'completed' : res.data.status === 'IN_PROGRESS' ? 'in-progress' : 'todo') as 'todo' | 'in-progress' | 'completed',
        priority: (res.data.priority?.toLowerCase() || 'medium') as 'low' | 'medium' | 'high',
        dueDate: res.data.endTime ? format(new Date(res.data.endTime), 'MMM d, yyyy') : undefined,
        timeLogged: res.data.timerAccumulated || 0
      };
      return frontendTask as TaskProps;
    }
    throw new Error('Invalid response from backend');
  } catch (error) {
    // Robust error handling for any Axios/network error
    if (error && typeof error === 'object' && 'response' in error && error.response) {
      console.error('Backend error:', error.response.data);
    } else if (error instanceof Error) {
      console.error('Network or unknown error:', error.message);
    } else {
      console.error('Unknown error:', error);
    }
    throw error;
  }
};

export const deleteTaskInBackend = async (id: string | number) => {
  await axios.delete(`${API_URL}/${id}`);
};

export const updateTaskStatusInBackend = async (id: string | number, status: string) => {
  try {
    // First fetch the current task to get all its data
    const currentTask = await axios.get<BackendTaskResponse>(`${API_URL}/${id}`);
    const taskData = currentTask.data;
    
    // Map frontend status to backend enum values
    const backendStatus = status === 'completed' ? 'DONE' : status === 'in-progress' ? 'IN_PROGRESS' : 'TODO';
    
    // Update only the status field while preserving all other data
    const updatedTask = {
      ...taskData,
      status: backendStatus
    };
    
    const response = await axios.put<BackendTaskResponse>(`${API_URL}/${id}`, updatedTask);
    
    // Map backend response back to frontend format
    const frontendTask = {
      ...response.data,
      id: response.data.id.toString(), // Ensure id is always a string
      status: (response.data.status === 'DONE' ? 'completed' : response.data.status === 'IN_PROGRESS' ? 'in-progress' : 'todo') as 'todo' | 'in-progress' | 'completed',
      priority: (response.data.priority?.toLowerCase() || 'medium') as 'low' | 'medium' | 'high',
      dueDate: response.data.endTime ? format(new Date(response.data.endTime), 'MMM d, yyyy') : undefined,
      timeLogged: response.data.timerAccumulated || 0
    };
    
    return frontendTask;
  } catch (error) {
    console.error('Error updating task status:', error);
    if (error && typeof error === 'object' && 'response' in error && error.response) {
      console.error('Backend error response:', error.response.data);
      throw new Error(`Backend error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    }
    throw error;
  }
};


export const updateTaskTimeInBackend = async (id: string | number, timeLogged: number) => {
  try {
    
    const currentTask = await axios.get<BackendTaskResponse>(`${API_URL}/${id}`);
    const taskData = currentTask.data;
    
    
    const updatedTask = {
      ...taskData,
      timerAccumulated: Math.round(timeLogged) // Backend expects timerAccumulated in seconds
    };
    
    const response = await axios.put<BackendTaskResponse>(`${API_URL}/${id}`, updatedTask);
    
    // Map backend response back to frontend format
    const frontendTask = {
      ...response.data,
      id: response.data.id.toString(), // Ensure id is always a string
      status: (response.data.status === 'DONE' ? 'completed' : response.data.status === 'IN_PROGRESS' ? 'in-progress' : 'todo') as 'todo' | 'in-progress' | 'completed',
      priority: (response.data.priority?.toLowerCase() || 'medium') as 'low' | 'medium' | 'high',
      dueDate: response.data.endTime ? format(new Date(response.data.endTime), 'MMM d, yyyy') : undefined,
      timeLogged: response.data.timerAccumulated || 0
    };
    
    return frontendTask;
  } catch (error) {
    console.error('Error updating task time:', error);
    if (error && typeof error === 'object' && 'response' in error && error.response) {
      console.error('Backend error response:', error.response.data);
      throw new Error(`Backend error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    }
    throw error;
  }
};

