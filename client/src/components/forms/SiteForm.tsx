import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertSiteSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useClients } from "@/hooks/use-clients";
import { useCreateSite, useUpdateSite } from "@/hooks/use-sites";
import { useToast } from "@/hooks/use-toast";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Map as MapIcon, Navigation, Building2, Loader2, Info, Search, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

// Leaflet icon fix
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface SiteFormProps {
    initialData?: any;
    onSuccess: () => void;
}

interface SearchResult {
    display_name: string;
    lat: string;
    lon: string;
}

function FlyToLocation({ position }: { position: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        if (position) {
            map.flyTo(position, 13, { duration: 1.5 });
        }
    }, [position, map]);
    return null;
}

function LocationPicker({ onLocationSelect, initialPosition }: { onLocationSelect: (lat: number, lng: number) => void, initialPosition?: [number, number] }) {
    const [position, setPosition] = useState<[number, number] | null>(initialPosition || null);

    useMapEvents({
        click(e) {
            setPosition([e.latlng.lat, e.latlng.lng]);
            onLocationSelect(e.latlng.lat, e.latlng.lng);
        },
    });

    return position === null ? null : (
        <Marker position={position}></Marker>
    );
}

export function SiteForm({ initialData, onSuccess }: SiteFormProps) {
    const createSite = useCreateSite();
    const updateSite = useUpdateSite();
    const { data: clients } = useClients();
    const { toast } = useToast();
    const [mapPosition, setMapPosition] = useState<[number, number]>(
        initialData?.latitude && initialData?.longitude
            ? [parseFloat(initialData.latitude), parseFloat(initialData.longitude)]
            : [-1.2921, 36.8219] // Nairobi default
    );

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(initialData?.location || "");

    const form = useForm({
        resolver: zodResolver(insertSiteSchema),
        defaultValues: initialData || {
            siteName: "",
            location: "",
            clientId: undefined,
            latitude: "",
            longitude: ""
        }
    });

    useEffect(() => {
        if (initialData) {
            form.reset(initialData);
            setSelectedLocation(initialData.location || "");
            setSearchQuery(initialData.location || "");
            if (initialData.latitude && initialData.longitude) {
                setMapPosition([parseFloat(initialData.latitude), parseFloat(initialData.longitude)]);
            }
        }
    }, [initialData, form]);

    const isPending = createSite.isPending || updateSite.isPending;

    const handleLocationSelect = (lat: number, lng: number) => {
        setMapPosition([lat, lng]);
        form.setValue("latitude", lat.toFixed(6));
        form.setValue("longitude", lng.toFixed(6));

        // If no location name is selected, set a placeholder derived from coordinates
        if (!selectedLocation || selectedLocation === "No location set" || selectedLocation === "") {
            const placeholder = `Pinned at ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
            setSelectedLocation(placeholder);
            form.setValue("location", placeholder);
            setSearchQuery(placeholder);
        }
    };

    const searchPlace = async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1`
            );
            const data = await response.json();
            setSearchResults(data);
            setShowResults(true);
        } catch (error) {
            console.error("Search error:", error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery && searchQuery !== selectedLocation) {
                searchPlace(searchQuery);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const selectSearchResult = (result: SearchResult) => {
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);

        // Format location name: extract city/area from display_name
        const parts = result.display_name.split(',');
        const formattedLocation = parts.slice(0, 3).join(',').trim(); // Take first 3 parts

        handleLocationSelect(lat, lng);
        setSelectedLocation(formattedLocation);
        setSearchQuery(formattedLocation);
        form.setValue("location", formattedLocation);
        setShowResults(false);
    };

    const onSubmit = (data: any) => {
        const payload = {
            ...data,
            clientId: Number(data.clientId),
            location: selectedLocation || data.location,
            latitude: data.latitude,
            longitude: data.longitude
        };

        if (initialData) {
            updateSite.mutate({ id: initialData.id, ...payload }, {
                onSuccess: () => {
                    toast({ title: "Site updated successfully" });
                    onSuccess();
                },
                onError: (err: any) => {
                    toast({ title: "Error", description: err.message, variant: "destructive" });
                }
            });
        } else {
            createSite.mutate(payload, {
                onSuccess: () => {
                    toast({ title: "Site created successfully" });
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Site Identity Section */}
                <div>
                    <div className="flex items-center gap-3 pb-2 border-b border-border/40 mb-6">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <Info className="w-4 h-4" />
                        </div>
                        <h3 className="text-sm font-bold text-primary/80 uppercase tracking-widest">Site Identity</h3>
                    </div>

                    <div className="space-y-4">
                        <FormField control={form.control} name="siteName" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Site Name</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input placeholder="e.g. Riverside Estate" className="pl-10 h-12 bg-muted/40 border-border/60 focus:bg-background transition-all" {...field} />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="clientId" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Client Owner</FormLabel>
                                <Select onValueChange={(val) => field.onChange(Number(val))} defaultValue={field.value ? String(field.value) : undefined}>
                                    <FormControl><SelectTrigger className="h-12 bg-muted/40 border-border/60"><SelectValue placeholder="Select a client" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        {clients?.map((client) => (
                                            <SelectItem key={client.id} value={String(client.id)}>{client.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>
                </div>

                {/* Geographical Pin Section */}
                <div className="pt-6 border-t border-border/40">
                    <div className="flex items-center gap-3 pb-2 border-b border-border/40 mb-6">
                        <div className="p-2 bg-green-500/10 rounded-lg text-green-600">
                            <MapIcon className="w-4 h-4" />
                        </div>
                        <h3 className="text-sm font-bold text-primary/80 uppercase tracking-widest">Geographical Pin</h3>
                    </div>

                    {/* Place Search */}
                    <div className="mb-4 relative">
                        <FormLabel className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Search Location</FormLabel>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search for a place... (e.g., Kileleshwa, Nairobi)"
                                className="pl-10 h-12 bg-muted/40 border-border/60 focus:bg-background transition-all"
                                value={searchQuery || selectedLocation}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setSearchQuery(val);
                                    setSelectedLocation(val);
                                    form.setValue("location", val);
                                }}
                                onFocus={() => searchResults.length > 0 && setShowResults(true)}
                            />
                            {isSearching && (
                                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-primary" />
                            )}
                        </div>

                        {/* Search Results Dropdown */}
                        {showResults && searchResults.length > 0 && (
                            <div className="absolute z-50 w-full mt-2 bg-background border border-border rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                                {searchResults.map((result, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        className="w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors border-b border-border/40 last:border-0 flex items-start gap-3"
                                        onClick={() => selectSearchResult(result)}
                                    >
                                        <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                        <span className="text-sm text-foreground">{result.display_name}</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {showResults && searchResults.length === 0 && searchQuery && !isSearching && (
                            <div className="absolute z-50 w-full mt-2 bg-background border border-border rounded-xl shadow-xl px-4 py-3">
                                <p className="text-sm text-muted-foreground">No results found. Try a different search term.</p>
                            </div>
                        )}
                    </div>

                    {/* Coordinates Display */}
                    <div className="flex items-center gap-2 mb-4">
                        <Navigation className="w-3 h-3 text-primary/70" />
                        <span className="text-[10px] font-bold text-primary/70 uppercase tracking-widest">Coordinates</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <FormField control={form.control} name="latitude" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[10px] font-bold text-muted-foreground">LATITUDE</FormLabel>
                                <FormControl><Input placeholder="0.00" className="h-10 bg-muted/20 border-dashed text-center font-mono text-xs" {...field} value={field.value || ""} readOnly /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="longitude" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[10px] font-bold text-muted-foreground">LONGITUDE</FormLabel>
                                <FormControl><Input placeholder="0.00" className="h-10 bg-muted/20 border-dashed text-center font-mono text-xs" {...field} value={field.value || ""} readOnly /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>

                    {/* Map - Full Width */}
                    <div className="rounded-xl overflow-hidden border-2 border-border/40 shadow-lg" style={{ height: "400px" }}>
                        <MapContainer center={mapPosition} zoom={13} style={{ height: "100%", width: "100%" }}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            />
                            <LocationPicker onLocationSelect={handleLocationSelect} initialPosition={mapPosition} />
                            <FlyToLocation position={mapPosition} />
                        </MapContainer>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 text-center">Click on the map to set the precise location</p>
                </div>

                {/* Submit Button */}
                <div className="pt-4 mt-8">
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
                                {initialData ? "Updating..." : "Creating..."}
                            </span>
                        ) : (
                            initialData ? "Update Site" : "Register Site"
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
