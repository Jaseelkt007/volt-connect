Refactor `src/components/ev/StatusHero.tsx` to match the chosen v3 "Mono status chip" direction:

- **Icon area:** Replace the gradient-to-br animated ring with a softer, state-colored pulsing glow (`bg-{state}/10` with `animate-pulse`) behind a clean white 56 px circle (`bg-white`, `shadow-sm`, `border-{state}/30`). Keep the lightning glyph but swap the emoji for a small inline SVG filled in the state color.
- **Status chip:** Add a small uppercase monospace label above the headline (e.g. "Idle", "Charging") in a pill/chip style (`bg-{state}/10`, `text-{state}`, `rounded-sm`, `font-mono`). Map each `LifecycleState` + disconnected/null to its label and color token (solar, energy, sky, destructive, muted-foreground).
- **Typography:** Reduce headline from `text-[26px] font-bold` to `text-xl font-semibold tracking-tight leading-none`. Keep sub-copy at `text-[13px] leading-snug text-muted-foreground`.
- **Layout:** Shift from the current asymmetric alignment to a compact horizontal flex (`items-center gap-5`), so the icon sits beside the text block instead of floating left with heavy whitespace.
- **Animations:** Preserve `AnimatePresence` cross-fade on headline/sub changes. Keep the `motion.div` ring pulse for the charging heartbeat, but simplify the idle ring to a gentle CSS pulse.
- **Font:** Add a Google Fonts `<link>` for JetBrains Mono (`wght@500`) in `src/routes/__root.tsx` so the status chip renders with the intended monospace face. The link array already has `preconnect` stubs for Google Fonts.

Acceptance:
- IDLE state shows the white ring + amber glow + "Idle" chip + "Ready to charge" headline.
- CHARGING state shows the green glow + "Charging" chip + headline updates with kWh delivered.
- No layout shift or overflow on a 390 px-wide viewport.
- Existing `ringClass` and `headline`/`sub` logic remain intact; only the JSX structure and visual polish change.