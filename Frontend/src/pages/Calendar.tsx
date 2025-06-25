import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Clock, BarChart4, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import { TaskProps } from '@/types/task';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { fetchTasksFromBackend, createTaskInBackend, deleteTaskInBackend } from '@/utils/taskApi';
import { toast } from 'sonner';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameMonth } from 'date-fns';

const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const Calendar = () => {
  const [tasks, setTasks] = useState<TaskProps[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDateTasks, setSelectedDateTasks] = useState<TaskProps[]>([]);
  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false);
  
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  
  useEffect(() => {
    fetchTasksFromBackend().then(setTasks).catch(() => toast.error('Failed to load tasks from server'));
  }, []);
  
  useEffect(() => {
    if (selectedDate) {
      const formattedSelectedDate = format(selectedDate, 'MMM d, yyyy');
      const filteredTasks = tasks.filter(task => 
        task.dueDate === formattedSelectedDate
      );
      setSelectedDateTasks(filteredTasks);
    } else {
      setSelectedDateTasks([]);
    }
  }, [selectedDate, tasks]);
  
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const getTasksForDay = (day: Date) => {
    const formattedDay = format(day, 'MMM d, yyyy');
    return tasks.filter(task => task.dueDate === formattedDay);
  };
  
  const handleDateClick = (day: Date) => {
    setSelectedDate(day);
  };
  
  const handleCloseTaskView = () => {
    setSelectedDate(null);
  };
  
  const handleAddTaskForDate = () => {
    setShowAddTaskDialog(true);
  };

  const closeTaskDialog = () => {
    console.log("Calendar: Closing task dialog");
    setShowAddTaskDialog(false);
    resetNewTaskForm();
  };

  const handleCreateTask = async () => {
    if (!newTaskTitle.trim()) {
      toast.error("Task title is required");
      return;
    }

    const newTask: TaskProps = {
      id: generateUUID(),
      title: newTaskTitle,
      description: newTaskDescription || undefined,
      priority: newTaskPriority,
      status: 'todo',
      dueDate: selectedDate ? format(selectedDate, 'MMM d, yyyy') : undefined,
      timeLogged: 0
    };

    try {
      const created = await createTaskInBackend(newTask);
      setTasks(prev => [...prev, created]);
      resetNewTaskForm();
      setShowAddTaskDialog(false);
      toast.success("Task created successfully");
    } catch {
      toast.error('Failed to create task');
    }
  };

  const resetNewTaskForm = () => {
    setNewTaskTitle('');
    setNewTaskDescription('');
    setNewTaskPriority('medium');
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">View and manage tasks by date</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setCurrentMonth(new Date())}
          >
            Today
          </Button>
          <div className="flex items-center border rounded-md">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-none border-r"
              onClick={prevMonth}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="px-3 flex">
              <span className="text-sm font-medium">{format(currentMonth, 'MMMM yyyy')}</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-none border-l"
              onClick={nextMonth}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border shadow-sm mb-4">
        <div className="grid grid-cols-7 text-center py-2 border-b">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-xs font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 h-[600px]">
          {monthDays.map((day, idx) => {
            const dayTasks = getTasksForDay(day);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            
            return (
              <div 
                key={idx} 
                className={`min-h-[100px] p-1 border border-border -ml-[1px] -mt-[1px] ${
                  isToday(day) ? 'bg-blue-50' : ''
                } ${
                  !isCurrentMonth ? 'opacity-40' : ''
                }`}
                onClick={() => handleDateClick(day)}
              >
                <div className="flex justify-between items-start p-1">
                  <span className={`text-xs font-medium rounded-full w-6 h-6 flex items-center justify-center ${
                    isToday(day) ? 'bg-blue-500 text-white' : ''
                  }`}>
                    {format(day, 'd')}
                  </span>
                  {dayTasks.length > 0 && (
                    <span className="text-xs bg-primary/10 text-primary rounded-full px-1.5 py-0.5">
                      {dayTasks.length}
                    </span>
                  )}
                </div>
                
                <div className="mt-1 space-y-1">
                  {dayTasks.slice(0, 2).map(task => (
                    <div 
                      key={task.id} 
                      className={`text-xs px-1.5 py-0.5 rounded truncate ${
                        task.priority === 'high' ? 'bg-red-50 text-red-700' :
                        task.priority === 'medium' ? 'bg-yellow-50 text-yellow-700' :
                        'bg-blue-50 text-blue-700'
                      }`}
                    >
                      {task.title}
                    </div>
                  ))}
                  {dayTasks.length > 2 && (
                    <div className="text-xs text-muted-foreground px-1.5">
                      +{dayTasks.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {selectedDate && (
        <div className="mt-6 bg-white rounded-lg border shadow-sm">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="font-semibold">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</h2>
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleCloseTaskView}
              >
                Close
              </Button>
              <Button 
                size="sm" 
                onClick={handleAddTaskForDate}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Task
              </Button>
            </div>
          </div>
          
          {selectedDateTasks.length > 0 ? (
            <div className="divide-y">
              {selectedDateTasks.map(task => (
                <div key={task.id} className="p-4 flex justify-between items-center">
                  <div>
                    <div className="font-medium">{task.title}</div>
                    {task.description && (
                      <div className="text-sm text-muted-foreground mt-1">{task.description}</div>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <span 
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                          task.priority === 'high' ? 'bg-red-50 text-red-600 border-red-100' :
                          task.priority === 'medium' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' :
                          'bg-blue-50 text-blue-600 border-blue-100'
                        }`}
                      >
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </span>
                      <span 
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                          task.status === 'completed' ? 'bg-green-50 text-green-600 border-green-100' :
                          task.status === 'in-progress' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                          'bg-slate-50 text-slate-600 border-slate-100'
                        }`}
                      >
                        {task.status === 'todo' ? 'To Do' : 
                         task.status === 'in-progress' ? 'In Progress' : 'Completed'}
                      </span>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={async () => {
                      try {
                        await deleteTaskInBackend(task.id);
                        setTasks(prev => prev.filter(t => t.id !== task.id));
                        toast.success('Task deleted successfully');
                      } catch {
                        toast.error('Failed to delete task');
                      }
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <CalendarIcon className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-medium">No tasks for this date</h3>
              <p className="text-muted-foreground mt-1">Add a task for {format(selectedDate, 'MMMM d')}</p>
              <Button 
                className="mt-4" 
                onClick={handleAddTaskForDate}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Task
              </Button>
            </div>
          )}
        </div>
      )}
      
      <Dialog open={showAddTaskDialog} onOpenChange={(open) => {
        console.log("Calendar dialog state changing to:", open);
        if (!open) {
          closeTaskDialog();
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Task Title</Label>
              <Input 
                id="title" 
                placeholder="Enter task title"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)} 
                className="transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea 
                id="description" 
                placeholder="Enter task description"
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                className="transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="priority">Priority</Label>
              <Select 
                value={newTaskPriority} 
                onValueChange={(value) => setNewTaskPriority(value as 'low' | 'medium' | 'high')}
              >
                <SelectTrigger id="priority" className="transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter className="sm:justify-between">
            <Button 
              type="button" 
              variant="outline"
              onClick={closeTaskDialog}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleCreateTask}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
            >
              Create Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Calendar;
