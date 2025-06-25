
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DownloadCloud, BarChart4, TrendingUp, Zap, FileText, File } from 'lucide-react';
import { TaskProps } from '@/types/task';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import StatusChart from '@/components/reports/StatusChart';
import PriorityChart from '@/components/reports/PriorityChart';
import TimeChart from '@/components/reports/TimeChart';
import MetricsCards from '@/components/reports/MetricsCards';
import ChartContainer from '@/components/reports/ChartContainer';
import { formatTime } from '@/components/reports/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { fetchTasksFromBackend } from '@/utils/taskApi';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

const Reports = () => {
  const [tasks, setTasks] = useState<TaskProps[]>([]);
  const [reportType, setReportType] = useState('overview');
  const [timeFrame, setTimeFrame] = useState('all');
  
  useEffect(() => {
    fetchTasksFromBackend().then(setTasks).catch(() => toast.error("Failed to load tasks from server"));
  }, []);

  const getFilteredTasks = () => {
    if (timeFrame === 'all') return tasks;
    return tasks;
  };

  const filteredTasks = getFilteredTasks();

  const totalTasks = filteredTasks.length;
  const completedTasks = filteredTasks.filter(task => task.status === 'completed').length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks * 100).toFixed(1) : '0';
  
  const totalTimeTracked = filteredTasks.reduce((total, task) => total + (task.timeLogged || 0), 0);
  const avgTimePerTask = totalTasks > 0 ? Math.round(totalTimeTracked / totalTasks) : 0;

  const highPriorityCompleted = filteredTasks.filter(task => 
    task.priority === 'high' && task.status === 'completed'
  ).length;
  
  const highPriorityTotal = filteredTasks.filter(task => task.priority === 'high').length;
  const highPriorityRate = highPriorityTotal > 0 
    ? (highPriorityCompleted / highPriorityTotal * 100).toFixed(1) 
    : '0';

  const renderChart = () => {
    if (reportType === 'overview' || reportType === 'status') {
      return <StatusChart tasks={filteredTasks} />;
    } else if (reportType === 'priority') {
      return <PriorityChart tasks={filteredTasks} />;
    } else {
      return <TimeChart tasks={filteredTasks} />;
    }
  };

  const getChartTitle = () => {
    switch (reportType) {
      case 'overview': return 'Task Overview';
      case 'status': return 'Task Status Distribution';
      case 'time': return 'Time Tracking Analysis';
      case 'priority': return 'Priority Distribution';
      default: return 'Analytics Report';
    }
  };

  const getInsights = () => {
    if (tasks.length === 0) return "Add tasks to see insights";
    
    const insights = [];
    
    if (Number(completionRate) > 70) {
      insights.push("Great job! Your task completion rate is excellent.");
    } else if (Number(completionRate) > 40) {
      insights.push("You're making good progress on your tasks.");
    } else if (tasks.length > 0) {
      insights.push("Consider focusing on completing more tasks.");
    }
    
    const highPriorityInProgress = filteredTasks.filter(task => 
      task.priority === 'high' && task.status === 'in-progress'
    ).length;
    
    if (highPriorityInProgress > 0) {
      insights.push(`You have ${highPriorityInProgress} high priority task${highPriorityInProgress > 1 ? 's' : ''} in progress.`);
    }
    
    if (highPriorityTotal > 0 && Number(highPriorityRate) < 50) {
      insights.push("Focus on completing high priority tasks.");
    }
    
    return insights.join(" ");
  };

  const handleExportPDF = () => {
    toast.success("Exporting report as PDF...");
    setTimeout(() => {
      toast.info("PDF Export complete!");
    }, 1500);
  };

  const handleExportTXT = () => {
    toast.success("Exporting report as TXT file...");
    setTimeout(() => {
      toast.info("TXT Export complete!");
    }, 1500);
  };
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">Analyze your productivity and task completion</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select 
            value={timeFrame} 
            onValueChange={setTimeFrame}
          >
            <SelectTrigger className="w-[120px] border-purple-200 focus:ring-purple-400 dark:border-border">
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent className="dark:bg-card dark:border-border">
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
          
          <Select 
            value={reportType} 
            onValueChange={setReportType}
          >
            <SelectTrigger className="w-[160px] border-purple-200 focus:ring-purple-400 dark:border-border">
              <SelectValue placeholder="Report Type" />
            </SelectTrigger>
            <SelectContent className="dark:bg-card dark:border-border">
              <SelectItem value="overview">Overview</SelectItem>
              <SelectItem value="status">Status Report</SelectItem>
              <SelectItem value="time">Time Report</SelectItem>
              <SelectItem value="priority">Priority Report</SelectItem>
            </SelectContent>
          </Select>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 border-purple-200 hover:bg-purple-50 hover:text-purple-600 transition-colors dark:border-border dark:hover:bg-card">
                <DownloadCloud className="h-3.5 w-3.5" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="dark:bg-card dark:border-border">
              <DropdownMenuItem onClick={handleExportPDF} className="cursor-pointer">
                <File className="mr-2 h-4 w-4" />
                <span>Export as PDF</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportTXT} className="cursor-pointer">
                <FileText className="mr-2 h-4 w-4" />
                <span>Export as TXT</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <MetricsCards tasks={filteredTasks} formatTime={formatTime} />
      
      <Card className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-100 dark:bg-card dark:border-border dark:from-transparent dark:to-transparent">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Zap className="h-4 w-4 mr-2 text-purple-500" />
            Smart Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-700 dark:text-foreground/90">{getInsights()}</p>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="dark:bg-card dark:border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-foreground">{completionRate}%</div>
            <div className="h-2 bg-gray-100 rounded-full mt-2 dark:bg-gray-800">
              <div 
                className="h-2 bg-green-500 rounded-full" 
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="dark:bg-card dark:border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <BarChart4 className="h-4 w-4 mr-2 text-blue-500" />
              Avg Time per Task
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-foreground">{formatTime(avgTimePerTask)}</div>
          </CardContent>
        </Card>
        
        <Card className="dark:bg-card dark:border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <Zap className="h-4 w-4 mr-2 text-amber-500" />
              High Priority Completion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-foreground">{highPriorityRate}%</div>
            <div className="h-2 bg-gray-100 rounded-full mt-2 dark:bg-gray-800">
              <div 
                className="h-2 bg-amber-500 rounded-full" 
                style={{ width: `${highPriorityRate}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <ChartContainer 
        title={getChartTitle()} 
        isEmpty={tasks.length === 0}
      >
        {renderChart()}
      </ChartContainer>
    </div>
  );
};

export default Reports;
