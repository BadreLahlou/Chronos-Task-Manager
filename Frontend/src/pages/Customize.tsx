import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import { 
  Plus, 
  Trash2, 
  Save,
  ArrowLeft,
  LayoutDashboard,
  BarChart,
  Clock,
  Users,
  Calendar as CalendarIcon,
  CheckCircle2,
  ClipboardList,
  Palette,
  Briefcase,
  BookOpen,
  GraduationCap,
  Stethoscope,
  Scale,
  UserRound,
  Settings as SettingsIcon,
  Eye,
  Edit2,
  Check,
  X
} from 'lucide-react';
import { useUserRole } from '@/contexts/UserRoleContext';

type DashboardWidget = {
  id: string;
  title: string;
  type: 'stat' | 'chart' | 'list';
  icon: string;
  enabled: boolean;
  color?: string;
  removable?: boolean;
};

type DashboardPage = {
  id: string;
  name: string;
  icon: string;
  enabled: boolean;
  removable?: boolean;
};

const coreWidgets: DashboardWidget[] = [
  { id: 'tasks', title: 'My Tasks', type: 'stat', icon: 'ClipboardList', enabled: true, removable: false },
  { id: 'completed', title: 'Completed', type: 'stat', icon: 'CheckCircle2', enabled: true, removable: false },
  { id: 'time', title: 'Time Logged', type: 'stat', icon: 'Clock', enabled: true, removable: false },
  { id: 'upcoming', title: 'Upcoming', type: 'stat', icon: 'CalendarIcon', enabled: true, removable: false },
  { id: 'activity', title: 'Task Activity Chart', type: 'chart', icon: 'BarChart', enabled: true, removable: false },
  { id: 'status', title: 'Status Chart', type: 'chart', icon: 'BarChart', enabled: true, removable: false },
  { id: 'todo', title: 'Todo List', type: 'list', icon: 'ClipboardList', enabled: true, removable: false },
];

