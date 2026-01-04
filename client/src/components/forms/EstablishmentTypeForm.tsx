import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertEstablishmentTypeSchema, type OperationMode } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Building2, Info, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCreateEstablishmentType, useUpdateEstablishmentType } from "@/hooks/use-establishment-types";

export function EstablishmentTypeForm({ initialData, onSuccess }: { initialData?: any, onSuccess: () => void }) {
    const createType = useCreateEstablishmentType();
    const updateType = useUpdateEstablishmentType();
    const { toast } = useToast();

    const form = useForm({
        resolver: zodResolver(insertEstablishmentTypeSchema),
        defaultValues: initialData || { typeName: "" }
    });

    const onSubmit = (data: any) => {
        if (initialData) {
            updateType.mutate({ id: initialData.id, ...data }, {
                onSuccess: () => {
                    toast({ title: "Type Updated" });
                    onSuccess();
                }
            });
        } else {
            createType.mutate(data, {
                onSuccess: () => {
                    toast({ title: "Type Created" });
                    onSuccess();
                }
            });
        }
    };

    const isPending = createType.isPending || updateType.isPending;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 pb-2 border-b border-border/40">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <Info className="w-4 h-4" />
                            </div>
                            <h3 className="text-sm font-bold text-primary/80 uppercase tracking-widest">Type Identity</h3>
                        </div>

                        <FormField control={form.control} name="typeName" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Type Name</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input placeholder="e.g. Residential, Industrial" className="pl-10 h-12 bg-muted/40 border-border/60 focus:bg-background transition-all" {...field} />
                                    </div>
                                </FormControl>
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
                                Synchronizing...
                            </span>
                        ) : (
                            initialData ? "Update Category" : "Register Type"
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
