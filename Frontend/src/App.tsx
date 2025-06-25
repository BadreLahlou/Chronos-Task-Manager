
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { UserRoleProvider } from '@/contexts/UserRoleContext';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Dashboard from '@/pages/Dashboard';
import Customize from '@/pages/Customize';
import TasksPage from '@/pages/TasksPage';
import TimeTracking from '@/pages/TimeTracking';
import Calendar from '@/pages/Calendar';
import Reports from '@/pages/Reports';
import Team from '@/pages/Team';
import Settings from '@/pages/Settings';
import RoleSelection from '@/pages/RoleSelection';
import NotFound from '@/pages/NotFound';
import DashboardLayout from '@/components/DashboardLayout';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <UserRoleProvider>
            <div className="min-h-screen bg-background text-foreground">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/role-selection" element={<RoleSelection />} />
                <Route path="/" element={<DashboardLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/customize" element={<Customize />} />
                  <Route path="/tasks" element={<TasksPage />} />
                  <Route path="/time-tracking" element={<TimeTracking />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/team" element={<Team />} />
                  <Route path="/settings" element={<Settings />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Toaster />
          </UserRoleProvider>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
