
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AuthCallback } from "@/components/auth/AuthCallback";
import { ProfileRouteHandler } from "@/components/routing/ProfileRouteHandler";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Onboarding from "./pages/Onboarding";
import PostGig from "./pages/PostGig";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Static routes - MUST come first */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route 
              path="/dashboard" 
              element={
                <AuthGuard requireAuth>
                  <Dashboard />
                </AuthGuard>
              } 
            />
            <Route 
              path="/onboarding" 
              element={
                <AuthGuard requireAuth>
                  <Onboarding />
                </AuthGuard>
              } 
            />
            <Route 
              path="/post-a-gig" 
              element={
                <AuthGuard requireAuth>
                  <PostGig />
                </AuthGuard>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <AuthGuard requireAuth requiredRole="admin">
                  <Admin />
                </AuthGuard>
              } 
            />
            
            {/* Dynamic profile route - MUST come after all static routes */}
            <Route path="/:slug" element={<ProfileRouteHandler />} />
            
            {/* Catch-all 404 route - MUST be last */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
