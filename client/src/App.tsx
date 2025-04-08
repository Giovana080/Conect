import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import SkillsPage from "@/pages/skills-page";
import ConnectionsPage from "@/pages/connections-page";
import SpecialtiesPage from "@/pages/specialties-page";
import AuthPage from "@/pages/auth-page";
import { ProtectedRoute } from "./lib/protected-route";
import { Loader2 } from "lucide-react";
import { AuthProvider } from "./hooks/use-auth";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

function AppRoutes() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={HomePage} />
      <ProtectedRoute path="/skills" component={SkillsPage} />
      <ProtectedRoute path="/connections" component={ConnectionsPage} />
      <ProtectedRoute path="/specialties" component={SpecialtiesPage} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRoutes />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
