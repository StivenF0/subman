"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface ToolbarProps {
  onSearch: (term: string) => void;
  onSort: (criteria: string) => void;
  children?: React.ReactNode; // Para aceitar o botão "Adicionar" dentro da barra
}

export function Toolbar({ onSearch, onSort, children }: ToolbarProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white p-4 rounded-lg border shadow-sm">
      
      {/* --- ÁREA DE BUSCA (Algoritmo Linear) --- */}
      <div className="relative w-full md:w-72">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome..."
          className="pl-8"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      <div className="flex gap-2 w-full md:w-auto">
        
        {/* --- ÁREA DE ORDENAÇÃO (Algoritmo de Ordenação) --- */}
        <Select onValueChange={onSort} defaultValue="default">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Ordenar por..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Padrão (Cadastro)</SelectItem>
            <SelectItem value="price">Preço (Menor &rarr; Maior)</SelectItem>
            <SelectItem value="duedate">Vencimento (Próximos)</SelectItem>
            <SelectItem value="name">Nome (A-Z)</SelectItem>
          </SelectContent>
        </Select>

        {/* Aqui renderiza o botão de "Nova Assinatura" que passaremos como filho */}
        {children}
      </div>
    </div>
  );
}