// Role-specific widgets that appear on dashboard
const getRoleSpecificWidgets = (userRole: string): DashboardWidget[] => {
  const roleWidgets: Record<string, DashboardWidget[]> = {
    admin: [
      { id: 'total-users', title: 'Total Users', type: 'stat', icon: 'Users', enabled: true, removable: true },
      { id: 'active-projects', title: 'Active Projects', type: 'stat', icon: 'Briefcase', enabled: true, removable: true },
      { id: 'system-uptime', title: 'System Uptime', type: 'stat', icon: 'CheckCircle2', enabled: true, removable: true },
      { id: 'pending-approvals', title: 'Pending Approvals', type: 'stat', icon: 'ClipboardList', enabled: true, removable: true },
    ],
    project_manager: [
      { id: 'active-projects', title: 'Active Projects', type: 'stat', icon: 'Briefcase', enabled: true, removable: true },
      { id: 'team-members', title: 'Team Members', type: 'stat', icon: 'Users', enabled: true, removable: true },
      { id: 'tasks-completed', title: 'Tasks Completed', type: 'stat', icon: 'CheckCircle2', enabled: true, removable: true },
      { id: 'budget-used', title: 'Budget Used', type: 'stat', icon: 'Clock', enabled: true, removable: true },
    ],
    team_leader: [
      { id: 'team-size', title: 'Team Size', type: 'stat', icon: 'Users', enabled: true, removable: true },
      { id: 'team-tasks', title: 'Team Tasks', type: 'stat', icon: 'ClipboardList', enabled: true, removable: true },
      { id: 'completion-rate', title: 'Completion Rate', type: 'stat', icon: 'CheckCircle2', enabled: true, removable: true },
      { id: 'team-hours', title: 'Team Hours', type: 'stat', icon: 'Clock', enabled: true, removable: true },
    ],
    team_member: [
      { id: 'my-tasks', title: 'My Tasks', type: 'stat', icon: 'ClipboardList', enabled: true, removable: true },
      { id: 'completed', title: 'Completed', type: 'stat', icon: 'CheckCircle2', enabled: true, removable: true },
      { id: 'time-logged', title: 'Time Logged', type: 'stat', icon: 'Clock', enabled: true, removable: true },
      { id: 'upcoming-due', title: 'Upcoming Due', type: 'stat', icon: 'CalendarIcon', enabled: true, removable: true },
    ],
    teacher: [
      { id: 'classes', title: 'Classes', type: 'stat', icon: 'BookOpen', enabled: true, removable: true },
      { id: 'students', title: 'Students', type: 'stat', icon: 'Users', enabled: true, removable: true },
      { id: 'assignments', title: 'Assignments', type: 'stat', icon: 'ClipboardList', enabled: true, removable: true },
      { id: 'grading-due', title: 'Grading Due', type: 'stat', icon: 'CalendarIcon', enabled: true, removable: true },
    ],
    principal: [
      { id: 'total-staff', title: 'Total Staff', type: 'stat', icon: 'Users', enabled: true, removable: true },
      { id: 'students', title: 'Students', type: 'stat', icon: 'GraduationCap', enabled: true, removable: true },
      { id: 'departments', title: 'Departments', type: 'stat', icon: 'Briefcase', enabled: true, removable: true },
      { id: 'events', title: 'Events', type: 'stat', icon: 'CalendarIcon', enabled: true, removable: true },
    ],
    student: [
      { id: 'courses', title: 'Courses', type: 'stat', icon: 'BookOpen', enabled: true, removable: true },
      { id: 'assignments', title: 'Assignments', type: 'stat', icon: 'ClipboardList', enabled: true, removable: true },
      { id: 'completed', title: 'Completed', type: 'stat', icon: 'CheckCircle2', enabled: true, removable: true },
      { id: 'upcoming-tests', title: 'Upcoming Tests', type: 'stat', icon: 'CalendarIcon', enabled: true, removable: true },
    ],
    freelancer: [
      { id: 'active-clients', title: 'Active Clients', type: 'stat', icon: 'Users', enabled: true, removable: true },
      { id: 'projects', title: 'Projects', type: 'stat', icon: 'Briefcase', enabled: true, removable: true },
      { id: 'billable-hours', title: 'Billable Hours', type: 'stat', icon: 'Clock', enabled: true, removable: true },
      { id: 'invoices-due', title: 'Invoices Due', type: 'stat', icon: 'ClipboardList', enabled: true, removable: true },
    ],
    healthcare_worker: [
      { id: 'patients', title: 'Patients', type: 'stat', icon: 'Users', enabled: true, removable: true },
      { id: 'appointments', title: 'Appointments', type: 'stat', icon: 'CalendarIcon', enabled: true, removable: true },
      { id: 'tasks', title: 'Tasks', type: 'stat', icon: 'ClipboardList', enabled: true, removable: true },
      { id: 'hours-logged', title: 'Hours Logged', type: 'stat', icon: 'Clock', enabled: true, removable: true },
    ],
    legal_team: [
      { id: 'active-cases', title: 'Active Cases', type: 'stat', icon: 'ClipboardList', enabled: true, removable: true },
      { id: 'deadlines', title: 'Deadlines', type: 'stat', icon: 'CalendarIcon', enabled: true, removable: true },
      { id: 'documents', title: 'Documents', type: 'stat', icon: 'ClipboardList', enabled: true, removable: true },
      { id: 'hours-billed', title: 'Hours Billed', type: 'stat', icon: 'Clock', enabled: true, removable: true },
    ],
    external_viewer: [
      { id: 'projects', title: 'Projects', type: 'stat', icon: 'Briefcase', enabled: true, removable: true },
      { id: 'completed', title: 'Completed', type: 'stat', icon: 'CheckCircle2', enabled: true, removable: true },
      { id: 'in-progress', title: 'In Progress', type: 'stat', icon: 'Clock', enabled: true, removable: true },
      { id: 'not-started', title: 'Not Started', type: 'stat', icon: 'ClipboardList', enabled: true, removable: true },
    ],
    other: [
      { id: 'total-items', title: 'Items', type: 'stat', icon: 'ClipboardList', enabled: true, removable: true },
      { id: 'completed-items', title: 'Completed', type: 'stat', icon: 'CheckCircle2', enabled: true, removable: true },
      { id: 'time-tracked', title: 'Time Tracked', type: 'stat', icon: 'Clock', enabled: true, removable: true },
      { id: 'weekly-items', title: 'This Week', type: 'stat', icon: 'CalendarIcon', enabled: true, removable: true },
    ]
  };

  return roleWidgets[userRole] || [];
};

