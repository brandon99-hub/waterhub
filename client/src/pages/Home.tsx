import { useDashboardStats } from "@/hooks/use-dashboard";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  MapPin,
  Gauge,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Droplets,
  DollarSign,
  Activity,
  Plus,
  Power,
  PowerOff,
  AlertCircle
} from "lucide-react";
import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ClientForm } from "@/components/forms/ClientForm";
import { MeterForm } from "@/components/forms/MeterForm";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";
import { useTransactions, useEvents } from "@/hooks/use-activity";
import { useMeters } from "@/hooks/use-meters";
import { useSites } from "@/hooks/use-sites";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { format } from "date-fns";
import { useResponsiveLayout } from "@/hooks/use-responsive-layout";
import { cn } from "@/lib/utils";

// Leaflet icon fix
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function StatCard({ title, value, icon: Icon, color, trend, unit = "" }: { title: string, value: number | string, icon: any, color: string, trend?: string, unit?: string }) {
  return (
    <Card className="border-border/40 shadow-sm hover:shadow-lg transition-all duration-300 group overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`w-10 h-10 rounded-xl ${color} bg-opacity-10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
          <Icon className={`h-5 w-5 ${color.replace('bg-', 'text-')}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-1">
          <div className="text-3xl font-display font-bold tracking-tight">{value}</div>
          {unit && <span className="text-sm font-medium text-muted-foreground">{unit}</span>}
        </div>
        {trend && (
          <p className="text-xs font-medium text-emerald-500 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> {trend}
          </p>
        )}
      </CardContent>
      <div className={`absolute bottom-0 left-0 h-1 w-full ${color} opacity-20`}></div>
    </Card>
  );
}

export default function Home() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: transactions } = useTransactions();
  const { data: events } = useEvents();
  const { data: meters } = useMeters();
  const { data: sites } = useSites();
  const { marginClass } = useResponsiveLayout();

  const [showClientModal, setShowClientModal] = useState(false);
  const [showMeterModal, setShowMeterModal] = useState(false);

  // Calculate valve status counts
  const valveStats = useMemo(() => {
    if (!meters?.length) return { open: 0, closed: 0, offline: 0 };
    return meters.reduce((acc, meter) => {
      const status = meter.valveStatus || 'offline';
      acc[status as keyof typeof acc] = (acc[status as keyof typeof acc] || 0) + 1;
      return acc;
    }, { open: 0, closed: 0, offline: 0 });
  }, [meters]);

  // Calculate cumulative consumption for current month
  const cumulativeConsumption = useMemo(() => {
    if (!meters?.length) return 0;
    return meters.reduce((sum, meter) => sum + (meter.latestReading || 0), 0);
  }, [meters]);

  // Calculate average daily consumption (mock for now)
  const avgDailyConsumption = useMemo(() => {
    const daysInMonth = new Date().getDate();
    return daysInMonth > 0 ? Math.round(cumulativeConsumption / daysInMonth) : 0;
  }, [cumulativeConsumption]);

  // Mock chart data if no transactions
  const consumptionData = useMemo(() => {
    if (!transactions?.length) {
      return [
        { name: 'Mon', usage: 400, rev: 2400 },
        { name: 'Tue', usage: 300, rev: 1398 },
        { name: 'Wed', usage: 200, rev: 9800 },
        { name: 'Thu', usage: 278, rev: 3908 },
        { name: 'Fri', usage: 189, rev: 4800 },
        { name: 'Sat', usage: 239, rev: 3800 },
        { name: 'Sun', usage: 349, rev: 4300 },
      ];
    }
    // Real grouping logic would go here
    return transactions.slice(0, 7).map((t, i) => ({
      name: format(new Date(t.timestamp || Date.now()), 'EEE'),
      usage: Number(t.volume),
      rev: Number(t.amount)
    })).reverse();
  }, [transactions]);

  if (statsLoading) {
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

      <main className={cn("flex-1 p-8 transition-all duration-300", marginClass)}>
        <header className="mb-10 flex items-end justify-between">
          <div>
            <h1 className="text-4xl font-display font-bold mb-2 tracking-tight">
              Platform Overview
            </h1>
            <p className="text-muted-foreground text-lg font-medium">
              Real-time synchronization for your water distribution network.
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => setShowClientModal(true)} variant="outline" className="gap-2 border-primary/20 hover:bg-primary/5 text-primary">
              <Plus className="w-4 h-4" /> New Client
            </Button>
            <Button onClick={() => setShowMeterModal(true)} className="gap-2 shadow-lg shadow-primary/20">
              <Plus className="w-4 h-4" /> New Meter
            </Button>
          </div>
        </header>

        {/* KPI Section */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5 mb-10">
          <StatCard
            title="Cumulative Consumption"
            value={cumulativeConsumption.toLocaleString()}
            unit="L"
            icon={Droplets}
            color="bg-blue-500"
            trend={`${avgDailyConsumption.toLocaleString()}L daily avg`}
          />
          <StatCard
            title="Valves Open"
            value={valveStats.open}
            icon={Power}
            color="bg-emerald-500"
          />
          <StatCard
            title="Valves Closed"
            value={valveStats.closed}
            icon={PowerOff}
            color="bg-red-500"
          />
          <StatCard
            title="Offline Meters"
            value={valveStats.offline}
            icon={AlertCircle}
            color="bg-gray-500"
          />
          <StatCard
            title="Total Meters"
            value={stats?.metersCount || 0}
            icon={Gauge}
            color="bg-amber-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* Main Chart */}
          <Card className="lg:col-span-2 border-border/40 shadow-sm overflow-hidden flex flex-col">
            <CardHeader className="border-b border-border/40 bg-muted/20">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Consumption & Revenue Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-10 flex-1">
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={consumptionData}>
                    <defs>
                      <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="usage"
                      name="Litres"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorUsage)"
                    />
                    <Area
                      type="monotone"
                      dataKey="rev"
                      name="KES"
                      stroke="#10b981"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorRev)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Activity Stream */}
          <Card className="border-border/40 shadow-sm flex flex-col">
            <CardHeader className="border-b border-border/40 bg-muted/20">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Network Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-y-auto max-h-[440px]">
              <div className="divide-y divide-border/40">
                {!events?.length ? (
                  <div className="p-8 text-center text-muted-foreground italic">No recent events tracked.</div>
                ) : (
                  events.map((event) => (
                    <div key={event.id} className="p-4 hover:bg-muted/30 transition-colors flex gap-4">
                      <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${event.eventType === 'alert' ? 'bg-destructive' : 'bg-primary'
                        }`} />
                      <div className="space-y-1">
                        <p className="text-sm font-semibold">{event.description}</p>
                        <p className="text-xs text-muted-foreground">{format(new Date(event.timestamp || Date.now()), 'MMM d, h:mm a')}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
            <div className="p-4 border-t border-border/40 bg-muted/10">
              <Button variant="ghost" className="w-full text-xs text-primary font-bold tracking-wide uppercase">
                View Full Event Log
              </Button>
            </div>
          </Card>
        </div>

        {/* Global Map Section */}
        <Card className="border-border/40 shadow-sm overflow-hidden mb-10">
          <CardHeader className="border-b border-border/40 bg-muted/20">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Network Geolocation
              </CardTitle>
              <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Active
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Warning
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[500px] w-full relative z-10">
              <MapContainer
                center={[-1.2921, 36.8219]}
                zoom={10}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {sites?.filter(s => s.latitude && s.longitude).map((site) => (
                  <Marker key={site.id} position={[Number(site.latitude), Number(site.longitude)]}>
                    <Popup>
                      <div className="p-1">
                        <h3 className="font-bold text-sm mb-1">{site.siteName}</h3>
                        <Button variant="outline" size="sm" className="h-7 text-xs w-full">View Site Details</Button>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </CardContent>
        </Card>
      </main>

      <Dialog open={showClientModal} onOpenChange={setShowClientModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
          </DialogHeader>
          <ClientForm onSuccess={() => setShowClientModal(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={showMeterModal} onOpenChange={setShowMeterModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Meter</DialogTitle>
          </DialogHeader>
          <MeterForm onSuccess={() => setShowMeterModal(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
