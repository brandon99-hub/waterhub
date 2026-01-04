import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Home, User, Mail, Phone, Loader2, Gauge, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMeters } from "@/hooks/use-meters";

const occupancySchema = z.object({
    establishmentId: z.number(),
    unitNumber: z.string().min(1, "Unit number is required"),
    customerName: z.string().optional(),
    customerPhone: z.string().optional(),
    customerEmail: z.string().email().optional().or(z.literal("")),
    meterId: z.number().optional(),
    status: z.enum(["occupied", "vacant"]),
});

interface OccupancyFormProps {
    establishmentId: number;
    initialData?: any;
    onSuccess: () => void;
    onSubmit: (data: any) => void;
    isPending: boolean;
}

export function OccupancyForm({ establishmentId, initialData, onSuccess, onSubmit, isPending }: OccupancyFormProps) {
    const { data: meters } = useMeters();
    const { toast } = useToast();

    const form = useForm({
        resolver: zodResolver(occupancySchema),
        defaultValues: initialData || {
            establishmentId,
            unitNumber: "",
            customerName: "",
            customerPhone: "",
            customerEmail: "",
            meterId: undefined,
            status: "vacant"
        }
    });

    const handleSubmit = (data: any) => {
        const payload = {
            ...data,
            establishmentId,
            meterId: data.meterId ? Number(data.meterId) : null,
        };
        onSubmit(payload);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                <div className="space-y-6">
                    {/* Unit Identity */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 pb-2 border-b border-border/40">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <Home className="w-4 h-4" />
                            </div>
                            <h3 className="text-sm font-bold text-primary/80 uppercase tracking-widest">Unit Identity</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <FormField control={form.control} name="unitNumber" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Unit Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. D4, C2, B3" className="h-12 bg-muted/40 border-border/60 focus:bg-background transition-all" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="status" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Status</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="h-12 bg-muted/40 border-border/60">
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                                                    <SelectValue placeholder="Select status" />
                                                </div>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="occupied">Occupied</SelectItem>
                                            <SelectItem value="vacant">Vacant</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                    </div>

                    {/* Tenant Details */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 pb-2 border-b border-border/40">
                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600">
                                <User className="w-4 h-4" />
                            </div>
                            <h3 className="text-sm font-bold text-primary/80 uppercase tracking-widest">Tenant Details</h3>
                        </div>

                        <FormField control={form.control} name="customerName" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Customer Name</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input placeholder="e.g. Grace Wawuda Malalo" className="pl-10 h-12 bg-muted/40 border-border/60 focus:bg-background transition-all" {...field} />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <div className="grid grid-cols-2 gap-6">
                            <FormField control={form.control} name="customerPhone" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Phone</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input placeholder="+254722334455" className="pl-10 h-12 bg-muted/40 border-border/60 focus:bg-background transition-all" {...field} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="customerEmail" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Email</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input type="email" placeholder="tenant@email.com" className="pl-10 h-12 bg-muted/40 border-border/60 focus:bg-background transition-all" {...field} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                    </div>

                    {/* Meter Assignment */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 pb-2 border-b border-border/40">
                            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-600">
                                <Gauge className="w-4 h-4" />
                            </div>
                            <h3 className="text-sm font-bold text-primary/80 uppercase tracking-widest">Meter Assignment</h3>
                        </div>

                        <FormField control={form.control} name="meterId" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Assigned Meter (Optional)</FormLabel>
                                <Select onValueChange={(val) => field.onChange(val === "none" ? undefined : Number(val))} defaultValue={field.value?.toString() || "none"}>
                                    <FormControl>
                                        <SelectTrigger className="h-12 bg-muted/40 border-border/60">
                                            <div className="flex items-center gap-2">
                                                <Gauge className="w-4 h-4 text-muted-foreground" />
                                                <SelectValue placeholder="Select meter" />
                                            </div>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="none">No Meter</SelectItem>
                                        {meters?.map(m => (
                                            <SelectItem key={m.id} value={m.id.toString()}>
                                                {m.serialNo} - {m.technology}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>
                </div>

                <div className="pt-4 mt-8 transition-all duration-300">
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
                                Saving Occupancy...
                            </span>
                        ) : (
                            initialData ? "Update Unit Details" : "Register Occupancy"
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
