import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertEstablishment, type InsertEstablishmentType } from "@shared/routes";

// --- Types ---
export function useEstablishmentTypes() {
  return useQuery({
    queryKey: [api.establishmentTypes.list.path],
    queryFn: async () => {
      const res = await fetch(api.establishmentTypes.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch establishment types");
      return api.establishmentTypes.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateEstablishmentType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertEstablishmentType) => {
      const res = await fetch(api.establishmentTypes.create.path, {
        method: api.establishmentTypes.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create establishment type");
      return api.establishmentTypes.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.establishmentTypes.list.path] }),
  });
}

export function useDeleteEstablishmentType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.establishmentTypes.delete.path, { id });
      const res = await fetch(url, { 
        method: api.establishmentTypes.delete.method,
        credentials: "include" 
      });
      if (!res.ok) throw new Error("Failed to delete establishment type");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.establishmentTypes.list.path] }),
  });
}

// --- Establishments ---
export function useEstablishments() {
  return useQuery({
    queryKey: [api.establishments.list.path],
    queryFn: async () => {
      const res = await fetch(api.establishments.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch establishments");
      return api.establishments.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateEstablishment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertEstablishment) => {
      const res = await fetch(api.establishments.create.path, {
        method: api.establishments.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create establishment");
      return api.establishments.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.establishments.list.path] }),
  });
}

export function useUpdateEstablishment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & Partial<InsertEstablishment>) => {
      const url = buildUrl(api.establishments.update.path, { id });
      const res = await fetch(url, {
        method: api.establishments.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update establishment");
      return api.establishments.update.responses[200].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.establishments.list.path] }),
  });
}

export function useDeleteEstablishment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.establishments.delete.path, { id });
      const res = await fetch(url, { 
        method: api.establishments.delete.method,
        credentials: "include" 
      });
      if (!res.ok) throw new Error("Failed to delete establishment");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.establishments.list.path] }),
  });
}
