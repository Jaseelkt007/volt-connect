# ConnectionCard — gradient + design refresh

Scope: only `src/components/ev/ConnectionCard.tsx` (and 1–2 token additions in `src/styles.css`). No logic, no API, no other components.

## What changes

Replace the flat pale-mint `bg-energy/[0.06]` card with a **dark green left-to-right gradient hero card** when the charger is connected. Disconnected state stays calm/neutral so the contrast makes "connected" feel like a real status change.

### Connected state (new look)

- Background: linear-gradient 90deg from a deep forest green → vivid energy green → a soft warm highlight on the far right (suggesting sun + energy flowing in). Stored as `--gradient-connected` token in `src/styles.css`.
- Foreground text becomes white / white-80 for contrast (use `text-white` only inside this gradient surface; rest of app keeps tokens).
- Check badge: frosted white circle (`bg-white/15` + `backdrop-blur` + thin white ring) with the ✓ in white — replaces the solid green pill on green which currently disappears.
- Subtle inner top highlight (`shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]`) and an outer soft green glow (`shadow-[0_10px_30px_-12px_rgba(20,140,90,0.45)]`) for depth.
- A faint animated shimmer line sweeping L→R every ~4s (pure CSS keyframes, respects `prefers-reduced-motion`) — reinforces "energy flowing".
- Decorative lightning glyph at far right at low opacity as a watermark.
- Divider between header and stats becomes `border-white/15`.
- Stats row: "Available" and "Price" labels in `text-white/60` uppercase; values in white, tabular. A thin vertical white/15 divider between the two cells instead of just spacing.

### Disconnected state (tightened)

- Stays light, but upgrade from flat gray to a very subtle top-down `from-surface to-card` gradient with a dashed border to imply "waiting / empty slot".
- Plug emoji sits in a dashed-ring circle.
- One-line copy unchanged.

## Token additions (src/styles.css)

```css
:root {
  --gradient-connected: linear-gradient(
    90deg,
    oklch(0.30 0.09 155) 0%,
    oklch(0.55 0.17 152) 55%,
    oklch(0.78 0.14 110) 100%
  );
}
@keyframes ev-sweep { 0% { transform: translateX(-100%);} 100% { transform: translateX(200%);} }
@utility ev-sweep { animation: ev-sweep 4s ease-in-out infinite; }
```

## Out of scope

- No changes to `StatusHero`, `LivePanel`, header, or other cards.
- No theme-wide color changes; the gradient is local to this card.
- No new dependencies (uses existing `motion` only if needed; CSS keyframes are enough).

## Acceptance

- Connected card reads as a premium dark-green hero with clear white text.
- Disconnected card reads as a calm, empty slot — clearly different from connected.
- Works on a 480px mobile width without overflow; values stay tabular.
- Reduced-motion users get no shimmer.
