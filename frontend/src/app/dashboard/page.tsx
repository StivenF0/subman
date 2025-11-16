"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardPage() {
  const { logout } = useAuth();

  const handleClick = async () => {
    await logout();
  };

  return (
    <div>
      <h1>Bem-vindo ao seu Dashboard!</h1>
      <p>Este é o conteúdo principal.</p>
      <Button onClick={handleClick}>Sair</Button>
    </div>
  );
}
