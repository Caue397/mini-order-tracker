import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { CreateOrderRequest, Order } from "@/lib/types";
import { ordersQueryKey } from "./useOrders";

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (order: CreateOrderRequest) => {
      const { data } = await api.post<Order>("/api/orders", order);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ordersQueryKey });
    },
  });
}
