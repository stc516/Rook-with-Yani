export const COLORS = ["red", "yellow", "green", "black"] as const;
export type CardColor = (typeof COLORS)[number];
export type Seat = 1 | 2 | 3 | 4;
export type Team = "A" | "B";
export type Rank = 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;

export interface Card {
  id: string;
  color: CardColor | null;
  rank: Rank | null;
  pointValue: number;
  isRook: boolean;
}

export interface RulesConfig {
  players: 4;
  minimumBid: number;
  maximumBid: number;
  bidIncrement: number;
  nestSize: number;
  winningScore: number;
  rookValue: number;
  rookActsAsHighestTrump: boolean;
  rookMayBePlayedAnytime: boolean;
  lastTrickTakesNest: boolean;
}

export type Phase =
  | "LOBBY"
  | "DEAL"
  | "BIDDING"
  | "NEST"
  | "SELECT_TRUMP"
  | "PLAYING"
  | "ROUND_COMPLETE"
  | "GAME_COMPLETE";

export interface PlayedCard {
  seat: Seat;
  card: Card;
}

export interface BidState {
  currentBid: number | null;
  highBidderSeat: Seat | null;
  passedSeats: Seat[];
}

export interface GameState {
  phase: Phase;
  dealerSeat: Seat;
  currentSeat: Seat;
  highBidderSeat: Seat | null;
  currentBid: number | null;
  trumpColor: CardColor | null;
  leadColor: CardColor | null;
  trickNumber: number;
  teamAScore: number;
  teamBScore: number;
  roundPointsA: number;
  roundPointsB: number;
  hands: Record<Seat, Card[]>;
  nest: Card[];
  currentTrick: PlayedCard[];
  capturedCards: Record<Team, Card[]>;
  passedBidding: Seat[];
}
