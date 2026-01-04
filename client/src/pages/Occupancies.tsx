import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useOccupancies, useCreateOccupancy, useUpdateOccupancy, useDeleteOccupancy } from "@/hooks/use-occupancies";
import { Sidebar } from "@/components/Sidebar";
import { PageHeader } from "@/components/PageHeader";
import { DataTable } from "@/components/DataTable";
import { EmptyState } from "@/components/EmptyState";
import { cn } from "@/lib/utils";
import { Search, MapPin, Pencil, Trash2, Gauge, Activity, ExternalLink, ShieldCheck, LayoutList, LayoutGrid, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { OccupancyForm } from "@/components/forms/OccupancyForm";
import { Badge } from "@/components/ui/badge";
import { useResponsiveLayout } from "@/hooks/use-responsive-layout";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GridView } from "@/components/GridView";

export default function Occupancies() {
    const params = useParams();
    const establishmentId = Number(params.id);
    const [, setLocation] = useLocation();

    const { data: occupancies, isLoading } = useOccupancies(establishmentId);
    const createOccupancy = useCreateOccupancy();
    const updateOccupancy = useUpdateOccupancy();
    const deleteOccupancy = useDeleteOccupancy();

    const [modalOpen, setModalOpen] = useState(false);
    const [editingOccupancy, setEditingOccupancy] = useState<any>(null);
    const [viewMode, setViewMode] = useState<"table" | "grid">("table");
    const { toast } = useToast();
    const { marginClass } = useResponsiveLayout();
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    const filteredOccupancies = (occupancies || []).filter((o: any) => {
        const search = searchTerm.toLowerCase();
        const searchMatch = o.unitNumber?.toLowerCase().includes(search) ||
            o.customerName?.toLowerCase().includes(search) ||
            o.customerPhone?.toLowerCase().includes(search);

        const statusMatch = filterStatus === "all" || o.status === filterStatus;

        return searchMatch && statusMatch;
    });

    const handleEdit = (occupancy: any) => {
        setEditingOccupancy(occupancy);
        setModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm("Delete this occupancy?")) {
            deleteOccupancy.mutate(id, {
                onSuccess: () => toast({ title: "Occupancy deleted" })
            });
        }
    };

    const handleSubmit = (data: any) => {
        if (editingOccupancy) {
            updateOccupancy.mutate({ id: editingOccupancy.id, ...data }, {
                onSuccess: () => {
                    toast({ title: "Occupancy updated successfully" });
                    setModalOpen(false);
                    setEditingOccupancy(null);
                },
                onError: (err: any) => {
                    toast({ title: "Error", description: err.message, variant: "destructive" });
                }
            });
        } else {
            createOccupancy.mutate(data, {
                onSuccess: () => {
                    toast({ title: "Occupancy created successfully" });
                    setModalOpen(false);
                },
                onError: (err: any) => {
                    toast({ title: "Error", description: err.message, variant: "destructive" });
                }
            });
        }
    };

    const columns = [
        {
            header: "Unit Number",
            accessorKey: "unitNumber" as const,
            cell: (item: any) => <span className="font-bold font-mono text-sm">{item.unitNumber}</span>
        },
        {
            header: "Customer",
            accessorKey: "customerName" as const,
            cell: (item: any) => item.customerName || <span className="text-muted-foreground italic">Unassigned</span>
        },
        {
            header: "Phone",
            accessorKey: "customerPhone" as const,
            cell: (item: any) => item.customerPhone || "-"
        },
        {
            header: "Status",
            cell: (item: any) => (
                <Badge variant={item.status === "occupied" ? "default" : "secondary"}>
                    {item.status}
                </Badge>
            )
        },
        {
            header: "Meter Assigned",
            cell: (item: any) => (
                item.meterId ? (
                    <Button
                        variant="link"
                        className="p-0 h-auto font-mono text-xs flex items-center gap-1.5"
                        onClick={() => setLocation(`/meters?search=${item.meterSerial}`)}
                    >
                        <Gauge className="w-3.5 h-3.5 text-primary/60" />
                        {item.meterSerial}
                        {item.meterTechnology && (
                            <span className="text-[10px] text-muted-foreground bg-muted px-1 rounded flex items-center gap-1">
                                <Activity className="w-2.5 h-2.5" />
                                {item.meterTechnology}
                            </span>
                        )}
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Button>
                ) : (
                    <span className="text-muted-foreground text-xs italic">No meter</span>
                )
            )
        },
        {
            header: "Actions",
            cell: (item: any) => (
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors rounded-xl"
                        onClick={() => handleEdit(item)}
                        title="Edit Occupancy"
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors rounded-xl"
                        onClick={() => handleDelete(item.id)}
                        title="Delete Occupancy"
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
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => setLocation("/establishments")}
                        className="mb-4 text-muted-foreground hover:text-foreground"
                    >
                        ← Back to Establishments
                    </Button>
                    <PageHeader
                        title="Manage Occupancies"
                        description="Manage units and tenants within this establishment."
                        actionLabel="Add Unit"
                        onAction={() => { setEditingOccupancy(null); setModalOpen(true); }}
                        breadcrumbs={["Establishments", "Occupancies"]}
                    />
                </div>
                {!occupancies?.length ? (
                    <EmptyState
                        icon={Home}
                        title="No units found"
                        description="Add your first unit to this establishment."
                        actionLabel="Add Unit"
                        onAction={() => { setEditingOccupancy(null); setModalOpen(true); }}
                    />
                ) : (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by unit number or customer..."
                                    className="pl-10 h-11 bg-muted/40 border-border/60 rounded-xl"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <Select onValueChange={(val) => setFilterStatus(val)} defaultValue="all">
                                <SelectTrigger className="w-[160px] h-11 bg-muted/20 text-[11px] font-bold uppercase tracking-wider border-border/40 rounded-xl">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Units</SelectItem>
                                    <SelectItem value="occupied">Occupied</SelectItem>
                                    <SelectItem value="vacant">Vacant</SelectItem>
                                </SelectContent>
                            </Select>

                            <div className="flex items-center gap-2 bg-muted/20 p-1 rounded-xl border border-border/40 ml-4">
                                <Button
                                    variant={viewMode === "table" ? "secondary" : "ghost"}
                                    size="sm"
                                    onClick={() => setViewMode("table")}
                                    className={cn("h-9 px-4 gap-2 rounded-lg transition-all", viewMode === "table" ? "bg-background shadow-sm border border-border/40 text-primary" : "text-muted-foreground")}
                                >
                                    <LayoutList className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Table</span>
                                </Button>
                                <Button
                                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                                    size="sm"
                                    onClick={() => setViewMode("grid")}
                                    className={cn("h-9 px-4 gap-2 rounded-lg transition-all", viewMode === "grid" ? "bg-background shadow-sm border border-border/40 text-primary" : "text-muted-foreground")}
                                >
                                    <LayoutGrid className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Grid</span>
                                </Button>
                            </div>
                        </div>

                        {viewMode === "table" ? (
                            <div className="overflow-x-auto">
                                <DataTable data={filteredOccupancies} columns={columns} searchKey="unitNumber" searchPlaceholder="Search units..." hideSearch />
                            </div>
                        ) : (
                            <GridView
                                data={filteredOccupancies}
                                type="occupancy"
                                searchKey="unitNumber"
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        )}
                    </div>
                )}
            </main>
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingOccupancy ? "Edit Occupancy" : "Add New Unit"}</DialogTitle>
                    </DialogHeader>
                    <OccupancyForm
                        establishmentId={establishmentId}
                        initialData={editingOccupancy}
                        onSuccess={() => setModalOpen(false)}
                        onSubmit={handleSubmit}
                        isPending={createOccupancy.isPending || updateOccupancy.isPending}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
