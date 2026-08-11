import { nextSeat, teamForSeat } from "./rules";
import type { Card, CardColor, PlayedCard, RulesConfig, Seat, Team } from "./types";

export function validBids(currentBid: number | null, rules: RulesConfig): number[] {
  const floor = currentBid === null ? rules.minimumBid : currentBid + rules.bidIncrement;
  const bids: number[] = [];
  for (let bid = floor; bid <= rules.maximumBid; bid += rules.bidIncrement) bids.push(bid);
  return bids;
}

export function isValidBid(bid: number, currentBid: number | null, rules: RulesConfig): boolean {
  return validBids(currentBid, rules).includes(bid);
}

export function legalCards(
  hand: readonly Card[],
  leadColor: CardColor | null,
  trumpColor: CardColor,
  rules: RulesConfig,
  rookLed = false,
): Card[] {
  if (hand.length === 0) return [];

  if (rookLed) {
    const trump = hand.filter((card) => !card.isRook && card.color === trumpColor);
    if (trump.length > 0) return rules.rookMayBePlayedAnytime ? [...trump, ...hand.filter((card) => card.isRook)] : trump;
    return [...hand];
  }

  if (leadColor === null) return [...hand];
  const following = hand.filter((card) => !card.isRook && card.color === leadColor);
  if (following.length === 0) return [...hand];
  if (rules.rookMayBePlayedAnytime) return [...following, ...hand.filter((card) => card.isRook)];
  return following;
}

export function trickWinner(trick: readonly PlayedCard[], trumpColor: CardColor, rules: RulesConfig): Seat {
  if (trick.length !== 4) throw new Error("A complete trick requires four cards");

  if (rules.rookActsAsHighestTrump) {
    const rookPlay = trick.find((play) => play.card.isRook);
    if (rookPlay) return rookPlay.seat;
  }

  const normalLead = trick.find((play) => !play.card.isRook);
  if (!normalLead?.card.color) throw new Error("Cannot determine lead color");
  const leadColor = normalLead.card.color;
  const trumps = trick.filter((play) => !play.card.isRook && play.card.color === trumpColor);
  const candidates = trumps.length > 0 ? trumps : trick.filter((play) => !play.card.isRook && play.card.color === leadColor);

  return candidates.reduce((best, play) => ((play.card.rank ?? 0) > (best.card.rank ?? 0) ? play : best)).seat;
}

export function counterPoints(cards: readonly Card[]): number {
  return cards.reduce((sum, card) => sum + card.pointValue, 0);
}

export interface RoundScoreInput {
  bidderSeat: Seat;
  bid: number;
  capturedA: readonly Card[];
  capturedB: readonly Card[];
  nest: readonly Card[];
  lastTrickWinner: Seat;
  rules: RulesConfig;
}

export interface RoundScoreResult {
  countersA: number;
  countersB: number;
  scoreDeltaA: number;
  scoreDeltaB: number;
  biddingTeam: Team;
  madeBid: boolean;
}

export function scoreRound(input: RoundScoreInput): RoundScoreResult {
  const { bidderSeat, bid, rules, lastTrickWinner } = input;
  const biddingTeam = teamForSeat(bidderSeat);
  const nestTeam = teamForSeat(lastTrickWinner);
  const capturedA = [...input.capturedA, ...(rules.lastTrickTakesNest && nestTeam === "A" ? input.nest : [])];
  const capturedB = [...input.capturedB, ...(rules.lastTrickTakesNest && nestTeam === "B" ? input.nest : [])];
  const countersA = counterPoints(capturedA);
  const countersB = counterPoints(capturedB);
  const biddingCounters = biddingTeam === "A" ? countersA : countersB;
  const madeBid = biddingCounters >= bid;

  return {
    countersA,
    countersB,
    scoreDeltaA: biddingTeam === "A" && !madeBid ? -bid : countersA,
    scoreDeltaB: biddingTeam === "B" && !madeBid ? -bid : countersB,
    biddingTeam,
    madeBid,
  };
}

export function turnOrder(start: Seat): Seat[] {
  return [start, nextSeat(start), nextSeat(nextSeat(start)), nextSeat(nextSeat(nextSeat(start)))];
}
