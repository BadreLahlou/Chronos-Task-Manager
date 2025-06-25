
import { FC } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface TaskSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const TaskSearchBar: FC<TaskSearchBarProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="mb-4 max-w-md">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input 
          type="search" 
          placeholder="Search tasks..." 
          className="pl-9 transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>
  );
};
