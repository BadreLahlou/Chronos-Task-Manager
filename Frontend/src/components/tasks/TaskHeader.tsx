
import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Filter, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TaskHeaderProps {
  priorityFilter: string | null;
  setPriorityFilter: (priority: string | null) => void;
  onOpenFilterDrawer: () => void;
  onOpenNewTaskDialog: () => void;
}

export const TaskHeader: FC<TaskHeaderProps> = ({
  priorityFilter,
  setPriorityFilter,
  onOpenFilterDrawer,
  onOpenNewTaskDialog
}) => {
  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">My Tasks</h1>
          <p className="text-muted-foreground">Manage and organize your personal tasks</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 transition-all duration-300 hover:bg-secondary/80 hover:border-purple-200"
            onClick={onOpenFilterDrawer}
          >
            <Filter className="h-3.5 w-3.5 text-purple-500" />
            Filter
          </Button>
          <Button 
            size="sm" 
            className="gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300" 
            onClick={onOpenNewTaskDialog}
          >
            <Plus className="h-3.5 w-3.5" />
            New Task
          </Button>
        </div>
      </div>

      {priorityFilter && (
        <div className="mb-4">
          <Badge 
            className="bg-purple-100 text-purple-800 hover:bg-purple-200"
            onClick={() => setPriorityFilter(null)}
          >
            Priority: {priorityFilter} ×
          </Badge>
        </div>
      )}
    </>
  );
};
