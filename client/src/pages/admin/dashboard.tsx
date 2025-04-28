import { useQuery } from '@tanstack/react-query';
import { AdminSidebar } from '@/components/admin/sidebar';
import { StatsCard } from '@/components/admin/stats-card';
import { ActivityTable } from '@/components/admin/activity-table';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { User, Film, Eye, Database, Search, MoreHorizontal } from 'lucide-react';
import { ClientContext } from '@/main';
import { useContext } from 'react';

// Mock data for the user activity chart
const userActivityData = [
  { name: 'Mon', views: 120 },
  { name: 'Tue', views: 95 },
  { name: 'Wed', views: 150 },
  { name: 'Thu', views: 125 },
  { name: 'Fri', views: 140 },
  { name: 'Sat', views: 190 },
  { name: 'Sun', views: 170 },
];

// Popular content type for the dashboard
interface TopContent {
  id: number;
  title: string;
  category: string;
  views: number;
  percentage: number;
  thumbnailUrl: string;
}

export default function AdminDashboard() {
  const clientInfo = useContext(ClientContext);
  
  // Fetch user count, movie count, and activity count
  const { data: users, isLoading: isLoadingUsers } = useQuery<any[]>({
    queryKey: ['/api/admin/users'],
  });
  
  const { data: movies, isLoading: isLoadingMovies } = useQuery<any[]>({
    queryKey: ['/api/movies'],
  });
  
  const { data: activityLogs, isLoading: isLoadingLogs } = useQuery<any[]>({
    queryKey: ['/api/admin/activity'],
  });
  
  // Calculate view counts for top content based on activity logs
  const { data: topContent, isLoading: isLoadingTopContent } = useQuery<TopContent[]>({
    queryKey: ['/api/admin/top-content'],
    queryFn: async () => {
      // We'll use the existing activity logs to derive top content
      if (!activityLogs || !movies) return [];
      
      // Count views per movie
      const viewCounts = activityLogs
        .filter(log => log.activity === 'view' && log.movieId)
        .reduce((acc, log) => {
          acc[log.movieId] = (acc[log.movieId] || 0) + 1;
          return acc;
        }, {} as Record<number, number>);
      
      // Get total views
      const totalViews = Object.values(viewCounts).reduce((sum, count) => sum + count, 0);
      
      // Create sorted top content
      return movies
        .filter(movie => viewCounts[movie.id])
        .map(movie => ({
          id: movie.id,
          title: movie.title,
          category: movie.category,
          views: viewCounts[movie.id],
          percentage: Math.round((viewCounts[movie.id] / totalViews) * 100),
          thumbnailUrl: movie.thumbnailUrl
        }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 4); // Get top 4
    },
    enabled: !!(activityLogs && movies)
  });
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AdminSidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        <header className="bg-card shadow-md">
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-xl font-semibold">Dashboard</h1>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 w-60"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
              
              <div className="relative">
                <Button variant="outline" size="icon" className="relative">
                  <i className="relative">
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      3
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                      <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                    </svg>
                  </i>
                </Button>
              </div>
            </div>
          </div>
        </header>
        
        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatsCard
              title="Total Users"
              value={isLoadingUsers ? "Loading..." : users?.length || 0}
              icon={User}
              iconColor="text-primary"
              iconBgColor="bg-primary/10"
              change={{ value: "12%", trend: "up" }}
            />
            
            <StatsCard
              title="Total Videos"
              value={isLoadingMovies ? "Loading..." : movies?.length || 0}
              icon={Film}
              iconColor="text-blue-500"
              iconBgColor="bg-blue-500/10"
              change={{ value: "8%", trend: "up" }}
            />
            
            <StatsCard
              title="Total Views"
              value={isLoadingLogs 
                ? "Loading..." 
                : `${activityLogs?.filter(log => log.activity === 'view').length || 0}`
              }
              icon={Eye}
              iconColor="text-purple-500"
              iconBgColor="bg-purple-500/10"
              change={{ value: "23%", trend: "up" }}
            />
            
            <StatsCard
              title="Your IP Address"
              value={clientInfo.ip || "Unknown"}
              icon={Database}
              iconColor="text-green-500"
              iconBgColor="bg-green-500/10"
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* User Activity Chart */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>User Activity</CardTitle>
                  <CardDescription>Daily view counts for the past week</CardDescription>
                </div>
                <Select defaultValue="7days">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7days">Last 7 days</SelectItem>
                    <SelectItem value="30days">Last 30 days</SelectItem>
                    <SelectItem value="90days">Last 90 days</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={userActivityData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(15, 15, 15, 0.9)', 
                          border: 'none',
                          borderRadius: '4px',
                          color: '#fff'
                        }} 
                      />
                      <Bar dataKey="views" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Top Content */}
            <Card>
              <CardHeader>
                <CardTitle>Top Content</CardTitle>
                <CardDescription>Most viewed movies and shows</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isLoadingTopContent ? (
                    <>
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center">
                          <Skeleton className="w-12 h-18 rounded mr-3" />
                          <div className="flex-1">
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-3 w-20 mb-2" />
                            <Skeleton className="h-1.5 w-full" />
                          </div>
                        </div>
                      ))}
                    </>
                  ) : topContent && topContent.length > 0 ? (
                    topContent.map((item) => (
                      <div key={item.id} className="flex items-center">
                        <img 
                          src={item.thumbnailUrl} 
                          alt={item.title} 
                          className="w-12 h-18 object-cover rounded mr-3" 
                        />
                        <div className="flex-1">
                          <div className="font-medium">{item.title}</div>
                          <div className="text-xs text-muted-foreground">{item.category}</div>
                          <div className="w-full bg-muted h-1.5 rounded-full mt-1.5">
                            <div 
                              className="bg-primary h-full rounded-full" 
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{item.percentage}%</div>
                          <div className="text-xs text-muted-foreground">{item.views} views</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No content views recorded yet
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Recent User Activity Table */}
          <div className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Recent User Activity</CardTitle>
                  <CardDescription>Latest actions from users on the platform</CardDescription>
                </div>
                <Button variant="ghost" className="text-primary">
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <ActivityTable />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
