# Rook with Yani

Mobile-first private multiplayer Rook for friends and family.

## Product goal

Four people should be able to create/join a private room from their phones and play a complete game of Rook with correct bidding, nest, trump, legal-play enforcement, trick resolution, scoring, reconnect support, and rematches.

## V1 scope

- 4 human players
- fixed partnerships: seats 1 + 3 vs 2 + 4
- private room code / invite
- mobile-first UI
- Tournament/Kentucky Discard-style defaults, isolated behind configurable house rules
- authoritative multiplayer game state
- reconnect/pause support
- rematch

Not V1: bots, public matchmaking, chat, ads, IAP, rankings, cosmetics.

## Architecture direction

- `packages/game-core`: pure TypeScript rules/state engine. No React Native or backend dependencies.
- `apps/mobile`: Expo + React Native client (next milestone).
- backend: authoritative room/game service with private per-player hand state (next multiplayer milestone).

Keeping the rules engine pure makes it deterministic, unit-testable, reusable on the mobile client and server, and much harder to accidentally break while building UI.

## Current milestone

Build and validate the game core first, then scaffold the Expo app, then add private multiplayer.
