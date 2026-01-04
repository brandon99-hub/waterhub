import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertBillingProfile, type InsertMpesaKey } from "@shared/routes";

// --- Billing Profiles ---
export function useBillingProfiles() {
  return useQuery({
    queryKey: [api.billingProfiles.list.path],
    queryFn: async () => {
      const res = await fetch(api.billingProfiles.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch billing profiles");
      return api.billingProfiles.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateBillingProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertBillingProfile) => {
      const res = await fetch(api.billingProfiles.create.path, {
        method: api.billingProfiles.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create billing profile");
      return api.billingProfiles.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.billingProfiles.list.path] }),
  });
}

export function useUpdateBillingProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & Partial<InsertBillingProfile>) => {
      const url = buildUrl(api.billingProfiles.update.path, { id });
      const res = await fetch(url, {
        method: api.billingProfiles.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update billing profile");
      return api.billingProfiles.update.responses[200].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.billingProfiles.list.path] }),
  });
}

export function useDeleteBillingProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.billingProfiles.delete.path, { id });
      const res = await fetch(url, { 
        method: api.billingProfiles.delete.method,
        credentials: "include" 
      });
      if (!res.ok) throw new Error("Failed to delete billing profile");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.billingProfiles.list.path] }),
  });
}

// --- Mpesa Keys ---
export function useMpesaKeys() {
  return useQuery({
    queryKey: [api.mpesaKeys.list.path],
    queryFn: async () => {
      const res = await fetch(api.mpesaKeys.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch Mpesa keys");
      return api.mpesaKeys.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateMpesaKey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertMpesaKey) => {
      const res = await fetch(api.mpesaKeys.create.path, {
        method: api.mpesaKeys.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create Mpesa key");
      return api.mpesaKeys.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.mpesaKeys.list.path] }),
  });
}

export function useUpdateMpesaKey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & Partial<InsertMpesaKey>) => {
      const url = buildUrl(api.mpesaKeys.update.path, { id });
      const res = await fetch(url, {
        method: api.mpesaKeys.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update Mpesa key");
      return api.mpesaKeys.update.responses[200].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.mpesaKeys.list.path] }),
  });
}

export function useDeleteMpesaKey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.mpesaKeys.delete.path, { id });
      const res = await fetch(url, { 
        method: api.mpesaKeys.delete.method,
        credentials: "include" 
      });
      if (!res.ok) throw new Error("Failed to delete Mpesa key");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.mpesaKeys.list.path] }),
  });
}
