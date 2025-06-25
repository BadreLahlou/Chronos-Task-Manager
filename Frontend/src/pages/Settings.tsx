import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  Bell,
  Moon,
  Sun,
  User,
  Clock,
  GraduationCap,
  Trash2,
  ChevronRight,
  Check,
  Briefcase,
  UserRound,
  Stethoscope,
  Scale,
  Users 
} from "lucide-react";
import { useUserRole } from "@/contexts/UserRoleContext";
import { toast } from "sonner";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("account");
  const { userRole } = useUserRole();

  // Settings fields state
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    weeklyReport: false,
    newFeatures: true,
    taskReminders: true,
    teamUpdates: true,
    securityAlerts: true
  });
  const [privacy, setPrivacy] = useState({
    trackActivity: true,
    shareData: false,
    showOnlineStatus: true,
    showProfile: true,
    thirdPartyData: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveSettings = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Settings successfully saved!");
    }, 800);
  };

  // Get role-specific content
  const getRoleSpecificSettings = () => {
    const baseSettings = {
      roleName: "User",
      roleIcon: <User className="h-8 w-8 text-primary" />,
      title: "Account Settings",
      subtitle: "Manage your account settings and preferences.",
      showTeamSettings: false,
      showIntegrations: true,
      showApiSettings: false,
      showAdvancedSettings: true,
      additionalSettings: []
    };

    switch (userRole) {
      case 'admin':
        return {
          ...baseSettings,
          roleName: "Administrator",
          roleIcon: <User className="h-8 w-8 text-purple-500" />,
          title: "System Settings",
          subtitle: "Configure system-wide settings and permissions.",
          showTeamSettings: true,
          showIntegrations: true,
          showApiSettings: true,
          showAdvancedSettings: true,
          additionalSettings: [
            { name: "User Management", description: "Manage users and permissions" },
            { name: "System Configuration", description: "Configure system-wide settings" },
            { name: "Security Settings", description: "Manage security policies and access controls" }
          ]
        };
      case 'project_manager':
        return {
          ...baseSettings,
          roleName: "Project Manager",
          roleIcon: <Briefcase className="h-8 w-8 text-blue-500" />,
          title: "Project Settings",
          subtitle: "Configure project-specific settings and team access.",
          showTeamSettings: true,
          showIntegrations: true,
          showApiSettings: false,
          additionalSettings: [
            { name: "Project Templates", description: "Manage project templates and defaults" },
            { name: "Team Management", description: "Configure team assignments and roles" }
          ]
        };
      case 'team_leader':
        return {
          ...baseSettings,
          roleName: "Team Leader",
          roleIcon: <Users className="h-8 w-8 text-green-500" />,
          title: "Team Settings",
          subtitle: "Configure team settings and member access.",
          showTeamSettings: true,
          showIntegrations: true,
          additionalSettings: [
            { name: "Team Dashboard", description: "Configure team dashboard views" },
            { name: "Member Access", description: "Manage team member access levels" }
          ]
        };
      case 'team_member':
        return {
          ...baseSettings,
          roleName: "Team Member",
          roleIcon: <User className="h-8 w-8 text-teal-500" />,
          showTeamSettings: false,
          additionalSettings: [
            { name: "Workspace Settings", description: "Customize your workspace" }
          ]
        };
      case 'teacher':
        return {
          ...baseSettings,
          roleName: "Teacher",
          roleIcon: <GraduationCap className="h-8 w-8 text-red-500" />,
          title: "Teacher Settings",
          subtitle: "Configure class settings and student access.",
          showTeamSettings: true,
          additionalSettings: [
            { name: "Classroom Configuration", description: "Adjust classroom layout and settings" },
            { name: "Student Access", description: "Manage student access levels and permissions" }
          ]
        };
      case 'principal':
        return {
          ...baseSettings,
          roleName: "Principal",
          roleIcon: <GraduationCap className="h-8 w-8 text-orange-500" />,
          title: "School Administration",
          subtitle: "Configure school-wide settings and staff access.",
          showTeamSettings: true,
          showIntegrations: true,
          showApiSettings: true,
          additionalSettings: [
            { name: "School Configuration", description: "Manage school-wide settings" },
            { name: "Staff Management", description: "Configure staff roles and permissions" },
            { name: "Department Settings", description: "Manage department configurations" }
          ]
        };
      case 'student':
        return {
          ...baseSettings,
          roleName: "Student",
          roleIcon: <GraduationCap className="h-8 w-8 text-yellow-500" />,
          title: "Student Settings",
          showTeamSettings: false,
          showIntegrations: false,
          showApiSettings: false,
          additionalSettings: [
            { name: "Course Preferences", description: "Set your course display preferences" }
          ]
        };
      case 'freelancer':
        return {
          ...baseSettings,
          roleName: "Freelancer",
          roleIcon: <UserRound className="h-8 w-8 text-pink-500" />,
          title: "Freelancer Settings",
          subtitle: "Configure your freelance work environment.",
          additionalSettings: [
            { name: "Client Management", description: "Configure client access and visibility" },
            { name: "Invoice Settings", description: "Set up your invoice templates and defaults" }
          ]
        };
      case 'healthcare_worker':
        return {
          ...baseSettings,
          roleName: "Healthcare Worker",
          roleIcon: <Stethoscope className="h-8 w-8 text-red-500" />,
          title: "Healthcare Settings",
          subtitle: "Configure patient care and privacy settings.",
          showTeamSettings: true,
          additionalSettings: [
            { name: "Patient Privacy", description: "Manage patient data privacy settings" },
            { name: "Schedule Preferences", description: "Configure your scheduling defaults" }
          ]
        };
      case 'legal_team':
        return {
          ...baseSettings,
          roleName: "Legal Team Member",
          roleIcon: <Scale className="h-8 w-8 text-blue-800" />,
          title: "Legal Settings",
          subtitle: "Configure case management and document settings.",
          showTeamSettings: true,
          additionalSettings: [
            { name: "Case Management", description: "Configure case handling preferences" },
            { name: "Document Templates", description: "Manage document templates and defaults" }
          ]
        };
      case 'external_viewer':
        return {
          ...baseSettings,
          roleName: "External Viewer",
          roleIcon: <User className="h-8 w-8 text-gray-500" />,
          title: "Viewer Settings",
          subtitle: "Configure your view preferences.",
          showTeamSettings: false,
          showIntegrations: false,
          showApiSettings: false,
          showAdvancedSettings: false,
          additionalSettings: [
            { name: "Dashboard Preferences", description: "Configure your dashboard view" }
          ]
        };
      default:
        return baseSettings;
    }
  };

  const settings = getRoleSpecificSettings();

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center gap-3">
        {settings.roleIcon}
        <div>
          <h1 className="text-2xl font-semibold">{settings.title}</h1>
          <p className="text-muted-foreground">{settings.subtitle}</p>
        </div>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 lg:w-[600px]">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          {settings.showAdvancedSettings && (
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          )}
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="John Doe" 
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="john.doe@example.com" 
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="role" className="text-sm font-medium">Role</label>
                  <div className="flex items-center gap-2 rounded-md border p-2">
                    {settings.roleName}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleSaveSettings} disabled={isLoading}>
                  {isLoading ? (
                    <><Clock className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                  ) : (
                    <>Save Changes</>
                  )}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your password to keep your account secure.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="current-password" className="text-sm font-medium">Current Password</label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="new-password" className="text-sm font-medium">New Password</label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="confirm-password" className="text-sm font-medium">Confirm Password</label>
                  <Input id="confirm-password" type="password" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button variant="default">Update Password</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>
                  Configure your email notification preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <label htmlFor="email-notifications" className="text-sm font-medium">Receive email notifications</label>
                  <Switch 
                    id="email-notifications" 
                    checked={notifications.email}
                    onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label htmlFor="weekly-report" className="text-sm font-medium">Weekly report summary</label>
                  <Switch 
                    id="weekly-report"
                    checked={notifications.weeklyReport}
                    onCheckedChange={(checked) => setNotifications({...notifications, weeklyReport: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label htmlFor="new-features" className="text-sm font-medium">New features and updates</label>
                  <Switch 
                    id="new-features"
                    checked={notifications.newFeatures}
                    onCheckedChange={(checked) => setNotifications({...notifications, newFeatures: checked})}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleSaveSettings} disabled={isLoading}>
                  {isLoading ? (
                    <><Clock className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                  ) : (
                    <>Save Changes</>
                  )}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Push Notifications</CardTitle>
                <CardDescription>
                  Manage your push notification preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <label htmlFor="push-notifications" className="text-sm font-medium">Receive push notifications</label>
                  <Switch 
                    id="push-notifications"
                    checked={notifications.push}
                    onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label htmlFor="task-reminders" className="text-sm font-medium">Task reminders</label>
                  <Switch 
                    id="task-reminders"
                    checked={notifications.taskReminders}
                    onCheckedChange={(checked) => setNotifications({...notifications, taskReminders: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label htmlFor="team-updates" className="text-sm font-medium">Team updates</label>
                  <Switch 
                    id="team-updates"
                    checked={notifications.teamUpdates}
                    onCheckedChange={(checked) => setNotifications({...notifications, teamUpdates: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label htmlFor="security-alerts" className="text-sm font-medium">Security alerts</label>
                  <Switch 
                    id="security-alerts"
                    checked={notifications.securityAlerts}
                    onCheckedChange={(checked) => setNotifications({...notifications, securityAlerts: checked})}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleSaveSettings} disabled={isLoading}>
                  {isLoading ? (
                    <><Clock className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                  ) : (
                    <>Save Changes</>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Theme</CardTitle>
                <CardDescription>
                  Customize the appearance of your application.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <label htmlFor="theme" className="text-sm font-medium">Dark Mode</label>
                  <Switch id="theme" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleSaveSettings} disabled={isLoading}>
                  {isLoading ? (
                    <><Clock className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                  ) : (
                    <>Save Changes</>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>
                  Control your privacy preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <label htmlFor="track-activity" className="text-sm font-medium">Track Activity</label>
                  <Switch 
                    id="track-activity"
                    checked={privacy.trackActivity}
                    onCheckedChange={(checked) => setPrivacy({...privacy, trackActivity: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label htmlFor="share-data" className="text-sm font-medium">Share Data</label>
                  <Switch 
                    id="share-data"
                    checked={privacy.shareData}
                    onCheckedChange={(checked) => setPrivacy({...privacy, shareData: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label htmlFor="show-online-status" className="text-sm font-medium">Show Online Status</label>
                  <Switch 
                    id="show-online-status"
                    checked={privacy.showOnlineStatus}
                    onCheckedChange={(checked) => setPrivacy({...privacy, showOnlineStatus: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label htmlFor="show-profile" className="text-sm font-medium">Show Profile</label>
                  <Switch 
                    id="show-profile"
                    checked={privacy.showProfile}
                    onCheckedChange={(checked) => setPrivacy({...privacy, showProfile: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label htmlFor="third-party-data" className="text-sm font-medium">Third Party Data</label>
                  <Switch 
                    id="third-party-data"
                    checked={privacy.thirdPartyData}
                    onCheckedChange={(checked) => setPrivacy({...privacy, thirdPartyData: checked})}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleSaveSettings} disabled={isLoading}>
                  {isLoading ? (
                    <><Clock className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                  ) : (
                    <>Save Changes</>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {settings.showAdvancedSettings && (
            <TabsContent value="advanced" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Settings</CardTitle>
                  <CardDescription>
                    Configure advanced settings for your account.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {settings.additionalSettings.map((setting, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium">{setting.name}</h3>
                        <p className="text-xs text-muted-foreground">{setting.description}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Configure <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Cancel</Button>
                  <Button onClick={handleSaveSettings} disabled={isLoading}>
                    {isLoading ? (
                      <><Clock className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                    ) : (
                      <>Save Changes</>
                    )}
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Danger Zone</CardTitle>
                  <CardDescription>
                    Be careful, these actions can have serious consequences.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-red-500">Delete Account</h3>
                      <p className="text-xs text-muted-foreground">Permanently delete your account and all associated data.</p>
                    </div>
                    <Button variant="destructive" size="sm">
                      Delete <Trash2 className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </div>
      </Tabs>
    </div>
  );
};

export default Settings;
