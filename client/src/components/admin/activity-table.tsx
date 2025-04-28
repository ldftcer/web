import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';

interface ActivityLog {
  id: number;
  timestamp: string;
  ipAddress: string;
  activity: string;
  user: {
    id: number;
    username: string;
    email: string;
    isAdmin: boolean;
  } | null;
  movie: {
    id: number;
    title: string;
  } | null;
}

export function ActivityTable() {
  const [page, setPage] = useState(1);
  const { data: logs, isLoading, error } = useQuery<ActivityLog[]>({
    queryKey: ['/api/admin/activity'],
  });
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }
  
  if (error) {
    return <div className="text-destructive">Error loading activity logs: {error.message}</div>;
  }
  
  const getActivityIcon = (activity: string) => {
    switch (activity) {
      case 'login':
        return '🔐';
      case 'logout':
        return '👋';
      case 'registration':
        return '✨';
      case 'view':
        return '👁️';
      case 'create_movie':
        return '🎬';
      case 'update_movie':
        return '✏️';
      case 'delete_movie':
        return '🗑️';
      default:
        return '📋';
    }
  };
  
  const getActivityDescription = (log: ActivityLog) => {
    const username = log.user?.username || 'Unknown user';
    
    switch (log.activity) {
      case 'login':
        return `${username} logged in`;
      case 'logout':
        return `${username} logged out`;
      case 'registration':
        return `${username} registered`;
      case 'view':
        return `${username} watched ${log.movie?.title || 'a movie'}`;
      case 'create_movie':
        return `${username} created movie: ${log.movie?.title || 'unknown'}`;
      case 'update_movie':
        return `${username} updated movie: ${log.movie?.title || 'unknown'}`;
      case 'delete_movie':
        return `${username} deleted movie: ${log.movie?.title || 'unknown'}`;
      default:
        return `${username} performed ${log.activity}`;
    }
  };
  
  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">User</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Activity</TableHead>
              <TableHead>Content</TableHead>
              <TableHead>Time</TableHead>
              <TableHead className="w-[50px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs && logs.length > 0 ? (
              logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-3">
                        <AvatarImage src={`https://ui-avatars.com/api/?name=${log.user?.username || 'User'}`} />
                        <AvatarFallback>{(log.user?.username || 'U').substring(0, 1).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{log.user?.username || 'Unknown user'}</div>
                        <div className="text-xs text-muted-foreground">{log.user?.email || 'No email'}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{log.ipAddress}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="mr-2">{getActivityIcon(log.activity)}</span>
                      {getActivityDescription(log)}
                    </div>
                  </TableCell>
                  <TableCell>{log.movie?.title || '-'}</TableCell>
                  <TableCell>
                    {log.timestamp ? formatDistanceToNow(new Date(log.timestamp), { addSuffix: true }) : '-'}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Mark as Suspicious</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No activity logs found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
