import { z } from "zod";

export const orderSchema = z.object({
  customerName: z.string().min(1, "Informe o nome do cliente"),
  items: z
    .array(
      z.object({
        productName: z.string().min(1, "Informe o produto"),
        quantity: z.number().min(1, "Mínimo 1"),
      })
    )
    .min(1, "Adicione ao menos um item"),
  deliveryAddress: z.object({
    street: z.string().min(1, "Informe a rua"),
    number: z.string().min(1, "Informe o número"),
    neighborhood: z.string().min(1, "Informe o bairro"),
    city: z.string().min(1, "Informe a cidade"),
    state: z.string().min(1, "Informe o estado"),
    zipCode: z.string().regex(/^\d{5}-\d{3}$/, "CEP inválido, use o formato 00000-000"),
  }),
});

export type OrderFormValues = z.infer<typeof orderSchema>;
