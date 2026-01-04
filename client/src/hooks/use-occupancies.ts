import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

export function useOccupancies(establishmentId?: number) {
    return useQuery<any[]>({
        queryKey: establishmentId ? [`/api/establishments/${establishmentId}/occupancies`] : ["/api/occupancies"],
        enabled: !!establishmentId,
    });
}

export function useCreateOccupancy() {
    return useMutation({
        mutationFn: async (data: any) => {
            const res = await fetch("/api/occupancies", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Failed to create occupancy");
            return res.json();
        },
        onSuccess: (_, variables) => {
            // Invalidate the specific establishment's occupancies
            queryClient.invalidateQueries({
                queryKey: [`/api/establishments/${variables.establishmentId}/occupancies`]
            });
            queryClient.invalidateQueries({ queryKey: ["/api/occupancies"] });
        },
    });
}

export function useUpdateOccupancy() {
    return useMutation({
        mutationFn: async ({ id, ...data }: any) => {
            const res = await fetch(`/api/occupancies/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Failed to update occupancy");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/establishments"] });
            queryClient.invalidateQueries({ queryKey: ["/api/occupancies"] });
        },
    });
}

export function useDeleteOccupancy() {
    return useMutation({
        mutationFn: async (id: number) => {
            const res = await fetch(`/api/occupancies/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Failed to delete occupancy");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/establishments"] });
            queryClient.invalidateQueries({ queryKey: ["/api/occupancies"] });
        },
    });
}
