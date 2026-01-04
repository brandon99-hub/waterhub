import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertBillingProfileSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Wallet, Info, Loader2, User, Coins, Droplets, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCreateBillingProfile, useUpdateBillingProfile } from "@/hooks/use-billing";
import { useClients } from "@/hooks/use-clients";

export function BillingProfileForm({ initialData, onSuccess }: { initialData?: any, onSuccess: () => void }) {
    const createBilling = useCreateBillingProfile();
    const updateBilling = useUpdateBillingProfile();
    const { data: clients } = useClients();
    const { toast } = useToast();

    const form = useForm({
        resolver: zodResolver(insertBillingProfileSchema),
        defaultValues: initialData || {
            clientId: "",
            tariff: "Standard",
            quota: 1000,
            automatedBilling: false,
            baseRate: "0",
            sewerCharge: "0",
            serviceFee: "0",
            rateKes: "50",
            rateLitres: "1",
            status: "active"
        }
    });

    const onSubmit = (data: any) => {
        const action = initialData ? updateBilling : createBilling;
        const payload = initialData ? { id: initialData.id, ...data } : data;

        action.mutate(payload, {
            onSuccess: () => {
                toast({ title: initialData ? "Profile Updated" : "Profile Active" });
                onSuccess();
            }
        });
    };

    const isPending = createBilling.isPending || updateBilling.isPending;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 pb-2 border-b border-border/40">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <Wallet className="w-4 h-4" />
                            </div>
                            <h3 className="text-sm font-bold text-primary/80 uppercase tracking-widest">Financial Scope</h3>
                        </div>

                        <FormField control={form.control} name="clientId" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Assigned Client</FormLabel>
                                <Select onValueChange={(v) => field.onChange(parseInt(v))} defaultValue={field.value?.toString()}>
                                    <FormControl>
                                        <SelectTrigger className="h-12 bg-muted/40 border-border/60">
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-muted-foreground" />
                                                <SelectValue placeholder="Select high-value client" />
                                            </div>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {clients?.map(c => (
                                            <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <div className="grid grid-cols-2 gap-6">
                            <FormField control={form.control} name="tariff" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Tariff Plan</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Zap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input placeholder="e.g. Commercial" className="pl-10 h-12 bg-muted/40 border-border/60 focus:bg-background transition-all" {...field} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="quota" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Quota (Litres)</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Droplets className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input type="number" placeholder="1000" className="pl-10 h-12 bg-muted/40 border-border/60 focus:bg-background transition-all" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <FormField control={form.control} name="rateKes" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Rate (KES)</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Coins className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input placeholder="50.00" className="pl-10 h-12 bg-muted/40 border-border/60 focus:bg-background transition-all" {...field} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="rateLitres" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Per (Litres)</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Droplets className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input placeholder="1.00" className="pl-10 h-12 bg-muted/40 border-border/60 focus:bg-background transition-all" {...field} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <FormField control={form.control} name="baseRate" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Base Rate</FormLabel>
                                    <FormControl>
                                        <Input placeholder="0.00" className="h-11 bg-muted/40 border-border/60" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="sewerCharge" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Sewer (%)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="0" className="h-11 bg-muted/40 border-border/60" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="serviceFee" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Service Fee</FormLabel>
                                    <FormControl>
                                        <Input placeholder="0.00" className="h-11 bg-muted/40 border-border/60" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>

                        <FormField control={form.control} name="automatedBilling" render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-xl border border-border/40 p-3 bg-muted/10">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-xs font-bold uppercase tracking-wider">Automated Billing</FormLabel>
                                    <p className="text-[10px] text-muted-foreground font-medium italic">Auto-generate invoices on quota finish</p>
                                </div>
                                <FormControl>
                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
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
                                Validating Profile...
                            </span>
                        ) : (
                            initialData ? "Apply Tariff Changes" : "Activate Billing Profile"
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
