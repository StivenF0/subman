"use client";

import { useDueSoonSubscriptions } from "@/hooks/useSubscriptions";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, AlertCircle, CheckCircle2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function DueSoonWidget() {
  const { data: queue, isLoading } = useDueSoonSubscriptions();

  // Função auxiliar para calcular dias restantes
  const getDaysRemaining = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dateString);
    due.setHours(0, 0, 0, 0);
    
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Hoje!";
    if (diffDays === 1) return "Amanhã";
    if (diffDays < 0) return "Atrasado";
    return `Em ${diffDays} dias`;
  };

  // Função para cor de urgência
  const getUrgencyColor = (dateString: string) => {
    const today = new Date();
    const due = new Date(dateString);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "text-red-600 bg-red-50 border-red-200"; // Atrasado
    if (diffDays <= 3) return "text-orange-600 bg-orange-50 border-orange-200"; // Urgente
    return "text-blue-600 bg-blue-50 border-blue-200"; // Normal
  };

  if (isLoading) {
    return <Skeleton className="h-32 w-full rounded-lg" />;
  }

  // Se a fila estiver vazia
  if (!queue || queue.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 flex items-center gap-4 text-green-800">
        <div className="bg-green-100 p-2 rounded-full">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-semibold">Tudo em dia!</h3>
          <p className="text-sm text-green-700">Nenhuma conta vencendo nos próximos 30 dias.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <AlertCircle className="h-5 w-5 text-orange-500" />
        <h2 className="text-lg font-semibold tracking-tight">Fila de Vencimentos (Próximos 30 Dias)</h2>
      </div>

      {/* Container com Scroll Horizontal para representar a Fila */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {queue.map((sub, index) => (
          <Card 
            key={sub.id} 
            className={`min-w-[240px] border-l-4 shadow-sm ${getUrgencyColor(sub.vencimento)}`}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold uppercase opacity-70">
                  #{index + 1} da Fila
                </span>
                <CalendarDays className="h-4 w-4 opacity-50" />
              </div>
              
              <h3 className="font-bold text-lg truncate">{sub.nome}</h3>
              
              <div className="mt-3 flex items-end justify-between">
                <div>
                  <p className="text-xs opacity-80">Valor</p>
                  <p className="font-bold text-xl">
                    R$ {sub.valor.toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs opacity-80">Vence</p>
                  <p className="font-bold text-sm">
                    {getDaysRemaining(sub.vencimento)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}