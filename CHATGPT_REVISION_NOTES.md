# ChatGPT Revision Notes — July 2026

## What was found
The Replit quota interrupted an architectural rewrite. `useGameState.ts` had already been changed to a new multi-phase state model, while `Mechanism.tsx` still depended on the old passive-demo API. The exported source was therefore internally inconsistent.

## What this revision changes
- Reconnects the game to the new phase-based state model.
- Replaces the single automatic launch button with four player actions:
  1. adjust the launch ramp;
  2. thread the lifting cord;
  3. place the marble;
  4. release it.
- Adds two recoverable physical failure states:
  - the marble misses the lever when the ramp angle is wrong;
  - the wheel turns without lifting the cup when the cord is loose.
- Synchronizes switch movement, machine-wake audio, filament, glow, particles, and distant response.
- Adds a distant answering light to communicate contribution beyond the immediate machine.
- Restores procedural audio fallbacks when uploaded samples are unavailable.
- Retains the one-use Question Card and changes it to a restrained observational prompt.
- Preserves full reset and post-completion resting states.

## Verification performed here
The edited TypeScript/TSX source was bundled with esbuild as a syntax and import-resolution check. The exported Replit archive did not contain a complete portable pnpm installation, so the normal Vite/pnpm build could not be reproduced locally without downloading packages. Replit should run its normal build after the files are returned.

## Files changed
- `artifacts/workshop-game/src/hooks/useGameState.ts`
- `artifacts/workshop-game/src/hooks/useSoundEngine.ts`
- `artifacts/workshop-game/src/components/Mechanism.tsx`
- `artifacts/workshop-game/src/components/Marble.tsx`
- `artifacts/workshop-game/src/components/Wheel.tsx`
- `artifacts/workshop-game/src/components/QuestionCard.tsx`
