
import React from 'react';
import { Switch, Route, Router as WouterRouter } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { Suspense, lazy, type ReactNode } from 'react';
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "./hooks/use-auth";
import { LanguageProvider } from "./hooks/use-language";

// Use lazy loading to prevent DOM errors during navigation
const AuthPage = lazy(() => import('@/pages/auth-page'));
const MoviePage = lazy(() => import('@/pages/movie-page'));
const MyListPage = lazy(() => import('@/pages/my-list-page'));
const TVShowsPage = lazy(() => import('@/pages/tv-shows-page'));
const MoviesPage = lazy(() => import('@/pages/movies-page'));
const AdminDashboard = lazy(() => import('@/pages/admin/dashboard'));
const AdminContent = lazy(() => import('@/pages/admin/content'));
const AdminSecurity = lazy(() => import('@/pages/admin/security'));
const AdminAnalytics = lazy(() => import('@/pages/admin/analytics'));
const AdminSettings = lazy(() => import('@/pages/admin/settings'));
const AdminUsers = lazy(() => import('@/pages/admin/users'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps): JSX.Element => (
  <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
    <h2 className="text-2xl font-bold text-destructive mb-4">Something went wrong</h2>
    <p className="mb-4 max-w-md text-muted-foreground">{error.message || "An unexpected error occurred"}</p>
    <button 
      onClick={resetErrorBoundary}
      className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
    >
      Try again
    </button>
  </div>
);

function Router() {
  return (
    <ErrorBoundary 
      FallbackComponent={ErrorFallback} 
      onReset={() => window.location.reload()}
    >
      <Switch>
        <Route path="/auth">
          <Suspense fallback={<LoadingFallback />}>
            <AuthPage />
          </Suspense>
        </Route>
        <Route path="/" component={HomePage} />
        <Route path="/movie/:id">
          <Suspense fallback={<LoadingFallback />}>
            <MoviePage />
          </Suspense>
        </Route>

        <Route path="/my-list">
          <Suspense fallback={<LoadingFallback />}>
            <MyListPage />
          </Suspense>
        </Route>

        <Route path="/tv">
          <Suspense fallback={<LoadingFallback />}>
            <TVShowsPage />
          </Suspense>
        </Route>

        <Route path="/movies">
          <Suspense fallback={<LoadingFallback />}>
            <MoviesPage />
          </Suspense>
        </Route>
        
        {/* Admin routes with protection */}
        <ProtectedRoute path="/admin" adminOnly>
          <Suspense fallback={<LoadingFallback />}>
            <AdminDashboard />
          </Suspense>
        </ProtectedRoute>
        <ProtectedRoute path="/admin/dashboard" adminOnly>
          <Suspense fallback={<LoadingFallback />}>
            <AdminDashboard />
          </Suspense>
        </ProtectedRoute>
        <ProtectedRoute path="/admin/content" adminOnly>
          <Suspense fallback={<LoadingFallback />}>
            <AdminContent />
          </Suspense>
        </ProtectedRoute>
        <ProtectedRoute path="/admin/security" adminOnly>
          <Suspense fallback={<LoadingFallback />}>
            <AdminSecurity />
          </Suspense>
        </ProtectedRoute>
        <ProtectedRoute path="/admin/analytics" adminOnly>
          <Suspense fallback={<LoadingFallback />}>
            <AdminAnalytics />
          </Suspense>
        </ProtectedRoute>
        
        <ProtectedRoute path="/admin/settings" adminOnly>
          <Suspense fallback={<LoadingFallback />}>
            <AdminSettings />
          </Suspense>
        </ProtectedRoute>
        
        <ProtectedRoute path="/admin/users" adminOnly>
          <Suspense fallback={<LoadingFallback />}>
            <AdminUsers />
          </Suspense>
        </ProtectedRoute>
        
        {/* Fallback to 404 */}
        <Route component={NotFound} />
      </Switch>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <LanguageProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
