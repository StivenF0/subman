"use client";

import {
  useSubscriptions,
  useDeleteSubscription,
} from "@/hooks/useSubscriptions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { CreateSubscriptionModal } from "@/components/dashboard/create-subscription-modal";

export default function DashboardPage() {
  // 1. Usa o hook para buscar dados
  const { data: subscriptions, isLoading, isError } = useSubscriptions();

  // 2. Usa o hook para deletar
  const deleteMutation = useDeleteSubscription();

  if (isLoading)
    return <div className="p-8">Carregando suas assinaturas...</div>;
  if (isError)
    return <div className="p-8 text-red-500">Erro ao carregar dados.</div>;

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Meu Dashboard</h1>
        {/* Aqui colocaremos o botão de "Adicionar Nova" depois */}
        <CreateSubscriptionModal />
      </div>

      {/* Grid de Assinaturas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {subscriptions?.length === 0 ? (
          <p className="text-muted-foreground col-span-full">
            Você ainda não tem assinaturas. Adicione uma!
          </p>
        ) : (
          subscriptions?.map((sub) => (
            <Card key={sub.id} className="relative">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {sub.nome}
                </CardTitle>
                <Badge variant="secondary">{sub.categoria}</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  R$ {sub.valor.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Vence dia: {new Date(sub.vencimento).toLocaleDateString()}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  Ciclo: {sub.cicloCobranca.toLowerCase()}
                </p>

                {/* Botão de Deletar */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute bottom-2 right-2 text-destructive hover:text-destructive"
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
    </div>
  );
}
