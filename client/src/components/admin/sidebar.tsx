import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/hooks/use-language';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  LayoutDashboard,
  Film,
  Users,
  BarChart2,
  Shield,
  Settings,
  LogOut,
  FoldHorizontal,
  UnfoldHorizontal
} from 'lucide-react';

export function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logoutMutation } = useAuth();
  const { language, setLanguage } = useLanguage();
  const [location] = useLocation();
  
  if (!user || !user.isAdmin) return null;
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  const navItems = [
    {
      title: 'Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: '/admin/dashboard',
      active: location === '/admin' || location === '/admin/dashboard'
    },
    {
      title: 'Content Management',
      icon: <Film className="h-5 w-5" />,
      href: '/admin/content',
      active: location === '/admin/content'
    },
    {
      title: 'User Management',
      icon: <Users className="h-5 w-5" />,
      href: '/admin/users',
      active: location === '/admin/users'
    },
    {
      title: 'Analytics',
      icon: <BarChart2 className="h-5 w-5" />,
      href: '/admin/analytics',
      active: location === '/admin/analytics'
    },
    {
      title: 'Security Logs',
      icon: <Shield className="h-5 w-5" />,
      href: '/admin/security',
      active: location === '/admin/security'
    },
    {
      title: 'Settings',
      icon: <Settings className="h-5 w-5" />,
      href: '/admin/settings',
      active: location === '/admin/settings'
    }
  ];
  
  return (
    <div className={cn(
      "admin-sidebar bg-card h-full flex flex-col transition-all duration-300",
      isCollapsed ? "w-20" : "w-64"
    )}>
      <div className="p-4 border-b border-muted">
        <div className="flex items-center justify-between">
          {!isCollapsed && <span className="text-primary text-xl font-bold">Admin Panel</span>}
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-muted-foreground hover:text-primary"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <UnfoldHorizontal /> : <FoldHorizontal />}
          </Button>
        </div>
      </div>
      
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul>
          {navItems.map((item, index) => (
            <li key={index} className="mb-1">
              <Link href={item.href}>
                <a className={cn(
                  "flex items-center px-4 py-3 rounded mx-2",
                  "text-muted-foreground hover:bg-muted transition-colors",
                  item.active && "bg-muted text-primary font-medium"
                )}>
                  <span className="mr-3">{item.icon}</span>
                  {!isCollapsed && <span>{item.title}</span>}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-muted">
        <div className={cn(
          "flex items-center",
          isCollapsed ? "justify-center" : "space-x-3"
        )}>
          <Avatar className="h-10 w-10">
            <AvatarImage src={`https://ui-avatars.com/api/?name=${user.username}`} />
            <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          
          {!isCollapsed && (
            <div className="overflow-hidden">
              <div className="font-medium truncate">{user.username}</div>
              <div className="text-xs text-muted-foreground truncate">{user.email}</div>
            </div>
          )}
        </div>
        
        {!isCollapsed && (
          <div className="mt-4 mb-2">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ru">Russian</SelectItem>
                <SelectItem value="arm">Armenian</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        
        <Button
          variant="outline"
          className={cn(
            "mt-2 flex items-center justify-center w-full text-primary bg-primary/10 hover:bg-primary/20",
            isCollapsed && "p-2"
          )}
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          {!isCollapsed && <span>Log Out</span>}
        </Button>
      </div>
    </div>
  );
}
