import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type Transaction, type AppEvent } from "@shared/schema";

export function useTransactions() {
    return useQuery<Transaction[]>({
        queryKey: [api.transactions.list.path],
    });
}

export function useEvents() {
    return useQuery<AppEvent[]>({
        queryKey: [api.events.list.path],
    });
}
