"use client";

import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth");
    }
  }, [user, isLoading, router]); // Dependências do efeito

  // (Podes substituir isto por um componente "Spinner" do Shadcn)
  if (isLoading) {
    return (
      <section className="w-full h-screen flex items-center justify-center">
        <Spinner className="size-20" />
      </section>
    );
  }

  // 3. Se está logado (passou pela verificação do useEffect),
  // mostra o conteúdo da página (o 'children')
  if (user) {
    return (
      <main>
        {/* Aqui podes adicionar uma Navbar/Sidebar do Dashboard */}
        {children}
      </main>
    );
  }

  // 4. Se não está a carregar e não tem usuário, retorna null
  // (o useEffect já está a tratar do redirecionamento)
  return null;
}
