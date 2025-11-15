'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { LoginSchema, LoginFormValues } from "@/schemas/auth.schema";

// Importa os componentes Shadcn/UI
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const [apiError, setApiError] = useState<string | null>(null);
  const router = useRouter();
  const { login } = useAuth();

  // 1. Configuração do React Hook Form + Zod
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      senha: "",
    },
  });

  // Pega o estado de 'isSubmitting' para mostrar o loading no botão
  const { isSubmitting } = form.formState;

  // 2. Função de 'Submit'
  async function onSubmit(data: LoginFormValues) {
    setApiError(null); // Limpa erros antigos

    try {
      // 3. Chama a função 'login' do nosso AuthContext
      await login(data.email, data.senha);
      
      // 4. Sucesso! Redireciona para o dashboard
      router.push("/dashboard");

    } catch (error) {
      // 5. Falha! Mostra o erro da API
      setApiError("Email ou senha inválidos. Tente novamente.");
    }
  }

  return (
    // O 'Form' do Shadcn/UI já vem com o 'provider' do RHF
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        
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
              <FormMessage /> {/* Mostra erros de validação do Zod */}
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

        {/* Mostra erros da API (ex: "Email ou senha inválidos") */}
        {apiError && (
          <p className="text-sm font-medium text-destructive">{apiError}</p>
        )}

        {/* Botão de Submit */}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "A entrar..." : "Entrar"}
        </Button>
      </form>
    </Form>
  );
}