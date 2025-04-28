import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Menu, ChevronDown } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export function Header({ onSearch }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logoutMutation } = useAuth();
  const [location, navigate] = useLocation();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };
  
  const handleLogout = () => {
    logoutMutation.mutate();
    navigate('/');
  };
  
  const NavItems = () => (
    <>
      <Link href="/">
        <a className={cn(
          "text-foreground hover:text-primary transition",
          location === '/' && "text-primary"
        )}>
          Home
        </a>
      </Link>
      <Link href="/?category=Action">
        <a className="text-foreground hover:text-primary transition">Movies</a>
      </Link>
      <Link href="/?category=TV">
        <a className="text-foreground hover:text-primary transition">TV Shows</a>
      </Link>
      <Link href="/my-list">
        <a className="text-foreground hover:text-primary transition">My List</a>
      </Link>
    </>
  );
  
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-b from-black to-transparent">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/">
              <a className="flex items-center">
                <span className="text-primary text-3xl font-bold">MovieStream</span>
              </a>
            </Link>
            <nav className="hidden md:flex ml-10 space-x-8">
              <NavItems />
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative hidden md:block">
              <Input
                type="text"
                placeholder="Search..."
                className="bg-muted text-foreground w-60 pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            </form>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px] bg-background">
                <nav className="mt-8 flex flex-col space-y-6">
                  <NavItems />
                  
                  <form onSubmit={handleSearch} className="mt-4">
                    <Input
                      type="text"
                      placeholder="Search..."
                      className="bg-muted text-foreground"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </form>
                </nav>
              </SheetContent>
            </Sheet>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`https://ui-avatars.com/api/?name=${user.username}`} />
                      <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline">{user.username}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Account</DropdownMenuItem>
                  {user.isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Link href="/admin">
                          <a className="w-full">Admin Panel</a>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>Sign out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="default" onClick={() => navigate('/auth')}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
