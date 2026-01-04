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
import { Key, Pencil, Trash2, ShieldCheck, Lock, CreditCard, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { MpesaKeyForm } from "@/components/forms/MpesaKeyForm";
import type { MpesaKey } from "@shared/schema";
import { useResponsiveLayout } from "@/hooks/use-responsive-layout";
import { cn } from "@/lib/utils";

export default function MpesaKeys() {
    const { toast } = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingKey, setEditingKey] = useState<MpesaKey | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const { marginClass } = useResponsiveLayout();

    const { data: keys, isLoading } = useQuery<MpesaKey[]>({
        queryKey: [api.mpesaKeys.list.path]
    });

    const filteredKeys = (keys || []).filter((k: any) =>
        k.shortCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        k.accountType?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            await fetch(buildUrl(api.mpesaKeys.delete.path, { id }), {
                method: "DELETE"
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [api.mpesaKeys.list.path] });
            toast({
                title: "Integration Severed",
                description: "The M-PESA keys have been removed from the system.",
            });
        }
    });

    const handleEdit = (key: MpesaKey) => {
        setEditingKey(key);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm("Permanently delete these integration keys?")) {
            deleteMutation.mutate(id);
        }
    };

    const columns = [
        {
            header: "Account Type",
            accessorKey: "accountType" as const,
            cell: (item: any) => (
                <Badge variant="outline" className="font-bold border-primary/30 text-primary">
                    <CreditCard className="w-3 h-3 mr-1.5" />
                    {item.accountType}
                </Badge>
            )
        },
        {
            header: "ShortCode / Till",
            accessorKey: "shortCode" as const,
            cell: (item: any) => <span className="font-mono font-bold text-foreground tracking-widest">{item.shortCode}</span>
        },
        {
            header: "Consumer Key",
            accessorKey: "consumerKey" as const,
            cell: (item: any) => (
                <div className="flex items-center gap-2 max-w-[150px]">
                    <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="truncate text-muted-foreground text-xs font-mono">{item.consumerKey}</span>
                </div>
            )
        },
        {
            header: "Status",
            cell: () => (
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <span className="text-[11px] font-black uppercase tracking-tighter text-emerald-600/80">Active Bridge</span>
                </div>
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
                        title="Edit Keys"
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors rounded-xl"
                        onClick={() => handleDelete(item.id)}
                        title="Delete Keys"
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
                        title="M-PESA Keys"
                        description="Configure Daraja API credentials for automated payments."
                        actionLabel="Add Integration"
                        onAction={() => {
                            setEditingKey(null);
                            setIsModalOpen(true);
                        }}
                        breadcrumbs={["Settings", "Payment Gateway"]}
                    />

                    <div className="flex items-center justify-between">
                        <div className="relative flex-1 max-w-md group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Search shortcodes or account types..."
                                className="pl-10 h-11 bg-muted/40 border-border/60 rounded-xl focus:bg-background transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {!keys?.length ? (
                    <EmptyState
                        icon={ShieldCheck}
                        title="No integrations active"
                        description="Securely link your M-PESA Till or Paybill number to enable automation."
                        actionLabel="Start Integration"
                        onAction={() => setIsModalOpen(true)}
                    />
                ) : (
                    <DataTable
                        data={filteredKeys}
                        columns={columns}
                        searchKey="shortCode"
                        searchPlaceholder="Search shortcodes..."
                        hideSearch
                    />
                )}
            </main>

            <Dialog open={isModalOpen} onOpenChange={(open) => {
                setIsModalOpen(open);
                if (!open) setEditingKey(null);
            }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black tracking-tight">
                            {editingKey ? "Update Gateways" : "Register Integration"}
                        </DialogTitle>
                    </DialogHeader>
                    <MpesaKeyForm
                        initialData={editingKey || undefined}
                        onSuccess={() => setIsModalOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
