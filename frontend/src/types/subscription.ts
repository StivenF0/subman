// Enum para Categoria
export enum Category {
  STREAMING = "STREAMING",
  GAMES = "GAMES",
  MOBILE = "MOBILE",
  SERVICE = "SERVICE",
  SAAS = "SAAS",
  OTHER = "OTHER",
}

// Enum para Ciclo
export enum BillingCycle {
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  QUARTERLY = "QUARTERLY",
  SEMI_ANNUAL = "SEMI_ANNUAL",
  ANNUAL = "ANNUAL",
}

// O DTO da Assinatura
export interface Subscription {
  id: number;
  userId: number;
  nome: string;
  valor: number;
  categoria: Category;
  cicloCobranca: BillingCycle;
  vencimento: string; // string (ISO date)
  historicoPagamentos: string[];
}