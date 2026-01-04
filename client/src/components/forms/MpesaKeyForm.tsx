import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertMpesaKeySchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Key, Info, Loader2, User, Building2, Lock, ShieldCheck, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCreateMpesaKey, useUpdateMpesaKey } from "@/hooks/use-billing";
import { useAdmins } from "@/hooks/use-admins";

export function MpesaKeyForm({ initialData, onSuccess }: { initialData?: any, onSuccess: () => void }) {
    const createKey = useCreateMpesaKey();
    const updateKey = useUpdateMpesaKey();
    const { data: admins } = useAdmins();
    const { toast } = useToast();

    const form = useForm({
        resolver: zodResolver(insertMpesaKeySchema),
        defaultValues: initialData || {
            adminId: "",
            accountType: "C2B",
            consumerKey: "",
            businessAccount: "",
            consumerSecret: "",
            shortCode: "",
            passKey: "",
            initiator: "",
            securityCredential: ""
        }
    });

    const onSubmit = (data: any) => {
        const action = initialData ? updateKey : createKey;
        const payload = initialData ? { id: initialData.id, ...data } : data;

        action.mutate(payload, {
            onSuccess: () => {
                toast({ title: initialData ? "Integration Updated" : "Integration Active" });
                onSuccess();
            }
        });
    };

    const isPending = createKey.isPending || updateKey.isPending;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 pb-2 border-b border-border/40">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <Key className="w-4 h-4" />
                            </div>
                            <h3 className="text-sm font-bold text-primary/80 uppercase tracking-widest">Integration Identity</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <FormField control={form.control} name="adminId" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Primary Admin</FormLabel>
                                    <Select onValueChange={(v) => field.onChange(parseInt(v))} defaultValue={field.value?.toString()}>
                                        <FormControl>
                                            <SelectTrigger className="h-12 bg-muted/40 border-border/60">
                                                <div className="flex items-center gap-2">
                                                    <User className="w-4 h-4 text-muted-foreground" />
                                                    <SelectValue placeholder="Select admin" />
                                                </div>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {admins?.map(a => (
                                                <SelectItem key={a.id} value={a.id.toString()}>{a.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="accountType" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Account Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="h-12 bg-muted/40 border-border/60">
                                                <div className="flex items-center gap-2">
                                                    <CreditCard className="w-4 h-4 text-muted-foreground" />
                                                    <SelectValue placeholder="Select type" />
                                                </div>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="C2B">C2B (Lipa Na Mpesa)</SelectItem>
                                            <SelectItem value="B2C">B2C (Payouts)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <FormField control={form.control} name="consumerKey" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Consumer Key</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input placeholder="Dara Client ID" className="pl-10 h-12 bg-muted/40 border-border/60 focus:bg-background transition-all" {...field} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="consumerSecret" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Consumer Secret</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input type="password" placeholder="••••••••••••" className="pl-10 h-12 bg-muted/40 border-border/60 focus:bg-background transition-all" {...field} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <FormField control={form.control} name="shortCode" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Till/Paybill No.</FormLabel>
                                    <FormControl><Input placeholder="6-digit code" className="h-12 bg-muted/40 border-border/60 focus:bg-background transition-all" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="businessAccount" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Store Name</FormLabel>
                                    <FormControl><Input placeholder="MPESA Store ID" className="h-12 bg-muted/40 border-border/60 focus:bg-background transition-all" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>

                        <FormField control={form.control} name="passKey" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Online PassKey</FormLabel>
                                <FormControl><Input placeholder="LNM Passkey" className="h-12 bg-muted/40 border-border/60 focus:bg-background transition-all" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <div className="grid grid-cols-2 gap-6">
                            <FormField control={form.control} name="initiator" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">B2C Initiator</FormLabel>
                                    <FormControl><Input placeholder="Username" className="h-12 bg-muted/40 border-border/60 focus:bg-background transition-all" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="securityCredential" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Security Cred.</FormLabel>
                                    <FormControl><Input type="password" placeholder="••••••••••••" className="h-12 bg-muted/40 border-border/60 focus:bg-background transition-all" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
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
                                Validating Tunnel...
                            </span>
                        ) : (
                            initialData ? "Apply M-PESA Updates" : "Commission Payment Bridge"
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
