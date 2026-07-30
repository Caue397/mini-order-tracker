"use client";

import { MapPin, ShoppingBag } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ORDER_STATUSES, type Order, type OrderStatus } from "@/lib/types";
import { useUpdateOrderStatus } from "@/hooks/useUpdateOrderStatus";

const statusLabels: Record<OrderStatus, string> = {
  RECEBIDO: "Recebido",
  EM_PREPARO: "Em preparo",
  SAIU_PARA_ENTREGA: "Saiu para entrega",
  ENTREGUE: "Entregue",
  CANCELADO: "Cancelado",
};

export function OrderCard({ order }: { order: Order }) {
  const updateStatus = useUpdateOrderStatus();
  const { street, number, city, state, zipCode } = order.deliveryAddress;

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-foreground">{order.customerName}</h3>
          <p className="flex items-center gap-1 text-xs text-muted">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            {street}, {number} — {city}/{state} — {zipCode}
          </p>
        </div>
        <Badge status={order.status} />
      </div>

      <ul className="flex flex-col gap-1 text-sm text-foreground/80">
        {order.items.map((item, idx) => (
          <li key={item.id ?? idx} className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5">
              <ShoppingBag className="h-3.5 w-3.5 shrink-0 text-muted" />
              {item.productName}
            </span>
            <span className="text-muted">x{item.quantity}</span>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-2 border-t border-border pt-3">
        <label className="text-xs font-medium text-muted" htmlFor={`status-${order.id}`}>
          Atualizar status
        </label>
        <select
          id={`status-${order.id}`}
          value={order.status}
          disabled={updateStatus.isPending}
          onChange={(e) =>
            updateStatus.mutate({ id: order.id, status: e.target.value as OrderStatus })
          }
          className="rounded-lg border border-border bg-surface px-2 py-1 text-sm text-foreground outline-none focus:border-primary-500"
        >
          {ORDER_STATUSES.map((status) => (
            <option key={status} value={status}>
              {statusLabels[status]}
            </option>
          ))}
        </select>
      </div>
    </Card>
  );
}
