import { useCreateClient, useUpdateClient } from "@/hooks/use-clients";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertClientSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Mail, MapPin, Phone, Loader2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClientFormProps {
  initialData?: any;
  onSuccess: () => void;
}

export function ClientForm({ initialData, onSuccess }: ClientFormProps) {
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(insertClientSchema),
    defaultValues: initialData || { name: "", email: "", businessAddress: "", phone: "" }
  });

  const isPending = createClient.isPending || updateClient.isPending;

  const onSubmit = (data: any) => {
    if (initialData) {
      updateClient.mutate({ id: initialData.id, ...data }, {
        onSuccess: () => {
          toast({ title: "Client updated successfully" });
          onSuccess();
        },
        onError: (err: any) => {
          toast({ title: "Error", description: err.message, variant: "destructive" });
        }
      });
    } else {
      createClient.mutate(data, {
        onSuccess: () => {
          toast({ title: "Client created successfully" });
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
              <h3 className="text-sm font-bold text-primary/80 uppercase tracking-widest">Client Profile</h3>
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
              <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
                <MapPin className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-primary/80 uppercase tracking-widest">Contact Details</h3>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <FormField control={form.control} name="businessAddress" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Business Address</FormLabel>
                  <FormControl><Input placeholder="Office/Business Location" className="h-12 bg-muted/40 border-border/60 focus:bg-background transition-all" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Phone Number</FormLabel>
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
              initialData ? "Update Client Records" : "Register New Client"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
