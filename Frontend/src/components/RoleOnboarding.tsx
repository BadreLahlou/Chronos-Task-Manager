
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Settings, 
  Briefcase, 
  Users, 
  User, 
  BookOpen, 
  GraduationCap, 
  UserRound, 
  HeartPulse, 
  Scale, 
  Eye 
} from 'lucide-react';

interface RoleOnboardingProps {
  role: string;
  onComplete: (data: any) => void;
}

const RoleOnboarding = ({ role, onComplete }: RoleOnboardingProps) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(0);

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleComplete = () => {
    localStorage.setItem(`onboarding-${role}`, 'completed');
    onComplete(formData);
  };

  const getOnboardingConfig = () => {
    switch (role) {
      case 'admin':
        return {
          title: 'Administrator Setup',
          icon: <Settings className="h-8 w-8 text-purple-500" />,
          steps: [
            {
              title: 'System Overview',
              fields: [
                { key: 'totalUsers', label: 'Total Users in System', type: 'number', placeholder: '0' },
                { key: 'activeProjects', label: 'Active Projects', type: 'number', placeholder: '0' },
                { key: 'systemUptime', label: 'Target System Uptime (%)', type: 'number', placeholder: '99' },
                { key: 'pendingApprovals', label: 'Pending Approvals', type: 'number', placeholder: '0' }
              ]
            },
            {
              title: 'System Configuration',
              fields: [
                { key: 'organizationName', label: 'Organization Name', type: 'text', placeholder: 'Your Organization' },
                { key: 'departments', label: 'Number of Departments', type: 'number', placeholder: '0' },
                { key: 'securityLevel', label: 'Security Level', type: 'select', options: ['Basic', 'Standard', 'High', 'Enterprise'] }
              ]
            }
          ]
        };
      
      case 'project_manager':
        return {
          title: 'Project Manager Setup',
          icon: <Briefcase className="h-8 w-8 text-blue-500" />,
          steps: [
            {
              title: 'Project Overview',
              fields: [
                { key: 'activeProjects', label: 'Active Projects', type: 'number', placeholder: '0' },
                { key: 'teamMembers', label: 'Team Members', type: 'number', placeholder: '0' },
                { key: 'tasksCompleted', label: 'Tasks Completed This Month', type: 'number', placeholder: '0' },
                { key: 'budgetUsed', label: 'Budget Used (%)', type: 'number', placeholder: '0' }
              ]
            },
            {
              title: 'Project Preferences',
              fields: [
                { key: 'projectMethodology', label: 'Preferred Methodology', type: 'select', options: ['Agile', 'Waterfall', 'Hybrid', 'Scrum', 'Kanban'] },
                { key: 'reportingFrequency', label: 'Reporting Frequency', type: 'select', options: ['Daily', 'Weekly', 'Bi-weekly', 'Monthly'] },
                { key: 'defaultProjectDuration', label: 'Default Project Duration (weeks)', type: 'number', placeholder: '12' }
              ]
            }
          ]
        };

      case 'team_leader':
        return {
          title: 'Team Leader Setup',
          icon: <Users className="h-8 w-8 text-green-500" />,
          steps: [
            {
              title: 'Team Information',
              fields: [
                { key: 'teamSize', label: 'Team Size', type: 'number', placeholder: '0' },
                { key: 'teamTasks', label: 'Current Team Tasks', type: 'number', placeholder: '0' },
                { key: 'completionRate', label: 'Team Completion Rate (%)', type: 'number', placeholder: '0' },
                { key: 'teamHours', label: 'Weekly Team Hours', type: 'number', placeholder: '0' }
              ]
            },
            {
              title: 'Team Preferences',
              fields: [
                { key: 'teamName', label: 'Team Name', type: 'text', placeholder: 'Development Team' },
                { key: 'meetingFrequency', label: 'Meeting Frequency', type: 'select', options: ['Daily', 'Weekly', 'Bi-weekly'] },
                { key: 'workingHours', label: 'Team Working Hours', type: 'text', placeholder: '9 AM - 5 PM' }
              ]
            }
          ]
        };

      case 'team_member':
        return {
          title: 'Team Member Setup',
          icon: <User className="h-8 w-8 text-teal-500" />,
          steps: [
            {
              title: 'Personal Tasks',
              fields: [
                { key: 'myTasks', label: 'Current Tasks', type: 'number', placeholder: '0' },
                { key: 'completed', label: 'Completed Tasks', type: 'number', placeholder: '0' },
                { key: 'timeLogged', label: 'Hours Logged This Week', type: 'number', placeholder: '0' },
                { key: 'upcomingDue', label: 'Tasks Due Soon', type: 'number', placeholder: '0' }
              ]
            },
            {
              title: 'Work Preferences',
              fields: [
                { key: 'workingHours', label: 'Preferred Working Hours', type: 'text', placeholder: '9 AM - 5 PM' },
                { key: 'skillSet', label: 'Primary Skills', type: 'text', placeholder: 'JavaScript, React, Node.js' },
                { key: 'workLocation', label: 'Work Location', type: 'select', options: ['Office', 'Remote', 'Hybrid'] }
              ]
            }
          ]
        };

      case 'teacher':
        return {
          title: 'Teacher Setup',
          icon: <BookOpen className="h-8 w-8 text-red-500" />,
          steps: [
            {
              title: 'Teaching Load',
              fields: [
                { key: 'classes', label: 'Number of Classes', type: 'number', placeholder: '0' },
                { key: 'students', label: 'Total Students', type: 'number', placeholder: '0' },
                { key: 'assignments', label: 'Active Assignments', type: 'number', placeholder: '0' },
                { key: 'gradingDue', label: 'Assignments to Grade', type: 'number', placeholder: '0' }
              ]
            },
            {
              title: 'Teaching Details',
              fields: [
                { key: 'subjects', label: 'Subjects Taught', type: 'text', placeholder: 'Mathematics, Physics' },
                { key: 'gradeLevel', label: 'Grade Level', type: 'text', placeholder: '9th Grade' },
                { key: 'classroomNumber', label: 'Classroom Number', type: 'text', placeholder: 'Room 101' }
              ]
            }
          ]
        };

      case 'principal':
        return {
          title: 'Principal Setup',
          icon: <GraduationCap className="h-8 w-8 text-orange-500" />,
          steps: [
            {
              title: 'School Overview',
              fields: [
                { key: 'totalStaff', label: 'Total Staff', type: 'number', placeholder: '0' },
                { key: 'students', label: 'Total Students', type: 'number', placeholder: '0' },
                { key: 'departments', label: 'Number of Departments', type: 'number', placeholder: '0' },
                { key: 'events', label: 'Upcoming Events', type: 'number', placeholder: '0' }
              ]
            },
            {
              title: 'School Information',
              fields: [
                { key: 'schoolName', label: 'School Name', type: 'text', placeholder: 'Lincoln High School' },
                { key: 'schoolType', label: 'School Type', type: 'select', options: ['Elementary', 'Middle School', 'High School', 'K-12'] },
                { key: 'district', label: 'School District', type: 'text', placeholder: 'Metropolitan District' }
              ]
            }
          ]
        };

      case 'student':
        return {
          title: 'Student Setup',
          icon: <GraduationCap className="h-8 w-8 text-yellow-500" />,
          steps: [
            {
              title: 'Academic Information',
              fields: [
                { key: 'courses', label: 'Number of Courses', type: 'number', placeholder: '0' },
                { key: 'assignments', label: 'Pending Assignments', type: 'number', placeholder: '0' },
                { key: 'completed', label: 'Completed Assignments', type: 'number', placeholder: '0' },
                { key: 'upcomingTests', label: 'Upcoming Tests', type: 'number', placeholder: '0' }
              ]
            },
            {
              title: 'Student Details',
              fields: [
                { key: 'gradeLevel', label: 'Grade Level', type: 'text', placeholder: '10th Grade' },
                { key: 'major', label: 'Major/Focus Area', type: 'text', placeholder: 'Science' },
                { key: 'gpa', label: 'Current GPA', type: 'number', placeholder: '3.5' }
              ]
            }
          ]
        };

      case 'freelancer':
        return {
          title: 'Freelancer Setup',
          icon: <UserRound className="h-8 w-8 text-pink-500" />,
          steps: [
            {
              title: 'Business Overview',
              fields: [
                { key: 'activeClients', label: 'Active Clients', type: 'number', placeholder: '0' },
                { key: 'projects', label: 'Active Projects', type: 'number', placeholder: '0' },
                { key: 'billableHours', label: 'Billable Hours This Month', type: 'number', placeholder: '0' },
                { key: 'invoicesDue', label: 'Outstanding Invoices', type: 'number', placeholder: '0' }
              ]
            },
            {
              title: 'Freelance Details',
              fields: [
                { key: 'services', label: 'Services Offered', type: 'text', placeholder: 'Web Development, Design' },
                { key: 'hourlyRate', label: 'Hourly Rate ($)', type: 'number', placeholder: '75' },
                { key: 'availability', label: 'Weekly Availability (hours)', type: 'number', placeholder: '40' }
              ]
            }
          ]
        };

      case 'healthcare_worker':
        return {
          title: 'Healthcare Setup',
          icon: <HeartPulse className="h-8 w-8 text-red-500" />,
          steps: [
            {
              title: 'Patient Care',
              fields: [
                { key: 'patients', label: 'Patients in Care', type: 'number', placeholder: '0' },
                { key: 'appointments', label: 'Daily Appointments', type: 'number', placeholder: '0' },
                { key: 'tasks', label: 'Care Tasks', type: 'number', placeholder: '0' },
                { key: 'hoursLogged', label: 'Weekly Hours', type: 'number', placeholder: '0' }
              ]
            },
            {
              title: 'Healthcare Details',
              fields: [
                { key: 'specialization', label: 'Specialization', type: 'text', placeholder: 'Cardiology' },
                { key: 'department', label: 'Department', type: 'text', placeholder: 'Emergency' },
                { key: 'shift', label: 'Shift Schedule', type: 'select', options: ['Day', 'Evening', 'Night', 'Rotating'] }
              ]
            }
          ]
        };

      case 'legal_team':
        return {
          title: 'Legal Team Setup',
          icon: <Scale className="h-8 w-8 text-blue-800" />,
          steps: [
            {
              title: 'Case Management',
              fields: [
                { key: 'activeCases', label: 'Active Cases', type: 'number', placeholder: '0' },
                { key: 'deadlines', label: 'Upcoming Deadlines', type: 'number', placeholder: '0' },
                { key: 'documents', label: 'Documents to Review', type: 'number', placeholder: '0' },
                { key: 'hoursBilled', label: 'Billable Hours This Month', type: 'number', placeholder: '0' }
              ]
            },
            {
              title: 'Legal Practice',
              fields: [
                { key: 'practiceArea', label: 'Practice Area', type: 'text', placeholder: 'Corporate Law' },
                { key: 'barNumber', label: 'Bar Number', type: 'text', placeholder: 'BAR123456' },
                { key: 'firmName', label: 'Firm Name', type: 'text', placeholder: 'Smith & Associates' }
              ]
            }
          ]
        };

      case 'external_viewer':
        return {
          title: 'External Viewer Setup',
          icon: <Eye className="h-8 w-8 text-gray-500" />,
          steps: [
            {
              title: 'Access Overview',
              fields: [
                { key: 'projects', label: 'Projects to View', type: 'number', placeholder: '0' },
                { key: 'completed', label: 'Completed Projects', type: 'number', placeholder: '0' },
                { key: 'inProgress', label: 'In Progress', type: 'number', placeholder: '0' },
                { key: 'notStarted', label: 'Not Started', type: 'number', placeholder: '0' }
              ]
            },
            {
              title: 'Viewer Details',
              fields: [
                { key: 'organization', label: 'Organization', type: 'text', placeholder: 'Client Company' },
                { key: 'accessLevel', label: 'Access Level', type: 'select', options: ['View Only', 'Limited', 'Standard'] },
                { key: 'reportFrequency', label: 'Report Frequency', type: 'select', options: ['Weekly', 'Monthly', 'Quarterly'] }
              ]
            }
          ]
        };

      default:
        return {
          title: 'Custom Setup',
          icon: <Settings className="h-8 w-8 text-indigo-500" />,
          steps: [
            {
              title: 'General Information',
              fields: [
                { key: 'totalItems', label: 'Total Items', type: 'number', placeholder: '0' },
                { key: 'completedItems', label: 'Completed Items', type: 'number', placeholder: '0' },
                { key: 'timeTracked', label: 'Time Tracked (hours)', type: 'number', placeholder: '0' },
                { key: 'weeklyItems', label: 'Weekly Items', type: 'number', placeholder: '0' }
              ]
            },
            {
              title: 'Custom Preferences',
              fields: [
                { key: 'workspaceName', label: 'Workspace Name', type: 'text', placeholder: 'My Workspace' },
                { key: 'primaryGoal', label: 'Primary Goal', type: 'text', placeholder: 'Productivity' },
                { key: 'updateFrequency', label: 'Update Frequency', type: 'select', options: ['Real-time', 'Hourly', 'Daily', 'Weekly'] }
              ]
            }
          ]
        };
    }
  };

  const config = getOnboardingConfig();
  const currentStepData = config.steps[currentStep];

  const nextStep = () => {
    if (currentStep < config.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">{config.icon}</div>
        <CardTitle className="text-2xl">{config.title}</CardTitle>
        <p className="text-muted-foreground">
          Step {currentStep + 1} of {config.steps.length}: {currentStepData.title}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {currentStepData.fields.map((field) => (
            <div key={field.key} className="space-y-2">
              <Label htmlFor={field.key}>{field.label}</Label>
              {field.type === 'select' ? (
                <select
                  id={field.key}
                  className="w-full p-2 border rounded-md"
                  value={formData[field.key] || ''}
                  onChange={(e) => handleInputChange(field.key, e.target.value)}
                >
                  <option value="">Select...</option>
                  {field.options?.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              ) : field.type === 'textarea' ? (
                <Textarea
                  id={field.key}
                  placeholder={field.placeholder}
                  value={formData[field.key] || ''}
                  onChange={(e) => handleInputChange(field.key, e.target.value)}
                />
              ) : (
                <Input
                  id={field.key}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={formData[field.key] || ''}
                  onChange={(e) => handleInputChange(field.key, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-between pt-6">
          <Button 
            variant="outline" 
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          <Button onClick={nextStep}>
            {currentStep === config.steps.length - 1 ? 'Complete Setup' : 'Next'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoleOnboarding;
