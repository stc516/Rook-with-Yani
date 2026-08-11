# AGENTS.md — Rook with Yani

## Mission
Build a polished mobile-first Rook game for private play with friends and family. The first useful release is four human players completing reliable online games from their phones.

## Product priorities
1. Correct rules and scoring.
2. Multiplayer reliability and hidden-information privacy.
3. Fast, obvious mobile UX.
4. Reconnect and rematch reliability.
5. Visual polish after the above are solid.

Do not add bots, public matchmaking, chat, ads, IAP, rankings, achievements, or cosmetics unless explicitly requested.

## Technical rules
- TypeScript throughout.
- Keep `packages/game-core` pure: no React, React Native, Expo, database, network, timers, or UI dependencies.
- All rule-changing behavior must be represented by a `RulesConfig`; avoid scattered magic constants.
- Prefer pure deterministic reducers/functions for game transitions.
- Never trust a client to determine deck order, another player's hand, trick winners, round scores, or game winners in online play.
- The authoritative backend must validate every action.
- Do not send hidden hands or nest contents to players who should not see them.
- Add/update tests whenever game rules change.
- Preserve a complete card-conservation invariant: every card must exist in exactly one valid location.

## Default V1 rules
- 4 players.
- Seats 1 and 3 are Team A; seats 2 and 4 Team B.
- 41 cards: colors red/yellow/green/black, ranks 5–14, plus Rook Bird.
- Five-card nest; nine cards per player.
- Counter values: 5=5, 10=10, 14=10, Rook=20; 120 total counters.
- Minimum bid 70, increment 5, maximum 120.
- Winning bidder takes nest, discards exactly five, then chooses trump.
- Players follow lead color when possible; Rook may be played regardless.
- Rook is highest trump by default.
- Final-trick winner takes nest.
- If bidding team makes bid, both teams add captured counters. If bidding team fails, subtract bid from bidding team; defenders still add captured counters.
- Default winning score 300.

## Important ambiguity policy
Rook has many house-rule variants. If a requested rule differs from defaults, implement it through `RulesConfig` where practical rather than replacing the core model. If a rule is genuinely ambiguous, document the assumption rather than silently inventing behavior.

## Development workflow
- Keep changes small enough to test.
- Run typecheck and tests after meaningful rules changes.
- Never weaken tests just to make a failing implementation pass.
- When building UI, prioritize portrait phones and accessible tap targets.
- When building multiplayer, test with four simultaneous clients plus disconnect/reconnect cases.
