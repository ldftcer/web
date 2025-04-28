import { useState } from 'react';
import { AdminSidebar } from '@/components/admin/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Download, Calendar } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

// Analytics mock data
const viewsByDay = [
  { name: 'Mon', views: 120 },
  { name: 'Tue', views: 95 },
  { name: 'Wed', views: 150 },
  { name: 'Thu', views: 125 },
  { name: 'Fri', views: 140 },
  { name: 'Sat', views: 190 },
  { name: 'Sun', views: 170 },
];

const viewsByCategory = [
  { name: 'Action', value: 35 },
  { name: 'Drama', value: 25 },
  { name: 'Sci-Fi', value: 15 },
  { name: 'Comedy', value: 15 },
  { name: 'Horror', value: 10 },
];

const COLORS = ['#E50914', '#4dabf7', '#9775fa', '#63e6be', '#ffa94d'];

const viewsByDevice = [
  { name: 'Jan', desktop: 250, mobile: 180, tablet: 120 },
  { name: 'Feb', desktop: 300, mobile: 200, tablet: 140 },
  { name: 'Mar', desktop: 280, mobile: 220, tablet: 130 },
  { name: 'Apr', desktop: 320, mobile: 260, tablet: 160 },
  { name: 'May', desktop: 340, mobile: 290, tablet: 170 },
  { name: 'Jun', desktop: 380, mobile: 340, tablet: 190 },
];

const retentionData = [
  { name: 'Week 1', retention: 100 },
  { name: 'Week 2', retention: 87 },
  { name: 'Week 3', retention: 72 },
  { name: 'Week 4', retention: 65 },
  { name: 'Week 5', retention: 58 },
  { name: 'Week 6', retention: 52 },
  { name: 'Week 7', retention: 47 },
  { name: 'Week 8', retention: 45 },
];

