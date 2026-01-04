// Similar pattern to Admins but with Client hooks and schema
import { useState } from "react";
import { useClients, useCreateClient, useUpdateClient, useDeleteClient } from "@/hooks/use-clients";
import { Sidebar } from "@/components/Sidebar";
import { PageHeader } from "@/components/PageHeader";
import { DataTable } from "@/components/DataTable";
import { EmptyState } from "@/components/EmptyState";
import { Users, Pencil, Trash2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertClientSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

function ClientForm({ initialData, onSuccess }: { initialData?: any, onSuccess: () => void }) {
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();
  const { toast } = useToast();
  
  const form = useForm({
    resolver: zodResolver(insertClientSchema),
    defaultValues: initialData || { name: "", email: "", address: "", phone: "" }
  });

  const onSubmit = (data: any) => {
    const mutation = initialData ? updateClient : createClient;
    const payload = initialData ? { id: initialData.id, ...data } : data;
    
    mutation.mutate(payload, {
      onSuccess: () => {
        toast({ title: `Client ${initialData ? 'updated' : 'created'} successfully` });
        onSuccess();
      },
      onError: (err) => {
        toast({ title: "Error", description: err.message, variant: "destructive" });
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="email" render={({ field }) => (
          <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="address" render={({ field }) => (
            <FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="phone" render={({ field }) => (
            <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <Button type="submit" className="w-full" disabled={createClient.isPending || updateClient.isPending}>
          {createClient.isPending || updateClient.isPending ? "Saving..." : (initialData ? "Update Client" : "Create Client")}
        </Button>
      </form>
    </Form>
  );
}

export default function Clients() {
  const { data: clients, isLoading } = useClients();
  const deleteClient = useDeleteClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);
  const { toast } = useToast();

  const handleEdit = (client: any) => {
    setEditingClient(client);
    setModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure? This will delete the client and related data.")) {
      deleteClient.mutate(id, { onSuccess: () => toast({ title: "Client deleted" }) });
    }
  };

  const columns = [
    { header: "Name", accessorKey: "name" as const, cell: (item: any) => <span className="font-medium">{item.name}</span> },
    { header: "Email", accessorKey: "email" as const },
    { header: "Phone", accessorKey: "phone" as const },
    { header: "Address", accessorKey: "address" as const },
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
        <PageHeader title="Clients" description="Manage your customer database." actionLabel="Add Client" onAction={() => { setEditingClient(null); setModalOpen(true); }} />
        {!clients?.length ? (
          <EmptyState icon={Users} title="No clients found" description="Add your first client to get started." actionLabel="Add Client" onAction={() => { setEditingClient(null); setModalOpen(true); }} />
        ) : (
          <DataTable data={clients} columns={columns} searchKey="name" searchPlaceholder="Search clients..." />
        )}
      </main>
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent><DialogHeader><DialogTitle>{editingClient ? "Edit Client" : "Add New Client"}</DialogTitle></DialogHeader><ClientForm initialData={editingClient} onSuccess={() => setModalOpen(false)} /></DialogContent>
      </Dialog>
    </div>
  );
}
