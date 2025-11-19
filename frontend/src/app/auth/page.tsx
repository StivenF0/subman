'use client' // Necessário para usar o useState

import { useState } from 'react'
import { LoginForm } from '@/components/auth/LoginForm'
import { RegisterForm } from '@/components/auth/RegisterForm' // 1. Importa o novo componente
import { Button } from '@/components/ui/button' // Para o link de alternância

// Define os modos que a página pode ter
type ViewMode = 'login' | 'register'

export default function AuthPage() {
  // 2. Estado para controlar qual formulário está visível
  const [viewMode, setViewMode] = useState<ViewMode>('login')

  // 3. Estado para a mensagem de sucesso após registo
  const [registerSuccess, setRegisterSuccess] = useState<string | null>(null)

  // 4. Função chamada pelo RegisterForm em caso de sucesso
  const handleRegisterSuccess = () => {
    setRegisterSuccess('Conta criada com sucesso! Por favor, faça o login.')
    setViewMode('login') // Volta para a tela de login
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold">SubMan</h1>
          <p className="text-muted-foreground">
            {/* 5. Título dinâmico */}
            {viewMode === 'login'
              ? 'Acesse o seu gestor de assinaturas.'
              : 'Crie a sua conta para começar.'}
          </p>
        </div>

        {/* Mensagem de Sucesso no Registo */}
        {registerSuccess && (
          <div className="rounded-md border border-green-300 bg-green-50 p-3 text-center text-sm font-medium text-green-700">
            {registerSuccess}
          </div>
        )}

        {/* 6. Renderização Condicional do Formulário */}
        {viewMode === 'login' ? (
          <LoginForm />
        ) : (
          <RegisterForm onSuccess={handleRegisterSuccess} />
        )}

        {/* 7. Link de alternância dinâmico */}
        <p className="text-center text-sm text-muted-foreground">
          {viewMode === 'login' ? 'Não tem uma conta?' : 'Já tem uma conta?'}

          <Button
            variant="link"
            className="p-1"
            onClick={() => {
              setViewMode(viewMode === 'login' ? 'register' : 'login')
              setRegisterSuccess(null) // Limpa a mensagem de sucesso ao trocar
            }}
          >
            {viewMode === 'login' ? 'Cadastre-se' : 'Faça o login'}
          </Button>
        </p>
      </div>
    </div>
  )
}
