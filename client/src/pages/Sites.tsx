import { useState } from "react";
import { useSites, useDeleteSite } from "@/hooks/use-sites";
import { useClients } from "@/hooks/use-clients";
import { Sidebar } from "@/components/Sidebar";
import { PageHeader } from "@/components/PageHeader";
import { DataTable } from "@/components/DataTable";
import { EmptyState } from "@/components/EmptyState";
import { MapPin, Pencil, Trash2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { SiteForm } from "@/components/forms/SiteForm";
import { useResponsiveLayout } from "@/hooks/use-responsive-layout";
import { cn } from "@/lib/utils";

export default function Sites() {
  const { data: sites, isLoading } = useSites();
  const { data: clients } = useClients();
  const deleteSite = useDeleteSite();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSite, setEditingSite] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const { marginClass } = useResponsiveLayout();

  const filteredSites = (sites || []).filter((s: any) =>
    s.siteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getClientName(s.clientId).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (site: any) => { setEditingSite(site); setModalOpen(true); };
  const handleDelete = (id: number) => {
    if (confirm("Delete this site?")) deleteSite.mutate(id, { onSuccess: () => toast({ title: "Site deleted" }) });
  };

  const getClientName = (id: number) => clients?.find(c => c.id === id)?.name || "Unknown";

  const columns = [
    { header: "Site Name", accessorKey: "siteName" as const, cell: (item: any) => <span className="font-medium">{item.siteName}</span> },
    {
      header: "Location",
      cell: (item: any) => (
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">
            {item.location || "No location set"}
          </span>
        </div>
      )
    },
    { header: "Client", accessorKey: "clientId" as const, cell: (item: any) => getClientName(item.clientId) },
    {
      header: "Actions",
      cell: (item: any) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors rounded-xl"
            onClick={() => handleEdit(item)}
            title="Edit Site"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors rounded-xl"
            onClick={() => handleDelete(item.id)}
            title="Delete Site"
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
            title="Sites"
            description="Manage installation sites."
            actionLabel="Add Site"
            onAction={() => { setEditingSite(null); setModalOpen(true); }}
            breadcrumbs={["Infrastructure", "Site Distribution"]}
          />

          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-md group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search sites..."
                className="pl-10 h-11 bg-muted/40 border-border/60 rounded-xl focus:bg-background transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        {!sites?.length ? (
          <EmptyState icon={MapPin} title="No sites found" description="Create a site to assign meters." actionLabel="Add Site" onAction={() => { setEditingSite(null); setModalOpen(true); }} />
        ) : (
          <DataTable data={filteredSites} columns={columns} searchKey="siteName" searchPlaceholder="Search sites..." hideSearch />
        )}
      </main>
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent><DialogHeader><DialogTitle>{editingSite ? "Edit Site" : "Add New Site"}</DialogTitle></DialogHeader><SiteForm initialData={editingSite} onSuccess={() => setModalOpen(false)} /></DialogContent>
      </Dialog>
    </div>
  );
}
