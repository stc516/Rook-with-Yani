import type { RulesConfig, Seat, Team } from "./types";

export const DEFAULT_RULES: RulesConfig = {
  players: 4,
  minimumBid: 70,
  maximumBid: 120,
  bidIncrement: 5,
  nestSize: 5,
  winningScore: 300,
  rookValue: 20,
  rookActsAsHighestTrump: true,
  rookMayBePlayedAnytime: true,
  lastTrickTakesNest: true,
};

export function teamForSeat(seat: Seat): Team {
  return seat === 1 || seat === 3 ? "A" : "B";
}

export function nextSeat(seat: Seat): Seat {
  return (seat === 4 ? 1 : seat + 1) as Seat;
}
