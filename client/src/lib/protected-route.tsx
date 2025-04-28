import React from 'react';
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";
import { ReactNode } from 'react';

export interface ProtectedRouteProps {
  path: string;
  component?: () => React.JSX.Element;
  children?: ReactNode;
  adminOnly?: boolean;
}

export function ProtectedRoute({
  path,
  component: Component,
  children,
  adminOnly = false,
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  const content = React.useMemo(() => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (!user) {
      return <Redirect to="/auth" />;
    }

    if (adminOnly && !user.isAdmin) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-background flex-col">
          <h1 className="text-2xl font-bold text-destructive mb-4">Access Denied</h1>
          <p className="text-muted-foreground">You don't have permission to access this area.</p>
          <a href="/" className="mt-4 text-primary hover:underline">Back to Home</a>
        </div>
      );
    }

    return children || (Component && <Component />);
  }, [isLoading, user, adminOnly, children, Component]);

  return <Route path={path}>{content}</Route>;
}