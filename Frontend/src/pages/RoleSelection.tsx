import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  User, 
  Users, 
  Settings, 
  Briefcase, 
  UserRound, 
  GraduationCap, 
  BookUser, 
  HeartPulse, 
  Scale, 
  Eye, 
  Clock
} from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from "@/components/ui/label";
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useUserRole } from '@/contexts/UserRoleContext';

type UserRole = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
};

const userRoles: UserRole[] = [
  {
    id: 'admin',
    name: 'Admin',
    description: 'Full system access and configuration',
    icon: <Settings className="h-6 w-6 text-purple-600" />
  },
  {
    id: 'project_manager',
    name: 'Project Manager',
    description: 'Manage projects and team resources',
    icon: <Briefcase className="h-6 w-6 text-blue-600" />
  },
  {
    id: 'team_leader',
    name: 'Team Leader',
    description: 'Lead team members and track performance',
    icon: <Users className="h-6 w-6 text-green-600" />
  },
  {
    id: 'team_member',
    name: 'Team Member',
    description: 'Contribute to projects and track time',
    icon: <User className="h-6 w-6 text-teal-600" />
  },
  {
    id: 'teacher',
    name: 'Teacher',
    description: 'Manage classes and student assignments',
    icon: <BookUser className="h-6 w-6 text-red-600" />
  },
  {
    id: 'principal',
    name: 'Principal',
    description: 'Oversee school operations and staff',
    icon: <GraduationCap className="h-6 w-6 text-orange-600" />
  },
  {
    id: 'student',
    name: 'Student',
    description: 'Track assignments and academic progress',
    icon: <GraduationCap className="h-6 w-6 text-yellow-600" />
  },
  {
    id: 'freelancer',
    name: 'Freelancer',
    description: 'Manage personal projects and clients',
    icon: <UserRound className="h-6 w-6 text-pink-600" />
  },
  {
    id: 'healthcare_worker',
    name: 'Healthcare Worker',
    description: 'Track patient-related tasks and schedules',
    icon: <HeartPulse className="h-6 w-6 text-red-500" />
  },
  {
    id: 'legal_team',
    name: 'Legal Team',
    description: 'Manage cases and document deadlines',
    icon: <Scale className="h-6 w-6 text-blue-800" />
  },
  {
    id: 'external_viewer',
    name: 'External Viewer',
    description: 'Limited view access to specific projects',
    icon: <Eye className="h-6 w-6 text-gray-600" />
  },
  {
    id: 'other',
    name: 'Other',
    description: 'Customizable dashboard for any use case',
    icon: <Settings className="h-6 w-6 text-indigo-600" />
  }
];

const RoleSelection = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setUserRole } = useUserRole();

  const handleRoleSelect = (value: string) => {
    setSelectedRole(value);
  };

  const handleContinue = () => {
    if (!selectedRole) {
      toast.error('Please select a role to continue');
      return;
    }

    // Use the UserRoleContext to set the role
    setUserRole(selectedRole);
    
    const roleName = userRoles.find(role => role.id === selectedRole)?.name;
    toast.success(`Welcome! Your dashboard has been customized for a ${roleName}`, {
      duration: 3000
    });

    // Navigate to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-card border border-border rounded-xl shadow-lg p-6 md:p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Clock className="h-10 w-10 text-primary animate-pulse-subtle" />
          </div>
          <h1 className="text-3xl font-semibold mb-2">Welcome to Chronos</h1>
          <p className="text-muted-foreground">Select your role to personalize your experience</p>
        </div>

        <RadioGroup 
          value={selectedRole || ''} 
          onValueChange={handleRoleSelect}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {userRoles.map((role) => (
            <div key={role.id} className="relative">
              <RadioGroupItem 
                value={role.id} 
                id={role.id} 
                className="peer sr-only" 
              />
              <Label
                htmlFor={role.id}
                className={cn(
                  "flex items-start space-x-4 border border-border rounded-lg p-4 cursor-pointer transition-all",
                  "hover:border-primary hover:bg-accent",
                  "peer-focus-visible:ring-2 peer-focus-visible:ring-primary",
                  "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                )}
              >
                <div className="flex-shrink-0 mt-1">{role.icon}</div>
                <div className="flex-1">
                  <h3 className="font-medium">{role.name}</h3>
                  <p className="text-sm text-muted-foreground">{role.description}</p>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>

        <div className="mt-8 flex justify-center">
          <Button 
            size="lg" 
            onClick={handleContinue}
            disabled={!selectedRole}
            className="min-w-[200px] gap-2"
          >
            Continue to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
