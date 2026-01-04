import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Admins from "@/pages/Admins";
import Clients from "@/pages/Clients";
import Sites from "@/pages/Sites";
import Meters from "@/pages/Meters";

// Placeholder components for unimplemented pages to avoid crashes
const Placeholder = ({ title }: { title: string }) => (
  <div className="flex min-h-screen bg-background font-sans">
    <div className="w-64 border-r border-border/40 h-screen bg-card fixed left-0 top-0"></div>
    <main className="flex-1 ml-64 p-8 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-muted-foreground">This page is under construction.</p>
        <a href="/" className="text-primary hover:underline mt-4 block">Back to Dashboard</a>
      </div>
    </main>
  </div>
);

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admins" component={Admins} />
      <Route path="/clients" component={Clients} />
      <Route path="/sites" component={Sites} />
      <Route path="/meters" component={Meters} />
      
      {/* Placeholders for remaining routes */}
      <Route path="/operation-modes"><Placeholder title="Operation Modes" /></Route>
      <Route path="/establishment-types"><Placeholder title="Establishment Types" /></Route>
      <Route path="/establishments"><Placeholder title="Establishments" /></Route>
      <Route path="/billing-profiles"><Placeholder title="Billing Profiles" /></Route>
      <Route path="/mpesa-keys"><Placeholder title="Mpesa Keys" /></Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
