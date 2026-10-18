import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useGosti } from "@/context/gosti-context";
import { apartmani } from "@/data/apartmani";
import { supabase } from "@/lib/supabase";

const izbornik = [
  { naziv: "Stanje ville", opis: "Pregled svih apartmana", ikona: "calendar", ruta: "/stanje-ville", boja: "#5D70E5" },
  { naziv: "Apartmani", opis: "Detalji i rezervacije", ikona: "home", ruta: "/apartmani", boja: "#0EA5E9" },
  { naziv: "Slobodno", opis: "Pretraga po datumima", ikona: "search", ruta: "/slobodno", boja: "#16A34A" },
  { naziv: "Dnevni plan", opis: "Zadaci za danas", ikona: "checkmark-done", ruta: "/dnevni-plan", boja: "#F59E0B" },
  { naziv: "Raspored gostiju", opis: "Trenutna zauzetost", ikona: "people", ruta: "/raspored-gostiju", boja: "#8B5CF6" },
];

export default function Index() {
  const router = useRouter();
  const { gosti } = useGosti();

  const danas = new Date().toISOString().split("T")[0];

  const trenutniGosti = gosti.filter(g => g.odDatum <= danas && g.doDatum > danas);
  const dolasciDanas = gosti.filter(g => g.odDatum === danas);
  const odlasciDanas = gosti.filter(g => g.doDatum === danas);
  const slobodnih = apartmani.length - trenutniGosti.length;

  return (
    <ScrollView style={styles.ekran} contentContainerStyle={styles.sadrzaj}>

      <Text style={styles.pozdrav}>Guest Manager</Text>
      <Text style={styles.podnaslov}>Villa Bomada</Text>

      <View style={styles.statistika}>
        <View style={styles.statKartica}>
          <Text style={styles.statBroj}>{trenutniGosti.length}</Text>
          <Text style={styles.statOpis}>zauzeto</Text>
        </View>
        <View style={styles.statKartica}>
          <Text style={[styles.statBroj, { color: "#16A34A" }]}>{slobodnih}</Text>
          <Text style={styles.statOpis}>slobodno</Text>
        </View>
        <View style={styles.statKartica}>
          <Text style={[styles.statBroj, { color: "#0EA5E9" }]}>{dolasciDanas.length}</Text>
          <Text style={styles.statOpis}>dolazaka</Text>
        </View>
        <View style={styles.statKartica}>
          <Text style={[styles.statBroj, { color: "#F59E0B" }]}>{odlasciDanas.length}</Text>
          <Text style={styles.statOpis}>odlazaka</Text>
        </View>
      </View>

      {izbornik.map(stavka => (
        <Pressable
          key={stavka.ruta}
          style={styles.kartica}
          onPress={() => router.push(stavka.ruta as any)}
        >
          <View style={[styles.ikonaOkvir, { backgroundColor: stavka.boja }]}>
            <Ionicons name={stavka.ikona as any} size={22} color="white" />
          </View>
          <View style={styles.tekstBlok}>
            <Text style={styles.karticaNaziv}>{stavka.naziv}</Text>
            <Text style={styles.karticaOpis}>{stavka.opis}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
        </Pressable>
      ))}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  ekran: { flex: 1, backgroundColor: "#F1F5F9" },
  sadrzaj: { padding: 20, paddingBottom: 40 },
  pozdrav: { fontSize: 28, fontWeight: "bold", color: "#0F172A" },
  podnaslov: { fontSize: 15, color: "#64748B", marginTop: 2, marginBottom: 20 },
  statistika: { flexDirection: "row", gap: 10, marginBottom: 24 },
  statKartica: {
    flex: 1, backgroundColor: "white", borderRadius: 14,
    paddingVertical: 14, alignItems: "center",
  },
  statBroj: { fontSize: 24, fontWeight: "bold", color: "#DC2626" },
  statOpis: { fontSize: 11, color: "#64748B", marginTop: 2 },
  kartica: {
    flexDirection: "row", alignItems: "center", gap: 14,
    backgroundColor: "white", borderRadius: 16,
    padding: 16, marginBottom: 10,
  },
  ikonaOkvir: {
    width: 44, height: 44, borderRadius: 12,
    alignItems: "center", justifyContent: "center",
  },
  tekstBlok: { flex: 1 },
  karticaNaziv: { fontSize: 16, fontWeight: "bold", color: "#0F172A" },
  karticaOpis: { fontSize: 13, color: "#64748B", marginTop: 1 },
});