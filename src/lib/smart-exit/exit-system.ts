import type { 
  ExitToken, 
  TransactionData, 
  RiskLevel, 
  ValidationResult,
  BehavioralPattern,
  SecurityAlert,
  InventoryItem,
  HistoricalData
} from "./types";

/**
 * Calcula a pontuação de risco de uma transação (0-100)
 * Quanto maior o score, maior o risco
 * MELHORADO: Agora inclui análise comportamental e padrões históricos
 */
export function calculateRiskScore(transaction: TransactionData): number {
  let score = 0;

  // Valor total alto (0-25 pontos)
  if (transaction.totalValue > 500) {
    score += 25;
  } else if (transaction.totalValue > 300) {
    score += 15;
  } else if (transaction.totalValue > 150) {
    score += 8;
  }

  // Itens de alto valor (0-20 pontos)
  if (transaction.hasHighValueItems) {
    score += 20;
  }

  // Itens pequenos/fáceis de ocultar (0-15 pontos)
  if (transaction.hasSmallItems) {
    score += 15;
  }

  // Uso de self-checkout (0-15 pontos)
  if (transaction.usedSelfCheckout) {
    score += 15;
  }

  // Anomalias na transação (0-20 pontos)
  if (transaction.hasAnomalies) {
    score += 20;
  }

  // NOVO: Múltiplos cancelamentos/voids (0-15 pontos)
  if (transaction.multipleVoids) {
    score += 15;
  }

  // NOVO: Itens sem embalagem (0-10 pontos)
  if (transaction.itemsWithoutPackaging && transaction.itemsWithoutPackaging > 3) {
    score += 10;
  } else if (transaction.itemsWithoutPackaging && transaction.itemsWithoutPackaging > 0) {
    score += 5;
  }

  // NOVO: Padrão de compra incomum (0-15 pontos)
  if (transaction.unusualPurchasePattern) {
    score += 15;
  }

  // NOVO: Compras frequentes de alto risco (0-10 pontos)
  if (transaction.frequentHighRiskPurchases) {
    score += 10;
  }

  // Quantidade de itens (0-10 pontos)
  if (transaction.itemCount > 20) {
    score += 10;
  } else if (transaction.itemCount > 10) {
    score += 5;
  }

  // Checagem aleatória (5-10% das compras de baixo risco)
  if (score < 30 && Math.random() < 0.08) {
    score += 20; // Força checagem aleatória
  }

  return Math.min(score, 100);
}

/**
 * Determina o nível de risco baseado no score
 */
export function getRiskLevel(score: number): RiskLevel {
  if (score >= 60) return "high";
  if (score >= 35) return "medium";
  return "low";
}

/**
 * Gera um token de saída único e criptografado
 */
export function generateExitToken(transaction: TransactionData): ExitToken {
  const riskScore = calculateRiskScore(transaction);
  const riskLevel = getRiskLevel(riskScore);
  
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 4 * 60 * 1000); // Expira em 4 minutos

  const token: ExitToken = {
    id: generateTokenId(),
    transaction,
    riskScore,
    riskLevel,
    createdAt: now,
    expiresAt,
    used: false,
    signature: generateSignature(transaction, now)
  };

  return token;
}

/**
 * Valida um token de saída
 */
export function validateExitToken(token: ExitToken): ValidationResult {
  // Verifica se já foi usado
  if (token.used) {
    return {
      valid: false,
      reason: "Este QR Code já foi utilizado"
    };
  }

  // Verifica se expirou
  const now = new Date();
  if (now > token.expiresAt) {
    return {
      valid: false,
      reason: "QR Code expirado. Solicite um novo no caixa."
    };
  }

  // Verifica assinatura (simplificado para demonstração)
  const expectedSignature = generateSignature(token.transaction, token.createdAt);
  if (token.signature !== expectedSignature) {
    return {
      valid: false,
      reason: "QR Code inválido ou adulterado"
    };
  }

  return {
    valid: true
  };
}

/**
 * Marca um token como usado
 */
export function markTokenAsUsed(token: ExitToken): ExitToken {
  return {
    ...token,
    used: true
  };
}

/**
 * Gera um ID único para o token
 */
function generateTokenId(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 15);
  return `SE-${timestamp}-${randomStr}`.toUpperCase();
}

/**
 * Gera uma assinatura criptográfica para o token
 * Em produção, usar HMAC-SHA256 com chave secreta
 */
function generateSignature(transaction: TransactionData, createdAt: Date): string {
  // Simplificado para demonstração
  // Em produção: usar crypto.createHmac('sha256', SECRET_KEY)
  const data = JSON.stringify({
    value: transaction.totalValue,
    items: transaction.itemCount,
    time: createdAt.getTime()
  });
  
  // Simula hash (em produção usar crypto real)
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  return Math.abs(hash).toString(36).toUpperCase().padStart(12, '0');
}

