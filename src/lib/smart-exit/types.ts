export type RiskLevel = "low" | "medium" | "high";

export interface TransactionData {
  totalValue: number;
  itemCount: number;
  categories: string[];
  hasHighValueItems: boolean;
  hasSmallItems: boolean;
  usedSelfCheckout: boolean;
  hasAnomalies: boolean;
  // Novos campos para análise comportamental
  frequentHighRiskPurchases?: boolean;
  unusualPurchasePattern?: boolean;
  multipleVoids?: boolean;
  itemsWithoutPackaging?: number;
}

export interface ExitToken {
  id: string;
  transaction: TransactionData;
  riskScore: number;
  riskLevel: RiskLevel;
  createdAt: Date;
  expiresAt: Date;
  used: boolean;
  signature: string;
}

export interface ValidationResult {
  valid: boolean;
  reason?: string;
}

// Novo: Análise de padrões comportamentais
export interface BehavioralPattern {
  timestamp: Date;
  transactionId: string;
  riskFactors: string[];
  score: number;
}

// Novo: Alerta de segurança
export interface SecurityAlert {
  id: string;
  type: "high_risk_transaction" | "unusual_pattern" | "inventory_discrepancy" | "peak_hour";
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  timestamp: Date;
  resolved: boolean;
  metadata?: Record<string, any>;
}

// Novo: Dados de inventário
export interface InventoryItem {
  sku: string;
  name: string;
  category: string;
  value: number;
  riskLevel: RiskLevel;
  stockCount: number;
  soldCount: number;
}

// Novo: Nota de funcionário
export interface EmployeeNote {
  id: string;
  employeeId: string;
  timestamp: Date;
  type: "suspicious_behavior" | "customer_complaint" | "system_issue" | "general";
  description: string;
  priority: "low" | "medium" | "high";
  resolved: boolean;
}

// Novo: Dados históricos para análise
export interface HistoricalData {
  date: Date;
  hour: number;
  exitCount: number;
  highRiskCount: number;
  theftIncidents: number;
  averageValue: number;
}
