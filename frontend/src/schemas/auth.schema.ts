import { z } from 'zod'

export const LoginSchema = z.object({
  // O email deve ser uma string e ter formato de email válido
  email: z
    .email({ error: 'Formato de email inválido.' })
    .nonempty({ error: 'O email é obrigatório.' }),

  // A senha deve ser uma string e ter no mínimo 6 caracteres
  senha: z
    .string()
    .min(6, { message: 'A senha deve ter no mínimo 6 caracteres.' }),
})

// Schema para Registo
export const RegisterSchema = z.object({
  nome: z
    .string()
    .min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' }),
  email: z.email({ message: 'Por favor, insira um email válido.' }),
  senha: z
    .string()
    .min(6, { message: 'A senha deve ter pelo menos 6 caracteres.' }),
})

export type LoginFormValues = z.infer<typeof LoginSchema>
export type RegisterFormValues = z.infer<typeof RegisterSchema>
