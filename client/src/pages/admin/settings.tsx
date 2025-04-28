import { useState } from 'react';
import { AdminSidebar } from '@/components/admin/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export default function AdminSettings() {
  const { toast } = useToast();
  const [language, setLanguage] = useState('en');
  
  // Site settings
  const [siteName, setSiteName] = useState('MovieStream');
  const [siteDescription, setSiteDescription] = useState('Your ultimate streaming platform');
  const [enableRegistration, setEnableRegistration] = useState(true);
  const [enableComments, setEnableComments] = useState(true);
  const [enableRatings, setEnableRatings] = useState(true);
  
  // Email settings
  const [smtpServer, setSmtpServer] = useState('');
  const [smtpPort, setSmtpPort] = useState('');
  const [smtpUsername, setSmtpUsername] = useState('');
  const [smtpPassword, setSmtpPassword] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  
  // Backup settings
  const [backupSchedule, setBackupSchedule] = useState('daily');
  const [backupRetention, setBackupRetention] = useState('7');
  
  // Mutation for saving settings
  const saveSettingsMutation = useMutation({
    mutationFn: async (settings: any) => {
      const res = await apiRequest('POST', '/api/admin/settings', settings);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Settings saved',
        description: 'Your settings have been saved successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error saving settings',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  const handleSaveSettings = (tab: string) => {
    let settingsToSave = {};
    
    if (tab === 'general') {
      settingsToSave = {
        siteName,
        siteDescription,
        enableRegistration,
        enableComments,
        enableRatings,
        language,
      };
    } else if (tab === 'email') {
      settingsToSave = {
        smtpServer,
        smtpPort,
        smtpUsername,
        smtpPassword,
        senderEmail,
      };
    } else if (tab === 'backup') {
      settingsToSave = {
        backupSchedule,
        backupRetention,
      };
    }
    
    saveSettingsMutation.mutate(settingsToSave);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Configure your application settings</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ru">Russian</SelectItem>
                <SelectItem value="arm">Armenian</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="backup">Backup & Recovery</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Configure the general settings of your application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="site-name">Site Name</Label>
                  <Input 
                    id="site-name" 
                    value={siteName} 
                    onChange={(e) => setSiteName(e.target.value)} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="site-description">Site Description</Label>
                  <Textarea 
                    id="site-description" 
                    value={siteDescription} 
                    onChange={(e) => setSiteDescription(e.target.value)} 
                  />
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Features</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="registration">Enable User Registration</Label>
                      <p className="text-sm text-muted-foreground">Allow new users to register on your site</p>
                    </div>
                    <Switch 
                      id="registration" 
                      checked={enableRegistration} 
                      onCheckedChange={setEnableRegistration} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="comments">Enable Comments</Label>
                      <p className="text-sm text-muted-foreground">Allow users to comment on movies</p>
                    </div>
                    <Switch 
                      id="comments" 
                      checked={enableComments} 
                      onCheckedChange={setEnableComments} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="ratings">Enable Ratings</Label>
                      <p className="text-sm text-muted-foreground">Allow users to rate movies</p>
                    </div>
                    <Switch 
                      id="ratings" 
                      checked={enableRatings} 
                      onCheckedChange={setEnableRatings} 
                    />
                  </div>
                </div>
                
                <Button 
                  className="mt-4" 
                  onClick={() => handleSaveSettings('general')}
                  disabled={saveSettingsMutation.isPending}
                >
                  {saveSettingsMutation.isPending ? 'Saving...' : 'Save Settings'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="email">
            <Card>
              <CardHeader>
                <CardTitle>Email Settings</CardTitle>
                <CardDescription>Configure email server settings for notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="smtp-server">SMTP Server</Label>
                  <Input 
                    id="smtp-server" 
                    value={smtpServer} 
                    onChange={(e) => setSmtpServer(e.target.value)} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="smtp-port">SMTP Port</Label>
                  <Input 
                    id="smtp-port" 
                    value={smtpPort} 
                    onChange={(e) => setSmtpPort(e.target.value)} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="smtp-username">SMTP Username</Label>
                  <Input 
                    id="smtp-username" 
                    value={smtpUsername} 
                    onChange={(e) => setSmtpUsername(e.target.value)} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="smtp-password">SMTP Password</Label>
                  <Input 
                    id="smtp-password" 
                    type="password"
                    value={smtpPassword} 
                    onChange={(e) => setSmtpPassword(e.target.value)} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sender-email">Sender Email</Label>
                  <Input 
                    id="sender-email" 
                    value={senderEmail} 
                    onChange={(e) => setSenderEmail(e.target.value)} 
                  />
                </div>
                
                <Button 
                  className="mt-4" 
                  onClick={() => handleSaveSettings('email')}
                  disabled={saveSettingsMutation.isPending}
                >
                  {saveSettingsMutation.isPending ? 'Saving...' : 'Save Settings'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="backup">
            <Card>
              <CardHeader>
                <CardTitle>Backup & Recovery</CardTitle>
                <CardDescription>Configure database backup settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="backup-schedule">Backup Schedule</Label>
                  <Select value={backupSchedule} onValueChange={setBackupSchedule}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select schedule" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="backup-retention">Backup Retention (days)</Label>
                  <Input 
                    id="backup-retention" 
                    value={backupRetention} 
                    onChange={(e) => setBackupRetention(e.target.value)} 
                  />
                </div>
                
                <div className="flex gap-4">
                  <Button 
                    className="mt-4" 
                    onClick={() => handleSaveSettings('backup')}
                    disabled={saveSettingsMutation.isPending}
                  >
                    {saveSettingsMutation.isPending ? 'Saving...' : 'Save Settings'}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => {
                      toast({
                        title: 'Backup Started',
                        description: 'Backup process has been initiated.',
                      });
                    }}
                  >
                    Backup Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="advanced">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
                <CardDescription>These settings are for advanced users only</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 rounded-md">
                  <p>Warning: Changes to these settings may affect the functionality of your application.</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <div className="flex gap-2">
                    <Input id="api-key" value="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" readOnly />
                    <Button variant="outline" onClick={() => {
                      toast({
                        title: 'API Key Regenerated',
                        description: 'A new API key has been generated.',
                      });
                    }}>
                      Regenerate
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cache-ttl">Cache TTL (seconds)</Label>
                  <Input id="cache-ttl" defaultValue="3600" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="debug-mode">Debug Mode</Label>
                  <Select defaultValue="off">
                    <SelectTrigger>
                      <SelectValue placeholder="Select debug mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="off">Off</SelectItem>
                      <SelectItem value="errors">Errors Only</SelectItem>
                      <SelectItem value="all">All (Verbose)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button className="mt-4" variant="destructive" onClick={() => {
                  toast({
                    title: 'Cache Cleared',
                    description: 'Application cache has been cleared.',
                  });
                }}>
                  Clear Cache
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}