const additionalWidgets: DashboardWidget[] = [
  { id: 'team-performance', title: 'Team Performance', type: 'chart', icon: 'Users', enabled: false, removable: true },
  { id: 'recent-activity', title: 'Recent Activity', type: 'list', icon: 'Clock', enabled: false, removable: true },
  { id: 'weekly-summary', title: 'Weekly Summary', type: 'stat', icon: 'CalendarIcon', enabled: false, removable: true },
];

const corePages: DashboardPage[] = [
  { id: 'dashboard', name: 'Dashboard', icon: 'LayoutDashboard', enabled: true, removable: false },
  { id: 'tasks', name: 'Tasks', icon: 'ClipboardList', enabled: true, removable: false },
];

const additionalPages: DashboardPage[] = [
  { id: 'calendar', name: 'Calendar', icon: 'CalendarIcon', enabled: true, removable: true },
  { id: 'time-tracking', name: 'Time Tracking', icon: 'Clock', enabled: true, removable: true },
  { id: 'reports', name: 'Reports', icon: 'BarChart', enabled: true, removable: true },
  { id: 'team', name: 'Team', icon: 'Users', enabled: true, removable: true },
];

const colorOptions = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', 
  '#d084d0', '#ffb347', '#87ceeb', '#dda0dd', '#98fb98'
];

