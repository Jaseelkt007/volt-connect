import { StateChip } from "./StateChip";
import type { LifecycleState } from "@/lib/ev/types";

interface Props {
  online: boolean;
  isDemo: boolean;
  state: LifecycleState | null;
}

export function Header({ online, isDemo, state }: Props) {
  return (
    <header className="flex items-center justify-between gap-3 pt-6 pb-3">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground text-background">
          <span className="text-lg">⚡</span>
        </div>
        <div>
          <h1 className="text-lg font-bold leading-none tracking-tight">EV Charge</h1>
          <p className="mt-0.5 text-[11px] font-medium text-hint">
            Algorand TestNet · x402
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {state && <StateChip state={state} />}
        {isDemo ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-solar/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-900">
            Demo data
          </span>
        ) : (
          <span
            title={online ? "Connected" : "Offline"}
            className={`h-2.5 w-2.5 rounded-full ${online ? "bg-energy" : "bg-neutral-300"}`}
          />
        )}
      </div>
    </header>
  );
}
