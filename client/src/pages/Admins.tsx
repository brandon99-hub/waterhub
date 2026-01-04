import { useState } from "react";
import { useAdmins, useCreateAdmin, useUpdateAdmin, useDeleteAdmin } from "@/hooks/use-admins";
import { Sidebar } from "@/components/Sidebar";
import { PageHeader } from "@/components/PageHeader";
import { DataTable } from "@/components/DataTable";
import { EmptyState } from "@/components/EmptyState";
import { ShieldCheck, Pencil, Trash2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertAdminSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

function AdminForm({ initialData, onSuccess }: { initialData?: any, onSuccess: () => void }) {
  const createAdmin = useCreateAdmin();
  const updateAdmin = useUpdateAdmin();
  const { toast } = useToast();
  
  const form = useForm({
    resolver: zodResolver(insertAdminSchema),
    defaultValues: initialData || { name: "", email: "", address: "", phone: "" }
  });

  const onSubmit = (data: any) => {
    const mutation = initialData ? updateAdmin : createAdmin;
    const payload = initialData ? { id: initialData.id, ...data } : data;
    
    mutation.mutate(payload, {
      onSuccess: () => {
        toast({ title: `Admin ${initialData ? 'updated' : 'created'} successfully` });
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
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl><Input type="email" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-full" disabled={createAdmin.isPending || updateAdmin.isPending}>
          {createAdmin.isPending || updateAdmin.isPending ? "Saving..." : (initialData ? "Update Admin" : "Create Admin")}
        </Button>
      </form>
    </Form>
  );
}

export default function Admins() {
  const { data: admins, isLoading } = useAdmins();
  const deleteAdmin = useDeleteAdmin();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<any>(null);
  const { toast } = useToast();

  const handleEdit = (admin: any) => {
    setEditingAdmin(admin);
    setModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this admin?")) {
      deleteAdmin.mutate(id, {
        onSuccess: () => toast({ title: "Admin deleted" })
      });
    }
  };

  const handleCreate = () => {
    setEditingAdmin(null);
    setModalOpen(true);
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
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleEdit(item)}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(item.id)}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  ];

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1 ml-64 p-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background font-sans">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <PageHeader 
          title="Admins" 
          description="Manage system administrators and permissions."
          actionLabel="Add Admin"
          onAction={handleCreate}
        />

        {!admins?.length ? (
          <EmptyState 
            icon={ShieldCheck}
            title="No admins found"
            description="Get started by adding your first system administrator."
            actionLabel="Add Admin"
            onAction={handleCreate}
          />
        ) : (
          <DataTable 
            data={admins} 
            columns={columns} 
            searchKey="name" 
            searchPlaceholder="Search admins..."
          />
        )}
      </main>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingAdmin ? "Edit Admin" : "Add New Admin"}</DialogTitle>
          </DialogHeader>
          <AdminForm 
            initialData={editingAdmin} 
            onSuccess={() => setModalOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
