import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { CreateOrderRequest, Order } from "@/lib/types";
import { ordersQueryKey } from "./useOrders";

export function useUpdateOrder(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (order: CreateOrderRequest) => {
      const { data } = await api.put<Order>(`/api/orders/${id}`, order);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ordersQueryKey });
      queryClient.invalidateQueries({ queryKey: ["orders", id] });
    },
  });
}
