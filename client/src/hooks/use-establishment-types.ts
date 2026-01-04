import { useQuery, useMutation } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { queryClient } from "@/lib/queryClient";

export function useEstablishmentTypes() {
    return useQuery({
        queryKey: [api.establishmentTypes.list.path],
    });
}

export function useCreateEstablishmentType() {
    return useMutation({
        mutationFn: async (data: any) => {
            const res = await fetch(api.establishmentTypes.create.path, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Failed to create establishment type");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [api.establishmentTypes.list.path] });
        },
    });
}

export function useUpdateEstablishmentType() {
    return useMutation({
        mutationFn: async ({ id, ...data }: any) => {
            const res = await fetch(buildUrl(api.establishmentTypes.update.path, { id }), {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Failed to update establishment type");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [api.establishmentTypes.list.path] });
        },
    });
}
