"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ChevronDown, MapPin, Pencil, ShoppingBag, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { IconButton } from "@/components/ui/IconButton";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ORDER_STATUSES, type Order, type OrderStatus } from "@/lib/types";
import { statusIcons, statusLabels } from "@/lib/orderStatus";
import { useUpdateOrderStatus } from "@/hooks/useUpdateOrderStatus";
import { useDeleteOrder } from "@/hooks/useDeleteOrder";
import { getApiErrorMessage } from "@/lib/api";

export function OrderCard({ order }: { order: Order }) {
  const updateStatus = useUpdateOrderStatus();
  const deleteOrder = useDeleteOrder();
  const { street, number, city, state, zipCode } = order.deliveryAddress;
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const StatusIcon = statusIcons[order.status];

  function confirmDelete() {
    deleteOrder.mutate(order.id, {
      onSuccess: () => {
        toast.success("Pedido excluído com sucesso");
        setIsConfirmOpen(false);
      },
      onError: (err) => toast.error(getApiErrorMessage(err)),
    });
  }

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-4">
          <h3 className="min-w-0 truncate font-semibold text-foreground">{order.customerName}</h3>
          <Badge status={order.status} className="shrink-0" />
        </div>
        <p className="flex mt-1.5 items-start gap-1 text-xs text-muted">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>
            {street}, {number} — {city}/{state} — {zipCode}
          </span>
        </p>
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

      <div className="flex items-center justify-between gap-3 border-t border-border pt-3">
        <div className="relative flex-1">
          <StatusIcon className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
          <select
            aria-label="Atualizar status"
            value={order.status}
            disabled={updateStatus.isPending}
            onChange={(e) =>
              updateStatus.mutate({ id: order.id, status: e.target.value as OrderStatus })
            }
            className="w-full cursor-pointer appearance-none rounded-lg border border-border bg-surface py-1.5 pl-8 pr-7 text-sm text-foreground outline-none focus:border-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {ORDER_STATUSES.map((status) => (
              <option key={status} value={status}>
                {statusLabels[status]}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/orders/${order.id}/edit`}>
            <IconButton type="button" aria-label="Editar pedido">
              <Pencil className="h-4 w-4" />
            </IconButton>
          </Link>
          <IconButton
            type="button"
            variant="danger"
            aria-label="Excluir pedido"
            disabled={deleteOrder.isPending}
            onClick={() => setIsConfirmOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
          </IconButton>
        </div>
      </div>

      <ConfirmDialog
        open={isConfirmOpen}
        title="Excluir pedido"
        description={`Tem certeza que deseja excluir o pedido de ${order.customerName}? Essa ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        isConfirming={deleteOrder.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </Card>
  );
}
