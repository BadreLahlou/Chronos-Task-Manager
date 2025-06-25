
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Search, Plus, Mail, Phone, MoreHorizontal, Users, UserPlus, UserCheck, Trash2, Edit2, Link as LinkIcon, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';

const teamMembers = [
  {
    id: 1,
    name: 'Alex Johnson',
    role: 'Project Manager',
    email: 'alex@example.com',
    avatar: '',
    initials: 'AJ',
    status: 'online'
  },
  {
    id: 2,
    name: 'Sarah Williams',
    role: 'UX Designer',
    email: 'sarah@example.com',
    avatar: '',
    initials: 'SW',
    status: 'offline'
  },
  {
    id: 3,
    name: 'Michael Brown',
    role: 'Developer',
    email: 'michael@example.com',
    avatar: '',
    initials: 'MB',
    status: 'online'
  },
  {
    id: 4,
    name: 'Emily Davis',
    role: 'Product Owner',
    email: 'emily@example.com',
    avatar: '',
    initials: 'ED',
    status: 'busy'
  }
];

const Team = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    role: '',
    email: ''
  });
  const [inviteLink, setInviteLink] = useState('https://chronos.app/team/invite/abc123xyz');
  const [members, setMembers] = useState([...teamMembers]);
  
  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleInviteTeamMember = () => {
    setIsInviteDialogOpen(true);
  };

  const handleAddMember = () => {
    setIsAddMemberDialogOpen(true);
  };

  const handleSubmitNewMember = (e) => {
    e.preventDefault();
    if (newMember.name && newMember.role && newMember.email) {
      const newId = members.length > 0 ? Math.max(...members.map(m => m.id)) + 1 : 1;
      const nameParts = newMember.name.split(' ');
      const initials = nameParts.length > 1 
        ? `${nameParts[0][0]}${nameParts[1][0]}`
        : `${nameParts[0][0]}${nameParts[0][1] || ''}`;
      
      const memberToAdd = {
        id: newId,
        name: newMember.name,
        role: newMember.role,
        email: newMember.email,
        avatar: '',
        initials: initials.toUpperCase(),
        status: 'offline'
      };
      
      setMembers([...members, memberToAdd]);
      toast.success(`${newMember.name} added to the team!`);
      setNewMember({ name: '', role: '', email: '' });
      setIsAddMemberDialogOpen(false);
    } else {
      toast.error("Please fill out all fields");
    }
  };

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    toast.success('Invite link copied to clipboard!');
  };
  
  const handleRemoveMember = (id) => {
    setMembers(members.filter(member => member.id !== id));
    toast.success('Team member removed successfully');
  };
  
  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Team</h1>
          <p className="text-muted-foreground">Manage your team and permissions</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={handleInviteTeamMember}
          >
            <UserPlus className="h-3.5 w-3.5" />
            Invite
          </Button>
          <Button size="sm" className="gap-2" onClick={handleAddMember}>
            <Plus className="h-3.5 w-3.5" />
            Add Member
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search team members..." 
            className="pl-9 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.map(member => (
          <Card key={member.id} className="overflow-hidden rounded-xl">
            <CardHeader className="p-4 pb-0">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <Avatar className={member.status === 'online' ? 'ring-2 ring-green-500 ring-offset-2' : ''}>
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback className="bg-primary/10">{member.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">{member.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div 
                    className={`h-2 w-2 rounded-full ${
                      member.status === 'online' ? 'bg-green-500' : 
                      member.status === 'busy' ? 'bg-yellow-500' : 'bg-gray-300'
                    }`}
                  />
                  <span className="text-xs text-muted-foreground capitalize">{member.status}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{member.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>Not provided</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <div className="flex items-center justify-between w-full">
                <Button variant="outline" size="sm">
                  View Profile
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-full"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem className="cursor-pointer">
                      <Edit2 className="mr-2 h-4 w-4" />
                      <span>Edit Details</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Mail className="mr-2 h-4 w-4" />
                      <span>Send Message</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="cursor-pointer text-red-600 focus:text-red-600"
                      onClick={() => handleRemoveMember(member.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Remove</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardFooter>
          </Card>
        ))}
        
        {/* Add Member Card */}
        <Card className="border-dashed rounded-xl">
          <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[200px]">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <UserPlus className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium text-center mb-2">Add Team Member</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Invite a new member to join your team
            </p>
            <Button size="sm" onClick={handleAddMember}>
              <Plus className="h-4 w-4 mr-1" />
              Add Member
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Add Member Dialog */}
      <Dialog open={isAddMemberDialogOpen} onOpenChange={setIsAddMemberDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>
              Add a new member to your team. Fill out their details below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitNewMember}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full name</Label>
                <Input 
                  id="name" 
                  placeholder="John Doe" 
                  value={newMember.name}
                  onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Input 
                  id="role" 
                  placeholder="Developer" 
                  value={newMember.role}
                  onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="john@example.com" 
                  value={newMember.email}
                  onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Add Member</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Invite Team Member Dialog */}
      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>
              Share this invite link with someone to join your team.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <div className="flex items-center gap-2 mb-4">
              <LinkIcon className="h-4 w-4 text-primary" />
              <p className="text-sm font-medium">Invite link</p>
            </div>
            
            <div className="flex items-center gap-2">
              <Input 
                value={inviteLink}
                readOnly
                className="flex-1 bg-muted"
              />
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleCopyInviteLink}
                className="shrink-0"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground mt-2">
              This link will expire in 7 days. Anyone with this link can join your team.
            </p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
            <Button onClick={handleCopyInviteLink}>
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Team;
