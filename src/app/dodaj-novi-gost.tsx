import { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { apartmani } from "../data/apartmani";
import { useGosti } from "@/context/gosti-context";
import { Gost } from "@/data/gosti";

const tipovi = [
  { kljuc: "booking", naziv: "Booking", boja: "#16A34A", ikona: "earth" },
  { kljuc: "direkt", naziv: "Direktno", boja: "#2563EB", ikona: "person-add" },
  { kljuc: "prijatelji", naziv: "Prijatelji", boja: "#CA8A04", ikona: "heart" },
];

const maxOsoba = 5;

export default function DodajNovogGosta() {
  const router = useRouter();
  const { dodajGosta } = useGosti();

  const [imeGosta, postaviIme] = useState("");
  const [apartman, postaviApartman] = useState("");
  const [datumOd, postaviDatumOd] = useState("");
  const [datumDo, postaviDatumDo] = useState("");
  const [tipGosta, postaviTipGosta] = useState("");
  const [odrasli, postaviOdrasli] = useState(2);
  const [djeca, postaviDjecu] = useState(0);
  const [otvorenIzbornik, postaviOtvorenIzbornik] = useState(false);

  function dodajOdraslog() {
    if (odrasli + djeca >= maxOsoba) return;
    postaviOdrasli(odrasli + 1);
  }

  function dodajDijete() {
    if (odrasli + djeca >= maxOsoba) return;
    postaviDjecu(djeca + 1);
  }

  function spremiRezervaciju() {
    if (imeGosta === "" || apartman === "" || datumOd === "" || datumDo === "" || tipGosta === "") {
      Alert.alert("Greška", "Popunite sva polja.");
      return;
    }

    const noviGost: Gost = {
      id: Date.now(),
      ime: imeGosta,
      apartman: apartman,
      odDatum: datumOd,
      doDatum: datumDo,
      tipGosta: tipGosta as "booking" | "direkt" | "prijatelji",
      odrasli: odrasli,
      djeca: djeca,
    };

    dodajGosta(noviGost);

    postaviIme("");
    postaviApartman("");
    postaviDatumOd("");
    postaviDatumDo("");
    postaviTipGosta("");
    postaviOdrasli(2);
    postaviDjecu(0);

    router.back();
  }

  return (
    <ScrollView style={styles.ekran} contentContainerStyle={styles.sadrzaj}>

      <Text style={styles.oznaka}>APARTMAN</Text>
      <Pressable
        style={styles.dropdown}
        onPress={() => postaviOtvorenIzbornik(!otvorenIzbornik)}
      >
        <Text style={styles.dropdownTekst}>{apartman === "" ? "ODABERI" : apartman}</Text>
        <Ionicons name="chevron-down" size={18} color="white" />
      </Pressable>

      {otvorenIzbornik && (
        <View style={styles.izbornik}>
          {apartmani.map(a => (
            <Pressable
              key={a}
              style={styles.izbornikStavka}
              onPress={() => {
                postaviApartman(a);
                postaviOtvorenIzbornik(false);
              }}
            >
              <Text style={styles.izbornikTekst}>{a}</Text>
            </Pressable>
          ))}
        </View>
      )}

      <Text style={styles.oznaka}>UNESITE DATUM BORAVKA</Text>
      <View style={styles.red}>
        <View style={styles.polaRed}>
          <Text style={styles.mala}>OD</Text>
          <TextInput
            style={styles.polje}
            value={datumOd}
            onChangeText={postaviDatumOd}
            placeholder="2026-07-14"
            placeholderTextColor="#94A3B8"
          />
        </View>
        <View style={styles.polaRed}>
          <Text style={styles.mala}>DO</Text>
          <TextInput
            style={styles.polje}
            value={datumDo}
            onChangeText={postaviDatumDo}
            placeholder="2026-07-21"
            placeholderTextColor="#94A3B8"
          />
        </View>
      </View>

      <Text style={styles.oznaka}>IME GOSTA</Text>
      <TextInput
        style={styles.polje}
        value={imeGosta}
        onChangeText={postaviIme}
        placeholder="npr. Marko Marić"
        placeholderTextColor="#94A3B8"
      />

      <Text style={styles.oznaka}>BROJ OSOBA</Text>
      <View style={styles.kartica}>
        <View style={styles.brojacRed}>
          <Ionicons name="person-outline" size={22} color="#0F172A" />
          <Text style={styles.brojacNaziv}>Odrasli</Text>
          <Pressable style={styles.kvadratic} onPress={() => postaviOdrasli(Math.max(odrasli - 1, 1))}>
            <Ionicons name="remove" size={16} color="white" />
          </Pressable>
          <Text style={styles.broj}>{odrasli}</Text>
          <Pressable style={styles.kvadratic} onPress={dodajOdraslog}>
            <Ionicons name="add" size={16} color="white" />
          </Pressable>
        </View>

        <View style={styles.brojacRed}>
          <MaterialCommunityIcons name="baby-face-outline" size={22} color="#0F172A" />
          <Text style={styles.brojacNaziv}>Djeca</Text>
          <Pressable style={styles.kvadratic} onPress={() => postaviDjecu(Math.max(djeca - 1, 0))}>
            <Ionicons name="remove" size={16} color="white" />
          </Pressable>
          <Text style={styles.broj}>{djeca}</Text>
          <Pressable style={styles.kvadratic} onPress={dodajDijete}>
            <Ionicons name="add" size={16} color="white" />
          </Pressable>
        </View>
      </View>

      <Text style={styles.oznaka}>TIP GOSTA</Text>
      <View style={styles.red}>
        {tipovi.map(tip => (
          <Pressable
            key={tip.kljuc}
            style={[
              styles.tipGumb,
              { borderColor: tip.boja },
              tipGosta === tip.kljuc && { backgroundColor: "#DBEAFE", borderWidth: 2 },
            ]}
            onPress={() => postaviTipGosta(tip.kljuc)}
          >
            <Ionicons name={tip.ikona as any} size={18} color={tip.boja} />
            <Text style={[styles.tipTekst, { color: tip.boja }]}>{tip.naziv}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.gumb} onPress={spremiRezervaciju}>
        <Ionicons name="checkmark" size={20} color="white" />
        <Text style={styles.gumbTekst}>SPREMI REZERVACIJU</Text>
      </Pressable>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  ekran: { flex: 1, backgroundColor: "#EEF2F6" },
  sadrzaj: { padding: 20, paddingBottom: 40 },
  oznaka: { fontSize: 18, fontWeight: "bold", color: "#0F172A", marginTop: 16, marginBottom: 8 },
  mala: { fontSize: 12, fontWeight: "600", color: "#64748B", marginBottom: 4 },
  dropdown: {
    backgroundColor: "#5D70E5", borderRadius: 20, paddingVertical: 10, paddingHorizontal: 18,
    flexDirection: "row", alignItems: "center", gap: 10, alignSelf: "flex-start",
  },
  dropdownTekst: { color: "white", fontSize: 15, fontWeight: "bold" },
  izbornik: {
    backgroundColor: "#5D70E5", borderRadius: 10, marginTop: 6, paddingVertical: 6,
    alignSelf: "flex-start", minWidth: 160,
  },
  izbornikStavka: { paddingVertical: 8, paddingHorizontal: 16 },
  izbornikTekst: { color: "white", fontSize: 16, fontWeight: "bold" },
  red: { flexDirection: "row", gap: 12 },
  polaRed: { flex: 1 },
  polje: {
    borderWidth: 1, borderColor: "#CBD5E1", borderRadius: 8,
    paddingVertical: 12, paddingHorizontal: 14, fontSize: 16,
    backgroundColor: "white", color: "#0F172A",
  },
  kartica: { backgroundColor: "white", borderRadius: 14, padding: 14, gap: 14 },
  brojacRed: { flexDirection: "row", alignItems: "center", gap: 10 },
  brojacNaziv: { flex: 1, fontSize: 15, fontWeight: "600", color: "#0F172A" },
  kvadratic: {
    width: 26, height: 26, borderRadius: 6, backgroundColor: "#5D70E5",
    alignItems: "center", justifyContent: "center",
  },
  broj: { fontSize: 16, fontWeight: "bold", color: "#0F172A", minWidth: 20, textAlign: "center" },
  tipGumb: {
    flex: 1, borderWidth: 1, borderRadius: 10, paddingVertical: 10,
    alignItems: "center", gap: 4, backgroundColor: "white",
  },
  tipTekst: { fontSize: 12, fontWeight: "600" },
  gumb: {
    backgroundColor: "#5D70E5", borderRadius: 24, paddingVertical: 14, marginTop: 24,
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
  },
  gumbTekst: { color: "white", fontSize: 15, fontWeight: "bold" },
});