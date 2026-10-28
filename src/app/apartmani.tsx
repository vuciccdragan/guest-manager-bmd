import { Pressable, ScrollView, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useGosti } from "@/context/gosti-context";
import { apartmani } from "@/data/apartmani";
import { bojaZaTipGosta } from "@/data/gosti";
import { formatirajDatumGodina } from "@/utils/datum";

export default function Apartmani() {
  const router = useRouter();
  const { gosti, ucitavanje } = useGosti();

  const danas = new Date().toISOString().split("T")[0];

  if (ucitavanje) {
    return (
      <View style={styles.sredina}>
        <ActivityIndicator size="large" color="#5D70E5" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.ekran} contentContainerStyle={styles.sadrzaj}>

      <Pressable style={styles.natrag} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={22} color="#5D70E5" />
        <Text style={styles.natragTekst}>Natrag</Text>
      </Pressable>

      <Text style={styles.naslov}>Apartmani</Text>

      {apartmani.map(oznaka => {
        const gost = gosti.find(
          g => g.apartman === oznaka && g.odDatum <= danas && g.doDatum > danas
        );
        const zauzet = gost !== undefined;

        return (
          <Pressable
            key={oznaka}
            style={styles.kartica}
            onPress={() => router.push(`/apartman/${oznaka}` as any)}
          >
            <View style={[styles.oznakaOkvir, zauzet ? styles.okvirZauzet : styles.okvirSlobodan]}>
              <Text style={[styles.oznakaTekst, zauzet ? styles.tekstZauzet : styles.tekstSlobodan]}>
                {oznaka}
              </Text>
            </View>

            <View style={styles.tekstBlok}>
              {zauzet ? (
                <>
                  <Text style={styles.ime}>{gost.ime}</Text>
                  <View style={styles.donjiRed}>
                    <View style={[styles.tocka, { backgroundColor: bojaZaTipGosta[gost.tipGosta] }]} />
                    <Text style={styles.info}>do {formatirajDatumGodina(gost.doDatum)}</Text>
                  </View>
                </>
              ) : (
                <>
                  <Text style={styles.slobodan}>Slobodan</Text>
                  <Text style={styles.info}>Nema trenutnog gosta</Text>
                </>
              )}
            </View>

            <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
          </Pressable>
        );
      })}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  ekran: { flex: 1, backgroundColor: "#F1F5F9" },
  sadrzaj: { padding: 20, paddingBottom: 40 },
  sredina: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
  },
  natrag: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  natragTekst: { fontSize: 15, color: "#5D70E5", fontWeight: "600" },
  naslov: { fontSize: 28, fontWeight: "bold", color: "#0F172A", marginBottom: 18 },
  kartica: {
    flexDirection: "row", alignItems: "center", gap: 14,
    backgroundColor: "white", borderRadius: 16,
    padding: 14, marginBottom: 10,
  },
  oznakaOkvir: {
    width: 48, height: 48, borderRadius: 12,
    alignItems: "center", justifyContent: "center",
  },
  okvirZauzet: { backgroundColor: "#FEE2E2" },
  okvirSlobodan: { backgroundColor: "#DCFCE7" },
  oznakaTekst: { fontSize: 17, fontWeight: "bold" },
  tekstZauzet: { color: "#DC2626" },
  tekstSlobodan: { color: "#16A34A" },
  tekstBlok: { flex: 1 },
  ime: { fontSize: 16, fontWeight: "bold", color: "#0F172A" },
  slobodan: { fontSize: 16, fontWeight: "bold", color: "#16A34A" },
  donjiRed: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 3 },
  tocka: { width: 8, height: 8, borderRadius: 4 },
  info: { fontSize: 13, color: "#64748B", marginTop: 1 },
});