import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Signal, Droplet, MapPin, User, Mail, Phone, Building2, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

interface GridCardProps {
    item: any;
    type: "meter" | "client" | "admin" | "establishmentType" | "occupancy";
    onEdit: (item: any) => void;
    onDelete: (id: number) => void;
    helpers?: {
        getClientName?: (id: number) => string;
        getEstablishmentName?: (id: number | null) => string;
        getModeName?: (id: number) => string;
    };
}

export function GridCard({ item, type, onEdit, onDelete, helpers }: GridCardProps) {
    if (type === "meter") {
        return (
            <Card className="p-6 hover:shadow-xl transition-all duration-300 border-border/40 bg-card/60 backdrop-blur-sm group">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center",
                            item.valveStatus === "open" ? "bg-emerald-500/10 text-emerald-600" :
                                item.valveStatus === "closed" ? "bg-red-500/10 text-red-600" :
                                    "bg-gray-500/10 text-gray-600"
                        )}>
                            <Droplet className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-foreground tracking-tight">{item.serialNo}</h3>
                            <p className="text-xs text-muted-foreground font-mono">{item.imeiNo}</p>
                        </div>
                    </div>
                    <Badge variant={item.valveStatus === "open" ? "default" : "destructive"} className="font-bold">
                        {item.valveStatus?.toUpperCase()}
                    </Badge>
                </div>

                <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm bg-muted/30 p-2 rounded-lg border border-border/40">
                        <Signal className="w-4 h-4 text-primary/60" />
                        <span className="text-muted-foreground">Tech:</span>
                        <span className="font-bold text-foreground">{item.technology}</span>
                        <span className="mx-1 text-muted-foreground opacity-30">|</span>
                        <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-tighter">DN{item.meterSize}</span>
                    </div>

                    <div className="flex flex-col gap-2 p-1">
                        <div className="flex items-center gap-2 text-sm">
                            <User className="w-4 h-4 text-primary/60" />
                            <span className="text-muted-foreground text-xs">Landlord:</span>
                            <span className="font-semibold text-foreground text-xs truncate">{helpers?.getClientName ? helpers.getClientName(item.clientId) : `Client #${item.clientId}`}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                            <Building2 className="w-4 h-4 text-primary/60" />
                            <span className="text-muted-foreground text-xs">Facility:</span>
                            <span className="font-semibold text-foreground text-xs truncate">{helpers?.getEstablishmentName ? helpers.getEstablishmentName(item.establishmentId) : "N/A"}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-primary/60" />
                            <span className="text-muted-foreground text-xs">Tenant:</span>
                            <span className={cn("font-semibold text-xs", item.customerName ? "text-foreground" : "text-muted-foreground italic")}>
                                {item.customerName || "Unassigned"}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-blue-500/5 rounded-xl border border-blue-500/10 mt-2">
                        <div className="flex items-center gap-2">
                            <Droplet className="w-4 h-4 text-blue-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600/60">Reading</span>
                        </div>
                        <span className="font-mono font-black text-blue-600 text-lg">{item.latestReading?.toLocaleString() || 0} <span className="text-[10px] opacity-60">L</span></span>
                    </div>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-border/40">
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 h-9 gap-2"
                        onClick={() => onEdit(item)}
                    >
                        <Pencil className="w-3.5 h-3.5" />
                        Edit
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 h-9 gap-2 text-destructive hover:bg-destructive/10"
                        onClick={() => onDelete(item.id)}
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                    </Button>
                </div>
            </Card>
        );
    }

    if (type === "client" || type === "admin") {
        return (
            <Card className="p-6 hover:shadow-xl transition-all duration-300 border-border/40 bg-card/60 backdrop-blur-sm group">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-foreground">{item.name}</h3>
                            <p className="text-xs text-muted-foreground">ID: {item.id}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-3 text-sm bg-muted/20 p-2.5 rounded-xl border border-border/30">
                        <Mail className="w-4 h-4 text-primary/60" />
                        <span className="text-foreground font-medium truncate">{item.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm bg-muted/20 p-2.5 rounded-xl border border-border/30">
                        <Phone className="w-4 h-4 text-primary/60" />
                        <span className="text-foreground font-medium">{item.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm bg-muted/20 p-2.5 rounded-xl border border-border/30 overflow-hidden">
                        <MapPin className="w-4 h-4 text-primary/60 flex-shrink-0" />
                        <span className="text-muted-foreground text-xs truncate">
                            {type === "client" ? (item.businessAddress || "-") : (item.address || "-")}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-border/40">
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 h-9 gap-2"
                        onClick={() => onEdit(item)}
                    >
                        <Pencil className="w-3.5 h-3.5" />
                        Edit
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 h-9 gap-2 text-destructive hover:bg-destructive/10"
                        onClick={() => onDelete(item.id)}
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                    </Button>
                </div>
            </Card>
        );
    }

    if (type === "occupancy") {
        return (
            <Card className="p-6 hover:shadow-xl transition-all duration-300 border-border/40 bg-card/60 backdrop-blur-sm group">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                            <h3 className="font-black text-xl text-foreground tracking-tighter">Unit {item.unitNumber}</h3>
                            <Badge variant={item.status === "occupied" ? "default" : "secondary"} className="mt-1 text-[10px] uppercase">
                                {item.status}
                            </Badge>
                        </div>
                    </div>
                </div>

                <div className="space-y-3 mb-6 text-sm">
                    <div className="flex flex-col gap-1.5 p-3 bg-muted/30 rounded-xl border border-border/40">
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-primary/60" />
                            <span className="font-bold">{item.customerName || "No Tenant"}</span>
                        </div>
                        {item.customerPhone && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Phone className="w-3.5 h-3.5" />
                                {item.customerPhone}
                            </div>
                        )}
                        {item.customerEmail && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Mail className="w-3.5 h-3.5" />
                                <span className="truncate">{item.customerEmail}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-xl border border-border/40">
                        <div className="flex items-center gap-2">
                            <Tag className="w-4 h-4 text-muted-foreground" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Meter</span>
                        </div>
                        {item.meterId ? (
                            <span className="font-mono font-bold text-xs text-primary">{item.meterSerial}</span>
                        ) : (
                            <span className="text-[10px] italic text-muted-foreground opacity-60 font-bold uppercase">Unassigned</span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-border/40 text-center">
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 h-9 gap-2"
                        onClick={() => onEdit(item)}
                    >
                        <Pencil className="w-3.5 h-3.5" />
                        Edit
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 h-9 gap-2 text-destructive hover:bg-destructive/10"
                        onClick={() => onDelete(item.id)}
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                    </Button>
                </div>
            </Card>
        );
    }

    return null;
}