export default function AdminAnalytics() {
  const [dateRange, setDateRange] = useState('7days');
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AdminSidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        <header className="bg-card shadow-md">
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-xl font-semibold">Analytics</h1>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Select
                  value={dateRange}
                  onValueChange={setDateRange}
                >
                  <SelectTrigger className="w-[180px]" id="date-range">
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Select date range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7days">Last 7 days</SelectItem>
                    <SelectItem value="30days">Last 30 days</SelectItem>
                    <SelectItem value="90days">Last 90 days</SelectItem>
                    <SelectItem value="year">Last 12 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span>Export Data</span>
              </Button>
            </div>
          </div>
        </header>
        
        <div className="p-6">
          <Tabs defaultValue="overview">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="content">Content Analytics</TabsTrigger>
              <TabsTrigger value="users">User Analytics</TabsTrigger>
              <TabsTrigger value="retention">Retention</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Daily Views</CardTitle>
                    <CardDescription>
                      Video views over the selected time period
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={viewsByDay}>
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
                
                <Card>
                  <CardHeader>
                    <CardTitle>Views by Category</CardTitle>
                    <CardDescription>
                      Distribution of views across different categories
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={viewsByCategory}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {viewsByCategory.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'rgba(15, 15, 15, 0.9)', 
                              border: 'none',
                              borderRadius: '4px',
                              color: '#fff'
                            }} 
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Views by Device</CardTitle>
                  <CardDescription>
                    Comparison of viewing patterns across different devices
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={viewsByDevice}>
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
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="desktop" 
                          stroke="#E50914" 
                          strokeWidth={2} 
                          activeDot={{ r: 8 }} 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="mobile" 
                          stroke="#4dabf7" 
                          strokeWidth={2} 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="tablet" 
                          stroke="#9775fa" 
                          strokeWidth={2} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="content">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Top Performing Content</CardTitle>
                  <CardDescription>
                    Movies and shows with the highest engagement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <table className="w-full caption-bottom text-sm">
                      <thead>
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <th className="h-12 px-4 text-left align-middle font-medium">Title</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Category</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Views</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Avg. Watch Time</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Completion Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <td className="p-4 align-middle">The Dark Knight</td>
                          <td className="p-4 align-middle">Action</td>
                          <td className="p-4 align-middle">2,541</td>
                          <td className="p-4 align-middle">65 min</td>
                          <td className="p-4 align-middle">82%</td>
                        </tr>
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <td className="p-4 align-middle">Inception</td>
                          <td className="p-4 align-middle">Sci-Fi</td>
                          <td className="p-4 align-middle">1,983</td>
                          <td className="p-4 align-middle">85 min</td>
                          <td className="p-4 align-middle">76%</td>
                        </tr>
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <td className="p-4 align-middle">Parasite</td>
                          <td className="p-4 align-middle">Drama</td>
                          <td className="p-4 align-middle">1,756</td>
                          <td className="p-4 align-middle">92 min</td>
                          <td className="p-4 align-middle">88%</td>
                        </tr>
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <td className="p-4 align-middle">Avengers: Endgame</td>
                          <td className="p-4 align-middle">Action</td>
                          <td className="p-4 align-middle">1,689</td>
                          <td className="p-4 align-middle">72 min</td>
                          <td className="p-4 align-middle">65%</td>
                        </tr>
                        <tr className="transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <td className="p-4 align-middle">Interstellar</td>
                          <td className="p-4 align-middle">Sci-Fi</td>
                          <td className="p-4 align-middle">1,542</td>
                          <td className="p-4 align-middle">102 min</td>
                          <td className="p-4 align-middle">82%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Engagement by Duration</CardTitle>
                    <CardDescription>
                      How video length affects completion rates
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                          { duration: "<60 min", completion: 92 },
                          { duration: "60-90 min", completion: 86 },
                          { duration: "90-120 min", completion: 78 },
                          { duration: "120+ min", completion: 65 },
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="duration" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'rgba(15, 15, 15, 0.9)', 
                              border: 'none',
                              borderRadius: '4px',
                              color: '#fff'
                            }} 
                            formatter={(value) => [`${value}%`, 'Completion Rate']}
                          />
                          <Bar dataKey="completion" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Popular Viewing Times</CardTitle>
                    <CardDescription>
                      When users are most active on the platform
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={[
                          { time: '12am', views: 25 },
                          { time: '4am', views: 10 },
                          { time: '8am', views: 42 },
                          { time: '12pm', views: 78 },
                          { time: '4pm', views: 120 },
                          { time: '8pm', views: 220 },
                          { time: '11pm', views: 145 },
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="time" />
                          <YAxis />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'rgba(15, 15, 15, 0.9)', 
                              border: 'none',
                              borderRadius: '4px',
                              color: '#fff'
                            }} 
                          />
                          <Line 
                            type="monotone" 
                            dataKey="views" 
                            stroke="hsl(var(--primary))" 
                            strokeWidth={2} 
                            dot={{ stroke: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 8 }} 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="users">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>User Growth</CardTitle>
                    <CardDescription>
                      New user registrations over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">12,543</div>
                    <div className="text-green-500 text-sm mt-2 flex items-center">
                      <svg className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      12% from last month
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Avg. Session Duration</CardTitle>
                    <CardDescription>
                      How long users stay on the platform
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">42 min</div>
                    <div className="text-green-500 text-sm mt-2 flex items-center">
                      <svg className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      8% from last month
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Active Users</CardTitle>
                    <CardDescription>
                      Daily active users (DAU)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">3,856</div>
                    <div className="text-green-500 text-sm mt-2 flex items-center">
                      <svg className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      15% from last month
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>User Demographics</CardTitle>
                  <CardDescription>
                    Breakdown of user base by age and gender
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { age: '18-24', male: 85, female: 110, other: 8 },
                          { age: '25-34', male: 120, female: 140, other: 12 },
                          { age: '35-44', male: 100, female: 90, other: 10 },
                          { age: '45-54', male: 75, female: 60, other: 7 },
                          { age: '55+', male: 40, female: 35, other: 5 },
                        ]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="age" />
                        <YAxis />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(15, 15, 15, 0.9)', 
                            border: 'none',
                            borderRadius: '4px',
                            color: '#fff'
                          }} 
                        />
                        <Legend />
                        <Bar dataKey="male" stackId="a" fill="#4dabf7" />
                        <Bar dataKey="female" stackId="a" fill="#e64980" />
                        <Bar dataKey="other" stackId="a" fill="#9775fa" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="retention">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>User Retention</CardTitle>
                  <CardDescription>
                    Weekly retention cohort analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={retentionData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(15, 15, 15, 0.9)', 
                            border: 'none',
                            borderRadius: '4px',
                            color: '#fff'
                          }} 
                          formatter={(value) => [`${value}%`, 'Retention Rate']}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="retention" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={3}
                          dot={{ stroke: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 8 }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Churn Rate Analysis</CardTitle>
                    <CardDescription>
                      Monthly user churn rate over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={[
                          { month: 'Jan', churn: 5.2 },
                          { month: 'Feb', churn: 4.8 },
                          { month: 'Mar', churn: 5.5 },
                          { month: 'Apr', churn: 6.1 },
                          { month: 'May', churn: 5.7 },
                          { month: 'Jun', churn: 4.9 },
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="month" />
                          <YAxis tickFormatter={(value) => `${value}%`} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'rgba(15, 15, 15, 0.9)', 
                              border: 'none',
                              borderRadius: '4px',
                              color: '#fff'
                            }} 
                            formatter={(value) => [`${value}%`, 'Churn Rate']}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="churn" 
                            stroke="#fa5252" 
                            strokeWidth={2}
                            dot={{ stroke: '#fa5252', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 8 }} 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>User Engagement</CardTitle>
                    <CardDescription>
                      Average actions per active user
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                          { action: 'Video Views', count: 8.4 },
                          { action: 'Searches', count: 5.2 },
                          { action: 'Likes', count: 2.7 },
                          { action: 'My List Adds', count: 1.5 },
                          { action: 'Shares', count: 0.8 },
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="action" />
                          <YAxis />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'rgba(15, 15, 15, 0.9)', 
                              border: 'none',
                              borderRadius: '4px',
                              color: '#fff'
                            }} 
                            formatter={(value) => [value, 'Avg per User']}
                          />
                          <Bar dataKey="count" fill="#4c6ef5" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
