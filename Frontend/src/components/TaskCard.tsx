
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { MoreHorizontal, Clock, CheckCircle2, Trash2, RefreshCw } from 'lucide-react';
import { TimerButton } from './TimerButton';
import { toast } from 'sonner';
import { TaskProps, TaskStatus } from '@/types/task';

export interface TaskCardProps {
  task: TaskProps;
  onStatusChange?: (id: string, status: TaskStatus) => void;
  onDelete?: (id: string) => void;
  onTimeUpdate?: (id: string, newTime: number) => void;
  showActions?: boolean;
}

const priorityClasses = {
  low: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/50',
  medium: 'bg-yellow-50 text-yellow-600 border-yellow-100 dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-yellow-900/50',
  high: 'bg-red-50 text-red-600 border-red-100 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50'
};

const statusClasses = {
  'todo': 'bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-950/30 dark:text-slate-400 dark:border-slate-900/50',
  'in-progress': 'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-900/50',
  'completed': 'bg-green-50 text-green-600 border-green-100 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900/50'
};

export const TaskCard = ({ 
  task, 
  onStatusChange, 
  onDelete, 
  onTimeUpdate,
  showActions = true
}: TaskCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const formatTimeLogged = (seconds?: number) => {
    if (!seconds) return '0:00:00';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStatusChange = (newStatus: TaskStatus) => {
    if (onStatusChange && task.status !== newStatus) {
      onStatusChange(task.id, newStatus);
      toast.success(`Task ${newStatus === 'completed' ? 'completed' : 'updated'}`);
    }
  };

  const handleTimeUpdate = (newTime: number) => {
    if (onTimeUpdate) {
      onTimeUpdate(task.id, newTime);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(task.id);
      toast.success("Task deleted");
    }
  };

  const handleRestartTask = () => {
    if (onStatusChange && task.status === 'completed') {
      onStatusChange(task.id, 'todo');
      toast.success("Task restarted");
    }
  };

  return (
    <Card 
      className={`overflow-hidden transition-all dark:bg-card dark:text-card-foreground dark:border-border ${
        task.status === 'completed' ? 'opacity-75' : ''
      } ${
        isHovered ? 'shadow-md border-primary/20' : 'shadow-sm'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="p-4 flex flex-row justify-between items-start space-y-0 pb-2">
        <div className="space-y-1">
          <h3 className="font-medium text-sm">{task.title}</h3>
          {task.dueDate && (
            <p className="text-xs text-muted-foreground">
              Due {task.dueDate}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span 
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${priorityClasses[task.priority]}`}
          >
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>
          {showActions && (
            <button 
              className="text-muted-foreground hover:text-destructive transition-colors"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        {task.description && (
          <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
            {task.description}
          </p>
        )}
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5 mr-1" />
            <span>{formatTimeLogged(task.timeLogged)}</span>
          </div>
          <span 
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusClasses[task.status]}`}
          >
            {task.status === 'todo' ? 'To Do' : 
             task.status === 'in-progress' ? 'In Progress' : 'Completed'}
          </span>
        </div>
      </CardContent>
      
      {showActions && (
        <CardFooter className="p-4 pt-0 flex justify-between gap-2">
          {task.status !== 'completed' ? (
            <>
              <TimerButton 
                isRunning={task.status === 'in-progress'} 
                timeLogged={task.timeLogged || 0}
                className="flex-1 h-8 text-xs"
                onTimeUpdate={handleTimeUpdate}
                onStart={() => handleStatusChange('in-progress')}
                onPause={() => handleStatusChange('todo')}
                taskId={task.id}
              />
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 rounded-full"
                onClick={() => handleStatusChange('completed')}
              >
                <CheckCircle2 className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <div className="w-full flex items-center justify-between">
              <div className="text-xs text-muted-foreground py-1 flex items-center">
                <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                Completed
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-7 text-xs"
                onClick={handleRestartTask}
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Restart
              </Button>
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
};
