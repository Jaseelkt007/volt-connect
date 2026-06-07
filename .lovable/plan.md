# EV Charge — Build Plan

A single-page, phone-first React app that acts as the remote control + receipt book for an autonomous P2P solar EV charging agent. No wallet, no auth, just `fetch` against one backend.

## Scope

One scrollable screen with: header, connection card, status hero, config form OR live charging panel, payments receipt list, and a pinned bottom CTA. Polls `/state` and `/events?limit=50` every 2s. Falls back to mock data with a "DEMO DATA" badge when backend is unreachable.

## Tech & files

Stack is already React + Vite + TS + Tailwind v4 (TanStack Start). Single route at `src/routes/index.tsx`. No router changes needed.

New files:
- `src/routes/index.tsx` — replace placeholder, compose the page
- `src/lib/ev/api.ts` — `AGENT_URL`, `fetchState`, `fetchEvents`, `startCharge`, `stopCharge` (pure fetch, typed)
- `src/lib/ev/types.ts` — `AgentState`, `AgentEvent`, enums
- `src/lib/ev/mock.ts` — mock state cycler (IDLE → EVALUATING → PAYING → CHARGING → WAITING → IDLE) + seeded PAYMENT events with realistic Algorand tx ids and `lora.algokit.io/testnet/tx/...` urls
- `src/lib/ev/usePolling.ts` — hook: polls every 2s, real-first / mock-fallback, exposes `{ state, events, isDemo, isOnline }`
- `src/lib/ev/format.ts` — `formatUSDC` (up to 6 decimals, trim zeros), `formatKWh` (2 decimals), `shortTx`, `relativeTime`
- `src/components/ev/Header.tsx` — title + "Algorand TestNet · x402" chip + connection dot + DEMO DATA badge
- `src/components/ev/StatusHero.tsx` — large status line that swaps copy by agent state, animated charging ring/pulse
- `src/components/ev/ConnectionCard.tsx` — charger connected/disconnected card
- `src/components/ev/ConfigSheet.tsx` — bottom-sheet-style config (chunk kWh, max price, budget)
- `src/components/ev/LivePanel.tsx` — big metrics (session kWh, USDC spent, # payments, remaining), decision_reason line, thin animated progress
- `src/components/ev/SessionSummary.tsx` — post-stop summary + "Charge again"
- `src/components/ev/StateChip.tsx` — colored pill per lifecycle state
- `src/components/ev/PaymentsList.tsx` — receipt rows + running total header + empty state + optional Activity toggle for DECISION/ERROR
- `src/components/ev/BottomCTA.tsx` — full-width black pill button pinned bottom w/ safe-area inset

Tokens go in `src/styles.css` (light Uber-style theme): override `--background` `#FFFFFF`, surface `#F6F6F6`, border `#EEEEEE`, text `#000`/`#6B6B6B`/`#9E9E9E`, plus new tokens `--accent-energy` `#13B36A`, `--destructive` `#E11900`, `--solar-amber` `#F5B301`. Add `@theme inline` mappings so Tailwind utilities (`bg-accent-energy`, etc.) work. Font: Inter via `<link>` in `__root.tsx` head, register `--font-sans`.

## Behavior details

- Polling: `setInterval` 2000ms in `usePolling`; on any fetch error flip `isDemo=true` and drive UI from mock cycler; recover to real when a fetch succeeds again.
- Start: optimistic "Starting…" overlay until next `/state` poll reflects EVALUATING/PAYING/CHARGING.
- New PAYMENT event detection (by `tx_id` not seen previously) → toast "⚡ Bought {kwh} kWh — ${usdc}" + brief green pulse on running total + slide-in row.
- State chip colors: IDLE grey, EVALUATING/PAYING amber, CHARGING green (pulsing), WAITING blue, ERROR red.
- View swap: IDLE/WAITING with no session → ConfigSheet visible, CTA = "Start charging" (disabled until `charger_connected`); EVALUATING/PAYING/CHARGING → LivePanel + CTA = "Stop charging" (red); just-stopped (IDLE with prior session totals) → SessionSummary + CTA = "Charge again".
- Skeleton shimmer on first load before any state resolves.
- Motion: Framer Motion (already-allowed) — press scale 0.98, cross-fade on status, slide-in for new rows, pulse on total. Add `motion` via `bun add motion` during build.
- Links: tx rows use `<a target="_blank" rel="noopener noreferrer" href={lora_url}>` with external-link icon (lucide-react, already available).

## Mock data

Mock returns a state object that advances every ~6s through the lifecycle, increments `session_kwh` / `session_spent_usdc` during CHARGING, and appends a PAYMENT event per chunk. Tx ids generated as 52-char base32-looking strings; `lora_url` points to `https://lora.algokit.io/testnet/tx/{id}`. Provides 3 seeded historical payments so the receipt list is non-empty in demo.

## Out of scope

No router, no auth, no wallet code, no web3 libs, no additional endpoints, no dark mode toggle (light Uber theme only), no backend code.

## Verification

After build: confirm `/` renders the new UI (not placeholder), DEMO DATA badge appears since no backend is running, lifecycle cycles, payments accumulate with working external links, Start/Stop swap CTA & view, and layout stays a centered ~480px column on desktop with a phone feel.
