"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { getApiErrorMessage } from "@/lib/api";
import { registerSchema, type RegisterFormValues } from "@/schemas/register.schema";

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(values: RegisterFormValues) {
    try {
      await registerUser(values);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <Card className="w-full max-w-sm flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-xl font-bold text-foreground">Criar conta</h1>
          <p className="text-sm text-muted">Cadastre-se para gerenciar seus pedidos</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input label="Nome" error={errors.name?.message} {...register("name")} />
          <Input
            label="E-mail"
            type="email"
            error={errors.email?.message}
            {...register("email")}
          />
          <Input
            label="Senha"
            type="password"
            error={errors.password?.message}
            {...register("password")}
          />

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Criando..." : "Criar conta"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted">
          Já tem uma conta?{" "}
          <Link href="/login" className="font-medium text-primary-600 hover:underline">
            Entrar
          </Link>
        </p>
      </Card>
    </div>
  );
}
