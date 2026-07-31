"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { Header } from "@/components/layout/Header";
import { OrderForm } from "@/components/orders/OrderForm";
import { Spinner } from "@/components/ui/Spinner";
import { useOrder } from "@/hooks/useOrders";

export default function EditOrderPage() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading: isOrderLoading, isError } = useOrder(id);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthLoading, isAuthenticated, router]);

  if (isAuthLoading || !isAuthenticated || isOrderLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <>
        <Header />
        <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10 text-center">
          <p className="mb-4 text-sm text-muted">Pedido não encontrado.</p>
          <Link href="/orders" className="font-medium text-primary-600 hover:underline">
            Voltar para pedidos
          </Link>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10">
        <h1 className="mb-6 text-2xl font-bold text-foreground">Editar pedido</h1>
        <OrderForm order={order} />
      </main>
    </>
  );
}
