import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertOperationMode } from "@shared/routes";

export function useOperationModes() {
  return useQuery({
    queryKey: [api.operationModes.list.path],
    queryFn: async () => {
      const res = await fetch(api.operationModes.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch operation modes");
      return api.operationModes.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateOperationMode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertOperationMode) => {
      const res = await fetch(api.operationModes.create.path, {
        method: api.operationModes.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create operation mode");
      return api.operationModes.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.operationModes.list.path] }),
  });
}

export function useUpdateOperationMode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & Partial<InsertOperationMode>) => {
      const url = buildUrl(api.operationModes.update.path, { id });
      const res = await fetch(url, {
        method: api.operationModes.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update operation mode");
      return api.operationModes.update.responses[200].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.operationModes.list.path] }),
  });
}

export function useDeleteOperationMode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.operationModes.delete.path, { id });
      const res = await fetch(url, { 
        method: api.operationModes.delete.method,
        credentials: "include" 
      });
      if (!res.ok) throw new Error("Failed to delete operation mode");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.operationModes.list.path] }),
  });
}
