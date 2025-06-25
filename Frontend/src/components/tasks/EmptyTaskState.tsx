
import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, ListTodo, Clock, CalendarIcon } from 'lucide-react';

interface EmptyTaskStateProps {
  statusFilter: string;
  hasFilters: boolean;
  onCreateNewTask: () => void;
}

export const EmptyTaskState: FC<EmptyTaskStateProps> = ({ statusFilter, hasFilters, onCreateNewTask }) => {
  let icon = <ListTodo className="h-12 w-12 mx-auto text-purple-300 mb-4 animate-pulse-subtle" />;
  let title = "No tasks found";
  let message = hasFilters
    ? "Try adjusting your search or filter criteria."
    : "Click 'New Task' to create your first task.";

  if (statusFilter === 'in-progress') {
    icon = <Clock className="h-12 w-12 mx-auto text-purple-300 mb-4 animate-pulse-subtle" />;
    title = "No tasks in progress";
    message = "Tasks you're currently working on will appear here.";
  } else if (statusFilter === 'completed') {
    icon = <CalendarIcon className="h-12 w-12 mx-auto text-purple-300 mb-4 animate-pulse-subtle" />;
    title = "No completed tasks";
    message = "Completed tasks will be shown here.";
  } else if (statusFilter === 'todo') {
    title = "No todo tasks";
    message = "All your 'To Do' tasks will appear here.";
  }

  return (
    <div className="text-center py-12 bg-purple-50/50 dark:bg-card/30 rounded-lg border border-purple-100 dark:border-purple-900/20">
      {icon}
      <h3 className="text-lg font-medium text-purple-900 dark:text-purple-300">{title}</h3>
      <p className="mt-2 text-sm text-purple-600 dark:text-purple-400">{message}</p>
      {statusFilter === 'all' && !hasFilters && (
        <div className="mt-6">
          <Button 
            onClick={onCreateNewTask}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
          >
            <Plus className="h-4 w-4 mr-1" />
            Create a new task
          </Button>
        </div>
      )}
    </div>
  );
};
