import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { useSidebar } from '@/contexts/SidebarContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Sun,
  Moon,
  Menu,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { authService } from '@/services/dataService';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const { toggleTheme } = useTheme();
  const { toggleMobile } = useSidebar();
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadge = (role: string) => {
    const roleColors: Record<string, string> = {
      super_admin: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      regional_admin: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      school_admin: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      teacher: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      staff: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
    };
    return roleColors[role] || roleColors.staff;
  };

  return (
    <header
      className={cn(
        'h-16 border-b border-border/50 bg-background/95 backdrop-blur-xl flex items-center justify-between px-4 sticky top-0 z-30',
        className
      )}
    >
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMobile}
          className="lg:hidden h-10 w-10 rounded-xl hover:bg-muted"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Breadcrumbs could go here */}
        <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
          <span>Regional Office</span>
          <span className="text-border">/</span>
          <span className="text-foreground font-medium">Dashboard</span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-10 w-10 rounded-xl hover:bg-muted relative"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl hover:bg-muted relative"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 rounded-xl">
            <DropdownMenuLabel className="font-semibold">Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-64 overflow-auto">
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer rounded-lg">
                <span className="text-sm font-medium">New enrollment request</span>
                <span className="text-xs text-muted-foreground">Emma Williams enrolled in Grade 9</span>
                <span className="text-xs text-muted-foreground">2 minutes ago</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer rounded-lg">
                <span className="text-sm font-medium">Grade updated</span>
                <span className="text-xs text-muted-foreground">Mathematics midterm grades published</span>
                <span className="text-xs text-muted-foreground">15 minutes ago</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer rounded-lg">
                <span className="text-sm font-medium">System maintenance</span>
                <span className="text-xs text-muted-foreground">Scheduled maintenance tonight at 2 AM</span>
                <span className="text-xs text-muted-foreground">1 hour ago</span>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="justify-center text-primary cursor-pointer rounded-lg"
              onClick={() => navigate('/announcements')}
            >
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-10 px-2 rounded-xl hover:bg-muted gap-2"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                  {getInitials(currentUser.name)}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:flex flex-col items-start">
                <span className="text-sm font-medium leading-tight">{currentUser.name}</span>
                <Badge
                  variant="outline"
                  className={cn(
                    'text-[10px] px-1 py-0 h-4 font-normal capitalize',
                    getRoleBadge(currentUser.role)
                  )}
                >
                  {currentUser.role.replace('_', ' ')}
                </Badge>
              </div>
              <ChevronDown className="hidden sm:block h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-xl">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{currentUser.name}</p>
                <p className="text-xs text-muted-foreground">{currentUser.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigate('/users')}
              className="cursor-pointer rounded-lg"
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate('/settings')}
              className="cursor-pointer rounded-lg"
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigate('/login')}
              className="text-destructive cursor-pointer rounded-lg focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
