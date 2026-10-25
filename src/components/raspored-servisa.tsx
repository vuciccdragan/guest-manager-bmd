import { Pressable, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Gost } from "@/data/gosti";
import { useServisi } from "@/context/servisi-context";
import { formatirajDatum, nazoviDane, pomakniDatum } from "@/utils/datum";

export default function RasporedServisa(props: { gostProp: Gost }) {
  const gost = props.gostProp;
  const { servisi } = useServisi();

  const mojiServisi = servisi.filter(s => s.gostId === gost.id && !s.uklonjen);

  const dani: string[] = [];
  let trenutni = gost.odDatum;
  while (trenutni <= gost.doDatum) {
    dani.push(trenutni);
    trenutni = pomakniDatum(trenutni, 1);
  }

  return (
    <View style={styles.okvir}>
      <Text style={styles.oznaka}>RASPORED BORAVKA</Text>

      <View style={styles.napomena}>
        <Ionicons name="sparkles-outline" size={16} color="#5D70E5" />
        <Text style={styles.napomenaTekst}>
          Dnevni ulazak se predlaže automatski. Svaki termin možeš urediti ili maknuti.
        </Text>
      </View>

      {dani.map(datum => {
        const jeDolazak = datum === gost.odDatum;
        const jeOdlazak = datum === gost.doDatum;
        const servis = mojiServisi.find(s => s.datum === datum);

        return (
          <View key={datum} style={styles.red}>
            <View style={styles.datumBlok}>
              <Text style={styles.datumBroj}>{formatirajDatum(datum).split(".")[0]}</Text>
              <Text style={styles.datumDan}>{nazoviDane(datum).slice(0, 3).toUpperCase()}</Text>
            </View>

            {jeDolazak ? (
              <View style={[styles.kartica, styles.dolazak]}>
                <Ionicons name="log-in-outline" size={20} color="#16A34A" />
                <View style={styles.tekstBlok}>
                  <Text style={styles.naslovDolazak}>Dolazak</Text>
                  <Text style={styles.opis}>Čist set posteljine i ručnika</Text>
                </View>
              </View>
            ) : jeOdlazak ? (
              <View style={[styles.kartica, styles.odlazak]}>
                <Ionicons name="log-out-outline" size={20} color="#DC2626" />
                <View style={styles.tekstBlok}>
                  <Text style={styles.naslovOdlazak}>Odjava · do 10:00</Text>
                  <Text style={styles.opis}>Generalno čišćenje apartmana</Text>
                </View>
              </View>
            ) : servis ? (
              <Pressable style={[styles.kartica, styles.servis]}>
                <Ionicons name="sparkles" size={18} color="#5D70E5" />
                <View style={styles.tekstBlok}>
                  <Text style={styles.naslovServis}>Dnevni ulazak</Text>
                  {servis.rucno && <Text style={styles.rucno}>ručno postavljeno</Text>}
                </View>
                <Ionicons name="pencil" size={18} color="#CBD5E1" />
              </Pressable>
            ) : (
              <View style={styles.prazanDan}>
                <Text style={styles.boravak}>Boravak</Text>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  okvir: { marginTop: 20 },
  oznaka: {
    fontSize: 12, fontWeight: "bold", color: "#94A3B8",
    letterSpacing: 0.6, marginBottom: 10,
  },
  napomena: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: "#EEF2FF", borderRadius: 12, padding: 12, marginBottom: 14,
  },
  napomenaTekst: { flex: 1, fontSize: 12, color: "#4338CA", lineHeight: 17 },
  red: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 8 },
  datumBlok: { width: 34, alignItems: "center" },
  datumBroj: { fontSize: 16, fontWeight: "bold", color: "#0F172A" },
  datumDan: { fontSize: 9, color: "#94A3B8", fontWeight: "600" },
  kartica: {
    flex: 1, flexDirection: "row", alignItems: "center", gap: 10,
    borderRadius: 12, paddingVertical: 12, paddingHorizontal: 14,
  },
  dolazak: { backgroundColor: "#DCFCE7" },
  odlazak: { backgroundColor: "#FEE2E2" },
  servis: { backgroundColor: "white" },
  tekstBlok: { flex: 1 },
  naslovDolazak: { fontSize: 14, fontWeight: "bold", color: "#166534" },
  naslovOdlazak: { fontSize: 14, fontWeight: "bold", color: "#991B1B" },
  naslovServis: { fontSize: 14, fontWeight: "600", color: "#0F172A" },
  opis: { fontSize: 12, color: "#475569", marginTop: 1 },
  rucno: { fontSize: 11, color: "#5D70E5", marginTop: 1 },
  prazanDan: { flex: 1, paddingVertical: 12, paddingHorizontal: 14 },
  boravak: { fontSize: 13, color: "#94A3B8" },
});