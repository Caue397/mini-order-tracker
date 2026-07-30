"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { Header } from "@/components/layout/Header";
import { NewOrderForm } from "@/components/orders/NewOrderForm";
import { Spinner } from "@/components/ui/Spinner";

export default function NewOrderPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10">
        <h1 className="mb-6 text-2xl font-bold text-foreground">Novo pedido</h1>
        <NewOrderForm />
      </main>
    </>
  );
}
