
import { 
  Clock, 
  LayoutDashboard, 
  Users, 
  ClipboardList, 
  BarChart4, 
  Bell, 
  Calendar, 
  Smartphone 
} from "lucide-react";

const features = [
  {
    icon: <LayoutDashboard className="h-8 w-8 text-primary" />,
    title: "Customizable Dashboards",
    description: "Personalize your workspace with role-specific views and important metrics at a glance."
  },
  {
    icon: <Clock className="h-8 w-8 text-primary" />,
    title: "Intelligent Time Tracking",
    description: "Track time spent on tasks with intuitive controls and detailed reports."
  },
  {
    icon: <ClipboardList className="h-8 w-8 text-primary" />,
    title: "Task Dependencies",
    description: "Set task relationships and prerequisites to ensure work flows smoothly."
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: "Role-Based Permissions",
    description: "Assign specific access levels based on organizational roles and responsibilities."
  },
  {
    icon: <BarChart4 className="h-8 w-8 text-primary" />,
    title: "Advanced Analytics",
    description: "Gain insights into productivity, time usage, and project progress."
  },
  {
    icon: <Bell className="h-8 w-8 text-primary" />,
    title: "Smart Notifications",
    description: "Receive timely alerts for deadlines, updates, and important changes."
  },
  {
    icon: <Calendar className="h-8 w-8 text-primary" />,
    title: "Timeline View",
    description: "Visualize projects and tasks on interactive calendars and Gantt charts."
  },
  {
    icon: <Smartphone className="h-8 w-8 text-primary" />,
    title: "Mobile Access",
    description: "Manage your tasks and track time from anywhere with our mobile-optimized interface."
  }
];

const Features = () => {
  return (
    <section id="features" className="py-20 bg-secondary/50">
      <div className="container px-4 md:px-6">
        <div className="max-w-5xl mx-auto text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Powerful features for every role
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Our system adapts to your organization's unique structure, whether you're an individual, 
            small team, or large enterprise.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group relative bg-white rounded-xl border border-border p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/20"
            >
              <div className="mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-medium mb-2 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