/**
 * Gera QR Code data string (para ser usado com biblioteca de QR Code)
 */
export function generateQRCodeData(token: ExitToken): string {
  return JSON.stringify({
    id: token.id,
    sig: token.signature,
    exp: token.expiresAt.getTime()
  });
}

/**
 * Decodifica QR Code data string
 */
export function decodeQRCodeData(qrData: string): { id: string; sig: string; exp: number } | null {
  try {
    return JSON.parse(qrData);
  } catch {
    return null;
  }
}

// ============================================
// NOVAS FUNCIONALIDADES DE PREVENÇÃO DE ROUBO
// ============================================

/**
 * NOVO: Analisa padrões comportamentais de transações
 * Identifica comportamentos suspeitos sem identificar pessoas
 */
export function analyzeBehavioralPattern(
  currentTransaction: TransactionData,
  recentTransactions: TransactionData[]
): BehavioralPattern {
  const riskFactors: string[] = [];
  let score = 0;

  // Analisa frequência de compras de alto risco
  const highRiskCount = recentTransactions.filter(t => 
    t.hasHighValueItems || t.hasSmallItems
  ).length;

  if (highRiskCount > 3) {
    riskFactors.push("Frequent high-risk purchases detected");
    score += 20;
  }

  // Analisa padrão de uso de self-checkout
  const selfCheckoutCount = recentTransactions.filter(t => 
    t.usedSelfCheckout
  ).length;

  if (selfCheckoutCount === recentTransactions.length && recentTransactions.length > 2) {
    riskFactors.push("Exclusive self-checkout usage pattern");
    score += 15;
  }

  // Analisa anomalias recorrentes
  const anomalyCount = recentTransactions.filter(t => t.hasAnomalies).length;
  if (anomalyCount > 1) {
    riskFactors.push("Multiple transactions with anomalies");
    score += 25;
  }

  // Analisa valor médio crescente
  const avgValue = recentTransactions.reduce((sum, t) => sum + t.totalValue, 0) / recentTransactions.length;
  if (currentTransaction.totalValue > avgValue * 2) {
    riskFactors.push("Transaction value significantly above average");
    score += 10;
  }

  return {
    timestamp: new Date(),
    transactionId: generateTokenId(),
    riskFactors,
    score: Math.min(score, 100)
  };
}

/**
 * NOVO: Gera alertas de segurança baseados em análise em tempo real
 */
export function generateSecurityAlerts(
  token: ExitToken,
  behavioralPattern?: BehavioralPattern,
  inventoryData?: InventoryItem[]
): SecurityAlert[] {
  const alerts: SecurityAlert[] = [];

  // Alerta de transação de alto risco
  if (token.riskLevel === "high") {
    alerts.push({
      id: `alert-${Date.now()}-1`,
      type: "high_risk_transaction",
      severity: "high",
      message: `High-risk transaction detected: $${token.transaction.totalValue} with ${token.transaction.itemCount} items`,
      timestamp: new Date(),
      resolved: false,
      metadata: {
        tokenId: token.id,
        riskScore: token.riskScore
      }
    });
  }

  // Alerta de padrão incomum
  if (behavioralPattern && behavioralPattern.score > 50) {
    alerts.push({
      id: `alert-${Date.now()}-2`,
      type: "unusual_pattern",
      severity: behavioralPattern.score > 70 ? "critical" : "medium",
      message: `Unusual purchase pattern detected: ${behavioralPattern.riskFactors.join(", ")}`,
      timestamp: new Date(),
      resolved: false,
      metadata: {
        patternScore: behavioralPattern.score,
        factors: behavioralPattern.riskFactors
      }
    });
  }

  // Alerta de discrepância de inventário (simulado)
  if (inventoryData && inventoryData.some(item => item.soldCount > item.stockCount)) {
    alerts.push({
      id: `alert-${Date.now()}-3`,
      type: "inventory_discrepancy",
      severity: "critical",
      message: "Inventory discrepancy detected: items sold exceed stock count",
      timestamp: new Date(),
      resolved: false,
      metadata: {
        affectedItems: inventoryData.filter(item => item.soldCount > item.stockCount).length
      }
    });
  }

  // Alerta de horário de pico
  const hour = new Date().getHours();
  if ((hour >= 12 && hour <= 14) || (hour >= 17 && hour <= 19)) {
    if (token.riskLevel === "medium" || token.riskLevel === "high") {
      alerts.push({
        id: `alert-${Date.now()}-4`,
        type: "peak_hour",
        severity: "medium",
        message: "High-risk transaction during peak hours - extra attention recommended",
        timestamp: new Date(),
        resolved: false,
        metadata: {
          hour,
          riskLevel: token.riskLevel
        }
      });
    }
  }

  return alerts;
}

