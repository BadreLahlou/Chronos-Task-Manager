
import { TaskProps } from '@/types/task';

export const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const filterTasks = (
  tasks: TaskProps[], 
  statusFilter: string, 
  priorityFilter: string | null, 
  searchQuery: string
): TaskProps[] => {
  return tasks
    .filter(task => {
      if (statusFilter === 'all') return true;
      if (statusFilter === 'todo') return task.status === 'todo';
      if (statusFilter === 'in-progress') return task.status === 'in-progress';
      if (statusFilter === 'completed') return task.status === 'completed';
      return true;
    })
    .filter(task => {
      if (!priorityFilter) return true;
      return task.priority === priorityFilter;
    })
    .filter(task => {
      if (!searchQuery) return true;
      return (
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false)
      );
    });
};

export const saveTasks = (tasks: TaskProps[]) => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

export const loadTasks = (): TaskProps[] => {
  const savedTasks = localStorage.getItem('tasks');
  if (savedTasks) {
    try {
      return JSON.parse(savedTasks);
    } catch (e) {
      console.error('Failed to parse saved tasks:', e);
      return [];
    }
  }
  return [];
};
