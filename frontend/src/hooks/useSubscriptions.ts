import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import { Subscription } from "@/types/subscription";

// --- HOOK PARA LISTAR (GET) ---
export function useSubscriptions() {
  return useQuery({
    queryKey: ["subscriptions"],
    queryFn: async () => {
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
