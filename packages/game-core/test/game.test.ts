import { describe, expect, it } from "vitest";
import {
  DEFAULT_RULES,
  assertUniqueCards,
  createDeck,
  deal,
  legalCards,
  scoreRound,
  trickWinner,
  validBids,
  type Card,
} from "../src";

const card = (id: string, color: Card["color"], rank: Card["rank"], pointValue = 0): Card => ({
  id,
  color,
  rank,
  pointValue,
  isRook: false,
});
const rook: Card = { id: "rook", color: null, rank: null, pointValue: 20, isRook: true };

describe("deck", () => {
  it("creates 41 unique cards worth 120 counters", () => {
    const deck = createDeck(DEFAULT_RULES);
    expect(deck).toHaveLength(41);
    assertUniqueCards(deck);
    expect(deck.reduce((sum, c) => sum + c.pointValue, 0)).toBe(120);
  });

  it("deals nine cards to each player and five to the nest", () => {
    const result = deal(createDeck(DEFAULT_RULES), 4);
    expect(Object.values(result.hands).map((hand) => hand.length)).toEqual([9, 9, 9, 9]);
    expect(result.nest).toHaveLength(5);
    assertUniqueCards([...Object.values(result.hands).flat(), ...result.nest]);
  });
});

describe("bidding", () => {
  it("offers 70 through 120 initially and only higher bids later", () => {
    expect(validBids(null, DEFAULT_RULES)[0]).toBe(70);
    expect(validBids(null, DEFAULT_RULES).at(-1)).toBe(120);
    expect(validBids(85, DEFAULT_RULES)[0]).toBe(90);
  });
});

describe("legal play", () => {
  it("requires following color but allows the Rook under default rules", () => {
    const hand = [card("r7", "red", 7), card("g14", "green", 14, 10), rook];
    expect(legalCards(hand, "red", "green", DEFAULT_RULES).map((c) => c.id)).toEqual(["r7", "rook"]);
  });

  it("allows any card when player cannot follow color", () => {
    const hand = [card("g14", "green", 14, 10), rook];
    expect(legalCards(hand, "red", "green", DEFAULT_RULES)).toHaveLength(2);
  });
});

describe("tricks", () => {
  it("highest trump beats lead color", () => {
    const winner = trickWinner([
      { seat: 1, card: card("r14", "red", 14, 10) },
      { seat: 2, card: card("r5", "red", 5, 5) },
      { seat: 3, card: card("g5", "green", 5, 5) },
      { seat: 4, card: card("r13", "red", 13) },
    ], "green", DEFAULT_RULES);
    expect(winner).toBe(3);
  });

  it("Rook wins as highest trump", () => {
    const winner = trickWinner([
      { seat: 1, card: card("g14", "green", 14, 10) },
      { seat: 2, card: rook },
      { seat: 3, card: card("g13", "green", 13) },
      { seat: 4, card: card("r14", "red", 14, 10) },
    ], "green", DEFAULT_RULES);
    expect(winner).toBe(2);
  });
});

describe("scoring", () => {
  it("sets the bidding team when it misses the bid and scores defenders", () => {
    const result = scoreRound({
      bidderSeat: 1,
      bid: 90,
      capturedA: [card("r14", "red", 14, 10)],
      capturedB: [card("g14", "green", 14, 10), rook],
      nest: [card("b10", "black", 10, 10)],
      lastTrickWinner: 2,
      rules: DEFAULT_RULES,
    });
    expect(result.madeBid).toBe(false);
    expect(result.scoreDeltaA).toBe(-90);
    expect(result.scoreDeltaB).toBe(40);
  });
});
