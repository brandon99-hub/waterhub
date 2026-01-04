import { useState } from "react";
import { useAdmins, useCreateAdmin, useUpdateAdmin, useDeleteAdmin } from "@/hooks/use-admins";
import { Sidebar } from "@/components/Sidebar";
import { PageHeader } from "@/components/PageHeader";
import { DataTable } from "@/components/DataTable";
import { EmptyState } from "@/components/EmptyState";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertAdminSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Pencil, Trash2, MoreHorizontal, User, Mail, MapPin, Phone, Loader2, Info, Search, LayoutList, LayoutGrid } from "lucide-react";
import { GridView } from "@/components/GridView";
import { cn } from "@/lib/utils";
import { useResponsiveLayout } from "@/hooks/use-responsive-layout";
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

function AdminForm({ initialData, onSuccess }: { initialData?: any, onSuccess: () => void }) {
  const createAdmin = useCreateAdmin();
  const updateAdmin = useUpdateAdmin();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(insertAdminSchema),
    defaultValues: initialData || { name: "", email: "", address: "", phone: "" }
  });

  const isPending = createAdmin.isPending || updateAdmin.isPending;

  const onSubmit = (data: any) => {
    if (initialData) {
      updateAdmin.mutate({ id: initialData.id, ...data }, {
        onSuccess: () => {
          toast({ title: "Admin updated successfully" });
          onSuccess();
        },
        onError: (err: any) => {
          toast({ title: "Error", description: err.message, variant: "destructive" });
        }
      });
    } else {
      createAdmin.mutate(data, {
        onSuccess: () => {
          toast({ title: "Admin created successfully" });
          onSuccess();
        },
        onError: (err: any) => {
          toast({ title: "Error", description: err.message, variant: "destructive" });
        }
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b border-border/40">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Info className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-primary/80 uppercase tracking-widest">Admin Profile</h3>
            </div>

            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Full Name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="e.g. John Doe" className="pl-10 h-12 bg-muted/40 border-border/60 focus:bg-background transition-all" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Email Address</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input type="email" placeholder="john@example.com" className="pl-10 h-12 bg-muted/40 border-border/60 focus:bg-background transition-all" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b border-border/40">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                <MapPin className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-primary/80 uppercase tracking-widest">Access Info</h3>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <FormField control={form.control} name="address" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Station/Office</FormLabel>
                  <FormControl><Input placeholder="Station Location" className="h-12 bg-muted/40 border-border/60 focus:bg-background transition-all" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Contact Phone</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input placeholder="+254..." className="pl-10 h-12 bg-muted/40 border-border/60 focus:bg-background transition-all" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          </div>
        </div>

        <div className="pt-4 mt-8">
          <Button
            type="submit"
            className={cn(
              "w-full h-14 text-lg font-bold shadow-xl rounded-2xl transition-all active:scale-[0.98]",
              isPending ? "bg-primary/80 shadow-primary/10 cursor-not-allowed" : "shadow-primary/20 hover:scale-[1.01]"
            )}
            disabled={isPending}
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Synchronizing Admin...
              </span>
            ) : (
              initialData ? "Apply Admin Updates" : "Grant Admin Access"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default function Admins() {
  const { data: admins, isLoading } = useAdmins();
  const deleteAdmin = useDeleteAdmin();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const { toast } = useToast();
  const { marginClass } = useResponsiveLayout();

  const filteredAdmins = (admins || []).filter((a: any) =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (admin: any) => {
    setEditingAdmin(admin);
    setModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Permanently delete this administrator? This action cannot be undone.")) {
      deleteAdmin.mutate(id, {
        onSuccess: () => {
          toast({
            title: "Access Revoked",
            description: "The administrator has been removed from the system.",
          });
        }
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
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors rounded-xl"
            onClick={() => handleEdit(item)}
            title="Edit Admin"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors rounded-xl"
            onClick={() => handleDelete(item.id)}
            title="Delete Admin"
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
            title="Admins"
            description="Manage system administrators and permissions."
            actionLabel="Add Admin"
            onAction={handleCreate}
            breadcrumbs={["Administration", "System Access"]}
          />

          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-md group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search admins..."
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

        {!admins?.length ? (
          <EmptyState
            icon={ShieldCheck}
            title="No admins found"
            description="Get started by adding your first system administrator."
            actionLabel="Add Admin"
            onAction={handleCreate}
          />
        ) : viewMode === "table" ? (
          <DataTable
            data={filteredAdmins}
            columns={columns}
            searchKey="name"
            searchPlaceholder="Search admins..."
            hideSearch
          />
        ) : (
          <GridView
            data={filteredAdmins}
            type="admin"
            searchKey="name"
            onEdit={handleEdit}
            onDelete={handleDelete}
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
