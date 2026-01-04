import { useState } from "react";
import { useMeters, useDeleteMeter } from "@/hooks/use-meters";
import { useClients } from "@/hooks/use-clients";
import { useOperationModes } from "@/hooks/use-operation-modes";
import { useEstablishments } from "@/hooks/use-establishments";
import { Sidebar } from "@/components/Sidebar";
import { PageHeader } from "@/components/PageHeader";
import { DataTable } from "@/components/DataTable";
import { GridView } from "@/components/GridView";
import { EmptyState } from "@/components/EmptyState";
import { Gauge, Pencil, Trash2, LayoutGrid, Search, List, Filter, Settings2, Activity, Info } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { MeterForm } from "@/components/forms/MeterForm";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useResponsiveLayout } from "@/hooks/use-responsive-layout";

export default function Meters() {
  const { data: meters, isLoading } = useMeters();
  const { data: clients } = useClients();
  const { data: modes } = useOperationModes();
  const { data: establishments } = useEstablishments();
  const deleteMeter = useDeleteMeter();
  const queryClient = useQueryClient(); // Added
  const { toast } = useToast(); // Removed duplicate
  const [isModalOpen, setIsModalOpen] = useState(false); // Renamed modalOpen to isModalOpen
  const [editingMeter, setEditingMeter] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterTech, setFilterTech] = useState("all");
  const { marginClass } = useResponsiveLayout();

  const filteredMeters = (meters || []).filter((m: any) => {
    const search = searchTerm.toLowerCase();
    const searchMatch = m.serialNo?.toLowerCase().includes(search) ||
      m.technology?.toLowerCase().includes(search) ||
      m.type?.toLowerCase().includes(search);

    const statusMatch = filterStatus === "all" || m.valveStatus === filterStatus;
    const techMatch = filterTech === "all" || m.technology === filterTech;

    return searchMatch && statusMatch && techMatch;
  });

  const handleEdit = (meter: any) => { setEditingMeter(meter); setIsModalOpen(true); }; // Updated
  const handleDelete = (id: number) => {
    if (confirm("Delete this meter?")) deleteMeter.mutate(id, { onSuccess: () => toast({ title: "Meter deleted" }) });
  };

  const toggleValve = useMutation({
    mutationFn: async ({ id, status }: { id: number, status: string }) => {
      const res = await fetch(`/api/meters/${id}/valve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ valveStatus: status })
      });
      if (!res.ok) throw new Error("Failed to toggle valve");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/meters"] });
      toast({ title: "Valve status updated" });
    }
  });

  const getClientName = (id: number) => clients?.find(c => c.id === id)?.name || "Unknown";
  const getModeName = (id: number) => modes?.find(m => m.id === id)?.modeName || "Unknown";
  const getEstablishmentName = (id: number | null) => id ? (establishments as any)?.find((e: any) => e.id === id)?.establishmentName || "N/A" : "N/A";

  const columns = [
    { header: "Serial No", accessorKey: "serialNo" as const, cell: (item: any) => <span className="font-medium font-mono text-xs bg-secondary px-2 py-1 rounded">{item.serialNo}</span> },
    { header: "Client (Landlord)", cell: (item: any) => <span className="font-medium">{getClientName(item.clientId)}</span> },
    {
      header: "Customer (Tenant)",
      cell: (item: any) => item.customerName ? (
        <span className="font-medium text-foreground">{item.customerName}</span>
      ) : (
        <span className="text-muted-foreground italic text-sm">Unassigned</span>
      )
    },
    { header: "Establishment", cell: (item: any) => <span className="text-sm">{getEstablishmentName(item.establishmentId)}</span> },
    { header: "Technology", cell: (item: any) => <span className="text-sm font-medium">{item.technology}</span> },
    { header: "Size", cell: (item: any) => <span className="text-xs text-muted-foreground">{item.meterSize}</span> },
    {
      header: "Valve Status",
      cell: (item: any) => (
        <div className="flex items-center gap-3">
          <Badge
            variant={item.valveStatus === "open" ? "default" : item.valveStatus === "closed" ? "destructive" : "secondary"}
            className={cn(
              "font-bold text-[10px] uppercase tracking-wider",
              item.valveStatus === "offline" && "bg-gray-500/10 text-gray-600 border-gray-500/20"
            )}
          >
            {item.valveStatus || "offline"}
          </Badge>
          <Switch
            checked={item.valveStatus === "open"}
            onCheckedChange={(checked) => toggleValve.mutate({ id: item.id, status: checked ? "open" : "closed" })}
            disabled={toggleValve.isPending || item.valveStatus === "offline"}
            className="data-[state=checked]:bg-emerald-500"
          />
        </div>
      )
    },
    { header: "Mode", accessorKey: "operationModeId" as const, cell: (item: any) => <span className="text-xs font-semibold px-2 py-1 bg-primary/10 text-primary rounded-full">{getModeName(item.operationModeId)}</span> },
    {
      header: "Actions",
      cell: (item: any) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors rounded-xl"
            onClick={() => handleEdit(item)}
            title="Edit Meter"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors rounded-xl"
            onClick={() => handleDelete(item.id)}
            title="Delete Meter"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    },
  ];

  if (isLoading) return <div className="flex h-screen items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;

  return (
    <div className="flex min-h-screen bg-background font-sans">
      <Sidebar />
      <main className={cn("flex-1 p-8 transition-all duration-300 min-w-0 overflow-hidden", marginClass)}>
        <PageHeader
          title="Meter Inventory"
          description="Monitor and manage all deployed water meters."
          actionLabel="Deploy New Meter"
          onAction={() => { setEditingMeter(null); setIsModalOpen(true); }} // Updated
          breadcrumbs={["Infrastructure", "Meter Inventory"]}
        />

        {/* Search and Advanced Filters */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-md group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <Input
                placeholder="Search by serial, client, or technology..."
                className="pl-10 h-11 bg-muted/40 border-border/60 rounded-xl focus:bg-background transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 bg-muted/20 p-1 rounded-xl border border-border/40 ml-4">
              <Button
                variant={viewMode === "table" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className={cn("gap-2 h-9 rounded-lg px-4 transition-all", viewMode === "table" ? "bg-background shadow-sm border border-border/40 text-primary" : "text-muted-foreground hover:text-foreground")}
              >
                <List className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Table</span>
              </Button>
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={cn("gap-2 h-9 rounded-lg px-4 transition-all", viewMode === "grid" ? "bg-background shadow-sm border border-border/40 text-primary" : "text-muted-foreground hover:text-foreground")}
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Grid</span>
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4 py-3 px-4 bg-muted/10 rounded-2xl border border-dashed border-border/60">
            <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mr-2">
              <Filter className="w-3.5 h-3.5" />
              Quick Filters
            </div>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[140px] h-9 bg-background/50 text-[11px] font-bold uppercase tracking-wider border-border/40 rounded-lg">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterTech} onValueChange={setFilterTech}>
              <SelectTrigger className="w-[140px] h-9 bg-background/50 text-[11px] font-bold uppercase tracking-wider border-border/40 rounded-lg">
                <SelectValue placeholder="Technology" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tech</SelectItem>
                <SelectItem value="NB-IoT">NB-IoT</SelectItem>
                <SelectItem value="LoRaWAN">LoRaWAN</SelectItem>
                <SelectItem value="GPRS">GPRS</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="ghost"
              size="sm"
              className="ml-auto text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 hover:bg-primary/5 px-4 h-9 rounded-lg"
              onClick={() => {
                setFilterStatus("all");
                setFilterTech("all");
                setSearchTerm("");
              }}
            >
              Reset Filters
            </Button>
          </div>
        </div>


        {!filteredMeters.length ? ( // Updated to use filteredMeters
          <EmptyState icon={Gauge} title="No meters found" description="Register your first meter." actionLabel="Add Meter" onAction={() => { setEditingMeter(null); setIsModalOpen(true); }} /> // Updated
        ) : viewMode === "table" ? (
          <div className="overflow-x-auto">
            <DataTable data={filteredMeters} columns={columns} searchKey="serialNo" searchPlaceholder="Search meters..." hideSearch />
          </div>
        ) : (
          <GridView
            data={filteredMeters}
            type="meter"
            searchKey="serialNo"
            searchPlaceholder="Search serial..."
            onEdit={handleEdit}
            onDelete={handleDelete}
            helpers={{
              getClientName,
              getEstablishmentName,
              getModeName
            }}
          />
        )}
      </main>
      <Dialog open={isModalOpen} onOpenChange={(open) => {
        setIsModalOpen(open);
        if (!open) setEditingMeter(null);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingMeter ? "Edit Meter" : "Add New Meter"}</DialogTitle>
          </DialogHeader>
          <MeterForm initialData={editingMeter} onSuccess={() => setIsModalOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
