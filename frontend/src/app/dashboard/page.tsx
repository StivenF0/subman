"use client";

import { useState } from "react"; // Importante
import {
  useSubscriptions,
  useDeleteSubscription,
} from "@/hooks/useSubscriptions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { CreateSubscriptionModal } from "@/components/dashboard/create-subscription-modal";
// Importe a nova Toolbar
import { Toolbar } from "@/components/dashboard/toolbar";
import { DueSoonWidget } from "@/components/dashboard/due-soon-widget";

export default function DashboardPage() {
  // 1. Estados locais para controlar os filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default");

  // 2. Passamos os estados para o Hook
  // O Hook vai decidir qual endpoint chamar automaticamente!
  const {
    data: subscriptions,
    isLoading,
    isError,
  } = useSubscriptions({
    search: searchTerm,
    sortBy: sortBy,
  });

  const deleteMutation = useDeleteSubscription();

  // Função auxiliar para formatar moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="container mx-auto space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Gerencie e acompanhe suas assinaturas mensais.
        </p>
      </div>

      {/* --- 1. WIDGET DA FILA (NOVO) --- */}
      <section>
        <DueSoonWidget />
      </section>

      {/* 3. Implementação da Toolbar */}
      <Toolbar
        onSearch={(term) => setSearchTerm(term)}
        onSort={(criteria) => setSortBy(criteria)}
      >
        {/* Passamos o Modal como filho para ficar alinhado à direita */}
        <CreateSubscriptionModal />
      </Toolbar>

      {/* Estados de Loading/Erro */}
      {isLoading && (
        <div className="text-center py-10">Carregando assinaturas...</div>
      )}

      {isError && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          Erro ao carregar dados. Verifique sua conexão.
        </div>
      )}

      {/* Grid de Assinaturas */}
      {!isLoading && !isError && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {subscriptions?.length === 0 ? (
            <div className="col-span-full text-center py-12 border-2 border-dashed rounded-lg text-muted-foreground">
              <p>Nenhuma assinatura encontrada.</p>
              {searchTerm && (
                <p className="text-sm">Tente mudar o termo de busca.</p>
              )}
            </div>
          ) : (
            subscriptions?.map((sub) => (
              <Card
                key={sub.id}
                className="relative group hover:shadow-md transition-shadow"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-base font-semibold">
                    {sub.nome}
                  </CardTitle>
                  <Badge
                    variant={
                      sub.categoria === "STREAMING" ? "default" : "secondary"
                    }
                  >
                    {sub.categoria}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(sub.valor)}
                  </div>
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-muted-foreground flex justify-between">
                      <span>Vencimento:</span>
                      <span className="font-medium text-foreground">
                        {new Date(sub.vencimento).toLocaleDateString("pt-BR")}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground flex justify-between">
                      <span>Ciclo:</span>
                      <span className="capitalize">
                        {sub.cicloCobranca.toLowerCase()}
                      </span>
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-14 right-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-600"
                    onClick={() => {
                      if (confirm("Tem certeza que deseja excluir?")) {
                        deleteMutation.mutate(sub.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
