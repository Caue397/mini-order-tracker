import type { OrderStatus } from "@/lib/types";
import { statusLabels } from "@/lib/orderStatus";

const statusClasses: Record<OrderStatus, string> = {
  RECEBIDO: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  EM_PREPARO:
    "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  SAIU_PARA_ENTREGA:
    "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300",
  ENTREGUE:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  CANCELADO: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
};

export function Badge({ status, className = "" }: { status: OrderStatus; className?: string }) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[status]} ${className}`}
    >
      {statusLabels[status]}
    </span>
  );
}
