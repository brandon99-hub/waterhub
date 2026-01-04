import { useQuery, useMutation } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { queryClient } from "@/lib/queryClient";
import { Sidebar } from "@/components/Sidebar";
import { PageHeader } from "@/components/PageHeader";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertOperationModeSchema, type OperationMode } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus, Settings2, Info, TextQuote, Loader2, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useState } from "react";
import { useResponsiveLayout } from "@/hooks/use-responsive-layout";

function OperationModeForm({ initialData, onSuccess }: { initialData?: OperationMode, onSuccess: () => void }) {
    const { toast } = useToast();
    const form = useForm({
        resolver: zodResolver(insertOperationModeSchema),
        defaultValues: initialData || { modeName: "", modeDescription: "" }
    });

    const mutation = useMutation({
        mutationFn: async (data: any) => {
            const url = initialData
                ? buildUrl(api.operationModes.update.path, { id: initialData.id })
                : api.operationModes.create.path;

            const response = await fetch(url, {
                method: initialData ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error("Failed to save");
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [api.operationModes.list.path] });
            toast({ title: `Mode ${initialData ? "updated" : "created"} successfully` });
            onSuccess();
        }
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-8">
                <div className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 pb-2 border-b border-border/40">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <Info className="w-4 h-4" />
                            </div>
                            <h3 className="text-sm font-bold text-primary/80 uppercase tracking-widest">Mode Definition</h3>
                        </div>

                        <FormField control={form.control} name="modeName" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Mode Name</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Settings2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input placeholder="e.g. Active, Maintenance" className="pl-10 h-12 bg-muted/40 border-border/60 focus:bg-background transition-all" {...field} />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="modeDescription" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Description</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <TextQuote className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                        <Textarea placeholder="What does this mode represent?" className="pl-10 min-h-[120px] bg-muted/40 border-border/60 focus:bg-background transition-all" {...field} />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>
                </div>

                <div className="pt-4">
                    <Button
                        type="submit"
                        className={cn(
                            "w-full h-14 text-lg font-bold shadow-xl rounded-2xl transition-all active:scale-[0.98]",
                            mutation.isPending ? "bg-primary/80 shadow-primary/10 cursor-not-allowed" : "shadow-primary/20 hover:scale-[1.01]"
                        )}
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Saving Definition...
                            </span>
                        ) : (
                            initialData ? "Update Mode Definition" : "Create New Mode"
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}

export default function OperationModes() {
    const { toast } = useToast();
    const [editingMode, setEditingMode] = useState<OperationMode | null>(null);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const { marginClass } = useResponsiveLayout();

    const { data: modes, isLoading } = useQuery<OperationMode[]>({
        queryKey: [api.operationModes.list.path]
    });

    const [searchTerm, setSearchTerm] = useState("");

    const filteredModes = (modes || []).filter((m: any) =>
        m.modeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.modeDescription?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            await fetch(buildUrl(api.operationModes.delete.path, { id }), { method: "DELETE" });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [api.operationModes.list.path] });
            toast({ title: "Mode deleted successfully" });
        }
    });

    return (
        <div className="flex min-h-screen bg-background font-sans">
            <Sidebar />
            <main className={cn("flex-1 p-8 transition-all duration-300 min-w-0 overflow-hidden", marginClass)}>
                <div className="flex flex-col gap-6 mb-8 max-w-6xl mx-auto">
                    <PageHeader
                        title="Operation Modes"
                        description="Manage state definitions for water meters."
                        actionLabel="Add New Mode"
                        onAction={() => { setEditingMode(null); setIsAddOpen(true); }}
                        breadcrumbs={["Administration", "Operation Modes"]}
                    />

                    <div className="flex items-center justify-between">
                        <div className="relative flex-1 max-w-md group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Search modes..."
                                className="pl-10 h-11 bg-muted/40 border-border/60 rounded-xl focus:bg-background transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto">

                    <Card className="border-border/40 shadow-sm overflow-hidden">
                        <CardHeader className="bg-muted/30 border-b border-border/40">
                            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                <Settings2 className="w-5 h-5 text-primary" />
                                Defined Modes
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/20">
                                        <TableHead className="w-[200px]">Name</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead className="w-[100px] text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        <TableRow><TableCell colSpan={3} className="text-center py-8 text-muted-foreground font-medium italic">Loading system states...</TableCell></TableRow>
                                    ) : filteredModes.length === 0 ? (
                                        <TableRow><TableCell colSpan={3} className="text-center py-8 text-muted-foreground font-medium italic text-sm">No modes match your search.</TableCell></TableRow>
                                    ) : (
                                        filteredModes.map((mode) => (
                                            <TableRow key={mode.id} className="hover:bg-muted/10 border-b border-border/20 group transition-colors">
                                                <TableCell className="font-medium text-foreground">{mode.modeName}</TableCell>
                                                <TableCell className="text-muted-foreground">{mode.modeDescription}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors rounded-xl"
                                                            onClick={() => {
                                                                setEditingMode(mode);
                                                                setIsAddOpen(true);
                                                            }}
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors rounded-xl"
                                                            onClick={() => {
                                                                if (confirm("Are you sure you want to delete this mode?")) {
                                                                    deleteMutation.mutate(mode.id);
                                                                }
                                                            }}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                <Dialog open={isAddOpen} onOpenChange={(open) => {
                    setIsAddOpen(open);
                    if (!open) setEditingMode(null);
                }}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black tracking-tight">
                                {editingMode ? "Update Operation Mode" : "Define New State"}
                            </DialogTitle>
                        </DialogHeader>
                        <OperationModeForm
                            initialData={editingMode || undefined}
                            onSuccess={() => {
                                setIsAddOpen(false);
                                setEditingMode(null);
                            }}
                        />
                    </DialogContent>
                </Dialog>
            </main>
        </div>
    );
}
