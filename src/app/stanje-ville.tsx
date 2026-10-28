import { Pressable, ScrollView, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useGosti } from "@/context/gosti-context";
import { apartmani } from "@/data/apartmani";
import { bojaZaTipGosta } from "@/data/gosti";
import { formatirajDatumGodina, nazoviDane, pomakniDatum, brojNociUkupno } from "@/utils/datum";

const SIRINA_DANA = 44;
const VISINA_REDA = 40;

const mjeseci = ["sij", "velj", "ožu", "tra", "svi", "lip", "srp", "kol", "ruj", "lis", "stu", "pro"];

function kraticaMjeseca(datum: string): string {
  const broj = parseInt(datum.split("-")[1]);
  return mjeseci[broj - 1];
}

export default function StanjeVille() {
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

  const buduciGosti = gosti.filter(g => g.doDatum > danas);

  const dolasci = buduciGosti
    .map(g => g.odDatum)
    .sort((a, b) => a.localeCompare(b));

  const odlasci = buduciGosti
    .map(g => g.doDatum)
    .sort((a, b) => a.localeCompare(b));

  const pocetak = dolasci.length > 0
    ? (dolasci[0] < danas ? danas : dolasci[0])
    : danas;

  const kraj = odlasci.length > 0
    ? pomakniDatum(odlasci[odlasci.length - 1], 2)
    : pomakniDatum(danas, 14);

  const brojDana = brojNociUkupno(pocetak, kraj) + 1;

  const dani: string[] = [];
  for (let i = 0; i < brojDana; i++) {
    dani.push(pomakniDatum(pocetak, i));
  }

  const mjeseciUPrikazu: { naziv: string; brojDana: number }[] = [];

  dani.forEach(datum => {
    const kratica = kraticaMjeseca(datum);
    const zadnji = mjeseciUPrikazu[mjeseciUPrikazu.length - 1];

    if (zadnji && zadnji.naziv === kratica) {
      zadnji.brojDana++;
    } else {
      mjeseciUPrikazu.push({ naziv: kratica, brojDana: 1 });
    }
  });

  return (
    <View style={styles.ekran}>

      <Pressable style={styles.natrag} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={22} color="#5D70E5" />
        <Text style={styles.natragTekst}>Natrag</Text>
      </Pressable>

      <Text style={styles.naslov}>Stanje ville</Text>
      <Text style={styles.raspon}>
        {formatirajDatumGodina(pocetak)} – {formatirajDatumGodina(kraj)}
      </Text>

      <View style={styles.tablica}>

        <View style={styles.stupacApartmana}>
          <View style={styles.kutZaglavlja} />
          {apartmani.map(oznaka => (
            <View key={oznaka} style={styles.celijaApartmana}>
              <Text style={styles.oznakaApartmana}>{oznaka}</Text>
            </View>
          ))}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View>

            <View style={styles.redMjeseci}>
              {mjeseciUPrikazu.map((m, index) => (
                <View
                  key={index}
                  style={[styles.celijaMjeseca, { width: m.brojDana * SIRINA_DANA }]}
                >
                  <Text style={styles.mjesecTekst}>{m.naziv.toUpperCase()}</Text>
                </View>
              ))}
            </View>

            <View style={styles.redDatuma}>
              {dani.map(datum => {
                const jeDanas = datum === danas;
                return (
                  <View key={datum} style={styles.celijaDatuma}>
                    <Text style={[styles.danTekst, jeDanas && styles.danasTekst]}>
                      {nazoviDane(datum).slice(0, 3).toUpperCase()}
                    </Text>
                    <Text style={[styles.brojTekst, jeDanas && styles.danasTekst]}>
                      {datum.split("-")[2]}
                    </Text>
                  </View>
                );
              })}
            </View>

            {apartmani.map(oznaka => {
              const gostiApartmana = gosti.filter(
                g => g.apartman === oznaka && g.doDatum > pocetak && g.odDatum <= kraj
              );

              return (
                <View key={oznaka} style={styles.redApartmana}>
                  {dani.map(datum => (
                    <View
                      key={datum}
                      style={[
                        styles.praznaCelija,
                        datum === danas && styles.celijaDanas,
                      ]}
                    />
                  ))}

                  {gostiApartmana.map(gost => {
                    const pocetniDan = gost.odDatum < pocetak ? pocetak : gost.odDatum;
                    const zavrsniDan = gost.doDatum > kraj ? kraj : gost.doDatum;

                    const odmak = brojNociUkupno(pocetak, pocetniDan);
                    const trajanje = brojNociUkupno(pocetniDan, zavrsniDan);

                    if (trajanje <= 0) return null;

                    return (
                      <Pressable
                        key={gost.id}
                        style={[
                          styles.traka,
                          {
                            left: odmak * SIRINA_DANA + 3,
                            width: trajanje * SIRINA_DANA - 6,
                            backgroundColor: bojaZaTipGosta[gost.tipGosta],
                          },
                        ]}
                        onPress={() => router.push(`/gost/${gost.id}` as any)}
                      >
                        <Text style={styles.trakaTekst} numberOfLines={1}>
                          {gost.ime}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              );
            })}

          </View>
        </ScrollView>

      </View>

      <View style={styles.legenda}>
        <View style={styles.legendaStavka}>
          <View style={[styles.legendaTocka, { backgroundColor: bojaZaTipGosta.booking }]} />
          <Text style={styles.legendaTekst}>Booking</Text>
        </View>
        <View style={styles.legendaStavka}>
          <View style={[styles.legendaTocka, { backgroundColor: bojaZaTipGosta.direkt }]} />
          <Text style={styles.legendaTekst}>Direktno</Text>
        </View>
        <View style={styles.legendaStavka}>
          <View style={[styles.legendaTocka, { backgroundColor: bojaZaTipGosta.prijatelji }]} />
          <Text style={styles.legendaTekst}>Prijatelji</Text>
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  ekran: { flex: 1, backgroundColor: "#F1F5F9" },
  sredina: {
    flex: 1, justifyContent: "center", alignItems: "center",
    backgroundColor: "#F1F5F9",
  },
  natrag: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 16, paddingTop: 12,
  },
  natragTekst: { fontSize: 15, color: "#5D70E5", fontWeight: "600" },
  naslov: {
    fontSize: 26, fontWeight: "bold", color: "#0F172A",
    paddingHorizontal: 16, marginTop: 6,
  },
  raspon: {
    fontSize: 13, color: "#64748B", paddingHorizontal: 16,
    marginTop: 2, marginBottom: 14,
  },
  tablica: { flexDirection: "row" },
  stupacApartmana: { backgroundColor: "#F1F5F9", zIndex: 2 },
  kutZaglavlja: { height: 58 },
  celijaApartmana: {
    height: VISINA_REDA, width: 42,
    alignItems: "center", justifyContent: "center",
    borderBottomWidth: 1, borderBottomColor: "#E2E8F0",
  },
  oznakaApartmana: { fontSize: 14, fontWeight: "bold", color: "#0F172A" },
  redMjeseci: { flexDirection: "row", height: 20 },
  celijaMjeseca: {
    justifyContent: "center",
    borderRightWidth: 1, borderRightColor: "#E2E8F0",
    paddingLeft: 6,
  },
  mjesecTekst: { fontSize: 10, fontWeight: "700", color: "#94A3B8", letterSpacing: 0.5 },
  redDatuma: { flexDirection: "row", height: 38 },
  celijaDatuma: {
    width: SIRINA_DANA, alignItems: "center", justifyContent: "center",
  },
  danTekst: { fontSize: 9, color: "#94A3B8", fontWeight: "600" },
  brojTekst: { fontSize: 14, fontWeight: "bold", color: "#0F172A" },
  danasTekst: { color: "#5D70E5" },
  redApartmana: {
    flexDirection: "row", height: VISINA_REDA, position: "relative",
  },
  praznaCelija: {
    width: SIRINA_DANA, height: VISINA_REDA,
    borderBottomWidth: 1, borderBottomColor: "#E2E8F0",
    borderRightWidth: 1, borderRightColor: "#F1F5F9",
    backgroundColor: "white",
  },
  celijaDanas: { backgroundColor: "#DBEAFE" },
  traka: {
    position: "absolute", top: 5, height: VISINA_REDA - 11,
    borderRadius: 7, justifyContent: "center", paddingHorizontal: 8,
  },
  trakaTekst: { fontSize: 11, fontWeight: "600", color: "#0F172A" },
  legenda: {
    flexDirection: "row", justifyContent: "center", gap: 18,
    paddingVertical: 14,
  },
  legendaStavka: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendaTocka: { width: 10, height: 10, borderRadius: 5 },
  legendaTekst: { fontSize: 12, color: "#64748B" },
});