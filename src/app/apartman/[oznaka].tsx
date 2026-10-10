import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useGosti } from "@/context/gosti-context";
import { bojaZaTipGosta } from "@/data/gosti";
import formatirajDatum from "@/utils/datum";
import { ostatakBrojaNoci } from "@/utils/datum";

const nazivTipa = {
  booking: "Booking",
  direkt: "Direktno",
  prijatelji: "Prijatelji",
};

export default function ApartmanDetalji() {
  const router = useRouter();
  const parametri = useLocalSearchParams();
  const oznaka = parametri.oznaka as string;

  const { gosti } = useGosti();
  const danas = new Date().toISOString().split("T")[0];

  const gostiApartmana = gosti.filter(gost => gost.apartman === oznaka);

  const trenutniGost = gostiApartmana.find(
    gost => gost.odDatum <= danas && gost.doDatum >= danas
  );

  const sljedeciGost = [...gostiApartmana]
    .sort((a, b) => a.odDatum.localeCompare(b.odDatum))
    .find(gost => gost.odDatum > danas);

  return (
    <ScrollView style={styles.ekran} contentContainerStyle={styles.sadrzaj}>

      <Pressable style={styles.natrag} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={22} color="#5D70E5" />
        <Text style={styles.natragTekst}>Natrag</Text>
      </Pressable>

      <Text style={styles.naslov}>Apartman {oznaka}</Text>

      <View style={styles.kartica}>
        {trenutniGost ? (
          <>
            <View style={styles.statusRed}>
              <Text style={[styles.status, styles.zauzet]}>ZAUZET</Text>
              <View style={[styles.chip, { backgroundColor: bojaZaTipGosta[trenutniGost.tipGosta] }]}>
                <Text style={styles.chipTekst}>{nazivTipa[trenutniGost.tipGosta]}</Text>
              </View>
            </View>

            <Text style={styles.ime}>{trenutniGost.ime}</Text>

            <View style={styles.infoRed}>
              <Ionicons name="people-outline" size={16} color="#334155" />
              <Text style={styles.info}>
                {trenutniGost.odrasli + trenutniGost.djeca} osoba
              </Text>
            </View>

            <View style={styles.infoRed}>
              <Ionicons name="calendar-outline" size={16} color="#334155" />
              <Text style={styles.info}>
                do {formatirajDatum(trenutniGost.doDatum)} · ostalo još{" "}
                {ostatakBrojaNoci(trenutniGost.doDatum)} noći
              </Text>
            </View>
          </>
        ) : (
          <Text style={[styles.status, styles.slobodan]}>SLOBODAN</Text>
        )}
      </View>

      <Text style={styles.podnaslov}>SLJEDEĆI DOLAZAK</Text>

      <View style={styles.kartica}>
        {sljedeciGost ? (
          <>
            <View style={styles.statusRed}>
              <Text style={styles.ime}>{sljedeciGost.ime}</Text>
              <View style={[styles.chip, { backgroundColor: bojaZaTipGosta[sljedeciGost.tipGosta] }]}>
                <Text style={styles.chipTekst}>{nazivTipa[sljedeciGost.tipGosta]}</Text>
              </View>
            </View>

            <View style={styles.infoRed}>
              <Ionicons name="calendar-outline" size={16} color="#334155" />
              <Text style={styles.info}>
                {formatirajDatum(sljedeciGost.odDatum)} – {formatirajDatum(sljedeciGost.doDatum)}
              </Text>
            </View>
          </>
        ) : (
          <Text style={styles.prazno}>Nema nadolazećih rezervacija</Text>
        )}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  ekran: { flex: 1, backgroundColor: "#EEF2F6" },
  sadrzaj: { padding: 20, paddingBottom: 40 },
  natrag: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  natragTekst: { fontSize: 15, color: "#5D70E5", fontWeight: "600" },
  naslov: { fontSize: 26, fontWeight: "bold", color: "#0F172A", marginBottom: 14 },
  podnaslov: {
    fontSize: 12, fontWeight: "bold", color: "#94A3B8",
    letterSpacing: 0.6, marginTop: 24, marginBottom: 8,
  },
  kartica: { backgroundColor: "white", borderRadius: 16, padding: 16, gap: 8 },
  statusRed: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  status: { fontSize: 14, fontWeight: "bold", letterSpacing: 0.5 },
  zauzet: { color: "#DC2626" },
  slobodan: { color: "#16A34A" },
  chip: { paddingVertical: 3, paddingHorizontal: 10, borderRadius: 999 },
  chipTekst: { fontSize: 11, fontWeight: "600", color: "#0F172A" },
  ime: { fontSize: 20, fontWeight: "bold", color: "#0F172A" },
  infoRed: { flexDirection: "row", alignItems: "center", gap: 6 },
  info: { fontSize: 14, color: "#334155" },
  prazno: { fontSize: 14, color: "#94A3B8" },
});