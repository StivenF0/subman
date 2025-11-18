import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import { Subscription } from "@/types/subscription";

interface SubscriptionFilters {
  search?: string;
  sortBy?: string;
}

export function useSubscriptions(filters?: SubscriptionFilters) {
  return useQuery({
    queryKey: ["subscriptions", filters?.search, filters?.sortBy],

    queryFn: async () => {
      // 1. Prioridade: Se tem busca, usa o endpoint de Busca Linear
      if (filters?.search && filters.search.length > 0) {
        const response = await api.get<Subscription[]>(
          "/subscriptions/search",
          {
            params: { name: filters.search },
          }
        );
        return response.data;
      }

      // 2. Se tem ordenação, usa o endpoint de Ordenação
      if (filters?.sortBy && filters.sortBy !== "default") {
        const response = await api.get<Subscription[]>(
          "/subscriptions/sorted",
          {
            params: { by: filters.sortBy },
          }
        );
        return response.data;
      }

      // 3. Padrão: Retorna a lista normal (Vetor/ArrayList)
      const response = await api.get<Subscription[]>("/subscriptions");
      return response.data;
    },

    refetchOnWindowFocus: true,
  });
}

// --- HOOK PARA DELETAR (DELETE) ---
export function useDeleteSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/subscriptions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    },
  });
}

// --- HOOK PARA CRIAR (POST) ---
export function useCreateSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: unknown) => {
      // O Axios interceptor já anexa o token
      const response = await api.post("/subscriptions", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    },
  });
}

// --- HOOK PARA A FILA (QUEUE) ---
export function useDueSoonSubscriptions() {
  return useQuery({
    queryKey: ["subscriptions-due-soon"],
    queryFn: async () => {
      const response = await api.get<Subscription[]>("/subscriptions/due-soon");
      return response.data;
    },
    // Atualiza a cada 1 minuto para garantir que a contagem de dias esteja fresca
    refetchInterval: 60000, 
  });
}