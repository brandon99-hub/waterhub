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
import { Building2, Pencil, Trash2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { EstablishmentTypeForm } from "@/components/forms/EstablishmentTypeForm";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import type { EstablishmentType } from "@shared/schema";
import { useResponsiveLayout } from "@/hooks/use-responsive-layout";
import { cn } from "@/lib/utils";

export default function EstablishmentTypes() {
    const { toast } = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingType, setEditingType] = useState<EstablishmentType | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const { marginClass } = useResponsiveLayout();

    const { data: types, isLoading } = useQuery<EstablishmentType[]>({
        queryKey: [api.establishmentTypes.list.path]
    });

    const filteredTypes = (types || []).filter((t: any) =>
        t.typeName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            await fetch(buildUrl(api.establishmentTypes.delete.path, { id }), {
                method: "DELETE"
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [api.establishmentTypes.list.path] });
            toast({
                title: "Category Removed",
                description: "The establishment type has been successfully deleted.",
            });
        }
    });

    const handleEdit = (type: EstablishmentType) => {
        setEditingType(type);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        deleteMutation.mutate(id);
        setDeleteId(null);
    };

    const columns = [
        {
            header: "Category Name",
            accessorKey: "typeName" as const,
            cell: (item: any) => <span className="font-bold text-foreground">{item.typeName}</span>
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
                        title="Edit Type"
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors rounded-xl"
                        onClick={() => setDeleteId(item.id)}
                        title="Delete Type"
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
                        title="Establishment Types"
                        description="Define categorization for different sites and buildings."
                        actionLabel="Define New Type"
                        onAction={() => {
                            setEditingType(null);
                            setIsModalOpen(true);
                        }}
                        breadcrumbs={["Establishments", "Types & Categories"]}
                    />

                    <div className="flex items-center justify-between">
                        <div className="relative flex-1 max-w-md group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Search categories..."
                                className="pl-10 h-11 bg-muted/40 border-border/60 rounded-xl focus:bg-background transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {!types?.length ? (
                    <EmptyState
                        icon={Building2}
                        title="No types defined"
                        description="Start by creating establishment categories like Residential or Commercial."
                        actionLabel="Define Type"
                        onAction={() => setIsModalOpen(true)}
                    />
                ) : (
                    <DataTable
                        data={filteredTypes}
                        columns={columns}
                        searchKey="typeName"
                        searchPlaceholder="Filter categories..."
                        hideSearch
                    />
                )}
            </main>

            <Dialog open={isModalOpen} onOpenChange={(open) => {
                setIsModalOpen(open);
                if (!open) setEditingType(null);
            }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black tracking-tight">
                            {editingType ? "Update Category" : "Define New Category"}
                        </DialogTitle>
                    </DialogHeader>
                    <EstablishmentTypeForm
                        initialData={editingType || undefined}
                        onSuccess={() => setIsModalOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            <DeleteConfirmDialog
                open={deleteId !== null}
                onConfirm={() => handleDelete(deleteId!)}
                onCancel={() => setDeleteId(null)}
                title="Delete Establishment Type?"
                description="This will permanently remove this category. Establishments using this type may be affected."
            />
        </div>
    );
}
