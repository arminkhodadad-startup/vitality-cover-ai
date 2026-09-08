# Vitality Cover AI

**Better behavior. Lower risk. Smarter coverage.**

**Live demo:** [https://arminkhodadad-startup.github.io/vitality-cover-ai/](https://arminkhodadad-startup.github.io/vitality-cover-ai/)

Wellness-risk, rewards, and coverage intelligence MVP for high-performance professionals. Simulated pricing only — not an insurance quote, medical diagnosis, or regulated underwriting decision.

## What it is

A live command-center for a demo member (Alex Karim). Health inputs drive a composite **Vitality Score**, burnout / claims pressure, a 30-day stability-buffered premium, and next-best coaching actions.

The home screen is a three-column ecosystem map:

1. Member 360  
2. Vitality Engine  
3. Risk Arithmetics  
4. Guide AI  
5. Infrastructure  
6. Interaction Layer  
7. Applications  

The circular **VC System** core sits in the middle. Click any module to open that product surface.

## Surfaces

| Page | What you get |
|---|---|
| Dashboard | Ecosystem map, portfolio, alerts |
| Member 360 | Identity, signal radar, weekly commitments |
| Health | Sleep, activity, nutrition, stress |
| Risk | Burnout, claims mix, coverage scenarios |
| Coverage | Standard / Silver / Gold plans |
| Rewards | Premium simulator, points, challenges |
| Care | Providers, pathways, telehealth |
| AI Coach | Daily plan, meal timing, recovery, notes |

**Tune Inputs** (top right) recalculates the whole app in real time.

## Stack

- React 19 + TanStack Start / Router
- Tailwind CSS v4
- Zustand
- Vite 8

## Run locally

```bash
npm install
npm run dev
```

The app listens on port **8080**.

```bash
npm run typecheck
npm run build
```

## Notes

- All member data is **simulated**.
- Pricing uses a 30-day weighted vitality buffer so one bad week does not punish the premium.
- Future regulated use would require consent, governance, auditability, and licensed partners.
