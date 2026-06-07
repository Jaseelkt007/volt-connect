import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast, Toaster } from "sonner";
import { Header } from "@/components/ev/Header";
import { StatusHero } from "@/components/ev/StatusHero";
import { ConnectionCard } from "@/components/ev/ConnectionCard";
import { ConfigSheet } from "@/components/ev/ConfigSheet";
import { LivePanel } from "@/components/ev/LivePanel";
import { SessionSummary } from "@/components/ev/SessionSummary";
import { PaymentsList } from "@/components/ev/PaymentsList";
import { BottomCTA } from "@/components/ev/BottomCTA";
import { WalletCard } from "@/components/ev/WalletCard";
import { TelemetryTiles } from "@/components/ev/TelemetryTiles";
import { SavingsCard } from "@/components/ev/SavingsCard";
import { AgentReasoningFeed } from "@/components/ev/AgentReasoningFeed";
import { usePolling } from "@/lib/ev/usePolling";
import { useWallet } from "@/lib/ev/useWallet";
import { formatEUR } from "@/lib/ev/format";
import type { StartChargePayload } from "@/lib/ev/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EV Charge — Autonomous Solar Charging" },
      { name: "description", content: "Plug into a neighbour's solar charger and let an autonomous agent buy energy in real time on Algorand." },
      { property: "og:title", content: "EV Charge" },
      { property: "og:description", content: "Autonomous peer-to-peer solar charging with x402 micropayments." },
    ],
  }),
  component: Index,
});

const ACTIVE_STATES = new Set(["EVALUATING", "PAYING", "CHARGING"]);

function Index() {
  const { state, events, isDemo, isOnline, loading, start, stop } = usePolling();
  const wallet = useWallet();

  const [cfg, setCfg] = useState<StartChargePayload>({
    chunk_kwh: 1,
    budget_usd: 5,
    max_price_per_kwh: 0.05,
  });
  const [starting, setStarting] = useState(false);
  const [lastSummary, setLastSummary] = useState<{ kwh: number; spent: number; payments: number } | null>(null);
  const prevActiveRef = useRef(false);
  const seenTxRef = useRef<Set<string>>(new Set());
  const firstLoadRef = useRef(true);

  const paymentCount = useMemo(() => events.filter((e) => e.type === "PAYMENT").length, [events]);

  // Toast on new payments
  useEffect(() => {
    if (firstLoadRef.current) {
      events.forEach((e) => e.tx_id && seenTxRef.current.add(e.tx_id));
      firstLoadRef.current = false;
      return;
    }
    for (const e of events) {
      if (e.type !== "PAYMENT" || !e.tx_id) continue;
      if (!seenTxRef.current.has(e.tx_id)) {
        seenTxRef.current.add(e.tx_id);
        toast(`⚡ Bought ${(e.kwh ?? 0).toFixed(2)} kWh — ${formatEUR(e.price ?? 0)}`);
      }
    }
  }, [events]);

  // Track session summary when transitioning out of an active state
  useEffect(() => {
    const active = state ? ACTIVE_STATES.has(state.state) : false;
    if (prevActiveRef.current && !active && state && state.session_kwh > 0) {
      setLastSummary({
        kwh: state.session_kwh,
        spent: state.session_spent,
        payments: paymentCount,
      });
    }
    if (active) {
      setLastSummary(null);
      if (starting) setStarting(false);
    }
    prevActiveRef.current = active;
  }, [state, paymentCount, starting]);

  const isActive = state ? ACTIVE_STATES.has(state.state) : false;
  const charger = state?.charger_connected ?? false;

  const onStart = async () => {
    setStarting(true);
    try {
      await start(cfg);
      toast("Starting…", { description: "Agent is evaluating the offer." });
    } catch {
      setStarting(false);
    }
  };
  const onStop = async () => {
    await stop();
    toast("Stopping…", { description: "Closing the session." });
  };
  const onChargeAgain = () => setLastSummary(null);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[480px] flex-col bg-surface px-4">
      <Toaster position="top-center" toastOptions={{ className: "!rounded-2xl !border !bg-card !text-foreground" }} />
      <Header online={isOnline} isDemo={isDemo} state={state?.state ?? null} />

      <main className="flex-1 space-y-4 pb-4">
        {loading && !state ? (
          <Skeleton />
        ) : (
          <>
            <StatusHero state={state} />
            <ConnectionCard
              connected={charger}
              availableKwh={state?.available_kwh ?? 0}
              pricePerKwh={state?.price_per_kwh ?? 0}
            />

            <WalletCard wallet={wallet} pricePerKwh={state?.price_per_kwh ?? 0} />
            {state && <TelemetryTiles state={state} />}

            {isActive && state ? (
              <LivePanel state={state} paymentCount={paymentCount} />
            ) : lastSummary ? (
              <SessionSummary kwh={lastSummary.kwh} spent={lastSummary.spent} payments={lastSummary.payments} />
            ) : (
              <ConfigSheet defaults={cfg} onChange={setCfg} />
            )}

            {state && <SavingsCard state={state} />}
            <AgentReasoningFeed events={events} active={isActive} />

            <PaymentsList events={events} />
          </>
        )}
      </main>

      {!loading && state && (
        isActive ? (
          <BottomCTA label="Stop charging" variant="danger" onClick={onStop} />
        ) : lastSummary ? (
          <BottomCTA label="Charge again" onClick={onChargeAgain} />
        ) : (
          <BottomCTA
            label={starting ? "Starting…" : "Start charging"}
            onClick={onStart}
            disabled={!charger || starting}
            hint={!charger ? "Plug in your charger to begin" : undefined}
          />
        )
      )}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-4 pt-2">
      <div className="ev-skeleton h-16 rounded-2xl" />
      <div className="ev-skeleton h-28 rounded-2xl" />
      <div className="ev-skeleton h-40 rounded-2xl" />
      <div className="ev-skeleton h-64 rounded-2xl" />
    </div>
  );
}
