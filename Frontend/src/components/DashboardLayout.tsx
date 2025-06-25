import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { 
  LayoutDashboard, 
  ListTodo, 
  Clock, 
  Calendar,
  BarChart4,
  Users,
  Settings,
  Menu,
  X,
  Search,
  Bell,
  User,
  LogOut,
  UserCog
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import ClickOutside from '@/components/ui/click-outside';
import { useUserRole } from '@/contexts/UserRoleContext';

const SidebarLink = ({ icon, label, to, active, onClick, visible = true }) => {
  if (!visible) return null;
  
  return (
    <Button 
      variant={active ? "secondary" : "ghost"} 
      className="w-full justify-start gap-3 transition-all duration-300" 
      asChild
      onClick={onClick}
    >
      <Link to={to}>
        {icon}
        {label}
      </Link>
    </Button>
  );
};

const DashboardLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [enabledPages, setEnabledPages] = useState([]);
  
  const { userRole, clearUserRole, isRoleLoaded } = useUserRole();

  // Redirect to role selection if no role is selected
  useEffect(() => {
    if (isRoleLoaded && !userRole) {
      navigate('/role-selection');
    }
  }, [userRole, isRoleLoaded, navigate]);

  // Load enabled pages from customization
  useEffect(() => {
    if (userRole) {
      const savedPages = localStorage.getItem(`customization-pages-${userRole}`);
      if (savedPages) {
        const pages = JSON.parse(savedPages);
        setEnabledPages(pages.filter(page => page.enabled));
      } else {
        // Default pages if no customization
        setEnabledPages([
          { id: 'dashboard', name: 'Dashboard' },
          { id: 'tasks', name: 'Tasks' },
          { id: 'calendar', name: 'Calendar' },
          { id: 'time-tracking', name: 'Time Tracking' },
          { id: 'reports', name: 'Reports' },
          { id: 'team', name: 'Team' }
        ]);
      }
    }
  }, [userRole]);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    toast.success('Logged out successfully');
    clearUserRole();
    navigate('/');
  };

  const handleChangeRole = () => {
    setIsProfileOpen(false);
    navigate('/role-selection');
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    toast.success(notificationsEnabled ? 'Notifications disabled' : 'Notifications enabled');
  };
  
  // Define role-based visibility for sidebar links
  const getLinkVisibility = (link: string) => {
    if (!userRole) return true;

    // Check if page is in enabled pages
    const pageId = link.replace('/', '').replace('-', '_');
    const isPageEnabled = enabledPages.some(page => 
      page.id === pageId || page.id === link.replace('/', '')
    );

    if (!isPageEnabled && link !== '/settings') return false;

    const visibilityMap: Record<string, string[]> = {
      '/dashboard': ['admin', 'project_manager', 'team_leader', 'team_member', 'teacher', 'principal', 'student', 'freelancer', 'healthcare_worker', 'legal_team', 'external_viewer', 'other'],
      '/tasks': ['admin', 'project_manager', 'team_leader', 'team_member', 'teacher', 'student', 'freelancer', 'healthcare_worker', 'legal_team', 'other'],
      '/time-tracking': ['admin', 'project_manager', 'team_leader', 'team_member', 'freelancer', 'healthcare_worker', 'legal_team', 'other'],
      '/reports': ['admin', 'project_manager', 'team_leader', 'principal', 'external_viewer', 'other'],
      '/calendar': ['admin', 'project_manager', 'team_leader', 'team_member', 'teacher', 'principal', 'student', 'freelancer', 'healthcare_worker', 'legal_team', 'other'],
      '/team': ['admin', 'project_manager', 'team_leader', 'principal', 'other'],
      '/settings': ['admin', 'project_manager', 'team_leader', 'team_member', 'teacher', 'principal', 'student', 'freelancer', 'healthcare_worker', 'legal_team', 'external_viewer', 'other']
    };

    return visibilityMap[link]?.includes(userRole) ?? true;
  };
  
  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);
  
  // Handle body overflow to prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Get role display name
  const getRoleDisplayName = () => {
    if (!userRole) return 'User';
    const roleMap: Record<string, string> = {
      'admin': 'Administrator',
      'project_manager': 'Project Manager',
      'team_leader': 'Team Leader',
      'team_member': 'Team Member',
      'teacher': 'Teacher',
      'principal': 'Principal',
      'student': 'Student',
      'freelancer': 'Freelancer',
      'healthcare_worker': 'Healthcare Worker',
      'legal_team': 'Legal Team Member',
      'external_viewer': 'External Viewer',
      'other': 'Custom User'
    };
    return roleMap[userRole] || 'User';
  };
  
  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        <div className="hidden md:flex w-64 flex-col bg-sidebar-background text-sidebar-foreground border-r border-border p-4 shadow-md transition-all duration-300 animate-slide-in">
          <Link to="/" className="flex items-center gap-2 py-3 px-2 mb-6 hover:opacity-80 transition-opacity">
            <Clock className="h-5 w-5 text-primary animate-pulse-subtle" />
            <span className="font-display text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Chronos</span>
          </Link>
          
          {userRole && (
            <div className="mb-6 px-2">
              <div className="text-sm text-muted-foreground">Logged in as</div>
              <div className="font-medium">{getRoleDisplayName()}</div>
            </div>
          )}
          
          <nav className="space-y-1 flex-1">
            <SidebarLink 
              icon={<LayoutDashboard className="h-4 w-4" />} 
              label="Dashboard" 
              to="/dashboard" 
              active={currentPath === "/dashboard"}
              onClick={handleLinkClick}
              visible={getLinkVisibility('/dashboard')}
            />
            <SidebarLink 
              icon={<ListTodo className="h-4 w-4" />} 
              label="Tasks" 
              to="/tasks" 
              active={currentPath === "/tasks"}
              onClick={handleLinkClick}
              visible={getLinkVisibility('/tasks')}
            />
            <SidebarLink 
              icon={<Clock className="h-4 w-4" />} 
              label="Time Tracking" 
              to="/time-tracking" 
              active={currentPath === "/time-tracking"}
              onClick={handleLinkClick}
              visible={getLinkVisibility('/time-tracking')}
            />
            <SidebarLink 
              icon={<Calendar className="h-4 w-4" />} 
              label="Calendar" 
              to="/calendar" 
              active={currentPath === "/calendar"}
              onClick={handleLinkClick}
              visible={getLinkVisibility('/calendar')}
            />
            <SidebarLink 
              icon={<BarChart4 className="h-4 w-4" />} 
              label="Reports" 
              to="/reports" 
              active={currentPath === "/reports"}
              onClick={handleLinkClick}
              visible={getLinkVisibility('/reports')}
            />
            <SidebarLink 
              icon={<Users className="h-4 w-4" />} 
              label="Team" 
              to="/team" 
              active={currentPath === "/team"}
              onClick={handleLinkClick}
              visible={getLinkVisibility('/team')}
            />
          </nav>
          
          <div className="pt-6 border-t border-border mt-6">
            <SidebarLink 
              icon={<Settings className="h-4 w-4" />} 
              label="Settings" 
              to="/settings" 
              active={currentPath === "/settings"}
              onClick={handleLinkClick}
              visible={getLinkVisibility('/settings')}
            />
          </div>
        </div>
        
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-30 bg-background border-b border-border h-16 flex items-center px-4 md:px-6 shadow-sm transition-all duration-300">
            <div className="flex items-center gap-2 md:hidden">
              <button 
                onClick={toggleMobileMenu}
                className="h-9 w-9 inline-flex items-center justify-center rounded-md hover:bg-secondary transition-all duration-300"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
              <Link to="/" className="hover:opacity-80 transition-opacity">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary animate-pulse-subtle" />
                  <span className="font-display text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Chronos</span>
                </div>
              </Link>
            </div>
            
            <div className="flex-1 flex justify-end md:justify-between items-center gap-4">
              <div className="hidden md:flex max-w-md w-full relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="search" 
                  placeholder="Search tasks..." 
                  className="pl-9 w-full bg-secondary border-none transition-all duration-300 focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  className={`h-9 w-9 inline-flex items-center justify-center rounded-md transition-all duration-300 ${
                    notificationsEnabled ? 'bg-black text-white dark:bg-white dark:text-black' : 'hover:bg-secondary'
                  }`}
                  onClick={toggleNotifications}
                  aria-label="Toggle notifications"
                >
                  <Bell className="h-5 w-5" />
                </button>
                
                <div className="relative">
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="h-9 w-9 inline-flex items-center justify-center rounded-md hover:bg-secondary transition-all duration-300"
                    aria-label="Toggle profile menu"
                  >
                    <User className="h-5 w-5 text-muted-foreground" />
                  </button>
                  
                  {isProfileOpen && (
                    <ClickOutside onClickOutside={() => setIsProfileOpen(false)} className="absolute right-0 mt-2 w-56 z-50">
                      <div className="bg-background rounded-md shadow-md border py-1">
                        <div className="px-4 py-2 text-sm font-medium border-b">
                          <div>{getRoleDisplayName()}</div>
                        </div>
                        <button 
                          className="w-full text-left px-4 py-2 text-sm hover:bg-accent" 
                          onClick={() => {
                            navigate('/settings');
                            setIsProfileOpen(false);
                          }}
                        >
                          <div className="flex items-center">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                          </div>
                        </button>
                        <button 
                          className="w-full text-left px-4 py-2 text-sm hover:bg-accent" 
                          onClick={handleChangeRole}
                        >
                          <div className="flex items-center">
                            <UserCog className="mr-2 h-4 w-4" />
                            <span>Change Role</span>
                          </div>
                        </button>
                        <button 
                          className="w-full text-left px-4 py-2 text-sm hover:bg-accent" 
                          onClick={() => {
                            handleLogout();
                            setIsProfileOpen(false);
                          }}
                        >
                          <div className="flex items-center">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                          </div>
                        </button>
                      </div>
                    </ClickOutside>
                  )}
                </div>
              </div>
            </div>
          </header>
          
          {isMobileMenuOpen && (
            <div id="mobile-menu" className="md:hidden fixed inset-0 top-16 z-20 bg-background/95 dark:bg-card/95 backdrop-blur-md pt-4 pb-20 animate-in overflow-hidden">
              <nav className="container px-4 flex flex-col gap-1">
                {userRole && (
                  <div className="px-2 py-3 mb-2">
                    <div className="text-sm text-muted-foreground">Logged in as</div>
                    <div className="font-medium">{getRoleDisplayName()}</div>
                  </div>
                )}
                
                <SidebarLink 
                  icon={<LayoutDashboard className="h-4 w-4" />} 
                  label="Dashboard" 
                  to="/dashboard" 
                  active={currentPath === "/dashboard"}
                  onClick={handleLinkClick}
                  visible={getLinkVisibility('/dashboard')}
                />
                <SidebarLink 
                  icon={<ListTodo className="h-4 w-4" />} 
                  label="Tasks" 
                  to="/tasks" 
                  active={currentPath === "/tasks"}
                  onClick={handleLinkClick}
                  visible={getLinkVisibility('/tasks')}
                />
                <SidebarLink 
                  icon={<Clock className="h-4 w-4" />} 
                  label="Time Tracking" 
                  to="/time-tracking" 
                  active={currentPath === "/time-tracking"}
                  onClick={handleLinkClick}
                  visible={getLinkVisibility('/time-tracking')}
                />
                <SidebarLink 
                  icon={<Calendar className="h-4 w-4" />} 
                  label="Calendar" 
                  to="/calendar" 
                  active={currentPath === "/calendar"}
                  onClick={handleLinkClick}
                  visible={getLinkVisibility('/calendar')}
                />
                <SidebarLink 
                  icon={<BarChart4 className="h-4 w-4" />} 
                  label="Reports" 
                  to="/reports" 
                  active={currentPath === "/reports"}
                  onClick={handleLinkClick}
                  visible={getLinkVisibility('/reports')}
                />
                <SidebarLink 
                  icon={<Users className="h-4 w-4" />} 
                  label="Team" 
                  to="/team" 
                  active={currentPath === "/team"}
                  onClick={handleLinkClick}
                  visible={getLinkVisibility('/team')}
                />
                <div className="pt-4 mt-4 border-t border-border">
                  <SidebarLink 
                    icon={<Settings className="h-4 w-4" />} 
                    label="Settings" 
                    to="/settings" 
                    active={currentPath === "/settings"}
                    onClick={handleLinkClick}
                    visible={getLinkVisibility('/settings')}
                  />
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20" 
                    onClick={handleChangeRole}
                  >
                    <UserCog className="h-4 w-4" />
                    Change Role
                  </Button>
                </div>
              </nav>
            </div>
          )}
          
          <main className="flex-1 overflow-auto p-4 md:p-5 lg:p-6 animate-fade-in dashboard-content">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
