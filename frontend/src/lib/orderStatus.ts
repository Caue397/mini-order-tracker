import { ChefHat, CircleCheck, PackageCheck, Truck, XCircle, type LucideIcon } from "lucide-react";
import type { OrderStatus } from "@/lib/types";

export const statusLabels: Record<OrderStatus, string> = {
  RECEBIDO: "Recebido",
  EM_PREPARO: "Em preparo",
  SAIU_PARA_ENTREGA: "Saiu para entrega",
  ENTREGUE: "Entregue",
  CANCELADO: "Cancelado",
};

export const statusIcons: Record<OrderStatus, LucideIcon> = {
  RECEBIDO: PackageCheck,
  EM_PREPARO: ChefHat,
  SAIU_PARA_ENTREGA: Truck,
  ENTREGUE: CircleCheck,
  CANCELADO: XCircle,
};
