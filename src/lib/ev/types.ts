export type LifecycleState =
  | "IDLE"
  | "EVALUATING"
  | "PAYING"
  | "CHARGING"
  | "WAITING"
  | "ERROR";

export type ChargeMode = "fixed" | "metered";

export interface AgentState {
  state: LifecycleState;
  mode: ChargeMode;
  charger_connected: boolean;
  solar_kw: number;
  battery_pct: number;
  price_per_kwh: number;
  available_kwh: number;
  delivery_remaining_kwh: number;
  budget_remaining_usdc: number;
  max_price_per_kwh: number;
  chunk_kwh: number;
  session_kwh: number;
  session_spent_usdc: number;
  last_tx_id: string;
  decision_reason: string;
}

export type EventType = "STATE" | "DECISION" | "PAYMENT" | "ERROR";

export interface AgentEvent {
  ts: number;
  type: EventType;
  message: string;
  kwh?: number;
  price_usdc?: number;
  tx_id?: string;
  lora_url?: string;
}

export interface StartChargePayload {
  chunk_kwh: number;
  budget_usd: number;
  max_price_per_kwh: number;
}
