import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Order } from "@/lib/types";

export const ordersQueryKey = ["orders"] as const;

export function useOrders() {
  return useQuery({
    queryKey: ordersQueryKey,
    queryFn: async () => {
      const { data } = await api.get<Order[]>("/api/orders");
      return data;
    },
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: async () => {
      const { data } = await api.get<Order>(`/api/orders/${id}`);
      return data;
    },
    enabled: !!id,
  });
}
