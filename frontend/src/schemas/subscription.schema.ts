import { z } from "zod";
import { Category, BillingCycle } from "@/types/subscription";

export const SubscriptionSchema = z.object({
  nome: z
    .string({ error: "O nome deve ser texto." })
    .min(1, "O nome não pode estar vazio."),

  valor: z.preprocess((val) => {
    if (typeof val === "string") {
      const n = Number(val.replace(",", "."));
      return isNaN(n) ? val : n;
    }
    return val;
  }, z.number({ error: "O valor deve ser um número válido." }).positive("O valor deve ser maior que zero.")),

  categoria: z.nativeEnum(Category, {
    error: "Selecione uma categoria válida.",
  }),

  cicloCobranca: z.nativeEnum(BillingCycle, {
    error: "Selecione um ciclo de cobrança válido.",
  }),

  vencimento: z.preprocess((val) => {
    if (typeof val === "string" && val) {
      const d = new Date(val);
      return isNaN(d.getTime()) ? val : d;
    }
    if (val instanceof Date) return val;
    return val;
  }, z.date({ error: "Data inválida. Use o formato AAAA-MM-DD." })),
});

export type SubscriptionFormValues = z.infer<typeof SubscriptionSchema>;
