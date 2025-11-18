"use client";

import { useParams, useRouter } from "next/navigation";
import { useSubscriptionById, useUpdateSubscription } from "@/hooks/useSubscriptions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CalendarCheck, History, Wallet } from "lucide-react";
import { Subscription, BillingCycle } from "@/types/subscription";

export default function SubscriptionDetailsPage() {
  const params = useParams();
  const router = useRouter();
  
  // Converte o ID da URL (string) para number
  const subId = Number(params.id);

  const { data: sub, isLoading } = useSubscriptionById(subId);
  const updateMutation = useUpdateSubscription();

  if (isLoading) return <div className="p-8">Carregando detalhes...</div>;
  if (!sub) return <div className="p-8">Assinatura não encontrada.</div>;

  // --- LÓGICA DO PAGAMENTO (Simulando Lista Encadeada) ---
  const handlePayment = () => {
    if (!confirm(`Confirmar pagamento de ${sub.nome}?`)) return;

    // 1. Clonamos o objeto atual
    const updatedSub: Subscription = { ...sub };

    // 2. REQUISITO: Adicionar ao Histórico (Linked List)
    // Adicionamos a data atual (vencimento que está sendo pago) ao histórico
    // Usamos "unshift" para adicionar no início (topo da lista visual) ou "push" para o fim.
    // O backend usa LinkedList, então a ordem é preservada.
    const paymentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD (Hoje)
    updatedSub.historicoPagamentos = [...sub.historicoPagamentos, `Pago em ${paymentDate} referente a ${sub.vencimento}`];

    // 3. Calcular Próximo Vencimento
    const currentDueDate = new Date(sub.vencimento);
    let nextDueDate = new Date(currentDueDate);

    // Lógica simples de incremento baseada no ciclo
    switch (sub.cicloCobranca) {
        case BillingCycle.MONTHLY:
            nextDueDate.setMonth(nextDueDate.getMonth() + 1);
            break;
        case BillingCycle.ANNUAL:
            nextDueDate.setFullYear(nextDueDate.getFullYear() + 1);
            break;
        case BillingCycle.WEEKLY:
            nextDueDate.setDate(nextDueDate.getDate() + 7);
            break;
        // Adicione outros casos se necessário
        default:
            nextDueDate.setMonth(nextDueDate.getMonth() + 1);
    }

    // Formata para YYYY-MM-DD
    updatedSub.vencimento = nextDueDate.toISOString().split('T')[0];

    // 4. Envia o PUT para o backend
    updateMutation.mutate({ id: sub.id, data: updatedSub });
  };

  return (
    <div className="container mx-auto max-w-4xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Botão Voltar */}
      <Button variant="ghost" onClick={() => router.back()} className="gap-2 pl-0">
        <ArrowLeft className="h-4 w-4" />
        Voltar para Dashboard
      </Button>

      <div className="grid gap-6 md:grid-cols-2">
        
        {/* COLUNA 1: Detalhes e Ação */}
        <div className="space-y-6">
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                    <CardTitle className="text-2xl">{sub.nome}</CardTitle>
                    <CardDescription className="mt-1">ID: {sub.id}</CardDescription>
                </div>
                <Badge className="text-sm">{sub.categoria}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-full text-green-700">
                        <Wallet className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Valor Atual</p>
                        <p className="text-xl font-bold">R$ {sub.valor.toFixed(2)}</p>
                    </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                 <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-full text-blue-700">
                        <CalendarCheck className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Próximo Vencimento</p>
                        <p className="text-xl font-bold">
                            {new Date(sub.vencimento).toLocaleDateString('pt-BR')}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                            Ciclo: {sub.cicloCobranca.toLowerCase()}
                        </p>
                    </div>
                </div>
              </div>

              <Separator />

              <Button 
                className="w-full h-12 text-lg gap-2" 
                onClick={handlePayment}
                disabled={updateMutation.isPending}
              >
                <CheckCircle2 className="h-5 w-5" />
                {updateMutation.isPending ? "Processando..." : "Confirmar Pagamento"}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Isso adicionará o registro ao histórico e atualizará a data.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* COLUNA 2: Histórico (Visualização da LinkedList) */}
        <div>
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center gap-2">
                <History className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Histórico de Pagamentos</CardTitle>
              </div>
              <CardDescription>
                Registro imutável (Lista Encadeada)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sub.historicoPagamentos.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-muted-foreground border-2 border-dashed rounded-lg">
                    <p>Nenhum pagamento registrado.</p>
                </div>
              ) : (
                <div className="relative border-l border-muted ml-3 space-y-6">
                  {/* Invertemos a lista para mostrar o mais recente no topo */}
                  {[...sub.historicoPagamentos].reverse().map((registro, index) => (
                    <div key={index} className="ml-6 relative group">
                      {/* Bolinha da Timeline */}
                      <span className="absolute -left-[31px] top-1 flex h-4 w-4 items-center justify-center rounded-full border bg-background ring-4 ring-background">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      </span>
                      
                      <div className="flex flex-col">
                        <p className="text-sm font-medium">{registro}</p>
                        <span className="text-xs text-muted-foreground">
                          Processado via Sistema
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}

// Ícone auxiliar (coloque isto fora do componente ou importe de lucide-react)
import { CheckCircle2 } from "lucide-react";