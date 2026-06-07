import { formatKWh, formatUSDC } from "@/lib/ev/format";

interface Props {
  connected: boolean;
  availableKwh: number;
  pricePerKwh: number;
}

export function ConnectionCard({ connected, availableKwh, pricePerKwh }: Props) {
  if (!connected) {
    return (
      <div className="rounded-2xl border bg-card p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-neutral-100 text-2xl">
            🔌
          </div>
          <div>
            <p className="text-base font-semibold text-foreground">Connect your charger</p>
            <p className="text-sm text-muted-foreground">Waiting for the charger to be plugged in…</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="rounded-2xl border border-energy/20 bg-energy/[0.06] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-energy text-white">
          ✓
        </div>
        <div className="flex-1">
          <p className="text-base font-semibold text-foreground">Charger connected</p>
          <p className="text-sm text-muted-foreground">Ready to receive energy from this stall.</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-energy/15 pt-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-hint">Available</p>
          <p className="tabular text-base font-semibold">{formatKWh(availableKwh)} kWh</p>
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-hint">Price</p>
          <p className="tabular text-base font-semibold">{formatUSDC(pricePerKwh)} <span className="text-xs font-normal text-muted-foreground">/ kWh</span></p>
        </div>
      </div>
    </div>
  );
}
