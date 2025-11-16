"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from "react";
import api from "@/services/api";
import { User } from "@/types/user";

// 1. Define o DTO de resposta do Login (como vem do backend)
interface LoginResponseDTO {
  user: User;
  token: string;
}

// 2. Define a "forma" do nosso contexto
interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
}

// 3. Cria o Contexto
const AuthContext = createContext<AuthContextType | null>(null);

// 4. Cria o "Provedor" (Provider)
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Começa como 'carregando'

  // ----- EFEITO DE INICIALIZAÇÃO -----
  useEffect(() => {
    // Tenta carregar os dados do localStorage
    const storedToken = localStorage.getItem("subman_token");
    const storedUser = localStorage.getItem("subman_user");

    if (storedToken && storedUser) {
      // Se encontrou, define o estado
      const parsedUser: User = JSON.parse(storedUser);
      setUser(parsedUser);
      setToken(storedToken);

      // IMPORTANTE: Atualiza o header do Axios
      // (isto garante que o 'api' já tem o token
      // na primeira vez que a app carrega)
      api.defaults.headers.Authorization = `Bearer ${storedToken}`;
    }

    // Termina o carregamento
    setIsLoading(false);
  }, []);

  // ----- FUNÇÃO DE LOGIN -----
  const login = async (email: string, senha: string) => {
    try {
      // 1. Chama a API de login
      const response = await api.post<LoginResponseDTO>("/users/login", {
        email,
        senha,
      });

      const { user, token } = response.data;

      // 2. Guarda no localStorage
      localStorage.setItem("subman_token", token);
      localStorage.setItem("subman_user", JSON.stringify(user));

      // 3. Define o estado local
      setUser(user);
      setToken(token);

      // 4. Define o header padrão do Axios para este e TODOS os pedidos futuros
      api.defaults.headers.Authorization = `Bearer ${token}`;
    } catch (error) {
      console.error("Falha no login:", error);
      // Lança o erro para o formulário de login poder mostrá-lo
      throw new Error("Email ou senha inválidos.");
    }
  };

  // ----- FUNÇÃO DE LOGOUT -----
  const logout = () => {
    // 1. Limpa o localStorage
    localStorage.removeItem("subman_token");
    localStorage.removeItem("subman_user");

    // 2. Limpa o estado local
    setUser(null);
    setToken(null);

    // 3. Limpa o header do Axios
    delete api.defaults.headers.Authorization;
  };

  // Memoiza o valor do contexto para evitar re-renders desnecessários
  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      login,
      logout,
    }),
    [user, token, isLoading] // Recria o 'value' só se isto mudar
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 5. Cria o Hook customizado (useAuth)
// É assim que os nossos componentes vão consumir o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
