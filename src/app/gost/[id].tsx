import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useGosti } from "@/context/gosti-context";
import { bojaZaTipGosta } from "@/data/gosti";
import { formatirajDatum, brojNociUkupno } from "@/utils/datum";
import RasporedServisa from "@/components/raspored-servisa";

const nazivTipa = {
  booking: "Booking",
  direkt: "Direktno",
  prijatelji: "Prijatelji",
};

export default function GostDetalji() {
  const router = useRouter();
  const parametri = useLocalSearchParams();
  const trazeniId = (parametri.id as string);

  const { gosti } = useGosti();
  const gost = gosti.find(g => g.id === trazeniId);

  if (!gost) {
    return (
      <View style={styles.ekran}>
        <Text style={styles.poruka}>Gost nije pronađen.</Text>
      </View>
    );
  }

  const inicijali = gost.ime
    .split(" ")
    .map(rijec => rijec[0])
    .join("");

  return (
    <ScrollView style={styles.ekran} contentContainerStyle={styles.sadrzaj}>

      <Pressable style={styles.natrag} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={22} color="#5D70E5" />
        <Text style={styles.natragTekst}>Natrag</Text>
      </Pressable>

      <View style={styles.kartica}>
        <View style={styles.gornjiRed}>
          <View style={[styles.avatar, { backgroundColor: bojaZaTipGosta[gost.tipGosta] }]}>
            <Text style={styles.inicijali}>{inicijali}</Text>
          </View>

          <View style={styles.imeBlok}>
            <Text style={styles.ime}>{gost.ime}</Text>
            <View style={styles.chipRed}>
              <View style={[styles.chip, { backgroundColor: bojaZaTipGosta[gost.tipGosta] }]}>
                <Text style={styles.chipTekst}>{nazivTipa[gost.tipGosta]}</Text>
              </View>
              <Text style={styles.apartman}>Apartman {gost.apartman}</Text>
            </View>
          </View>

          <Pressable
            style={styles.olovka}
            onPress={() => router.push(`/uredi-gost/${gost.id}` as any)}
          >
            <Ionicons name="pencil" size={20} color="#5D70E5" />
          </Pressable>
        </View>

        <View style={styles.crta} />

        <View style={styles.detalji}>
          <View style={styles.detaljRed}>
            <Ionicons name="calendar-outline" size={18} color="#64748B" />
            <Text style={styles.detaljTekst}>
              {formatirajDatum(gost.odDatum)} – {formatirajDatum(gost.doDatum)}
            </Text>
            <Text style={styles.noci}>
              {brojNociUkupno(gost.odDatum, gost.doDatum)} noći
            </Text>
          </View>

          <View style={styles.detaljRed}>
            <Ionicons name="person-outline" size={18} color="#64748B" />
            <Text style={styles.detaljTekst}>{gost.odrasli} odraslih</Text>
          </View>

          <View style={styles.detaljRed}>
            <MaterialCommunityIcons name="baby-face-outline" size={18} color="#64748B" />
            <Text style={styles.detaljTekst}>{gost.djeca} djece</Text>
          </View>
          <RasporedServisa gostProp={gost} />
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  ekran: { flex: 1, backgroundColor: "#F1F5F9" },
  sadrzaj: { padding: 20, paddingBottom: 40 },
  natrag: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  natragTekst: { fontSize: 15, color: "#5D70E5", fontWeight: "600" },
  kartica: { backgroundColor: "white", borderRadius: 16, padding: 16 },
  gornjiRed: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: {
    width: 46, height: 46, borderRadius: 23,
    alignItems: "center", justifyContent: "center",
  },
  inicijali: { fontSize: 16, fontWeight: "bold", color: "#0F172A" },
  imeBlok: { flex: 1 },
  ime: { fontSize: 20, fontWeight: "bold", color: "#0F172A" },
  chipRed: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4 },
  chip: { paddingVertical: 3, paddingHorizontal: 9, borderRadius: 999 },
  chipTekst: { fontSize: 11, fontWeight: "700", color: "#0F172A" },
  apartman: { fontSize: 13, color: "#64748B" },
  olovka: {
    width: 38, height: 38, borderRadius: 10, backgroundColor: "#EEF2FF",
    alignItems: "center", justifyContent: "center",
  },
  crta: { height: 1, backgroundColor: "#F1F5F9", marginVertical: 14 },
  detalji: { gap: 10 },
  detaljRed: { flexDirection: "row", alignItems: "center", gap: 10 },
  detaljTekst: { fontSize: 15, color: "#334155", flex: 1 },
  noci: { fontSize: 13, fontWeight: "600", color: "#5D70E5" },
  poruka: { fontSize: 16, color: "#64748B", padding: 20 },
});