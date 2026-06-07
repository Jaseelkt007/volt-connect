import { motion, AnimatePresence } from "motion/react";
import { Brain } from "lucide-react";
import type { AgentEvent } from "@/lib/ev/types";
import { relativeTime } from "@/lib/ev/format";

interface Props {
  events: AgentEvent[];
  active: boolean;
}

const ICON: Record<string, string> = { DECISION: "🤔", STATE: "·", ERROR: "⚠️", PAYMENT: "💸" };

export function AgentReasoningFeed({ events, active }: Props) {
  const feed = events
    .filter((e) => e.type === "DECISION" || e.type === "STATE" || e.type === "ERROR")
    .slice(0, 6);

  return (
    <div className="rounded-2xl border bg-card p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-hint">
          <Brain className="h-3.5 w-3.5" /> Agent activity
        </p>
        {active && (
          <span className="flex items-center gap-1.5 text-xs text-energy">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-energy opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-energy" />
            </span>
            thinking
          </span>
        )}
      </div>

      {feed.length === 0 ? (
        <p className="mt-3 text-xs text-muted-foreground">
          The agent's decisions appear here as it evaluates offers and buys energy.
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          <AnimatePresence initial={false}>
            {feed.map((e, i) => (
              <motion.li
                key={`${e.ts}-${i}`}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 320, damping: 26 }}
                className="flex items-start gap-2 text-sm"
              >
                <span className="mt-0.5 shrink-0">{ICON[e.type] ?? "·"}</span>
                <span className="flex-1 leading-snug">{e.message}</span>
                <span className="shrink-0 whitespace-nowrap text-[11px] text-hint">
                  {relativeTime(e.ts)}
                </span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}
