import { useState } from "react";
import { useMeters, useCreateMeter, useUpdateMeter, useDeleteMeter } from "@/hooks/use-meters";
import { useClients } from "@/hooks/use-clients";
import { useOperationModes } from "@/hooks/use-operation-modes";
import { Sidebar } from "@/components/Sidebar";
import { PageHeader } from "@/components/PageHeader";
import { DataTable } from "@/components/DataTable";
import { EmptyState } from "@/components/EmptyState";
import { Gauge, Pencil, Trash2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertMeterSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

function MeterForm({ initialData, onSuccess }: { initialData?: any, onSuccess: () => void }) {
  const createMeter = useCreateMeter();
  const updateMeter = useUpdateMeter();
  const { data: clients } = useClients();
  const { data: modes } = useOperationModes();
  const { toast } = useToast();
  
  const form = useForm({
    resolver: zodResolver(insertMeterSchema),
    defaultValues: initialData || { 
      serialNo: "", imeiNo: "", simcard: "", type: "", meterSize: "", technology: "",
      clientId: 0, operationModeId: 0
    }
  });

  const onSubmit = (data: any) => {
    const mutation = initialData ? updateMeter : createMeter;
    const payload = initialData ? { id: initialData.id, ...data } : data;
    payload.clientId = Number(payload.clientId);
    payload.operationModeId = Number(payload.operationModeId);

    mutation.mutate(payload, {
      onSuccess: () => {
        toast({ title: `Meter ${initialData ? 'updated' : 'created'} successfully` });
        onSuccess();
      },
      onError: (err) => toast({ title: "Error", description: err.message, variant: "destructive" })
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="serialNo" render={({ field }) => (
            <FormItem><FormLabel>Serial No</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="imeiNo" render={({ field }) => (
            <FormItem><FormLabel>IMEI</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="clientId" render={({ field }) => (
            <FormItem>
              <FormLabel>Client</FormLabel>
              <Select onValueChange={(val) => field.onChange(Number(val))} defaultValue={field.value ? String(field.value) : undefined}>
                <FormControl><SelectTrigger><SelectValue placeholder="Select Client" /></SelectTrigger></FormControl>
                <SelectContent>{clients?.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="operationModeId" render={({ field }) => (
            <FormItem>
              <FormLabel>Operation Mode</FormLabel>
              <Select onValueChange={(val) => field.onChange(Number(val))} defaultValue={field.value ? String(field.value) : undefined}>
                <FormControl><SelectTrigger><SelectValue placeholder="Select Mode" /></SelectTrigger></FormControl>
                <SelectContent>{modes?.map(m => <SelectItem key={m.id} value={String(m.id)}>{m.modeName}</SelectItem>)}</SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="simcard" render={({ field }) => (
            <FormItem><FormLabel>Simcard</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="type" render={({ field }) => (
            <FormItem><FormLabel>Type</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="meterSize" render={({ field }) => (
            <FormItem><FormLabel>Size</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="technology" render={({ field }) => (
            <FormItem><FormLabel>Technology</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>

        <Button type="submit" className="w-full" disabled={createMeter.isPending || updateMeter.isPending}>
          {createMeter.isPending || updateMeter.isPending ? "Saving..." : (initialData ? "Update Meter" : "Create Meter")}
        </Button>
      </form>
    </Form>
  );
}

export default function Meters() {
  const { data: meters, isLoading } = useMeters();
  const { data: clients } = useClients();
  const { data: modes } = useOperationModes();
  const deleteMeter = useDeleteMeter();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMeter, setEditingMeter] = useState<any>(null);
  const { toast } = useToast();

  const handleEdit = (meter: any) => { setEditingMeter(meter); setModalOpen(true); };
  const handleDelete = (id: number) => {
    if (confirm("Delete this meter?")) deleteMeter.mutate(id, { onSuccess: () => toast({ title: "Meter deleted" }) });
  };

  const getClientName = (id: number) => clients?.find(c => c.id === id)?.name || "Unknown";
  const getModeName = (id: number) => modes?.find(m => m.id === id)?.modeName || "Unknown";

  const columns = [
    { header: "Serial No", accessorKey: "serialNo" as const, cell: (item: any) => <span className="font-medium font-mono text-xs bg-secondary px-2 py-1 rounded">{item.serialNo}</span> },
    { header: "Client", accessorKey: "clientId" as const, cell: (item: any) => getClientName(item.clientId) },
    { header: "Mode", accessorKey: "operationModeId" as const, cell: (item: any) => <span className="text-xs font-semibold px-2 py-1 bg-primary/10 text-primary rounded-full">{getModeName(item.operationModeId)}</span> },
    { header: "Size", accessorKey: "meterSize" as const },
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
        <PageHeader title="Meters" description="Manage deployed meters and assignments." actionLabel="Add Meter" onAction={() => { setEditingMeter(null); setModalOpen(true); }} />
        {!meters?.length ? (
          <EmptyState icon={Gauge} title="No meters found" description="Register your first meter." actionLabel="Add Meter" onAction={() => { setEditingMeter(null); setModalOpen(true); }} />
        ) : (
          <DataTable data={meters} columns={columns} searchKey="serialNo" searchPlaceholder="Search serial..." />
        )}
      </main>
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent><DialogHeader><DialogTitle>{editingMeter ? "Edit Meter" : "Add New Meter"}</DialogTitle></DialogHeader><MeterForm initialData={editingMeter} onSuccess={() => setModalOpen(false)} /></DialogContent>
      </Dialog>
    </div>
  );
}