const Customize = () => {
  const { userRole } = useUserRole();
  const navigate = useNavigate();
  
  const [widgets, setWidgets] = useState<DashboardWidget[]>([]);
  const [pages, setPages] = useState<DashboardPage[]>([...corePages, ...additionalPages]);
  const [customWidgetName, setCustomWidgetName] = useState('');
  const [customWidgetColor, setCustomWidgetColor] = useState(colorOptions[0]);
  const [customPageName, setCustomPageName] = useState('');
  const [editingValue, setEditingValue] = useState<string | null>(null);
  const [tempEditValue, setTempEditValue] = useState('');
  const [roleData, setRoleData] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!userRole) return;
    
    // Combine core widgets, role-specific widgets, and additional widgets
    const roleSpecificWidgets = getRoleSpecificWidgets(userRole);
    const allWidgets = [...coreWidgets, ...roleSpecificWidgets, ...additionalWidgets];
    
    // Load saved customizations from localStorage
    const savedWidgets = localStorage.getItem(`customization-widgets-${userRole}`);
    const savedPages = localStorage.getItem(`customization-pages-${userRole}`);
    const savedRoleData = localStorage.getItem(`role-data-${userRole}`);
    
    if (savedWidgets) {
      const parsedWidgets = JSON.parse(savedWidgets);
      setWidgets(parsedWidgets);
    } else {
      setWidgets(allWidgets);
    }
    
    if (savedPages) {
      const parsedPages = JSON.parse(savedPages);
      setPages(parsedPages);
    }

    if (savedRoleData) {
      setRoleData(JSON.parse(savedRoleData));
    }
  }, [userRole]);

  const saveCustomizations = () => {
    localStorage.setItem(`customization-widgets-${userRole}`, JSON.stringify(widgets));
    localStorage.setItem(`customization-pages-${userRole}`, JSON.stringify(pages));
    localStorage.setItem(`role-data-${userRole}`, JSON.stringify(roleData));
    
    // Update navigation pages for DashboardLayout
    const enabledPages = pages.filter(page => page.enabled);
    localStorage.setItem(`navigation-pages-${userRole}`, JSON.stringify(enabledPages));
    
    toast.success('Customizations saved successfully!');
  };

  const updateWidgetValue = (widgetId: string, value: string) => {
    const key = getDataKeyForWidget(widgetId);
    setRoleData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getDataKeyForWidget = (widgetId: string) => {
    // Map widget IDs to data keys
    const widgetToDataKey: Record<string, string> = {
      'total-users': 'totalUsers',
      'active-projects': 'activeProjects',
      'system-uptime': 'systemUptime',
      'pending-approvals': 'pendingApprovals',
      'team-members': 'teamMembers',
      'tasks-completed': 'tasksCompleted',
      'budget-used': 'budgetUsed',
      'team-size': 'teamSize',
      'team-tasks': 'teamTasks',
      'completion-rate': 'completionRate',
      'team-hours': 'teamHours',
      'my-tasks': 'myTasks',
      'completed': 'completed',
      'time-logged': 'timeLogged',
      'upcoming-due': 'upcomingDue',
      'classes': 'classes',
      'students': 'students',
      'assignments': 'assignments',
      'grading-due': 'gradingDue',
      'total-staff': 'totalStaff',
      'departments': 'departments',
      'events': 'events',
      'courses': 'courses',
      'upcoming-tests': 'upcomingTests',
      'active-clients': 'activeClients',
      'projects': 'projects',
      'billable-hours': 'billableHours',
      'invoices-due': 'invoicesDue',
      'patients': 'patients',
      'appointments': 'appointments',
      'tasks': 'tasks',
      'hours-logged': 'hoursLogged',
      'active-cases': 'activeCases',
      'deadlines': 'deadlines',
      'documents': 'documents',
      'hours-billed': 'hoursBilled',
      'in-progress': 'inProgress',
      'not-started': 'notStarted',
      'total-items': 'totalItems',
      'completed-items': 'completedItems',
      'time-tracked': 'timeTracked',
      'weekly-items': 'weeklyItems'
    };
    
    return widgetToDataKey[widgetId] || widgetId;
  };

  const getCurrentValue = (widgetId: string) => {
    const key = getDataKeyForWidget(widgetId);
    return roleData[key] || '0';
  };

  const toggleWidget = (id: string) => {
    setWidgets(prev => prev.map(widget => 
      widget.id === id ? { ...widget, enabled: !widget.enabled } : widget
    ));
  };

  const togglePage = (id: string) => {
    setPages(prev => prev.map(page => 
      page.id === id ? { ...page, enabled: !page.enabled } : page
    ));
  };

  const addCustomWidget = () => {
    if (!customWidgetName.trim()) {
      toast.error('Please enter a widget name');
      return;
    }
    
    const newWidget: DashboardWidget = {
      id: `custom-${Date.now()}`,
      title: customWidgetName,
      type: 'stat',
      icon: 'ClipboardList',
      enabled: true,
      color: customWidgetColor,
      removable: true
    };
    
    setWidgets(prev => [...prev, newWidget]);
    setCustomWidgetName('');
    setCustomWidgetColor(colorOptions[0]);
    toast.success('Custom widget added!');
  };

  const addCustomPage = () => {
    if (!customPageName.trim()) {
      toast.error('Please enter a page name');
      return;
    }
    
    const newPage: DashboardPage = {
      id: `custom-${Date.now()}`,
      name: customPageName,
      icon: 'LayoutDashboard',
      enabled: true,
      removable: true
    };
    
    setPages(prev => [...prev, newPage]);
    setCustomPageName('');
    toast.success('Custom page added!');
  };

  const deleteWidget = (id: string) => {
    setWidgets(prev => prev.filter(widget => widget.id !== id));
    toast.success('Widget removed!');
  };

  const deletePage = (id: string) => {
    setPages(prev => prev.filter(page => page.id !== id));
    toast.success('Page removed!');
  };

  const updateWidgetColor = (id: string, color: string) => {
    setWidgets(prev => prev.map(widget => 
      widget.id === id ? { ...widget, color } : widget
    ));
  };

  const startEditing = (widgetId: string) => {
    setEditingValue(widgetId);
    setTempEditValue(getCurrentValue(widgetId));
  };

  const saveEdit = (widgetId: string) => {
    updateWidgetValue(widgetId, tempEditValue);
    setEditingValue(null);
    setTempEditValue('');
  };

  const cancelEdit = () => {
    setEditingValue(null);
    setTempEditValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent, widgetId: string) => {
    if (e.key === 'Enter') {
      saveEdit(widgetId);
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Customize Dashboard</h1>
            <p className="text-muted-foreground">Personalize your workspace</p>
          </div>
        </div>
        <Button onClick={saveCustomizations}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5" />
              Dashboard Widgets
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {widgets.map((widget) => (
              <div key={widget.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3 flex-1">
                  <Switch 
                    checked={widget.enabled}
                    onCheckedChange={() => toggleWidget(widget.id)}
                  />
                  <div className="flex-1">
                    <p className="font-medium">{widget.title}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{widget.type}</Badge>
                      {widget.type === 'stat' && !widget.id.startsWith('tasks') && !widget.id.startsWith('completed') && !widget.id.startsWith('time') && !widget.id.startsWith('upcoming') && (
                        <div className="flex items-center gap-2">
                          {editingValue === widget.id ? (
                            <div className="flex items-center gap-1">
                              <Input
                                type="text"
                                value={tempEditValue}
                                onChange={(e) => setTempEditValue(e.target.value)}
                                className="w-20 h-6 text-xs"
                                onKeyDown={(e) => handleKeyPress(e, widget.id)}
                                autoFocus
                                onFocus={(e) => e.target.select()}
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => saveEdit(widget.id)}
                                className="h-6 w-6 p-0"
                              >
                                <Check className="h-3 w-3 text-green-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={cancelEdit}
                                className="h-6 w-6 p-0"
                              >
                                <X className="h-3 w-3 text-red-600" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-muted-foreground">
                                Value: {getCurrentValue(widget.id)}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => startEditing(widget.id)}
                                className="h-6 w-6 p-0"
                              >
                                <Edit2 className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  {widget.color && (
                    <div className="flex items-center gap-2">
                      <Palette className="h-4 w-4" />
                      <div className="flex gap-1">
                        {colorOptions.map((color) => (
                          <button
                            key={color}
                            className={`w-6 h-6 rounded-full border-2 ${
                              widget.color === color ? 'border-gray-800 dark:border-gray-200' : 'border-gray-300 dark:border-gray-600'
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() => updateWidgetColor(widget.id, color)}
                            aria-label={`Select color ${color}`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {widget.removable && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => deleteWidget(widget.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            
            <div className="pt-4 border-t">
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add custom widget..."
                    value={customWidgetName}
                    onChange={(e) => setCustomWidgetName(e.target.value)}
                  />
                  <Button onClick={addCustomWidget} disabled={!customWidgetName.trim()}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Label>Color:</Label>
                  <div className="flex gap-1">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        className={`w-6 h-6 rounded-full border-2 ${
                          customWidgetColor === color ? 'border-gray-800 dark:border-gray-200' : 'border-gray-300 dark:border-gray-600'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setCustomWidgetColor(color)}
                        aria-label={`Select color ${color}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Navigation Pages
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pages.map((page) => (
              <div key={page.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Switch 
                    checked={page.enabled}
                    onCheckedChange={() => togglePage(page.id)}
                  />
                  <p className="font-medium">{page.name}</p>
                </div>
                {page.removable && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => deletePage(page.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            
            <div className="pt-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Add custom page..."
                  value={customPageName}
                  onChange={(e) => setCustomPageName(e.target.value)}
                />
                <Button onClick={addCustomPage} disabled={!customPageName.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Customize;
