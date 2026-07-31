"use client";

import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { useCreateOrder } from "@/hooks/useCreateOrder";
import { useUpdateOrder } from "@/hooks/useUpdateOrder";
import { getApiErrorMessage } from "@/lib/api";
import { orderSchema, type OrderFormValues } from "@/schemas/order.schema";
import type { Order } from "@/lib/types";

const emptyValues: OrderFormValues = {
  customerName: "",
  items: [{ productName: "", quantity: 1 }],
  deliveryAddress: { street: "", number: "", neighborhood: "", city: "", state: "", zipCode: "" },
};

function formatZipCode(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
}

function toFormValues(order: Order): OrderFormValues {
  return {
    customerName: order.customerName,
    items: order.items.map((item) => ({ productName: item.productName, quantity: item.quantity })),
    deliveryAddress: { ...order.deliveryAddress },
  };
}

export function OrderForm({ order }: { order?: Order }) {
  const router = useRouter();
  const isEditing = !!order;

  const createOrder = useCreateOrder();
  const updateOrder = useUpdateOrder(order?.id ?? "");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: order ? toFormValues(order) : emptyValues,
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  const numberField = register("deliveryAddress.number");
  const zipCodeField = register("deliveryAddress.zipCode");

  async function onSubmit(values: OrderFormValues) {
    try {
      if (isEditing) {
        await updateOrder.mutateAsync(values);
        toast.success("Pedido atualizado com sucesso");
      } else {
        await createOrder.mutateAsync(values);
        toast.success("Pedido criado com sucesso");
      }
      router.push("/orders");
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <Card className="flex flex-col gap-4">
        <h2 className="font-semibold text-foreground">Cliente</h2>
        <Input
          label="Nome do cliente"
          error={errors.customerName?.message}
          {...register("customerName")}
        />
      </Card>

      <Card className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Itens</h2>
          <Button
            type="button"
            variant="secondary"
            onClick={() => append({ productName: "", quantity: 1 })}
          >
            <Plus className="h-4 w-4" />
            Adicionar item
          </Button>
        </div>

        <div className="flex flex-col gap-3">
          {errors.items?.root?.message && (
            <p className="text-xs text-red-600">{errors.items.root.message}</p>
          )}
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-end gap-3">
              <div className="flex-1">
                <Input
                  label="Produto"
                  error={errors.items?.[index]?.productName?.message}
                  {...register(`items.${index}.productName`)}
                />
              </div>
              <div className="w-24">
                <Input
                  label="Qtd"
                  type="number"
                  min={1}
                  error={errors.items?.[index]?.quantity?.message}
                  {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                />
              </div>
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => remove(index)}
                  aria-label="Remover item"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card className="flex flex-col gap-4">
        <h2 className="font-semibold text-foreground">Endereço de entrega</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="CEP"
            inputMode="numeric"
            placeholder="00000-000"
            maxLength={9}
            error={errors.deliveryAddress?.zipCode?.message}
            {...zipCodeField}
            onChange={(e) => {
              e.target.value = formatZipCode(e.target.value);
              zipCodeField.onChange(e);
            }}
          />
          <Input
            label="Rua"
            error={errors.deliveryAddress?.street?.message}
            {...register("deliveryAddress.street")}
          />
          <Input
            label="Número"
            inputMode="numeric"
            error={errors.deliveryAddress?.number?.message}
            {...numberField}
            onChange={(e) => {
              e.target.value = e.target.value.replace(/\D/g, "");
              numberField.onChange(e);
            }}
          />
          <Input
            label="Bairro"
            error={errors.deliveryAddress?.neighborhood?.message}
            {...register("deliveryAddress.neighborhood")}
          />
          <Input
            label="Cidade"
            error={errors.deliveryAddress?.city?.message}
            {...register("deliveryAddress.city")}
          />
          <Input
            label="Estado"
            error={errors.deliveryAddress?.state?.message}
            {...register("deliveryAddress.state")}
          />
        </div>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={() => router.push("/orders")}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : isEditing ? "Salvar alterações" : "Criar pedido"}
        </Button>
      </div>
    </form>
  );
}
