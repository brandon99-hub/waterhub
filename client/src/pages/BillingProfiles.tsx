import { useQuery, useMutation } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { queryClient } from "@/lib/queryClient";
import { Sidebar } from "@/components/Sidebar";
import { PageHeader } from "@/components/PageHeader";
import { DataTable } from "@/components/DataTable";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Wallet, Pencil, Trash2, Droplets, Zap, User, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { BillingProfileForm } from "@/components/forms/BillingProfileForm";
import { useClients } from "@/hooks/use-clients";
import type { BillingProfile } from "@shared/schema";
import { useResponsiveLayout } from "@/hooks/use-responsive-layout";
import { cn } from "@/lib/utils";

export default function BillingProfiles() {
    const { toast } = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProfile, setEditingProfile] = useState<BillingProfile | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const { marginClass } = useResponsiveLayout();
    const { data: clients } = useClients();

    const getClientName = (id: number) => clients?.find(c => c.id === id)?.name || `Client #${id}`;

    const { data: profiles, isLoading } = useQuery<BillingProfile[]>({
        queryKey: [api.billingProfiles.list.path]
    });

    const filteredProfiles = (profiles || []).filter((p: any) =>
        p.tariff?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getClientName(p.clientId).toLowerCase().includes(searchTerm.toLowerCase())
    );

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            await fetch(buildUrl(api.billingProfiles.delete.path, { id }), {
                method: "DELETE"
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [api.billingProfiles.list.path] });
            toast({
                title: "Profile Deactivated",
                description: "The billing profile has been removed.",
            });
        }
    });

    const handleEdit = (profile: BillingProfile) => {
        setEditingProfile(profile);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm("Permanently deactivate this billing profile?")) {
            deleteMutation.mutate(id);
        }
    };

    const columns = [
        {
            header: "Client ID",
            accessorKey: "clientId" as const,
            cell: (item: any) => (
                <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-primary/60" />
                    <span className="font-bold">{getClientName(item.clientId)}</span>
                </div>
            )
        },
        {
            header: "Tariff",
            accessorKey: "tariff" as const,
            cell: (item: any) => (
                <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/20 font-bold px-3 py-1">
                    <Zap className="w-3 h-3 mr-1.5" />
                    {item.tariff}
                </Badge>
            )
        },
        {
            header: "Rate (KES)",
            accessorKey: "rateKes" as const,
            cell: (item: any) => (
                <div className="flex flex-col">
                    <span className="font-mono font-bold text-foreground">
                        KES {parseFloat(item.rateKes).toFixed(2)}
                    </span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-tighter font-semibold">
                        Per {item.rateLitres}L
                    </span>
                </div>
            )
        },
        {
            header: "Base Rate",
            accessorKey: "baseRate" as const,
            cell: (item: any) => (
                <span className="text-xs font-medium text-muted-foreground">
                    KES {parseFloat(item.baseRate || "0").toFixed(2)}
                </span>
            )
        },
        {
            header: "Sewer & Svc",
            cell: (item: any) => (
                <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                        Sewer: {item.sewerCharge}%
                    </span>
                    <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                        Svc: KES {parseFloat(item.serviceFee || "0").toFixed(2)}
                    </span>
                </div>
            )
        },
        {
            header: "Quota",
            accessorKey: "quota" as const,
            cell: (item: any) => (
                <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                    <Droplets className="w-4 h-4 text-blue-500/60" />
                    {item.quota.toLocaleString()} L
                </div>
            )
        },
        {
            header: "Status",
            accessorKey: "status" as const,
            cell: (item: any) => (
                <Badge variant={item.status === "active" ? "default" : "secondary"} className="text-[10px] px-1.5 py-0">
                    {item.status}
                </Badge>
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
                        title="Edit Profile"
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors rounded-xl"
                        onClick={() => handleDelete(item.id)}
                        title="Delete Profile"
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
                        title="Billing Profiles"
                        description="Manage financial tariffs and consumption quotas."
                        actionLabel="Add Profile"
                        onAction={() => {
                            setEditingProfile(null);
                            setIsModalOpen(true);
                        }}
                        breadcrumbs={["Finance", "Revenue Rules"]}
                    />

                    <div className="flex items-center justify-between">
                        <div className="relative flex-1 max-w-md group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Search tariffs or clients..."
                                className="pl-10 h-11 bg-muted/40 border-border/60 rounded-xl focus:bg-background transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {!profiles?.length ? (
                    <EmptyState
                        icon={Wallet}
                        title="No billing profiles"
                        description="Define your first tariff and quota rules for clients."
                        actionLabel="Create Profile"
                        onAction={() => setIsModalOpen(true)}
                    />
                ) : (
                    <DataTable
                        data={filteredProfiles}
                        columns={columns}
                        searchKey="tariff"
                        searchPlaceholder="Filter tariffs..."
                        hideSearch
                    />
                )}
            </main>

            <Dialog open={isModalOpen} onOpenChange={(open) => {
                setIsModalOpen(open);
                if (!open) setEditingProfile(null);
            }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black tracking-tight">
                            {editingProfile ? "Modify Billing Rules" : "Active New Profile"}
                        </DialogTitle>
                    </DialogHeader>
                    <BillingProfileForm
                        initialData={editingProfile || undefined}
                        onSuccess={() => setIsModalOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
