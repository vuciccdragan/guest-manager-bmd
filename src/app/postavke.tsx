import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/auth-context";
import { usePostavke } from "@/context/postavke-context";
import { apartmani } from "@/data/apartmani";

const tipovi = [
  { kljuc: "servisBooking" as const, naziv: "Booking", opis: "Gosti s Booking.com", boja: "#16A34A" },
  { kljuc: "servisDirekt" as const, naziv: "Direktno", opis: "Izravne rezervacije", boja: "#2563EB" },
  { kljuc: "servisPrijatelji" as const, naziv: "Prijatelji", opis: "Prijatelji i rodbina", boja: "#CA8A04" },
];

export default function Postavke() {
  const router = useRouter();
  const { odjaviSe, sesija } = useAuth();
  const { postavke, ucitavanje, spremiPostavke } = usePostavke();

  if (ucitavanje) {
    return (
      <View style={styles.sredina}>
        <ActivityIndicator size="large" color="#5D70E5" />
      </View>
    );
  }

  if (!postavke) {
    return (
      <View style={styles.sredina}>
        <Text style={styles.prazno}>Postavke nisu dostupne.</Text>
      </View>
    );
  }

  function promijeni(kljuc: "servisBooking" | "servisDirekt" | "servisPrijatelji", smjer: number) {
    if (!postavke) return;
    const nova = Math.min(Math.max(postavke[kljuc] + smjer, 0), 14);
    spremiPostavke({ ...postavke, [kljuc]: nova });
  }

  return (
    <ScrollView style={styles.ekran} contentContainerStyle={styles.sadrzaj}>

      <Pressable style={styles.natrag} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={22} color="#5D70E5" />
        <Text style={styles.natragTekst}>Natrag</Text>
      </Pressable>

      <Text style={styles.naslov}>Postavke</Text>

      <Text style={styles.oznaka}>DNEVNI ULAZAK</Text>
      <View style={styles.kartica}>
        <Text style={styles.opis}>
          Svakih koliko dana boravka ulazite u apartman. Crtica znači da se ulazak ne predlaže.
        </Text>

        {tipovi.map(tip => (
          <View key={tip.kljuc} style={styles.red}>
            <View style={[styles.tocka, { backgroundColor: tip.boja }]} />

            <View style={styles.tekstBlok}>
              <Text style={styles.naziv}>{tip.naziv}</Text>
              <Text style={styles.podnaziv}>{tip.opis}</Text>
            </View>

            <Pressable style={styles.kvadratic} onPress={() => promijeni(tip.kljuc, -1)}>
              <Ionicons name="remove" size={16} color="white" />
            </Pressable>

            <Text style={styles.broj}>
              {postavke[tip.kljuc] === 0 ? "—" : postavke[tip.kljuc]}
            </Text>

            <Pressable style={styles.kvadratic} onPress={() => promijeni(tip.kljuc, 1)}>
              <Ionicons name="add" size={16} color="white" />
            </Pressable>
          </View>
        ))}
      </View>

      <Text style={styles.oznaka}>OBJEKT</Text>
      <View style={styles.kartica}>
        <View style={styles.infoRed}>
          <Ionicons name="home-outline" size={20} color="#64748B" />
          <Text style={styles.infoNaziv}>Villa Bomada</Text>
        </View>
        <View style={styles.infoRed}>
          <Ionicons name="grid-outline" size={20} color="#64748B" />
          <Text style={styles.infoNaziv}>Broj apartmana</Text>
          <Text style={styles.infoVrijednost}>{apartmani.length}</Text>
        </View>
        <View style={styles.infoRed}>
          <Ionicons name="time-outline" size={20} color="#64748B" />
          <Text style={styles.infoNaziv}>Odjava do</Text>
          <Text style={styles.infoVrijednost}>10:00</Text>
        </View>
      </View>

      <Text style={styles.oznaka}>RAČUN</Text>
      <View style={styles.kartica}>
        <View style={styles.infoRed}>
          <Ionicons name="person-outline" size={20} color="#64748B" />
          <Text style={styles.infoNaziv}>Prijavljen kao</Text>
        </View>
        <Text style={styles.email}>{sesija?.user.email}</Text>
      </View>

      <Pressable style={styles.gumbOdjava} onPress={odjaviSe}>
        <Ionicons name="log-out-outline" size={20} color="#DC2626" />
        <Text style={styles.gumbOdjavaTekst}>ODJAVI SE</Text>
      </Pressable>

      <Text style={styles.verzija}>Villa Bomada · verzija 1.0</Text>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  ekran: { flex: 1, backgroundColor: "#F1F5F9" },
  sadrzaj: { padding: 20, paddingBottom: 40 },
  sredina: {
    flex: 1, justifyContent: "center", alignItems: "center",
    backgroundColor: "#F1F5F9",
  },
  prazno: { fontSize: 15, color: "#64748B" },
  natrag: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  natragTekst: { fontSize: 15, color: "#5D70E5", fontWeight: "600" },
  naslov: { fontSize: 28, fontWeight: "bold", color: "#0F172A" },
  oznaka: {
    fontSize: 12, fontWeight: "bold", color: "#94A3B8",
    letterSpacing: 0.6, marginTop: 24, marginBottom: 8,
  },
  kartica: { backgroundColor: "white", borderRadius: 16, padding: 16, gap: 14 },
  opis: { fontSize: 13, color: "#64748B", lineHeight: 19 },
  red: { flexDirection: "row", alignItems: "center", gap: 10 },
  tocka: { width: 10, height: 10, borderRadius: 5 },
  tekstBlok: { flex: 1 },
  naziv: { fontSize: 15, fontWeight: "600", color: "#0F172A" },
  podnaziv: { fontSize: 12, color: "#94A3B8", marginTop: 1 },
  kvadratic: {
    width: 28, height: 28, borderRadius: 8, backgroundColor: "#5D70E5",
    alignItems: "center", justifyContent: "center",
  },
  broj: {
    fontSize: 16, fontWeight: "bold", color: "#0F172A",
    minWidth: 24, textAlign: "center",
  },
  infoRed: { flexDirection: "row", alignItems: "center", gap: 10 },
  infoNaziv: { flex: 1, fontSize: 15, color: "#0F172A" },
  infoVrijednost: { fontSize: 15, fontWeight: "600", color: "#5D70E5" },
  email: { fontSize: 14, color: "#64748B", marginLeft: 30, marginTop: -8 },
  gumbOdjava: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    backgroundColor: "#FEE2E2", borderRadius: 12, paddingVertical: 15, marginTop: 24,
  },
  gumbOdjavaTekst: { color: "#DC2626", fontSize: 15, fontWeight: "bold" },
  verzija: {
    fontSize: 12, color: "#CBD5E1", textAlign: "center", marginTop: 24,
  },
});