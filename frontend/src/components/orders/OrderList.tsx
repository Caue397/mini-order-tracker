"use client";

import { AlertCircle, PackageOpen } from "lucide-react";
import { useOrders } from "@/hooks/useOrders";
import { OrderCard } from "./OrderCard";
import { Spinner } from "@/components/ui/Spinner";
import { getApiErrorMessage } from "@/lib/api";

export function OrderList() {
  const { data, isLoading, isError, error } = useOrders();

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">
        <AlertCircle className="h-4 w-4 shrink-0" />
        {getApiErrorMessage(error)}
      </p>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border px-4 py-16 text-center text-sm text-muted">
        <PackageOpen className="h-8 w-8" />
        Nenhum pedido cadastrado ainda.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {data.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}
