'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { RegisterSchema, RegisterFormValues } from '@/schemas/auth.schema'
import api from '@/services/api'

// Importa os componentes Shadcn/UI
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

// Props para o componente
interface RegisterFormProps {
  // Função para ser chamada quando o registo for bem-sucedido
  // (Isto irá permitir à página /auth trocar para o modo 'login')
  onSuccess: () => void
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [apiError, setApiError] = useState<string | null>(null)

  // 1. Configuração do React Hook Form + Zod
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      nome: '',
      email: '',
      senha: '',
    },
  })

  const { isSubmitting } = form.formState

  // 2. Função de 'Submit'
  async function onSubmit(data: RegisterFormValues) {
    setApiError(null)

    try {
      // 3. Chama a API para criar o utilizador
      // [POST /users] conforme o PDF
      await api.post('/users', data)

      // 4. Sucesso!
      // Chamamos a função onSuccess para o componente pai
      // mostrar uma mensagem ou trocar para o <LoginForm />
      onSuccess()
    } catch (error: any) {
      // 5. Falha!
      if (error.response?.data?.message) {
        setApiError(error.response.data.message)
      }
      // VERIFICAÇÃO 2: O erro é uma string pura?
      else if (typeof error.response?.data === 'string') {
        setApiError(error.response.data) // Usa a string diretamente
      }
      // ÚLTIMO CASO: Fallback
      else {
        setApiError('Falha ao criar conta. Tente novamente mais tarde.')
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Campo de Nome */}
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input
                  placeholder="O seu nome"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo de Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo de Senha */}
        <FormField
          control={form.control}
          name="senha"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="******"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Mostra erros da API */}
        {apiError && (
          <p className="text-sm font-medium text-destructive">{apiError}</p>
        )}

        {/* Botão de Submit */}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'A criar conta...' : 'Criar conta'}
        </Button>
      </form>
    </Form>
  )
}
