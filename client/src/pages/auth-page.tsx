import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'wouter';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

// Login form schema
const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Registration form schema
const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [location, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<string>("login");
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);
  
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });
  
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });
  
  // Use callbacks to prevent unnecessary re-renders
  const onLogin = useCallback((data: LoginFormValues) => {
    loginMutation.mutate(data);
  }, [loginMutation]);
  
  const onRegister = useCallback((data: RegisterFormValues) => {
    const { confirmPassword, ...registerData } = data;
    registerMutation.mutate({
      ...registerData,
      isAdmin: false,
    });
  }, [registerMutation]);
  
  // Reset forms when switching tabs
  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
    if (value === "login") {
      registerForm.reset();
    } else {
      loginForm.reset();
    }
  }, [loginForm, registerForm]);
  
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Forms */}
      <div className="flex-1 flex items-center justify-center p-8">
        <Tabs defaultValue="login" value={activeTab} onValueChange={handleTabChange} className="w-full max-w-md">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          {/* Login Form */}
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-primary">Sign In</CardTitle>
                <CardDescription>
                  Access your MovieStream account
                </CardDescription>
              </CardHeader>
              <form onSubmit={loginForm.handleSubmit(onLogin)}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-username">Username</Label>
                    <Input 
                      id="login-username"
                      type="text"
                      {...loginForm.register('username')}
                    />
                    {loginForm.formState.errors.username && (
                      <p className="text-sm text-destructive">
                        {loginForm.formState.errors.username.message}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="login-password">Password</Label>
                      <a href="#" className="text-sm text-primary hover:underline">
                        Forgot password?
                      </a>
                    </div>
                    <Input 
                      id="login-password"
                      type="password"
                      {...loginForm.register('password')}
                    />
                    {loginForm.formState.errors.password && (
                      <p className="text-sm text-destructive">
                        {loginForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : 'Sign In'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          {/* Registration Form */}
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-primary">Create Account</CardTitle>
                <CardDescription>
                  Join MovieStream today
                </CardDescription>
              </CardHeader>
              <form onSubmit={registerForm.handleSubmit(onRegister)}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-username">Username</Label>
                    <Input 
                      id="register-username"
                      type="text"
                      {...registerForm.register('username')}
                    />
                    {registerForm.formState.errors.username && (
                      <p className="text-sm text-destructive">
                        {registerForm.formState.errors.username.message}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input 
                      id="register-email"
                      type="email"
                      {...registerForm.register('email')}
                    />
                    {registerForm.formState.errors.email && (
                      <p className="text-sm text-destructive">
                        {registerForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <Input 
                      id="register-password"
                      type="password"
                      {...registerForm.register('password')}
                    />
                    {registerForm.formState.errors.password && (
                      <p className="text-sm text-destructive">
                        {registerForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-confirm-password">Confirm Password</Label>
                    <Input 
                      id="register-confirm-password"
                      type="password"
                      {...registerForm.register('confirmPassword')}
                    />
                    {registerForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-destructive">
                        {registerForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : 'Create Account'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Right Side - Hero Section */}
      <div className="hidden lg:flex flex-1 bg-card relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://source.unsplash.com/random/1920x1080?cinema,movie')" }}
        >
          <div className="absolute inset-0 bg-black/70"></div>
        </div>
        
        <div className="relative z-10 flex flex-col justify-center px-12 max-w-lg mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4 text-white">
            Unlimited Movies, TV Shows, and More
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Watch anywhere. Cancel anytime. Join MovieStream for access to our vast library of content.
          </p>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-card/20 backdrop-blur-sm p-4 rounded-lg">
              <div className="text-3xl font-bold text-primary mb-2">1000+</div>
              <div className="text-sm text-muted-foreground">Movies & TV Shows</div>
            </div>
            <div className="bg-card/20 backdrop-blur-sm p-4 rounded-lg">
              <div className="text-3xl font-bold text-primary mb-2">HD</div>
              <div className="text-sm text-muted-foreground">High Quality</div>
            </div>
            <div className="bg-card/20 backdrop-blur-sm p-4 rounded-lg">
              <div className="text-3xl font-bold text-primary mb-2">$0</div>
              <div className="text-sm text-muted-foreground">Free to Use</div>
            </div>
            <div className="bg-card/20 backdrop-blur-sm p-4 rounded-lg">
              <div className="text-3xl font-bold text-primary mb-2">All</div>
              <div className="text-sm text-muted-foreground">Devices</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
