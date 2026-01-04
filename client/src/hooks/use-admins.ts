import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertAdmin } from "@shared/routes";

export function useAdmins() {
  return useQuery({
    queryKey: [api.admins.list.path],
    queryFn: async () => {
      const res = await fetch(api.admins.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch admins");
      return api.admins.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertAdmin) => {
      const res = await fetch(api.admins.create.path, {
        method: api.admins.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create admin");
      return api.admins.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.admins.list.path] }),
  });
}

export function useUpdateAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & Partial<InsertAdmin>) => {
      const url = buildUrl(api.admins.update.path, { id });
      const res = await fetch(url, {
        method: api.admins.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update admin");
      return api.admins.update.responses[200].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.admins.list.path] }),
  });
}

export function useDeleteAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.admins.delete.path, { id });
      const res = await fetch(url, { 
        method: api.admins.delete.method,
        credentials: "include" 
      });
      if (!res.ok) throw new Error("Failed to delete admin");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.admins.list.path] }),
  });
}
