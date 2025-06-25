
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  const scrollToAbout = () => {
    const element = document.getElementById('about');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToSolutions = () => {
    const element = document.getElementById('solutions');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="pt-24 pb-20 md:pt-32 md:pb-28 bg-background">
      <div className="container px-4 md:px-6">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="space-y-2 animate-slide-up">
            <h1 className="text-4xl md:text-6xl font-semibold leading-tight md:leading-tight tracking-tight">
              A beautiful way to track time and manage tasks
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Designed for individuals and teams who care about their time and work.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up [animation-delay:200ms]">
            <Link to="/dashboard">
              <Button size="lg" className="gap-2 min-w-[160px] bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg" 
              className="min-w-[160px]"
              onClick={scrollToAbout}
            >
              Learn More
            </Button>
          </div>
          
          <div className="pt-8 md:pt-16 animate-slide-up [animation-delay:400ms]">
            <div className="relative mx-auto overflow-hidden rounded-2xl border border-border bg-card shadow-xl dark:bg-card/90 dark:border-border/50">
              <div className="absolute inset-0 bg-grid-slate-400/[0.05] bg-[bottom_1px_center] border border-border rounded-2xl dark:border-border/30"></div>
              <div className="relative overflow-hidden rounded-2xl">
                <div className="flex justify-between items-start gap-8 p-6 bg-background dark:bg-card/90 backdrop-blur-sm border-b border-border">
                  <div className="flex flex-col">
                    <h2 className="text-xl font-semibold">Project Dashboard</h2>
                    <p className="text-sm text-muted-foreground">Marketing Campaign Q3</p>
                  </div>
                  <div className="bg-secondary border border-border rounded-lg px-3 py-1 text-sm font-medium dark:bg-secondary/30 dark:border-border/50">
                    8 days left
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-px bg-muted/50 dark:bg-background/20">
                  <div className="bg-card dark:bg-card/80 p-6 space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground">To Do</h3>
                    <div className="space-y-2">
                      <div className="p-3 rounded-lg border border-border bg-background dark:bg-card/80 hover:shadow-sm transition-shadow cursor-pointer">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-medium">Design social media templates</span>
                          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-yellow-50 text-yellow-600 border-yellow-100 dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-yellow-900/50">Medium</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Due in 3 days</p>
                      </div>
                      <div className="p-3 rounded-lg border border-border bg-background dark:bg-card/80 hover:shadow-sm transition-shadow cursor-pointer">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-medium">Write email newsletter</span>
                          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-red-50 text-red-600 border-red-100 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50">High</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Due tomorrow</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-card dark:bg-card/80 p-6 space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground">In Progress</h3>
                    <div className="space-y-2">
                      <div className="p-3 rounded-lg border border-border bg-background dark:bg-card/80 hover:shadow-sm transition-shadow cursor-pointer">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-medium">Create brand guidelines PDF</span>
                          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/50">In Progress</span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-muted-foreground">2:45:30 logged</p>
                          <div className="h-2 w-24 bg-muted overflow-hidden rounded-full dark:bg-muted/30">
                            <div className="h-full w-1/2 bg-blue-500 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-card dark:bg-card/80 p-6 space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Completed</h3>
                    <div className="space-y-2">
                      <div className="p-3 rounded-lg border border-border bg-background dark:bg-card/80 hover:shadow-sm transition-shadow cursor-pointer opacity-80">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-medium">Update website content</span>
                          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-50 text-green-600 border-green-100 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900/50">Completed</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Completed 2 days ago</p>
                      </div>
                      <div className="p-3 rounded-lg border border-border bg-background dark:bg-card/80 hover:shadow-sm transition-shadow cursor-pointer opacity-80">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-medium">Competitor research</span>
                          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-50 text-green-600 border-green-100 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900/50">Completed</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Completed 5 days ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
