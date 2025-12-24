import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos do banco de dados
export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: 'manager' | 'employee' | 'security';
  created_at: string;
  updated_at: string;
};

export type ExitTokenDB = {
  id: string;
  user_id: string;
  transaction_data: any;
  risk_score: number;
  risk_level: 'low' | 'medium' | 'high';
  created_at: string;
  expires_at: string;
  used: boolean;
  used_at: string | null;
  signature: string;
};

export type SecurityAlertDB = {
  id: string;
  type: 'high_risk_transaction' | 'unusual_pattern' | 'inventory_discrepancy' | 'peak_hour';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
  resolved: boolean;
  resolved_at: string | null;
  resolved_by: string | null;
  metadata: any;
};

export type EmployeeNoteDB = {
  id: string;
  employee_id: string;
  type: 'suspicious_behavior' | 'customer_complaint' | 'system_issue' | 'general';
  description: string;
  priority: 'low' | 'medium' | 'high';
  timestamp: string;
  resolved: boolean;
  resolved_at: string | null;
};

export type InventoryItemDB = {
  sku: string;
  name: string;
  category: string;
  value: number;
  risk_level: 'low' | 'medium' | 'high';
  stock_count: number;
  sold_count: number;
  created_at: string;
  updated_at: string;
};

export type HistoricalDataDB = {
  id: number;
  date: string;
  hour: number;
  exit_count: number;
  high_risk_count: number;
  theft_incidents: number;
  average_value: number;
  created_at: string;
};
