import { useDashboardStats } from "@/hooks/use-dashboard";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MapPin, Gauge, ShieldCheck, Plus, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCreateClient } from "@/hooks/use-clients";
import { useCreateMeter } from "@/hooks/use-meters";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertClientSchema, insertMeterSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useClients } from "@/hooks/use-clients";
import { useOperationModes } from "@/hooks/use-operation-modes";
import { z } from "zod";

function StatCard({ title, value, icon: Icon, color }: { title: string, value: number, icon: any, color: string }) {
  return (
    <Card className="border-border/50 shadow-sm hover:shadow-lg transition-all duration-300 group">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`w-8 h-8 rounded-lg ${color} bg-opacity-10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`h-4 w-4 ${color.replace('bg-', 'text-')}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold font-display">{value}</div>
      </CardContent>
    </Card>
  );
}

// Quick Create Client Form Component
function CreateClientForm({ onSuccess }: { onSuccess: () => void }) {
  const createClient = useCreateClient();
  const form = useForm({
    resolver: zodResolver(insertClientSchema),
    defaultValues: { name: "", email: "", address: "", phone: "" }
  });

  const onSubmit = (data: any) => {
    createClient.mutate(data, { onSuccess });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl><Input type="email" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-full" disabled={createClient.isPending}>
          {createClient.isPending ? "Creating..." : "Create Client"}
        </Button>
      </form>
    </Form>
  );
}

export default function Home() {
  const { data: stats, isLoading } = useDashboardStats();
  const [showClientModal, setShowClientModal] = useState(false);
  const [showMeterModal, setShowMeterModal] = useState(false);

  // Simplified Meter creation just navigates to meters page for now
  // to avoid huge complexity in the dashboard file
  const handleCreateMeter = () => {
    window.location.href = "/meters";
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1 ml-64 p-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background font-sans text-foreground">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        <header className="mb-10">
          <h1 className="text-4xl font-display font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Dashboard Overview
          </h1>
          <p className="text-muted-foreground text-lg">
            Welcome back to WaterHub. Here's what's happening today.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-10">
          <StatCard 
            title="Total Clients" 
            value={stats?.clientsCount || 0} 
            icon={Users} 
            color="bg-blue-500" 
          />
          <StatCard 
            title="Total Sites" 
            value={stats?.sitesCount || 0} 
            icon={MapPin} 
            color="bg-emerald-500" 
          />
          <StatCard 
            title="Total Meters" 
            value={stats?.metersCount || 0} 
            icon={Gauge} 
            color="bg-amber-500" 
          />
          <StatCard 
            title="Active Admins" 
            value={stats?.adminsCount || 0} 
            icon={ShieldCheck} 
            color="bg-purple-500" 
          />
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-display font-bold mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div 
              onClick={() => setShowClientModal(true)}
              className="group cursor-pointer bg-gradient-to-br from-primary/5 to-blue-500/5 hover:from-primary/10 hover:to-blue-500/10 border border-primary/20 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden"
            >
              <div className="absolute right-0 top-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-all"></div>
              
              <div className="flex items-center gap-4 mb-3 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/25">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Add New Client</h3>
                  <p className="text-muted-foreground text-sm">Register a new customer</p>
                </div>
              </div>
              <Button variant="ghost" className="w-full justify-between hover:bg-transparent px-0 text-primary mt-2">
                Create Client <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <div 
              onClick={handleCreateMeter}
              className="group cursor-pointer bg-gradient-to-br from-amber-500/5 to-orange-500/5 hover:from-amber-500/10 hover:to-orange-500/10 border border-amber-500/20 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden"
            >
              <div className="absolute right-0 top-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-amber-500/20 transition-all"></div>
              
              <div className="flex items-center gap-4 mb-3 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/25">
                  <Gauge className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Add New Meter</h3>
                  <p className="text-muted-foreground text-sm">Register a device installation</p>
                </div>
              </div>
              <Button variant="ghost" className="w-full justify-between hover:bg-transparent px-0 text-amber-600 mt-2">
                Create Meter <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Dialog open={showClientModal} onOpenChange={setShowClientModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
          </DialogHeader>
          <CreateClientForm onSuccess={() => setShowClientModal(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
