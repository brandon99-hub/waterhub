import { useQuery, useMutation } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { queryClient } from "@/lib/queryClient";
import { Sidebar } from "@/components/Sidebar";
import { PageHeader } from "@/components/PageHeader";
import { DataTable } from "@/components/DataTable";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Building2, Pencil, Trash2, MapPin, Tags, Users, Search, Home } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useLocation } from "wouter";
import { EstablishmentForm } from "@/components/forms/EstablishmentForm";
import { OccupancyForm } from "@/components/forms/OccupancyForm";
import { useEstablishmentTypes } from "../hooks/use-establishment-types";
import { useSites } from "@/hooks/use-sites";
import type { Establishment } from "@shared/schema";
import { useResponsiveLayout } from "@/hooks/use-responsive-layout";
import { cn } from "@/lib/utils";
import { useCreateOccupancy } from "@/hooks/use-occupancies";

export default function Establishments() {
    const { toast } = useToast();
    const [, setLocation] = useLocation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [occupancyModalOpen, setOccupancyModalOpen] = useState(false);
    const [editingEst, setEditingEst] = useState<Establishment | null>(null);
    const [addingUnitToEst, setAddingUnitToEst] = useState<Establishment | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const { marginClass } = useResponsiveLayout();
    const createOccupancy = useCreateOccupancy();

    const { data: establishments, isLoading } = useQuery<Establishment[]>({
        queryKey: [api.establishments.list.path]
    });

    const filteredEstablishments = (establishments || []).filter((e: any) =>
        e.establishmentName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const { data: establishmentTypes } = useEstablishmentTypes();
    const { data: sites } = useSites();

    const getTypeName = (id: number) => (establishmentTypes as any[])?.find((t: any) => t.id === id)?.typeName || "Unknown";
    const getSiteName = (id: number) => sites?.find(s => s.id === id)?.siteName || "Unknown";

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            await fetch(buildUrl(api.establishments.delete.path, { id }), {
                method: "DELETE"
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [api.establishments.list.path] });
            toast({
                title: "Establishment Removed",
                description: "The record has been successfully deleted.",
            });
        }
    });

    const handleEdit = (est: Establishment) => {
        setEditingEst(est);
        setIsModalOpen(true);
    };

    const handleAddUnit = (est: Establishment) => {
        setAddingUnitToEst(est);
        setOccupancyModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm("Permanently delete this establishment?")) {
            deleteMutation.mutate(id);
        }
    };

    const onOccupancySubmit = (data: any) => {
        createOccupancy.mutate(data, {
            onSuccess: () => {
                toast({ title: "Unit Added", description: "The unit has been successfully added to the establishment." });
                setOccupancyModalOpen(false);
                setAddingUnitToEst(null);
            },
            onError: (err: any) => {
                toast({ title: "Error", description: err.message, variant: "destructive" });
            }
        });
    };

    const columns = [
        {
            header: "Establishment Name",
            accessorKey: "establishmentName" as const,
            cell: (item: any) => <span className="font-bold text-foreground">{item.establishmentName}</span>
        },
        {
            header: "Type",
            cell: (item: any) => (
                <div className="flex items-center gap-2">
                    <Tags className="w-4 h-4 text-primary/60" />
                    <span className="font-medium">{getTypeName(item.establishmentTypeId)}</span>
                </div>
            )
        },
        {
            header: "Site",
            cell: (item: any) => (
                <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary/60" />
                    <span className="font-medium">{getSiteName(item.siteId)}</span>
                </div>
            )
        },
        {
            header: "Occupancy",
            cell: (item: any) => (
                <Button
                    variant="outline"
                    size="sm"
                    className="h-9 gap-2 text-primary hover:bg-primary/10 border-primary/20"
                    onClick={() => setLocation(`/establishments/${item.id}/occupancies`)}
                >
                    <Users className="w-4 h-4" />
                    Manage Units
                </Button>
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
                        onClick={() => handleAddUnit(item)}
                        title="Add Unit"
                    >
                        <Home className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors rounded-xl"
                        onClick={() => handleEdit(item)}
                        title="Edit Establishment"
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors rounded-xl"
                        onClick={() => handleDelete(item.id)}
                        title="Delete Establishment"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            )
        },
    ];

    if (isLoading) {
        return (
            <div className="flex min-h-screen bg-background">
                <Sidebar />
                <main className={cn("flex-1 p-8 flex items-center justify-center transition-all duration-300", marginClass)}>
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-background font-sans">
            <Sidebar />
            <main className={cn("flex-1 p-8 transition-all duration-300 min-w-0 overflow-hidden", marginClass)}>
                <div className="flex flex-col gap-6 mb-8">
                    <PageHeader
                        title="Establishments"
                        description="Manage buildings and facilities linked to sites."
                        actionLabel="Register Establishment"
                        onAction={() => {
                            setEditingEst(null);
                            setIsModalOpen(true);
                        }}
                        breadcrumbs={["Establishments", "Facility Management"]}
                    />

                    <div className="flex items-center justify-between">
                        <div className="relative flex-1 max-w-md group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Search facilities..."
                                className="pl-10 h-11 bg-muted/40 border-border/60 rounded-xl focus:bg-background transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {!establishments?.length ? (
                    <EmptyState
                        icon={Building2}
                        title="No establishments found"
                        description="Get started by registering your first building or facility."
                        actionLabel="Register Now"
                        onAction={() => setIsModalOpen(true)}
                    />
                ) : (
                    <DataTable
                        data={filteredEstablishments}
                        columns={columns}
                        searchKey="establishmentName"
                        searchPlaceholder="Search facilities..."
                        hideSearch
                    />
                )}
            </main>

            <Dialog open={isModalOpen} onOpenChange={(open) => {
                setIsModalOpen(open);
                if (!open) setEditingEst(null);
            }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black tracking-tight">
                            {editingEst ? "Update Establishment" : "Register Facility"}
                        </DialogTitle>
                    </DialogHeader>
                    <EstablishmentForm
                        initialData={editingEst || undefined}
                        onSuccess={() => setIsModalOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            <Dialog open={occupancyModalOpen} onOpenChange={setOccupancyModalOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Add Unit to {addingUnitToEst?.establishmentName}</DialogTitle>
                    </DialogHeader>
                    {addingUnitToEst && (
                        <OccupancyForm
                            establishmentId={addingUnitToEst.id}
                            preselectedEstablishmentId={addingUnitToEst.id}
                            onSuccess={() => {}}
                            onSubmit={onOccupancySubmit}
                            isPending={createOccupancy.isPending}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
