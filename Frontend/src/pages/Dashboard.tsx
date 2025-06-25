import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  ClipboardList,
  Clock,
  Calendar as CalendarIcon,
  CheckCircle2,
  Users,
  ArrowRight,
  BookOpen,
  GraduationCap,
  Stethoscope,
  Scale,
  UserRound,
  Briefcase,
  Settings as SettingsIcon,
  Eye,
  LayoutDashboard
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TaskCard } from '@/components/TaskCard';
import { Link } from 'react-router-dom';
import { useUserRole } from '@/contexts/UserRoleContext';
import { TaskPriority, TaskStatus, TaskProps, Widget, RoleData } from '@/types/task';
import RoleOnboarding from '@/components/RoleOnboarding';
import { fetchTasksFromBackend } from '@/utils/taskApi';
import { toast } from 'sonner';

const Dashboard = () => {
  const { userRole } = useUserRole();
  const [tasks, setTasks] = useState<TaskProps[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [customizations, setCustomizations] = useState<Widget[] | null>(null);
  const [roleData, setRoleData] = useState<RoleData | null>(null);

  useEffect(() => {
    fetchTasksFromBackend().then(setTasks).catch(() => toast.error("Failed to load tasks from server"));
  }, []);

  useEffect(() => {
    
    const hasOnboarded = localStorage.getItem(`onboarding-${userRole}`);
    if (!hasOnboarded && userRole) {
      setShowOnboarding(true);
    }

    
    const savedWidgets = localStorage.getItem(`customization-widgets-${userRole}`);
    if (savedWidgets) {
      setCustomizations(JSON.parse(savedWidgets));
    }

    
    const savedRoleData = localStorage.getItem(`role-data-${userRole}`);
    if (savedRoleData) {
      setRoleData(JSON.parse(savedRoleData));
    }
  }, [userRole]);

  const handleOnboardingComplete = (data: RoleData) => {
    setShowOnboarding(false);
    
    localStorage.setItem(`role-data-${userRole}`, JSON.stringify(data));
    setRoleData(data);
  };

  if (showOnboarding) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <RoleOnboarding role={userRole} onComplete={handleOnboardingComplete} />
      </div>
    );
  }

  
  const getRoleSpecificData = () => {
    const baseData = {
      tasksData: [
        { name: 'Mon', tasks: 0 },
        { name: 'Tue', tasks: 0 },
        { name: 'Wed', tasks: 0 },
        { name: 'Thu', tasks: 0 },
        { name: 'Fri', tasks: 0 },
        { name: 'Sat', tasks: 0 },
        { name: 'Sun', tasks: 0 },
      ],
      pieData: [
        { name: 'To-Do', value: 0, color: '#818cf8' },
        { name: 'In Progress', value: 0, color: '#fbbf24' },
        { name: 'Done', value: 0, color: '#34d399' },
      ],
      todoTasks: []
    };

    const getStatValue = (key: string, defaultValue: string = "0") => {
      return roleData?.[key] || defaultValue;
    };

    switch (userRole) {
      case 'other':
        return {
          title: "Custom Dashboard",
          subtitle: "Your personalized workspace",
          icon: <SettingsIcon className="h-8 w-8 text-indigo-500" />,
          stats: [
            { title: "Items", value: getStatValue('totalItems'), icon: <ClipboardList className="h-8 w-8 text-blue-500" />, change: "+0" },
            { title: "Completed", value: getStatValue('completedItems'), icon: <CheckCircle2 className="h-8 w-8 text-green-500" />, change: "+0" },
            { title: "Time Tracked", value: getStatValue('timeTracked', '0h'), icon: <Clock className="h-8 w-8 text-amber-500" />, change: "+0h" },
            { title: "This Week", value: getStatValue('weeklyItems'), icon: <CalendarIcon className="h-8 w-8 text-purple-500" />, change: "+0" },
          ],
          ...baseData
        };
      case 'admin':
        return {
          title: "Administrator Dashboard",
          subtitle: "System overview and management",
          icon: <SettingsIcon className="h-8 w-8 text-purple-500" />,
          stats: [
            { title: "Total Users", value: getStatValue('totalUsers'), icon: <Users className="h-8 w-8 text-blue-500" />, change: "+0%" },
            { title: "Active Projects", value: getStatValue('activeProjects'), icon: <Briefcase className="h-8 w-8 text-green-500" />, change: "+0%" },
            { title: "System Uptime", value: getStatValue('systemUptime', '0%'), icon: <CheckCircle2 className="h-8 w-8 text-emerald-500" />, change: "+0%" },
            { title: "Pending Approvals", value: getStatValue('pendingApprovals'), icon: <ClipboardList className="h-8 w-8 text-amber-500" />, change: "+0" },
          ],
          ...baseData
        };
      case 'project_manager':
        return {
          title: "Project Manager Dashboard",
          subtitle: "Track projects and team performance",
          icon: <Briefcase className="h-8 w-8 text-blue-500" />,
          stats: [
            { title: "Active Projects", value: getStatValue('activeProjects'), icon: <Briefcase className="h-8 w-8 text-blue-500" />, change: "+0" },
            { title: "Team Members", value: getStatValue('teamMembers'), icon: <Users className="h-8 w-8 text-green-500" />, change: "+0" },
            { title: "Tasks Completed", value: getStatValue('tasksCompleted'), icon: <CheckCircle2 className="h-8 w-8 text-emerald-500" />, change: "+0%" },
            { title: "Budget Used", value: getStatValue('budgetUsed', '0%'), icon: <Clock className="h-8 w-8 text-amber-500" />, change: "+0%" },
          ],
          ...baseData
        };
      case 'team_leader':
        return {
          title: "Team Leader Dashboard",
          subtitle: "Team performance and task management",
          icon: <Users className="h-8 w-8 text-green-500" />,
          stats: [
            { title: "Team Size", value: getStatValue('teamSize'), icon: <Users className="h-8 w-8 text-blue-500" />, change: "Unchanged" },
            { title: "Team Tasks", value: getStatValue('teamTasks'), icon: <ClipboardList className="h-8 w-8 text-green-500" />, change: "+0" },
            { title: "Completion Rate", value: getStatValue('completionRate', '0%'), icon: <CheckCircle2 className="h-8 w-8 text-emerald-500" />, change: "+0%" },
            { title: "Team Hours", value: getStatValue('teamHours', '0h'), icon: <Clock className="h-8 w-8 text-amber-500" />, change: "+0h" },
          ],
          ...baseData
        };
      case 'team_member':
        return {
          title: "Team Member Dashboard",
          subtitle: "Your tasks and time tracking",
          icon: <UserRound className="h-8 w-8 text-teal-500" />,
          stats: [
            { title: "My Tasks", value: getStatValue('myTasks'), icon: <ClipboardList className="h-8 w-8 text-blue-500" />, change: "+0" },
            { title: "Completed", value: getStatValue('completed'), icon: <CheckCircle2 className="h-8 w-8 text-green-500" />, change: "+0" },
            { title: "Time Logged", value: getStatValue('timeLogged', '0h'), icon: <Clock className="h-8 w-8 text-emerald-500" />, change: "+0h" },
            { title: "Upcoming Due", value: getStatValue('upcomingDue'), icon: <CalendarIcon className="h-8 w-8 text-amber-500" />, change: "+0" },
          ],
          ...baseData
        };
      case 'teacher':
        return {
          title: "Teacher Dashboard",
          subtitle: "Class management and assignments",
          icon: <BookOpen className="h-8 w-8 text-red-500" />,
          stats: [
            { title: "Classes", value: getStatValue('classes'), icon: <BookOpen className="h-8 w-8 text-blue-500" />, change: "Unchanged" },
            { title: "Students", value: getStatValue('students'), icon: <Users className="h-8 w-8 text-green-500" />, change: "+0" },
            { title: "Assignments", value: getStatValue('assignments'), icon: <ClipboardList className="h-8 w-8 text-emerald-500" />, change: "+0" },
            { title: "Grading Due", value: getStatValue('gradingDue'), icon: <CalendarIcon className="h-8 w-8 text-amber-500" />, change: "+0" },
          ],
          ...baseData
        };
      case 'principal':
        return {
          title: "Principal Dashboard",
          subtitle: "School operations and performance",
          icon: <GraduationCap className="h-8 w-8 text-orange-500" />,
          stats: [
            { title: "Total Staff", value: getStatValue('totalStaff'), icon: <Users className="h-8 w-8 text-blue-500" />, change: "+0" },
            { title: "Students", value: getStatValue('students'), icon: <GraduationCap className="h-8 w-8 text-green-500" />, change: "+0" },
            { title: "Departments", value: getStatValue('departments'), icon: <Briefcase className="h-8 w-8 text-emerald-500" />, change: "Unchanged" },
            { title: "Events", value: getStatValue('events'), icon: <CalendarIcon className="h-8 w-8 text-amber-500" />, change: "+0" },
          ],
          ...baseData
        };
      case 'student':
        return {
          title: "Student Dashboard",
          subtitle: "Assignments and schedule",
          icon: <GraduationCap className="h-8 w-8 text-yellow-500" />,
          stats: [
            { title: "Courses", value: getStatValue('courses'), icon: <BookOpen className="h-8 w-8 text-blue-500" />, change: "Unchanged" },
            { title: "Assignments", value: getStatValue('assignments'), icon: <ClipboardList className="h-8 w-8 text-green-500" />, change: "+0" },
            { title: "Completed", value: getStatValue('completed'), icon: <CheckCircle2 className="h-8 w-8 text-emerald-500" />, change: "+0" },
            { title: "Upcoming Tests", value: getStatValue('upcomingTests'), icon: <CalendarIcon className="h-8 w-8 text-amber-500" />, change: "+0" },
          ],
          ...baseData
        };
      case 'freelancer':
        return {
          title: "Freelancer Dashboard",
          subtitle: "Projects and client management",
          icon: <UserRound className="h-8 w-8 text-pink-500" />,
          stats: [
            { title: "Active Clients", value: getStatValue('activeClients'), icon: <Users className="h-8 w-8 text-blue-500" />, change: "+0" },
            { title: "Projects", value: getStatValue('projects'), icon: <Briefcase className="h-8 w-8 text-green-500" />, change: "+0" },
            { title: "Billable Hours", value: getStatValue('billableHours', '0h'), icon: <Clock className="h-8 w-8 text-emerald-500" />, change: "+0h" },
            { title: "Invoices Due", value: getStatValue('invoicesDue'), icon: <ClipboardList className="h-8 w-8 text-amber-500" />, change: "+0" },
          ],
          ...baseData
        };
      case 'healthcare_worker':
        return {
          title: "Healthcare Dashboard",
          subtitle: "Patient care and scheduling",
          icon: <Stethoscope className="h-8 w-8 text-red-500" />,
          stats: [
            { title: "Patients", value: getStatValue('patients'), icon: <Users className="h-8 w-8 text-blue-500" />, change: "+0" },
            { title: "Appointments", value: getStatValue('appointments'), icon: <CalendarIcon className="h-8 w-8 text-green-500" />, change: "+0" },
            { title: "Tasks", value: getStatValue('tasks'), icon: <ClipboardList className="h-8 w-8 text-emerald-500" />, change: "+0" },
            { title: "Hours Logged", value: getStatValue('hoursLogged', '0h'), icon: <Clock className="h-8 w-8 text-amber-500" />, change: "+0h" },
          ],
          ...baseData
        };
      case 'legal_team':
        return {
          title: "Legal Team Dashboard",
          subtitle: "Case management and deadlines",
          icon: <Scale className="h-8 w-8 text-blue-800" />,
          stats: [
            { title: "Active Cases", value: getStatValue('activeCases'), icon: <ClipboardList className="h-8 w-8 text-blue-500" />, change: "+0" },
            { title: "Deadlines", value: getStatValue('deadlines'), icon: <CalendarIcon className="h-8 w-8 text-green-500" />, change: "+0" },
            { title: "Documents", value: getStatValue('documents'), icon: <ClipboardList className="h-8 w-8 text-emerald-500" />, change: "+0" },
            { title: "Hours Billed", value: getStatValue('hoursBilled', '0h'), icon: <Clock className="h-8 w-8 text-amber-500" />, change: "+0h" },
          ],
          ...baseData
        };
      case 'external_viewer':
        return {
          title: "Overview Dashboard",
          subtitle: "Project status and reports",
          icon: <Eye className="h-8 w-8 text-gray-500" />,
          stats: [
            { title: "Projects", value: getStatValue('projects'), icon: <Briefcase className="h-8 w-8 text-blue-500" />, change: "+0" },
            { title: "Completed", value: getStatValue('completed'), icon: <CheckCircle2 className="h-8 w-8 text-green-500" />, change: "+0" },
            { title: "In Progress", value: getStatValue('inProgress'), icon: <Clock className="h-8 w-8 text-amber-500" />, change: "Unchanged" },
            { title: "Not Started", value: getStatValue('notStarted'), icon: <ClipboardList className="h-8 w-8 text-purple-500" />, change: "Unchanged" },
          ],
          ...baseData
        };
      default:
        return {
          title: "Dashboard",
          subtitle: "Your productivity at a glance",
          icon: <LayoutDashboard className="h-8 w-8 text-purple-500" />,
          stats: [
            { title: "Tasks", value: getStatValue('tasks'), icon: <ClipboardList className="h-8 w-8 text-blue-500" />, change: "+0" },
            { title: "Completed", value: getStatValue('completed'), icon: <CheckCircle2 className="h-8 w-8 text-green-500" />, change: "+0" },
            { title: "Time Logged", value: getStatValue('timeLogged', '0h'), icon: <Clock className="h-8 w-8 text-amber-500" />, change: "+0h" },
            { title: "Upcoming", value: getStatValue('upcoming'), icon: <CalendarIcon className="h-8 w-8 text-purple-500" />, change: "+0" },
          ],
          ...baseData
        };
    }
  };

  const data = getRoleSpecificData();

  // Filter stats and content based on customizations
  const getEnabledWidgets = () => {
    if (!customizations) return data.stats;
    
    const enabledStats = [];
    
    // Add default widgets that are enabled
    customizations.forEach(widget => {
      if (widget.enabled) {
        if (widget.id.startsWith('custom-')) {
          // Custom widget
          enabledStats.push({
            title: widget.title,
            value: roleData?.[widget.id] || "0",
            icon: <ClipboardList className="h-8 w-8" style={{ color: widget.color || '#8884d8' }} />,
            change: "+0"
          });
        } else {
          // Find matching default widget
          const matchingStat = data.stats.find(stat => 
            stat.title.toLowerCase().includes(widget.title.toLowerCase()) ||
            widget.title.toLowerCase().includes(stat.title.toLowerCase())
          );
          if (matchingStat) {
            enabledStats.push(matchingStat);
          }
        }
      }
    });
    
    return enabledStats;
  };

  const shouldShowChart = (chartType: string) => {
    if (!customizations) return true;
    const chartWidget = customizations.find(w => w.type === 'chart' && w.enabled);
    return chartWidget !== undefined;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {data.icon}
          <div>
            <h1 className="text-2xl font-semibold">{data.title}</h1>
            <p className="text-muted-foreground">{data.subtitle}</p>
          </div>
        </div>
        <Button size="sm" variant="outline" asChild>
          <Link to="/customize">
            Customize Dashboard
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {getEnabledWidgets().map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.change.includes("+") ? (
                  <span className="text-green-600 dark:text-green-400">{stat.change}</span>
                ) : stat.change.includes("-") ? (
                  <span className="text-red-600 dark:text-red-400">{stat.change}</span>
                ) : (
                  <span>{stat.change}</span>
                )}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {shouldShowChart('chart') && (
        <div className="grid gap-6 md:grid-cols-7">
          <Card className="col-span-7 md:col-span-4">
            <CardHeader>
              <CardTitle>Task Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.tasksData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Bar dataKey="tasks" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-7 md:col-span-3">
            <CardHeader>
              <CardTitle>Task Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      label={(entry) => entry.name}
                    >
                      {data.pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {data.todoTasks.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center">
            <div className="flex-1">
              <CardTitle>Todo Tasks</CardTitle>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/tasks">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.todoTasks.map((task) => (
                <TaskCard key={task.id} task={task} showActions={false} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;