
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { toast } from 'sonner';

interface TaskFilterDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  priorityFilter: string | null;
  setPriorityFilter: (priority: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const TaskFilterDrawer = ({
  open,
  onOpenChange,
  priorityFilter,
  setPriorityFilter,
  searchQuery,
  setSearchQuery
}: TaskFilterDrawerProps) => {
  const applyFilters = () => {
    onOpenChange(false);
    toast.success("Filters applied");
  };

  const clearFilters = () => {
    setPriorityFilter(null);
    setSearchQuery('');
    onOpenChange(false);
    toast.success("Filters cleared");
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="px-4 py-2 max-w-md mx-auto">
          <DrawerHeader className="px-0">
            <DrawerTitle>Filter Tasks</DrawerTitle>
            <DrawerDescription>Customize which tasks you want to see</DrawerDescription>
          </DrawerHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="priority-filter">Priority</Label>
              <Select value={priorityFilter || ''} onValueChange={setPriorityFilter}>
                <SelectTrigger id="priority-filter">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent position="popper" className="bg-white">
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="search-tasks">Search Tasks</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="search-tasks" 
                  placeholder="Search by title or description" 
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
          <DrawerFooter className="px-0">
            <Button 
              onClick={applyFilters}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
            >
              Apply Filters
            </Button>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
            <DrawerClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
