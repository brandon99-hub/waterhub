import { useCreateMeter, useUpdateMeter } from "@/hooks/use-meters";
import { useClients } from "@/hooks/use-clients";
import { useOperationModes } from "@/hooks/use-operation-modes";
import { useEstablishments } from "@/hooks/use-establishments";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertMeterSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Cpu, Network, User, Loader2, Info, Building2, Hash } from "lucide-react";
import { cn } from "@/lib/utils";

interface MeterFormProps {
    initialData?: any;
    onSuccess: () => void;
}

export function MeterForm({ initialData, onSuccess }: MeterFormProps) {
    const createMeter = useCreateMeter();
    const updateMeter = useUpdateMeter();
    const { data: clients } = useClients();
    const { data: modes } = useOperationModes();
    const { data: establishments } = useEstablishments();
    const { toast } = useToast();

    const form = useForm({
        resolver: zodResolver(insertMeterSchema),
        defaultValues: initialData || {
            serialNo: "", imeiNo: "", simcard: "", type: "", meterSize: "", technology: "",
            clientId: 0, operationModeId: 0, establishmentId: 0, occupancy: "",
            valveStatus: "open", latestReading: 0
        }
    });

    const isPending = createMeter.isPending || updateMeter.isPending;

    const onSubmit = (data: any) => {
        const payload = {
            ...data,
            clientId: Number(data.clientId),
            operationModeId: Number(data.operationModeId),
            establishmentId: data.establishmentId ? Number(data.establishmentId) : null,
            latestReading: Number(data.latestReading) || 0
        };

        if (initialData) {
            updateMeter.mutate({ id: initialData.id, ...payload }, {
                onSuccess: () => {
                    toast({ title: "Meter updated successfully" });
                    onSuccess();
                },
                onError: (err: any) => {
                    toast({ title: "Error", description: err.message, variant: "destructive" });
                }
            });
        } else {
            createMeter.mutate(payload, {
                onSuccess: () => {
                    toast({ title: "Meter created successfully" });
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
                <div className="space-y-8">
                    {/* Identity Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 pb-2 border-b border-border/40">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <Info className="w-4 h-4" />
                            </div>
                            <h3 className="text-sm font-bold text-primary/80 uppercase tracking-widest">Identity & Network</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <FormField control={form.control} name="serialNo" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[10px] font-bold text-muted-foreground uppercase">Serial No</FormLabel>
                                    <FormControl><Input placeholder="S/N..." className="h-12 bg-muted/40 border-border/60 focus:bg-background transition-all" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="imeiNo" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[10px] font-bold text-muted-foreground uppercase">IMEI</FormLabel>
                                    <FormControl><Input placeholder="IMEI..." className="h-12 bg-muted/40 border-border/60 focus:bg-background transition-all" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                    </div>

                    {/* Ownership Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 pb-2 border-b border-border/40">
                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                                <User className="w-4 h-4" />
                            </div>
                            <h3 className="text-sm font-bold text-primary/80 uppercase tracking-widest">Ownership & Mode</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <FormField control={form.control} name="clientId" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[10px] font-bold text-muted-foreground uppercase">Assigned Client</FormLabel>
                                    <Select onValueChange={(val) => field.onChange(Number(val))} defaultValue={field.value ? String(field.value) : undefined}>
                                        <FormControl><SelectTrigger className="h-12 bg-muted/40 border-border/60"><SelectValue placeholder="Select Client" /></SelectTrigger></FormControl>
                                        <SelectContent>{clients?.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}</SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="operationModeId" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[10px] font-bold text-muted-foreground uppercase">Operation Mode</FormLabel>
                                    <Select onValueChange={(val) => field.onChange(Number(val))} defaultValue={field.value ? String(field.value) : undefined}>
                                        <FormControl><SelectTrigger className="h-12 bg-muted/40 border-border/60"><SelectValue placeholder="Select Mode" /></SelectTrigger></FormControl>
                                        <SelectContent>{modes?.map(m => <SelectItem key={m.id} value={String(m.id)}>{m.modeName}</SelectItem>)}</SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="establishmentId" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[10px] font-bold text-muted-foreground uppercase">Establishment (Optional)</FormLabel>
                                    <Select onValueChange={(val) => field.onChange(Number(val))} defaultValue={field.value ? String(field.value) : undefined}>
                                        <FormControl><SelectTrigger className="h-12 bg-muted/40 border-border/60">
                                            <div className="flex items-center gap-2">
                                                <Building2 className="w-4 h-4 text-muted-foreground" />
                                                <SelectValue placeholder="Select Establishment" />
                                            </div>
                                        </SelectTrigger></FormControl>
                                        <SelectContent>{establishments?.map(e => <SelectItem key={e.id} value={String(e.id)}>{e.establishmentName}</SelectItem>)}</SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                        <FormField control={form.control} name="occupancy" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[10px] font-bold text-muted-foreground uppercase">Occupancy / Unit No.</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input placeholder="e.g. D4, C2, B3" className="pl-10 h-12 bg-muted/40 border-border/60 focus:bg-background transition-all" {...field} />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>

                    {/* Technical Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 pb-2 border-b border-border/40">
                            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                                <Cpu className="w-4 h-4" />
                            </div>
                            <h3 className="text-sm font-bold text-primary/80 uppercase tracking-widest">Technical Specs</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <FormField control={form.control} name="simcard" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[10px] font-bold text-muted-foreground uppercase">SIM Number</FormLabel>
                                    <FormControl><Input placeholder="+254..." className="h-12 bg-muted/40 border-border/60 focus:bg-background transition-all" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="type" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[10px] font-bold text-muted-foreground uppercase">Meter Type</FormLabel>
                                    <FormControl><Input placeholder="Ultrasonic/Mechanical" className="h-12 bg-muted/40 border-border/60 focus:bg-background transition-all" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <FormField control={form.control} name="meterSize" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[10px] font-bold text-muted-foreground uppercase">Pipe Size</FormLabel>
                                    <FormControl><Input placeholder="20mm/25mm..." className="h-12 bg-muted/40 border-border/60 focus:bg-background transition-all" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="technology" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[10px] font-bold text-muted-foreground uppercase">Connectivity</FormLabel>
                                    <FormControl><Input placeholder="LoRaWAN/NB-IoT" className="h-12 bg-muted/40 border-border/60 focus:bg-background transition-all" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                    </div>
                </div>

                <div className="sticky bottom-0 pt-6 bg-background/80 backdrop-blur-sm border-t border-border/40 -mx-8 px-8 pb-2">
                    <Button
                        type="submit"
                        className={cn(
                            "w-full h-14 text-lg font-bold shadow-xl rounded-2xl transition-all active:scale-[0.98]",
                            isPending ? "bg-primary/80 shadow-primary/10" : "shadow-primary/20 hover:scale-[1.01]"
                        )}
                        disabled={isPending}
                    >
                        {isPending ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Validating Data...
                            </span>
                        ) : (
                            initialData ? "Apply Meter Updates" : "Commission New Meter"
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