/**
 * NOVO: Analisa dados históricos para identificar padrões de furto
 */
export function analyzeHistoricalPatterns(data: HistoricalData[]): {
  highRiskHours: number[];
  highRiskDays: string[];
  averageTheftRate: number;
  recommendations: string[];
} {
  const recommendations: string[] = [];
  
  // Identifica horários de maior risco
  const hourlyRisk = new Map<number, number>();
  data.forEach(d => {
    const current = hourlyRisk.get(d.hour) || 0;
    hourlyRisk.set(d.hour, current + d.highRiskCount);
  });

  const highRiskHours = Array.from(hourlyRisk.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([hour]) => hour);

  // Calcula taxa média de furto
  const totalExits = data.reduce((sum, d) => sum + d.exitCount, 0);
  const totalThefts = data.reduce((sum, d) => sum + d.theftIncidents, 0);
  const averageTheftRate = totalExits > 0 ? (totalThefts / totalExits) * 100 : 0;

  // Gera recomendações
  if (highRiskHours.length > 0) {
    recommendations.push(`Increase staff during peak hours: ${highRiskHours.join(", ")}:00`);
  }

  if (averageTheftRate > 2) {
    recommendations.push("Consider implementing additional security measures");
  }

  const avgHighRisk = data.reduce((sum, d) => sum + d.highRiskCount, 0) / data.length;
  if (avgHighRisk > 50) {
    recommendations.push("Review self-checkout procedures and signage");
  }

  return {
    highRiskHours,
    highRiskDays: ["Friday", "Saturday"], // Simulado
    averageTheftRate,
    recommendations
  };
}

/**
 * NOVO: Simula verificação de inventário em tempo real
 */
export function checkInventoryIntegrity(
  transaction: TransactionData,
  inventory: InventoryItem[]
): {
  hasDiscrepancy: boolean;
  discrepancies: string[];
  riskAdjustment: number;
} {
  const discrepancies: string[] = [];
  let riskAdjustment = 0;

  // Verifica itens de alto valor
  const highValueItems = inventory.filter(item => 
    item.riskLevel === "high" && item.value > 100
  );

  if (transaction.hasHighValueItems && highValueItems.length > 0) {
    const soldVsStock = highValueItems.filter(item => 
      item.soldCount > item.stockCount * 0.9
    );

    if (soldVsStock.length > 0) {
      discrepancies.push(`${soldVsStock.length} high-value items near stock limit`);
      riskAdjustment += 15;
    }
  }

  // Verifica categorias de risco
  transaction.categories.forEach(category => {
    const categoryItems = inventory.filter(item => item.category === category);
    const avgStock = categoryItems.reduce((sum, item) => sum + item.stockCount, 0) / categoryItems.length;
    
    if (avgStock < 10) {
      discrepancies.push(`Low stock in category: ${category}`);
      riskAdjustment += 5;
    }
  });

  return {
    hasDiscrepancy: discrepancies.length > 0,
    discrepancies,
    riskAdjustment
  };
}

/**
 * NOVO: Calcula score de risco ajustado com todas as novas análises
 */
export function calculateEnhancedRiskScore(
  transaction: TransactionData,
  recentTransactions: TransactionData[],
  inventory?: InventoryItem[]
): {
  baseScore: number;
  behavioralScore: number;
  inventoryAdjustment: number;
  finalScore: number;
  riskLevel: RiskLevel;
  alerts: SecurityAlert[];
} {
  // Score base
  const baseScore = calculateRiskScore(transaction);

  // Análise comportamental
  const pattern = analyzeBehavioralPattern(transaction, recentTransactions);
  const behavioralScore = pattern.score;

  // Ajuste de inventário
  let inventoryAdjustment = 0;
  if (inventory) {
    const inventoryCheck = checkInventoryIntegrity(transaction, inventory);
    inventoryAdjustment = inventoryCheck.riskAdjustment;
  }

  // Score final
  const finalScore = Math.min(baseScore + (behavioralScore * 0.3) + inventoryAdjustment, 100);
  const riskLevel = getRiskLevel(finalScore);

  // Gera token temporário para alertas
  const tempToken: ExitToken = {
    id: generateTokenId(),
    transaction,
    riskScore: finalScore,
    riskLevel,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 4 * 60 * 1000),
    used: false,
    signature: ""
  };

  const alerts = generateSecurityAlerts(tempToken, pattern, inventory);

  return {
    baseScore,
    behavioralScore,
    inventoryAdjustment,
    finalScore,
    riskLevel,
    alerts
  };
}
