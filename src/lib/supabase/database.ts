import { supabase } from "./client";
import type { 
  ExitToken, 
  TransactionData,
  SecurityAlert,
  EmployeeNote,
  InventoryItem,
  HistoricalData
} from "../smart-exit/types";
import { generateExitToken, generateTokenId } from "../smart-exit/exit-system";

// ============================================
// EXIT TOKENS
// ============================================

export async function saveExitToken(token: ExitToken, userId: string) {
  const { data, error } = await supabase
    .from("exit_tokens")
    .insert({
      id: token.id,
      user_id: userId,
      transaction_data: token.transaction,
      risk_score: token.riskScore,
      risk_level: token.riskLevel,
      created_at: token.createdAt.toISOString(),
      expires_at: token.expiresAt.toISOString(),
      used: token.used,
      signature: token.signature,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getExitToken(tokenId: string) {
  const { data, error } = await supabase
    .from("exit_tokens")
    .select("*")
    .eq("id", tokenId)
    .single();

  if (error) throw error;
  
  return {
    id: data.id,
    transaction: data.transaction_data,
    riskScore: data.risk_score,
    riskLevel: data.risk_level,
    createdAt: new Date(data.created_at),
    expiresAt: new Date(data.expires_at),
    used: data.used,
    signature: data.signature,
  } as ExitToken;
}

export async function markTokenAsUsed(tokenId: string) {
  const { data, error } = await supabase
    .from("exit_tokens")
    .update({ 
      used: true,
      used_at: new Date().toISOString()
    })
    .eq("id", tokenId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUserTokens(userId: string, limit = 10) {
  const { data, error } = await supabase
    .from("exit_tokens")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  
  return data.map(token => ({
    id: token.id,
    transaction: token.transaction_data,
    riskScore: token.risk_score,
    riskLevel: token.risk_level,
    createdAt: new Date(token.created_at),
    expiresAt: new Date(token.expires_at),
    used: token.used,
    signature: token.signature,
  })) as ExitToken[];
}

export async function getAllTokens(limit = 50) {
  const { data, error } = await supabase
    .from("exit_tokens")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  
  return data.map(token => ({
    id: token.id,
    transaction: token.transaction_data,
    riskScore: token.risk_score,
    riskLevel: token.risk_level,
    createdAt: new Date(token.created_at),
    expiresAt: new Date(token.expires_at),
    used: token.used,
    signature: token.signature,
  })) as ExitToken[];
}

// ============================================
// SECURITY ALERTS
// ============================================

export async function saveSecurityAlert(alert: SecurityAlert) {
  const { data, error } = await supabase
    .from("security_alerts")
    .insert({
      id: alert.id,
      type: alert.type,
      severity: alert.severity,
      message: alert.message,
      timestamp: alert.timestamp.toISOString(),
      resolved: alert.resolved,
      metadata: alert.metadata,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getSecurityAlerts(resolved = false, limit = 20) {
  const { data, error } = await supabase
    .from("security_alerts")
    .select("*")
    .eq("resolved", resolved)
    .order("timestamp", { ascending: false })
    .limit(limit);

  if (error) throw error;
  
  return data.map(alert => ({
    id: alert.id,
    type: alert.type,
    severity: alert.severity,
    message: alert.message,
    timestamp: new Date(alert.timestamp),
    resolved: alert.resolved,
    metadata: alert.metadata,
  })) as SecurityAlert[];
}

export async function resolveSecurityAlert(alertId: string, userId: string) {
  const { data, error } = await supabase
    .from("security_alerts")
    .update({ 
      resolved: true,
      resolved_at: new Date().toISOString(),
      resolved_by: userId
    })
    .eq("id", alertId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================
// EMPLOYEE NOTES
// ============================================

export async function saveEmployeeNote(note: EmployeeNote) {
  const { data, error } = await supabase
    .from("employee_notes")
    .insert({
      id: note.id,
      employee_id: note.employeeId,
      type: note.type,
      description: note.description,
      priority: note.priority,
      timestamp: note.timestamp.toISOString(),
      resolved: note.resolved,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getEmployeeNotes(employeeId?: string, limit = 20) {
  let query = supabase
    .from("employee_notes")
    .select("*")
    .order("timestamp", { ascending: false })
    .limit(limit);

  if (employeeId) {
    query = query.eq("employee_id", employeeId);
  }

  const { data, error } = await query;

  if (error) throw error;
  
  return data.map(note => ({
    id: note.id,
    employeeId: note.employee_id,
    type: note.type,
    description: note.description,
    priority: note.priority,
    timestamp: new Date(note.timestamp),
    resolved: note.resolved,
  })) as EmployeeNote[];
}

export async function resolveEmployeeNote(noteId: string) {
  const { data, error } = await supabase
    .from("employee_notes")
    .update({ 
      resolved: true,
      resolved_at: new Date().toISOString()
    })
    .eq("id", noteId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================
// INVENTORY
// ============================================

export async function getInventoryItems() {
  const { data, error } = await supabase
    .from("inventory_items")
    .select("*")
    .order("name");

  if (error) throw error;
  
  return data.map(item => ({
    sku: item.sku,
    name: item.name,
    category: item.category,
    value: parseFloat(item.value),
    riskLevel: item.risk_level,
    stockCount: item.stock_count,
    soldCount: item.sold_count,
  })) as InventoryItem[];
}

export async function updateInventoryItem(sku: string, updates: Partial<InventoryItem>) {
  const { data, error } = await supabase
    .from("inventory_items")
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq("sku", sku)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================
// HISTORICAL DATA
// ============================================

export async function saveHistoricalData(data: HistoricalData) {
  const { data: result, error } = await supabase
    .from("historical_data")
    .upsert({
      date: data.date.toISOString().split('T')[0],
      hour: data.hour,
      exit_count: data.exitCount,
      high_risk_count: data.highRiskCount,
      theft_incidents: data.theftIncidents,
      average_value: data.averageValue,
    })
    .select()
    .single();

  if (error) throw error;
  return result;
}

export async function getHistoricalData(days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from("historical_data")
    .select("*")
    .gte("date", startDate.toISOString().split('T')[0])
    .order("date", { ascending: true })
    .order("hour", { ascending: true });

  if (error) throw error;
  
  return data.map(item => ({
    date: new Date(item.date),
    hour: item.hour,
    exitCount: item.exit_count,
    highRiskCount: item.high_risk_count,
    theftIncidents: item.theft_incidents,
    averageValue: parseFloat(item.average_value),
  })) as HistoricalData[];
}

// ============================================
// STATISTICS
// ============================================

export async function getStatistics() {
  // Total de tokens hoje
  const today = new Date().toISOString().split('T')[0];
  
  const { count: todayTokens } = await supabase
    .from("exit_tokens")
    .select("*", { count: "exact", head: true })
    .gte("created_at", today);

  // Tokens de alto risco hoje
  const { count: highRiskToday } = await supabase
    .from("exit_tokens")
    .select("*", { count: "exact", head: true })
    .eq("risk_level", "high")
    .gte("created_at", today);

  // Alertas não resolvidos
  const { count: unresolvedAlerts } = await supabase
    .from("security_alerts")
    .select("*", { count: "exact", head: true })
    .eq("resolved", false);

  // Notas não resolvidas
  const { count: unresolvedNotes } = await supabase
    .from("employee_notes")
    .select("*", { count: "exact", head: true })
    .eq("resolved", false);

  return {
    todayTokens: todayTokens || 0,
    highRiskToday: highRiskToday || 0,
    unresolvedAlerts: unresolvedAlerts || 0,
    unresolvedNotes: unresolvedNotes || 0,
  };
}
