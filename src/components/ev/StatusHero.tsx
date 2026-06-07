import { AnimatePresence, motion } from "motion/react";
import type { AgentState, LifecycleState } from "@/lib/ev/types";

interface Props {
  state: AgentState | null;
}

function headline(s: AgentState | null): string {
  if (!s) return "Loading…";
  if (!s.charger_connected) return "Plug in to begin";
  switch (s.state) {
    case "IDLE":       return "Ready to charge";
    case "EVALUATING": return "Evaluating offer…";
    case "PAYING":     return "Buying energy…";
    case "CHARGING":   return `Charging — ${s.session_kwh.toFixed(2)} kWh delivered`;
    case "WAITING":    return "Waiting for next chunk";
    case "ERROR":      return "Something went wrong";
  }
}

function sub(s: AgentState | null): string {
  if (!s) return "Talking to the charging agent.";
  if (!s.charger_connected) return "Connect the cable to a neighbour's solar charger.";
  if (s.state === "IDLE") return "Set your limits and start an autonomous session.";
  return s.decision_reason || "Working…";
}

const ringClass: Record<LifecycleState, string> = {
  IDLE: "from-neutral-200 to-neutral-300",
  EVALUATING: "from-solar to-amber-300",
  PAYING: "from-solar to-amber-300",
  CHARGING: "from-energy to-emerald-300",
  WAITING: "from-sky-300 to-sky-200",
  ERROR: "from-destructive to-red-300",
};

export function StatusHero({ state }: Props) {
  const cls = state ? ringClass[state.state] : ringClass.IDLE;
  const charging = state?.state === "CHARGING";
  return (
    <div className="flex items-center gap-4 px-1 py-2">
      <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
        <motion.div
          className={`absolute inset-0 rounded-full bg-gradient-to-br ${cls} opacity-80`}
          animate={charging ? { scale: [1, 1.08, 1] } : { scale: 1 }}
          transition={{ duration: 1.6, repeat: Infinity }}
        />
        <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-background text-2xl shadow-sm">
          ⚡
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <AnimatePresence mode="wait">
          <motion.h2
            key={headline(state)}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="text-[26px] font-bold leading-tight tracking-tight"
          >
            {headline(state)}
          </motion.h2>
        </AnimatePresence>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{sub(state)}</p>
      </div>
    </div>
  );
}
