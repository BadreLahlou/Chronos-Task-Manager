
import { FC } from 'react';
import { TaskCard } from '@/components/TaskCard';
import { TaskProps, TaskStatus } from '@/types/task';
import { EmptyTaskState } from './EmptyTaskState';

interface TaskListProps {
  tasks: TaskProps[];
  hasFilters: boolean;
  statusFilter: string;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onDeleteTask: (id: string) => void;
  onTimeUpdate: (id: string, newTime: number) => void;
  onCreateNewTask: () => void;
}

export const TaskList: FC<TaskListProps> = ({
  tasks,
  hasFilters,
  statusFilter,
  onStatusChange,
  onDeleteTask,
  onTimeUpdate,
  onCreateNewTask
}) => {
  if (tasks.length === 0) {
    return (
      <EmptyTaskState 
        statusFilter={statusFilter} 
        hasFilters={hasFilters} 
        onCreateNewTask={onCreateNewTask} 
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.map(task => (
        <TaskCard 
          key={task.id} 
          task={task} 
          onStatusChange={onStatusChange}
          onDelete={onDeleteTask}
          onTimeUpdate={onTimeUpdate}
        />
      ))}
    </div>
  );
};
