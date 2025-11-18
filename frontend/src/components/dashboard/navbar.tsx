import Link from "next/link";
import { UserNav } from "./user-nav";
import { CreditCard } from "lucide-react"; // Ícone para o logo

export function Navbar() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        {/* --- 1. LOGO --- */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-bold text-xl mr-8"
        >
          <div className="bg-primary text-primary-foreground p-1 rounded">
            <CreditCard className="h-5 w-5" />
          </div>
          SubMan
        </Link>

        {/* --- 2. LINKS DE NAVEGAÇÃO (Centro/Esquerda) --- */}
        <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
          <Link
            href="/dashboard"
            className="text-sm font-medium transition-colors hover:text-primary text-primary"
          >
            Dashboard
          </Link>
        </nav>

        {/* --- 3. ESPAÇADOR (Empurra o resto para a direita) --- */}
        <div className="ml-auto flex items-center space-x-4">
          {/* Aqui poderíamos por uma barra de busca global no futuro */}

          {/* Menu do Usuário */}
          <UserNav />
        </div>
      </div>
    </div>
  );
}
