"use client";

import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Logo } from "@/components/ui/Logo";
import { ORDER_STATUSES } from "@/lib/types";

const features = [
  {
    title: "Autenticação segura",
    description: "Cadastre-se e faça login com e-mail e senha para acessar seus próprios pedidos.",
    accent: "bg-primary-500",
  },
  {
    title: "Criação de pedidos",
    description: "Registre cliente, itens e endereço de entrega em poucos passos.",
    accent: "bg-emerald-500",
  },
  {
    title: "Acompanhamento de status",
    description: "Veja todos os pedidos listados e atualize o status conforme a entrega avança.",
    accent: "bg-amber-500",
  },
];

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <>
      <header className="bg-background">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Logo />
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1">
        {/* Seção 1: Hero */}
        <section className="bg-background px-6 pb-20 pt-8">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
            <h1 className="text-4xl font-extrabold text-foreground sm:text-5xl">
              Tudo para acompanhar seus pedidos
            </h1>
            <p className="max-w-xl text-lg text-muted">
              Crie pedidos, acompanhe o status em tempo real e mantenha tudo organizado em um só
              lugar.
            </p>

            {!isLoading && (
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-center">
                {isAuthenticated ? (
                  <Link href="/orders" className="w-full sm:w-auto">
                    <Button className="w-full">Ver meus pedidos</Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/login" className="w-full sm:w-auto">
                      <Button className="w-full">Entrar</Button>
                    </Link>
                    <Link href="/register" className="w-full sm:w-auto">
                      <Button variant="secondary" className="w-full">
                        Criar conta
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Seção 2: Funcionalidades */}
        <section className="bg-surface px-6 py-16">
          <div className="mx-auto flex max-w-4xl flex-col gap-10">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground">O que você pode fazer</h2>
              <p className="text-sm text-muted">Tudo que você precisa para controlar seus pedidos.</p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title} className="flex flex-col gap-4">
                  <span className={`h-1.5 w-10 rounded-full ${feature.accent}`} />
                  <h3 className="text-lg font-bold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Seção 3: Fluxo de status */}
        <section className="bg-background px-6 py-16">
          <div className="mx-auto flex max-w-4xl flex-col gap-10">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground">Do pedido à entrega</h2>
              <p className="text-sm text-muted">
                Cada pedido passa pelos status abaixo até chegar ao cliente.
              </p>
            </div>
            <Card className="flex flex-wrap items-center justify-center gap-3">
              {ORDER_STATUSES.map((status, index) => (
                <div key={status} className="flex items-center gap-3">
                  <Badge status={status} />
                  {index < ORDER_STATUSES.length - 1 && (
                    <span className="text-muted">&rarr;</span>
                  )}
                </div>
              ))}
            </Card>
          </div>
        </section>
      </main>
    </>
  );
}
