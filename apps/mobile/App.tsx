import { useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { createDeck, deal, DEFAULT_RULES, shuffle, type Card, type Seat } from "@rook/game-core";

type Screen = "home" | "table";

function cardLabel(card: Card): string {
  if (card.isRook) return "ROOK";
  return `${card.color?.toUpperCase()} ${card.rank}`;
}

function cardShortLabel(card: Card): string {
  if (card.isRook) return "R";
  const color = card.color ? card.color[0]?.toUpperCase() : "?";
  return `${color}${card.rank}`;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [dealerSeat, setDealerSeat] = useState<Seat>(1);
  const [activeSeat, setActiveSeat] = useState<Seat>(1);
  const [dealNumber, setDealNumber] = useState(1);

  const currentDeal = useMemo(() => {
    const deck = shuffle(createDeck(DEFAULT_RULES));
    return deal(deck, dealerSeat, DEFAULT_RULES.nestSize);
  }, [dealerSeat, dealNumber]);

  function redeal() {
    setDealNumber((value) => value + 1);
  }

  function rotateDealer() {
    setDealerSeat((seat) => (seat === 4 ? 1 : ((seat + 1) as Seat)));
    setDealNumber((value) => value + 1);
  }

  if (screen === "home") {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />
        <View style={styles.home}>
          <Text style={styles.eyebrow}>PRIVATE FAMILY CARD TABLE</Text>
          <Text style={styles.title}>Rook with Yani</Text>
          <Text style={styles.subtitle}>
            First playable build: verify dealing, hands, seating and the mobile table before multiplayer.
          </Text>

          <TouchableOpacity style={styles.primaryButton} onPress={() => setScreen("table")}>
            <Text style={styles.primaryButtonText}>Start Local Test</Text>
          </TouchableOpacity>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>V1 target</Text>
            <Text style={styles.infoText}>4 players · 2 teams · private room code · full Rook rules</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const activeHand = currentDeal.hands[activeSeat];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.tableScreen}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => setScreen("home")}>
            <Text style={styles.link}>← Home</Text>
          </TouchableOpacity>
          <Text style={styles.score}>Team A 0 · 0 Team B</Text>
        </View>

        <View style={styles.partnerSeat}>
          <Text style={styles.seatName}>Seat 3 · Partner</Text>
          <View style={styles.cardBackRow}>
            {Array.from({ length: 9 }).map((_, index) => (
              <View key={index} style={styles.cardBack} />
            ))}
          </View>
        </View>

        <View style={styles.middleRow}>
          <View style={styles.sideSeat}>
            <Text style={styles.sideSeatName}>Seat 4</Text>
            <Text style={styles.cardCount}>9 cards</Text>
          </View>

          <View style={styles.trickArea}>
            <Text style={styles.trickTitle}>CURRENT TRICK</Text>
            <Text style={styles.trickPlaceholder}>Cards will land here</Text>
            <View style={styles.statusPills}>
              <Text style={styles.pill}>Dealer: {dealerSeat}</Text>
              <Text style={styles.pill}>Trump: —</Text>
              <Text style={styles.pill}>Bid: —</Text>
            </View>
          </View>

          <View style={styles.sideSeat}>
            <Text style={styles.sideSeatName}>Seat 2</Text>
            <Text style={styles.cardCount}>9 cards</Text>
          </View>
        </View>

        <View style={styles.devControls}>
          <Text style={styles.devLabel}>LOCAL TEST · VIEW HAND</Text>
          <View style={styles.seatButtons}>
            {([1, 2, 3, 4] as Seat[]).map((seat) => (
              <TouchableOpacity
                key={seat}
                style={[styles.seatButton, activeSeat === seat && styles.seatButtonActive]}
                onPress={() => setActiveSeat(seat)}
              >
                <Text style={[styles.seatButtonText, activeSeat === seat && styles.seatButtonTextActive]}>
                  {seat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hand}>
          {activeHand.map((card) => (
            <TouchableOpacity key={card.id} style={styles.playingCard} onPress={() => {}}>
              <Text style={styles.cardShort}>{cardShortLabel(card)}</Text>
              <Text style={styles.cardLong}>{cardLabel(card)}</Text>
              {card.pointValue > 0 && <Text style={styles.points}>{card.pointValue} pts</Text>}
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.bottomControls}>
          <TouchableOpacity style={styles.secondaryButton} onPress={redeal}>
            <Text style={styles.secondaryButtonText}>Redeal</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primarySmallButton} onPress={rotateDealer}>
            <Text style={styles.primaryButtonText}>Next Dealer</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.nestText}>Nest: {currentDeal.nest.length} cards · Hand: {activeHand.length} cards</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#101B18" },
  home: { flex: 1, padding: 28, justifyContent: "center" },
  eyebrow: { color: "#A7C7B8", fontSize: 12, fontWeight: "800", letterSpacing: 1.6, marginBottom: 12 },
  title: { color: "#F7F1E3", fontSize: 42, lineHeight: 46, fontWeight: "900" },
  subtitle: { color: "#C8D5CF", fontSize: 17, lineHeight: 25, marginTop: 14, marginBottom: 30 },
  primaryButton: { backgroundColor: "#E2B659", borderRadius: 16, paddingVertical: 17, alignItems: "center" },
  primarySmallButton: { flex: 1, backgroundColor: "#E2B659", borderRadius: 12, paddingVertical: 13, alignItems: "center" },
  primaryButtonText: { color: "#17201D", fontWeight: "900", fontSize: 16 },
  secondaryButton: { flex: 1, borderColor: "#6E857B", borderWidth: 1, borderRadius: 12, paddingVertical: 13, alignItems: "center" },
  secondaryButtonText: { color: "#F7F1E3", fontWeight: "800", fontSize: 15 },
  infoCard: { marginTop: 18, backgroundColor: "#192824", borderRadius: 16, padding: 18 },
  infoTitle: { color: "#F7F1E3", fontWeight: "900", marginBottom: 6 },
  infoText: { color: "#AFC0B8", lineHeight: 20 },
  tableScreen: { flex: 1, paddingHorizontal: 14, paddingTop: 6, paddingBottom: 10 },
  topBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 8 },
  link: { color: "#E2B659", fontWeight: "800" },
  score: { color: "#F7F1E3", fontWeight: "800", fontSize: 13 },
  partnerSeat: { alignItems: "center", paddingTop: 4 },
  seatName: { color: "#AFC0B8", fontSize: 12, fontWeight: "800", marginBottom: 5 },
  cardBackRow: { flexDirection: "row" },
  cardBack: { width: 20, height: 30, backgroundColor: "#315D51", borderWidth: 1, borderColor: "#7FA293", borderRadius: 4, marginHorizontal: -3 },
  middleRow: { flex: 1, minHeight: 220, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  sideSeat: { width: 55, alignItems: "center" },
  sideSeatName: { color: "#F7F1E3", fontSize: 12, fontWeight: "900" },
  cardCount: { color: "#83988E", fontSize: 10, marginTop: 4 },
  trickArea: { flex: 1, marginHorizontal: 8, minHeight: 150, backgroundColor: "#17372E", borderRadius: 28, borderWidth: 1, borderColor: "#315D51", alignItems: "center", justifyContent: "center", padding: 12 },
  trickTitle: { color: "#91AFA1", fontSize: 10, letterSpacing: 1.2, fontWeight: "900" },
  trickPlaceholder: { color: "#F7F1E3", fontSize: 17, fontWeight: "800", marginVertical: 15 },
  statusPills: { flexDirection: "row", gap: 5, flexWrap: "wrap", justifyContent: "center" },
  pill: { color: "#C9D6D0", backgroundColor: "#24483E", borderRadius: 999, paddingHorizontal: 9, paddingVertical: 5, fontSize: 10, fontWeight: "700" },
  devControls: { backgroundColor: "#182723", borderRadius: 12, padding: 10, marginBottom: 8 },
  devLabel: { color: "#7F968C", fontSize: 9, fontWeight: "900", letterSpacing: 1.2, marginBottom: 7 },
  seatButtons: { flexDirection: "row", gap: 7 },
  seatButton: { width: 34, height: 30, borderRadius: 9, backgroundColor: "#263934", alignItems: "center", justifyContent: "center" },
  seatButtonActive: { backgroundColor: "#E2B659" },
  seatButtonText: { color: "#B9CBC3", fontWeight: "900" },
  seatButtonTextActive: { color: "#17201D" },
  hand: { paddingVertical: 6, paddingHorizontal: 2, alignItems: "center" },
  playingCard: { width: 74, height: 108, backgroundColor: "#F7F1E3", borderRadius: 10, marginRight: 7, padding: 7, justifyContent: "space-between" },
  cardShort: { color: "#17201D", fontWeight: "900", fontSize: 18 },
  cardLong: { color: "#46534F", fontWeight: "700", fontSize: 9 },
  points: { color: "#8A5F09", fontSize: 9, fontWeight: "900" },
  bottomControls: { flexDirection: "row", gap: 10, marginTop: 6 },
  nestText: { textAlign: "center", color: "#80958B", fontSize: 10, marginTop: 7 },
});
