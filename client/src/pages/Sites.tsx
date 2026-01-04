import { useState } from "react";
import { useSites, useCreateSite, useUpdateSite, useDeleteSite } from "@/hooks/use-sites";
import { useClients } from "@/hooks/use-clients";
import { Sidebar } from "@/components/Sidebar";
import { PageHeader } from "@/components/PageHeader";
import { DataTable } from "@/components/DataTable";
import { EmptyState } from "@/components/EmptyState";
import { MapPin, Pencil, Trash2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertSiteSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

function SiteForm({ initialData, onSuccess }: { initialData?: any, onSuccess: () => void }) {
  const createSite = useCreateSite();
  const updateSite = useUpdateSite();
  const { data: clients } = useClients();
  const { toast } = useToast();
  
  const form = useForm({
    resolver: zodResolver(insertSiteSchema),
    defaultValues: initialData || { siteName: "", clientId: 0 }
  });

  const onSubmit = (data: any) => {
    const mutation = initialData ? updateSite : createSite;
    // Zod coercion is handled by the schema in routes usually, but let's be safe
    const payload = initialData ? { id: initialData.id, ...data } : data;
    payload.clientId = Number(payload.clientId);

    mutation.mutate(payload, {
      onSuccess: () => {
        toast({ title: `Site ${initialData ? 'updated' : 'created'} successfully` });
        onSuccess();
      },
      onError: (err) => toast({ title: "Error", description: err.message, variant: "destructive" })
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="siteName" render={({ field }) => (
          <FormItem><FormLabel>Site Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="clientId" render={({ field }) => (
          <FormItem>
            <FormLabel>Client</FormLabel>
            <Select onValueChange={(val) => field.onChange(Number(val))} defaultValue={field.value ? String(field.value) : undefined}>
              <FormControl><SelectTrigger><SelectValue placeholder="Select a client" /></SelectTrigger></FormControl>
              <SelectContent>
                {clients?.map((client) => (
                  <SelectItem key={client.id} value={String(client.id)}>{client.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />
        <Button type="submit" className="w-full" disabled={createSite.isPending || updateSite.isPending}>
          {createSite.isPending || updateSite.isPending ? "Saving..." : (initialData ? "Update Site" : "Create Site")}
        </Button>
      </form>
    </Form>
  );
}

export default function Sites() {
  const { data: sites, isLoading } = useSites();
  const { data: clients } = useClients();
  const deleteSite = useDeleteSite();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSite, setEditingSite] = useState<any>(null);
  const { toast } = useToast();

  const handleEdit = (site: any) => { setEditingSite(site); setModalOpen(true); };
  const handleDelete = (id: number) => {
    if (confirm("Delete this site?")) deleteSite.mutate(id, { onSuccess: () => toast({ title: "Site deleted" }) });
  };

  const getClientName = (id: number) => clients?.find(c => c.id === id)?.name || "Unknown";

  const columns = [
    { header: "Site Name", accessorKey: "siteName" as const, cell: (item: any) => <span className="font-medium">{item.siteName}</span> },
    { header: "Client", accessorKey: "clientId" as const, cell: (item: any) => getClientName(item.clientId) },
    { 
      header: "Actions", 
      cell: (item: any) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleEdit(item)}><Pencil className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(item.id)}><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  ];

  if (isLoading) return <div className="flex h-screen items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;

  return (
    <div className="flex min-h-screen bg-background font-sans">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <PageHeader title="Sites" description="Manage installation sites." actionLabel="Add Site" onAction={() => { setEditingSite(null); setModalOpen(true); }} />
        {!sites?.length ? (
          <EmptyState icon={MapPin} title="No sites found" description="Create a site to assign meters." actionLabel="Add Site" onAction={() => { setEditingSite(null); setModalOpen(true); }} />
        ) : (
          <DataTable data={sites} columns={columns} searchKey="siteName" searchPlaceholder="Search sites..." />
        )}
      </main>
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent><DialogHeader><DialogTitle>{editingSite ? "Edit Site" : "Add New Site"}</DialogTitle></DialogHeader><SiteForm initialData={editingSite} onSuccess={() => setModalOpen(false)} /></DialogContent>
      </Dialog>
    </div>
  );
}
