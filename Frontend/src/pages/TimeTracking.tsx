import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, BarChart4, Calendar, Filter } from 'lucide-react';
import { TaskProps } from '@/types/task';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TimerButton } from '@/components/TimerButton';
import { toast } from 'sonner';
import { fetchTasksFromBackend, updateTaskTimeInBackend, updateTaskStatusInBackend } from "@/utils/taskApi";

const TimeTracking = () => {
  const [tasks, setTasks] = useState<TaskProps[]>([]);
  const [timeFilter, setTimeFilter] = useState('all');
  const [activeTask, setActiveTask] = useState<string | null>(null);
  
  useEffect(() => {
    fetchTasksFromBackend().then(setTasks).catch(() => toast.error("Failed to load tasks from server"));
  }, []);


  
  const formatTime = (seconds?: number) => {
    if (!seconds) return '0h 0m';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    return `${hours}h ${minutes}m`;
  };
  
  const totalTimeLogged = tasks.reduce((total, task) => total + (task.timeLogged || 0), 0);
  
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
  const completedTasks = tasks.filter(task => task.status === 'completed');
  
  const getFilteredTasks = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const weekStart = new Date(today - (now.getDay() * 24 * 60 * 60 * 1000)).getTime();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    
    const filteredTasks = tasks;
    
    if (timeFilter === 'today') {
      return filteredTasks.filter(task => {
        const taskDate = new Date(task.lastUpdated || '');
        return taskDate.getTime() >= today;
      });
    } else if (timeFilter === 'week') {
      return filteredTasks.filter(task => {
        const taskDate = new Date(task.lastUpdated || '');
        return taskDate.getTime() >= weekStart;
      });
    } else if (timeFilter === 'month') {
      return filteredTasks.filter(task => {
        const taskDate = new Date(task.lastUpdated || '');
        return taskDate.getTime() >= monthStart;
      });
    }
    
    return filteredTasks;
  };
  
  const filteredTasks = getFilteredTasks();

  const handleTimeUpdate = async (taskId: string, newTime: number) => {
    try {
      await updateTaskTimeInBackend(taskId, newTime);
      setTasks(prev => 
        prev.map(task => 
          task.id === taskId ? { ...task, timeLogged: newTime } : task
        )
      );
    } catch (error) {
      toast.error(`Failed to update task time: ${error.message}`);
    }
  };

  const handleStartTimer = async (taskId: string) => {
    try {
      if (activeTask && activeTask !== taskId) {
        await updateTaskStatusInBackend(activeTask, 'todo');
        setTasks(prev => 
          prev.map(task => 
            task.id === activeTask ? { ...task, status: 'todo' } : task
          )
        );
        toast.info("Previous timer paused");
      }
      
      setActiveTask(taskId);
      await updateTaskStatusInBackend(taskId, 'in-progress');
      setTasks(prev => 
        prev.map(task => 
          task.id === taskId ? { ...task, status: 'in-progress' } : task
        )
      );
      toast.success("Timer started");
    } catch (error) {
      toast.error(`Failed to update task status: ${error.message}`);
    }
  };

  const handlePauseTimer = async (taskId: string) => {
    try {
      setActiveTask(null);
      await updateTaskStatusInBackend(taskId, 'todo');
      setTasks(prev => 
        prev.map(task => 
          task.id === taskId ? { ...task, status: 'todo' } : task
        )
      );
      toast.info("Timer paused");
    } catch (error) {
      toast.error(`Failed to update task status: ${error.message}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Time Tracking</h1>
          <p className="text-muted-foreground">Monitor time spent on tasks</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select 
            value={timeFilter} 
            onValueChange={setTimeFilter}
          >
            <SelectTrigger className="w-[160px] rounded-xl">
              <SelectValue placeholder="Filter by time" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm" className="gap-2 rounded-xl">
            <Calendar className="h-3.5 w-3.5" />
            Date Range
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="rounded-xl p-1 shadow-md">
          <CardHeader className="pb-2 px-5 pt-5">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Time</CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="text-2xl font-bold">{formatTime(totalTimeLogged)}</div>
          </CardContent>
        </Card>
        
        <Card className="rounded-xl p-1 shadow-md">
          <CardHeader className="pb-2 px-5 pt-5">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Tasks</CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="text-2xl font-bold">{inProgressTasks.length}</div>
          </CardContent>
        </Card>
        
        <Card className="rounded-xl p-1 shadow-md">
          <CardHeader className="pb-2 px-5 pt-5">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="text-2xl font-bold">{completedTasks.length}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-card rounded-xl border shadow-md dark:bg-card dark:border-border overflow-hidden">
        <div className="p-5 border-b">
          <h2 className="font-semibold">Time Logs</h2>
        </div>
        {filteredTasks.length > 0 ? (
          <div className="divide-y dark:divide-border">
            {filteredTasks.map(task => (
              <div key={task.id} className="p-5 flex justify-between items-center">
                <div>
                  <div className="font-medium">{task.title}</div>
                  <div className="text-sm text-muted-foreground">
                    Status: {task.status === 'todo' ? 'To Do' : 
                             task.status === 'in-progress' ? 'In Progress' : 'Completed'}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">{formatTime(task.timeLogged)}</span>
                  </div>
                  
                  {task.status !== 'completed' && (
                    <TimerButton
                      isRunning={task.status === 'in-progress'}
                      timeLogged={task.timeLogged || 0}
                      onTimeUpdate={(newTime) => handleTimeUpdate(task.id, newTime)}
                      onStart={() => handleStartTimer(task.id)}
                      onPause={() => handlePauseTimer(task.id)}
                      className="h-8 text-xs rounded-xl"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center rounded-b-xl">
            <Clock className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-medium">No time tracked yet</h3>
            <p className="text-muted-foreground mt-1">Start a task timer to begin tracking time</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeTracking;
