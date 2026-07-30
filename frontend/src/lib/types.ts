export type OrderStatus =
  | "RECEBIDO"
  | "EM_PREPARO"
  | "SAIU_PARA_ENTREGA"
  | "ENTREGUE"
  | "CANCELADO";

export const ORDER_STATUSES: OrderStatus[] = [
  "RECEBIDO",
  "EM_PREPARO",
  "SAIU_PARA_ENTREGA",
  "ENTREGUE",
  "CANCELADO",
];

export interface DeliveryAddress {
  street: string;
  number: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface OrderItem {
  id?: string;
  productName: string;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  deliveryAddress: DeliveryAddress;
  status: OrderStatus;
  items: OrderItem[];
}

export interface CreateOrderRequest {
  customerName: string;
  items: { productName: string; quantity: number }[];
  deliveryAddress: DeliveryAddress;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ApiErrorBody {
  timestamp?: string;
  status?: number;
  message?: string;
  errors?: Record<string, string>;
}
