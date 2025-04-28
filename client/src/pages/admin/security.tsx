import { useQuery } from '@tanstack/react-query';
import { AdminSidebar } from '@/components/admin/sidebar';
import { ActivityTable } from '@/components/admin/activity-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Shield, AlertTriangle, UserX } from 'lucide-react';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { ClientContext } from '@/main';
import { useContext } from 'react';

// Mock suspicious IP addresses
const suspiciousIPs = [
  { ip: "103.74.19.104", country: "Unknown", attempts: 23, lastAttempt: new Date(Date.now() - 1000 * 60 * 15) },
  { ip: "45.227.255.206", country: "Unknown", attempts: 17, lastAttempt: new Date(Date.now() - 1000 * 60 * 45) },
  { ip: "91.132.145.113", country: "Unknown", attempts: 12, lastAttempt: new Date(Date.now() - 1000 * 60 * 120) },
];

export default function AdminSecurity() {
  const { toast } = useToast();
  const clientInfo = useContext(ClientContext);
  
  const { data: activityLogs, isLoading } = useQuery<any[]>({
    queryKey: ['/api/admin/activity'],
  });
  
  // Filter for security relevant logs (login, registration, etc.)
  const securityLogs = activityLogs?.filter(log => 
    ['login', 'logout', 'registration'].includes(log.activity)
  );
  
  const handleBlock = (ip: string) => {
    toast({
      title: "IP Blocked",
      description: `IP address ${ip} has been blocked.`,
    });
  };
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AdminSidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        <header className="bg-card shadow-md">
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-xl font-semibold">Security Logs</h1>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search IP address..."
                  className="pl-10 w-60"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
              
              <Button variant="outline" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Security Report</span>
              </Button>
            </div>
          </div>
        </header>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-sm font-medium">Your IP Address</CardTitle>
                  <CardDescription>Currently detected visitor IP</CardDescription>
                </div>
                <Shield className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="mt-2 font-semibold text-lg">{clientInfo.ip || "Unknown"}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  This IP is logged for all your admin actions for security purposes.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-sm font-medium">Login Attempts</CardTitle>
                  <CardDescription>Last 24 hours</CardDescription>
                </div>
                <UserX className="h-5 w-5 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="mt-2 font-semibold text-lg">
                  {isLoading ? 
                    "Loading..." : 
                    securityLogs?.filter(log => 
                      log.activity === 'login' && 
                      new Date(log.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
                    ).length || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Monitor for unusual login patterns.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-sm font-medium">Suspicious IPs</CardTitle>
                  <CardDescription>Detected suspicious activities</CardDescription>
                </div>
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="mt-2 font-semibold text-lg">
                  {suspiciousIPs.length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Potential security threats detected.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="all-logs">
            <TabsList className="mb-6">
              <TabsTrigger value="all-logs">All Activity Logs</TabsTrigger>
              <TabsTrigger value="security-logs">Security Logs</TabsTrigger>
              <TabsTrigger value="suspicious">Suspicious IPs</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all-logs">
              <Card>
                <CardHeader>
                  <CardTitle>All Activity Logs</CardTitle>
                  <CardDescription>
                    Complete log of all user activities on the platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ActivityTable />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="security-logs">
              <Card>
                <CardHeader>
                  <CardTitle>Security Logs</CardTitle>
                  <CardDescription>
                    Security-related events like logins, registrations, and logouts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8">Loading security logs...</div>
                  ) : securityLogs && securityLogs.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>IP Address</TableHead>
                          <TableHead>Activity</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>User Agent</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {securityLogs.map((log) => (
                          <TableRow key={log.id}>
                            <TableCell>
                              {log.user?.username || "Unknown user"}
                            </TableCell>
                            <TableCell>{log.ipAddress}</TableCell>
                            <TableCell>
                              <span className="capitalize">{log.activity}</span>
                            </TableCell>
                            <TableCell>
                              {log.timestamp ? formatDistanceToNow(new Date(log.timestamp), { addSuffix: true }) : '-'}
                            </TableCell>
                            <TableCell className="truncate max-w-[200px]">
                              {log.details?.userAgent || '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No security logs found
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="suspicious">
              <Card>
                <CardHeader>
                  <CardTitle>Suspicious IP Addresses</CardTitle>
                  <CardDescription>
                    IP addresses with suspicious activity patterns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>IP Address</TableHead>
                        <TableHead>Country</TableHead>
                        <TableHead>Failed Attempts</TableHead>
                        <TableHead>Last Attempt</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {suspiciousIPs.map((ip, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{ip.ip}</TableCell>
                          <TableCell>{ip.country}</TableCell>
                          <TableCell>{ip.attempts}</TableCell>
                          <TableCell>
                            {formatDistanceToNow(ip.lastAttempt, { addSuffix: true })}
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleBlock(ip.ip)}
                            >
                              Block IP
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
