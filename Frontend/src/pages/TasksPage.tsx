import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TaskProps, TaskStatus } from '@/types/task';
import { filterTasks } from '@/utils/taskUtils';
import { fetchTasksFromBackend, createTaskInBackend, deleteTaskInBackend, updateTaskStatusInBackend, updateTaskTimeInBackend } from '@/utils/taskApi';
import { toast } from 'sonner';

// Import our new components
import { TaskHeader } from '@/components/tasks/TaskHeader';
import { TaskSearchBar } from '@/components/tasks/TaskSearchBar';
import { TaskFilterDrawer } from '@/components/tasks/TaskFilterDrawer';
import { TaskCreateDialog } from '@/components/tasks/TaskCreateDialog';
import { TaskList } from '@/components/tasks/TaskList';

const TasksPage = () => {
  const [tasks, setTasks] = useState<TaskProps[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewTaskDialog, setShowNewTaskDialog] = useState(false);
  const [openFilterDrawer, setOpenFilterDrawer] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);

  
  useEffect(() => {
    fetchTasksFromBackend().then(setTasks).catch(() => toast.error('Failed to load tasks from server'));
  }, []);

  
  const filteredTasks = filterTasks(tasks, activeFilter, priorityFilter, searchQuery);

  const handleCreateTask = async (newTask: TaskProps) => {
    try {
      const created = await createTaskInBackend(newTask);
      setTasks(prev => [...prev, created]);
      toast.success('Task created!');
    } catch {
      toast.error('Failed to create task');
    }
  };

  const handleOpenTaskDialog = () => {
    console.log("Opening task dialog");
    setShowNewTaskDialog(true);
  };

  const handleCloseTaskDialog = (isOpen: boolean) => {
    console.log("Dialog state changing to:", isOpen);
    setShowNewTaskDialog(isOpen);
  };

  const handleStatusChange = async (id: string, newStatus: TaskStatus) => {
    try {
      await updateTaskStatusInBackend(id, newStatus);
      setTasks(prev => 
        prev.map(task => 
          task.id === id ? { ...task, status: newStatus } : task
        )
      );
      toast.success(`Task status updated to ${newStatus}`);
    } catch (error) {
      toast.error(`Failed to update task status: ${error.message}`);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTaskInBackend(id);
      setTasks(prev => prev.filter(task => task.id !== id));
      toast.success('Task deleted successfully');
    } catch {
      toast.error('Failed to delete task');
    }
  };

  const handleTimeUpdate = async (id: string, newTime: number) => {
    try {
      await updateTaskTimeInBackend(id, newTime);
      setTasks(prev => 
        prev.map(task => 
          task.id === id ? { ...task, timeLogged: newTime } : task
        )
      );
    } catch (error) {
      toast.error(`Failed to update task time: ${error.message}`);
    }
  };

  const hasFilters = !!priorityFilter || !!searchQuery;

  return (
    <div className="max-w-7xl mx-auto animate-fade-in dashboard-content">
      {/* Header with title and main action buttons */}
      <TaskHeader 
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        onOpenFilterDrawer={() => setOpenFilterDrawer(true)}
        onOpenNewTaskDialog={handleOpenTaskDialog}
      />
      
      {/* Search bar */}
      <TaskSearchBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      {/* Tabs for filtering by status */}
      <div className="mb-5">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-4 w-full max-w-md bg-purple-50 dark:bg-card/60 p-1 rounded-xl">
            <TabsTrigger 
              value="all" 
              onClick={() => setActiveFilter('all')}
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-card data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-300 transition-all duration-300 rounded-lg"
            >
              All
            </TabsTrigger>
            <TabsTrigger 
              value="todo" 
              onClick={() => setActiveFilter('todo')}
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-card data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-300 transition-all duration-300 rounded-lg"
            >
              To Do
            </TabsTrigger>
            <TabsTrigger 
              value="in-progress" 
              onClick={() => setActiveFilter('in-progress')}
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-card data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-300 transition-all duration-300 rounded-lg"
            >
              In Progress
            </TabsTrigger>
            <TabsTrigger 
              value="completed" 
              onClick={() => setActiveFilter('completed')}
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-card data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-300 transition-all duration-300 rounded-lg"
            >
              Completed
            </TabsTrigger>
          </TabsList>
          
          {/* Tab content */}
          <TabsContent value="all" className="mt-5">
            <TaskList 
              tasks={filteredTasks}
              hasFilters={hasFilters}
              statusFilter={activeFilter}
              onStatusChange={handleStatusChange}
              onDeleteTask={handleDeleteTask}
              onTimeUpdate={handleTimeUpdate}
              onCreateNewTask={handleOpenTaskDialog}
            />
          </TabsContent>
          
          <TabsContent value="todo" className="mt-5">
            <TaskList 
              tasks={filteredTasks}
              hasFilters={hasFilters}
              statusFilter={activeFilter}
              onStatusChange={handleStatusChange}
              onDeleteTask={handleDeleteTask}
              onTimeUpdate={handleTimeUpdate}
              onCreateNewTask={handleOpenTaskDialog}
            />
          </TabsContent>
          
          <TabsContent value="in-progress" className="mt-5">
            <TaskList 
              tasks={filteredTasks}
              hasFilters={hasFilters}
              statusFilter={activeFilter}
              onStatusChange={handleStatusChange}
              onDeleteTask={handleDeleteTask}
              onTimeUpdate={handleTimeUpdate}
              onCreateNewTask={handleOpenTaskDialog}
            />
          </TabsContent>
          
          <TabsContent value="completed" className="mt-5">
            <TaskList 
              tasks={filteredTasks}
              hasFilters={hasFilters}
              statusFilter={activeFilter}
              onStatusChange={handleStatusChange}
              onDeleteTask={handleDeleteTask}
              onTimeUpdate={handleTimeUpdate}
              onCreateNewTask={handleOpenTaskDialog}
            />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Dialogs and drawers */}
      <TaskFilterDrawer 
        open={openFilterDrawer}
        onOpenChange={setOpenFilterDrawer}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      <TaskCreateDialog 
        open={showNewTaskDialog}
        onOpenChange={handleCloseTaskDialog}
        onTaskCreate={handleCreateTask}
      />
    </div>
  );
};

export default TasksPage;
