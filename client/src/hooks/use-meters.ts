import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertMeter } from "@shared/schema";

export function useMeters() {
  return useQuery({
    queryKey: [api.meters.list.path],
    queryFn: async () => {
      const res = await fetch(api.meters.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch meters");
      return api.meters.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateMeter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertMeter) => {
      const res = await fetch(api.meters.create.path, {
        method: api.meters.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create meter");
      return api.meters.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.meters.list.path] }),
  });
}

export function useUpdateMeter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & Partial<InsertMeter>) => {
      const url = buildUrl(api.meters.update.path, { id });
      const res = await fetch(url, {
        method: api.meters.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update meter");
      return api.meters.update.responses[200].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.meters.list.path] }),
  });
}

export function useDeleteMeter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.meters.delete.path, { id });
      const res = await fetch(url, {
        method: api.meters.delete.method,
        credentials: "include"
      });
      if (!res.ok) throw new Error("Failed to delete meter");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.meters.list.path] }),
  });
}
