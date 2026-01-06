// Similar pattern to Admins but with Client hooks and schema
import { useState } from "react";
import { useClients, useDeleteClient } from "@/hooks/use-clients";
import { Sidebar } from "@/components/Sidebar";
import { PageHeader } from "@/components/PageHeader";
import { DataTable } from "@/components/DataTable";
import { GridView } from "@/components/GridView";
import { EmptyState } from "@/components/EmptyState";
import { Users, Pencil, Trash2, LayoutList, LayoutGrid, Search, MapPinPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { useToast } from "@/hooks/use-toast";
import { ClientForm } from "@/components/forms/ClientForm";
import { SiteForm } from "@/components/forms/SiteForm";
import { useResponsiveLayout } from "@/hooks/use-responsive-layout";
import { cn } from "@/lib/utils";

export default function Clients() {
  const { data: clients, isLoading } = useClients();
  const deleteClient = useDeleteClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [siteModalOpen, setSiteModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);
  const [addingSiteToClient, setAddingSiteToClient] = useState<any>(null);
  const [clientToDelete, setClientToDelete] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const { marginClass } = useResponsiveLayout();

  const filteredClients = (clients || []).filter((c: any) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (client: any) => {
    setEditingClient(client);
    setModalOpen(true);
  };

  const handleAddSite = (client: any) => {
    setAddingSiteToClient(client);
    setSiteModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setClientToDelete(id);
  };

  const confirmDelete = () => {
    if (clientToDelete) {
      deleteClient.mutate(clientToDelete, {
        onSuccess: () => {
          toast({ title: "Client deleted" });
          setClientToDelete(null);
        },
      });
    }
  };

  const columns = [
    { header: "Name", accessorKey: "name" as const, cell: (item: any) => <span className="font-medium">{item.name}</span> },
    { header: "Email", accessorKey: "email" as const },
    { header: "Phone", accessorKey: "phone" as const },
    { header: "Business Address", accessorKey: "businessAddress" as const, cell: (item: any) => item.businessAddress || <span className="text-muted-foreground italic text-sm">-</span> },
    {
      header: "Actions",
      cell: (item: any) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors rounded-xl"
            onClick={() => handleAddSite(item)}
            title="Add Site"
            aria-label={`Add site for ${item.name}`}
          >
            <MapPinPlus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors rounded-xl"
            onClick={() => handleEdit(item)}
            title="Edit Client"
            aria-label={`Edit ${item.name}`}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors rounded-xl"
            onClick={() => handleDelete(item.id)}
            title="Delete Client"
            aria-label={`Delete ${item.name}`}
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
        <div className="flex flex-col gap-6 mb-8">
          <PageHeader
            title="Clients"
            description="Manage your customer database."
            actionLabel="Add Client"
            onAction={() => { setEditingClient(null); setModalOpen(true); }}
            breadcrumbs={["Operations", "Client Database"]}
          />

          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-md group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search clients..."
                aria-label="Search clients"
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
        </div>
        {!clients?.length ? (
          <EmptyState icon={Users} title="No clients found" description="Add your first client to get started." actionLabel="Add Client" onAction={() => { setEditingClient(null); setModalOpen(true); }} />
        ) : viewMode === "table" ? (
          <DataTable data={filteredClients} columns={columns} searchKey="name" searchPlaceholder="Search clients..." hideSearch />
        ) : (
          <GridView
            data={filteredClients}
            type="client"
            searchKey="name"
            searchPlaceholder="Search clients..."
            onEdit={handleEdit}
            onDelete={handleDelete}
            extraActions={(item: any) => (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/5"
                onClick={() => handleAddSite(item)}
                title="Add Site"
                aria-label={`Add site for ${item.name}`}
              >
                <MapPinPlus className="h-4 w-4" />
              </Button>
            )}
          />
        )}
      </main>

      <DeleteConfirmDialog
        open={!!clientToDelete}
        onConfirm={confirmDelete}
        onCancel={() => setClientToDelete(null)}
        title="Delete Client"
        description="Are you sure? This will delete the client and related data. This action cannot be undone."
      />

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingClient ? "Edit Client" : "Add New Client"}</DialogTitle>
          </DialogHeader>
          <ClientForm initialData={editingClient} onSuccess={() => setModalOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={siteModalOpen} onOpenChange={setSiteModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Site for {addingSiteToClient?.name}</DialogTitle>
          </DialogHeader>
          <SiteForm
            preselectedClientId={addingSiteToClient?.id}
            onSuccess={() => {
              setSiteModalOpen(false);
              setAddingSiteToClient(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
