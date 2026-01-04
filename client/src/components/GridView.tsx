import { GridCard } from "@/components/GridCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface GridViewProps {
    data: any[];
    type: "meter" | "client" | "admin" | "establishmentType" | "occupancy";
    searchKey: string;
    searchPlaceholder?: string;
    onEdit: (item: any) => void;
    onDelete: (id: number) => void;
    helpers?: {
        getClientName?: (id: number) => string;
        getEstablishmentName?: (id: number | null) => string;
        getModeName?: (id: number) => string;
    };
}

export function GridView({
    data,
    type,
    searchKey,
    searchPlaceholder = "Search...",
    onEdit,
    onDelete,
    helpers
}: GridViewProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Filter data based on search
    const filteredData = data.filter(item => {
        const value = item[searchKey];
        if (!value) return false;
        return String(value).toLowerCase().includes(searchQuery.toLowerCase());
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    // Reset to page 1 when search changes
    const handleSearch = (value: string) => {
        setSearchQuery(value);
        setCurrentPage(1);
    };

    return (
        <div className="space-y-6">
            {/* Search */}
            <div className="relative max-w-md group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                    placeholder={searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10 h-11 bg-muted/30 border-border/50 focus:border-primary/50 focus:ring-primary/10 rounded-xl shadow-sm"
                />
            </div>

            {/* Grid */}
            {paginatedData.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground py-24">
                    <Search className="w-16 h-16 opacity-20" />
                    <div className="text-center">
                        <p className="font-semibold text-lg">No matching records found</p>
                        <p className="text-sm opacity-70 mt-1">Try adjusting your search criteria</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedData.map((item) => (
                        <GridCard
                            key={item.id}
                            item={item}
                            type={type}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            helpers={helpers}
                        />
                    ))}
                </div>
            )}

            {/* Pagination Footer */}
            {paginatedData.length > 0 && (
                <div className="flex items-center justify-between px-2">
                    <p className="text-sm text-muted-foreground font-medium">
                        Showing <span className="font-bold text-foreground">{startIndex + 1}</span> to{" "}
                        <span className="font-bold text-foreground">{Math.min(endIndex, filteredData.length)}</span> of{" "}
                        <span className="font-bold text-foreground">{filteredData.length}</span> entries
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="h-9 w-9 p-0 rounded-lg"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <span className="text-sm font-medium px-3">
                            Page {currentPage} of {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="h-9 w-9 p-0 rounded-lg"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
