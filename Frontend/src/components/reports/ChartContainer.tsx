
import { ReactNode } from 'react';
import { BarChart4 } from 'lucide-react';

interface ChartContainerProps {
  title: string;
  children: ReactNode;
  isEmpty: boolean;
}

const ChartContainer = ({ title, children, isEmpty }: ChartContainerProps) => {
  return (
    <div className="bg-white dark:bg-card dark:border-border rounded-2xl border border-purple-200 shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in overflow-hidden transform hover:translate-y-[-2px]">
      <div className="p-5 border-b border-purple-100 dark:border-border bg-gradient-to-r from-purple-100 to-blue-100 dark:from-transparent dark:to-transparent dark:bg-card rounded-t-2xl">
        <h2 className="font-semibold text-purple-800 dark:text-foreground text-lg flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full bg-purple-500 animate-pulse-subtle"></span>
          {title}
        </h2>
      </div>
      
      <div className="p-5">
        {!isEmpty ? (
          <div className="animate-scale-in transition-all duration-300">
            {children}
          </div>
        ) : (
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-background/30 dark:to-background/30 dark:bg-card rounded-2xl border border-purple-100 dark:border-border shadow-sm p-8 text-center transition-all duration-300">
            <BarChart4 className="h-12 w-12 text-purple-400 dark:text-purple-600/70 mx-auto mb-4 animate-pulse-subtle" />
            <h3 className="text-lg font-medium text-purple-800 dark:text-foreground">No data to report</h3>
            <p className="text-muted-foreground mt-1 text-purple-600/70 dark:text-muted-foreground">Create and complete tasks to generate reports</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartContainer;
