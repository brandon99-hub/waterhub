import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertEstablishmentSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Building2, Info, Loader2, MapPin, Tags } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCreateEstablishment, useUpdateEstablishment } from "@/hooks/use-establishments";
import { useEstablishmentTypes } from "@/hooks/use-establishment-types";
import { useSites } from "@/hooks/use-sites";

export function EstablishmentForm({ initialData, onSuccess, preselectedSiteId }: { initialData?: any, onSuccess: () => void, preselectedSiteId?: number }) {
    const createEst = useCreateEstablishment();
    const updateEst = useUpdateEstablishment();
    const { data: types } = useEstablishmentTypes();
    const { data: sites } = useSites();
    const { toast } = useToast();

    const form = useForm({
        resolver: zodResolver(insertEstablishmentSchema),
        defaultValues: initialData || { establishmentName: "", establishmentTypeId: "", siteId: preselectedSiteId || "" }
    });

    const onSubmit = (data: any) => {
        const action = initialData ? updateEst : createEst;
        const payload = initialData ? { id: initialData.id, ...data } : data;

        action.mutate(payload, {
            onSuccess: () => {
                toast({ title: initialData ? "Establishment Updated" : "Establishment Registered" });
                onSuccess();
            }
        });
    };

    const isPending = createEst.isPending || updateEst.isPending;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 pb-2 border-b border-border/40">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <Info className="w-4 h-4" />
                            </div>
                            <h3 className="text-sm font-bold text-primary/80 uppercase tracking-widest">Establishment Identity</h3>
                        </div>

                        <FormField control={form.control} name="establishmentName" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Name</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input placeholder="e.g. Riverside Complex" className="pl-10 h-12 bg-muted/40 border-border/60 focus:bg-background transition-all" {...field} />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <div className="grid grid-cols-2 gap-6">
                            <FormField control={form.control} name="establishmentTypeId" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Category</FormLabel>
                                    <Select onValueChange={(v) => field.onChange(parseInt(v))} defaultValue={field.value?.toString()}>
                                        <FormControl>
                                            <SelectTrigger className="h-12 bg-muted/40 border-border/60">
                                                <div className="flex items-center gap-2">
                                                    <Tags className="w-4 h-4 text-muted-foreground" />
                                                    <SelectValue placeholder="Select type" />
                                                </div>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {types?.map(t => (
                                                <SelectItem key={t.id} value={t.id.toString()}>{t.typeName}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            {!preselectedSiteId && (
                                <FormField control={form.control} name="siteId" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Host Site</FormLabel>
                                        <Select onValueChange={(v) => field.onChange(parseInt(v))} defaultValue={field.value?.toString()}>
                                            <FormControl>
                                                <SelectTrigger className="h-12 bg-muted/40 border-border/60">
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="w-4 h-4 text-muted-foreground" />
                                                        <SelectValue placeholder="Select site" />
                                                    </div>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {sites?.map(s => (
                                                    <SelectItem key={s.id} value={s.id.toString()}>{s.siteName}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            )}
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
                                Synchronizing...
                            </span>
                        ) : (
                            initialData ? "Update Establishment" : "Register Establishment"
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
