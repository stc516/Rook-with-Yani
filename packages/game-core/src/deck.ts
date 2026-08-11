import { COLORS, type Card, type Rank, type RulesConfig, type Seat } from "./types";

const RANKS: Rank[] = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

export function pointValueForRank(rank: Rank): number {
  if (rank === 5) return 5;
  if (rank === 10 || rank === 14) return 10;
  return 0;
}

export function createDeck(rules: RulesConfig): Card[] {
  const cards: Card[] = COLORS.flatMap((color) =>
    RANKS.map((rank) => ({
      id: `${color}-${rank}`,
      color,
      rank,
      pointValue: pointValueForRank(rank),
      isRook: false,
    })),
  );

  cards.push({
    id: "rook",
    color: null,
    rank: null,
    pointValue: rules.rookValue,
    isRook: true,
  });

  return cards;
}

export function shuffle<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

export interface DealResult {
  hands: Record<Seat, Card[]>;
  nest: Card[];
}

export function deal(deck: readonly Card[], dealerSeat: Seat, nestSize = 5): DealResult {
  if (deck.length !== 41) throw new Error(`Expected 41 cards, got ${deck.length}`);
  if (nestSize !== 5) throw new Error("V1 deck requires a five-card nest");

  const hands: Record<Seat, Card[]> = { 1: [], 2: [], 3: [], 4: [] };
  const cards = [...deck];
  const firstSeat = (dealerSeat === 4 ? 1 : dealerSeat + 1) as Seat;
  const order: Seat[] = [firstSeat, (firstSeat % 4 + 1) as Seat, ((firstSeat + 1) % 4 + 1) as Seat, ((firstSeat + 2) % 4 + 1) as Seat];

  for (let round = 0; round < 9; round += 1) {
    for (const seat of order) {
      const card = cards.shift();
      if (!card) throw new Error("Deck exhausted while dealing");
      hands[seat].push(card);
    }
  }

  const nest = cards.splice(0, nestSize);
  if (cards.length !== 0 || nest.length !== nestSize) throw new Error("Invalid deal conservation");
  return { hands, nest };
}

export function assertUniqueCards(cards: readonly Card[]): void {
  const ids = cards.map((card) => card.id);
  if (new Set(ids).size !== ids.length) throw new Error("Duplicate card detected");
}
