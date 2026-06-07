import { motion } from "motion/react";

interface Props {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "danger";
  hint?: string;
}

export function BottomCTA({ label, onClick, disabled, variant = "primary", hint }: Props) {
  const colors =
    variant === "danger"
      ? "bg-destructive text-destructive-foreground"
      : "bg-foreground text-background";
  return (
    <div className="pointer-events-none sticky bottom-0 left-0 right-0 z-20 mt-2 -mx-4">
      <div
        className="pointer-events-auto bg-gradient-to-t from-surface via-surface/95 to-surface/0 px-4 pt-6"
        style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
      >
        {hint && <p className="mb-2 text-center text-xs text-muted-foreground">{hint}</p>}
        <motion.button
          whileTap={{ scale: disabled ? 1 : 0.98 }}
          disabled={disabled}
          onClick={onClick}
          className={`w-full rounded-full px-6 py-4 text-base font-semibold shadow-[0_8px_24px_-12px_rgba(0,0,0,0.4)] transition-opacity ${colors} ${
            disabled ? "opacity-40" : "opacity-100"
          }`}
        >
          {label}
        </motion.button>
      </div>
    </div>
  );
}
