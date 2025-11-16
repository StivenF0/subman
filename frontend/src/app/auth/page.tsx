import { LoginForm } from "@/components/auth/LoginForm";

export default function AuthPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold">SubMan</h1>
          <p className="text-muted-foreground">
            Acesse o seu gestor de assinaturas.
          </p>
        </div>
        
        {/* Formulário de login */}
        <LoginForm />

        <p className="text-center text-sm text-muted-foreground">
          {/* TODO: Criar o formulário de registo e o link */}
          Não tem uma conta? <a href="#" className="underline">Cadastre-se</a>
        </p>
      </div>
    </div>
  );
}