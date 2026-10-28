import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Gost } from "@/data/gosti";
import { Servis } from "@/data/servisi";
import { useServisi } from "@/context/servisi-context";
import { formatirajDatumGodina, nazoviDane, pomakniDatum } from "@/utils/datum";

export default function RasporedServisa(props: { gostProp: Gost }) {
  const gost = props.gostProp;
  const { servisi, pomakniServis, ukloniServis, vratiServis } = useServisi();

  const [odabrani, postaviOdabrani] = useState<Servis | null>(null);

  const mojiServisi = servisi.filter(s => s.gostId === gost.id);

  const dani: string[] = [];
  let trenutni = gost.odDatum;
  while (trenutni <= gost.doDatum) {
    dani.push(trenutni);
    trenutni = pomakniDatum(trenutni, 1);
  }

  async function obradiPomak(noviDatum: string) {
    if (!odabrani) return;
    await pomakniServis(odabrani.id, noviDatum);
    postaviOdabrani(null);
  }

  async function obradiUklanjanje() {
    if (!odabrani) return;
    await ukloniServis(odabrani.id);
    postaviOdabrani(null);
  }

  async function obradiVracanje(servis: Servis) {
    await vratiServis(servis.id);
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
              <Text style={styles.datumBroj}>{formatirajDatumGodina(datum).split(".")[0]}</Text>
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
            ) : servis && !servis.uklonjen ? (
              <Pressable
                style={[styles.kartica, styles.servis]}
                onPress={() => postaviOdabrani(servis)}
              >
                <Ionicons name="sparkles" size={18} color="#5D70E5" />
                <View style={styles.tekstBlok}>
                  <Text style={styles.naslovServis}>Dnevni ulazak</Text>
                </View>
                <Ionicons name="pencil" size={18} color="#CBD5E1" />
              </Pressable>
            ) : servis && servis.uklonjen ? (
              <Pressable
                style={[styles.kartica, styles.uklonjen]}
                onPress={() => obradiVracanje(servis)}
              >
                <Ionicons name="close-circle-outline" size={18} color="#94A3B8" />
                <View style={styles.tekstBlok}>
                  <Text style={styles.naslovUklonjen}>Ulazak uklonjen</Text>
                  <Text style={styles.vrati}>Dodirni za vraćanje</Text>
                </View>
              </Pressable>
            ) : (
              <View style={styles.prazanDan}>
                <Text style={styles.boravak}>Boravak</Text>
              </View>
            )}
          </View>
        );
      })}

      <Modal
        visible={odabrani !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => postaviOdabrani(null)}
      >
        <Pressable style={styles.pozadina} onPress={() => postaviOdabrani(null)}>
          <Pressable style={styles.modalKartica} onPress={() => {}}>
            <Text style={styles.modalNaslov}>Dnevni ulazak</Text>
            <Text style={styles.modalPodnaslov}>
              {odabrani ? formatirajDatumGodina(odabrani.datum) : ""}
            </Text>

            <Text style={styles.modalOznaka}>PREBACI NA DRUGI DAN</Text>

            <DateTimePicker
              value={odabrani ? new Date(odabrani.datum) : new Date()}
              mode="date"
              display="inline"
              themeVariant="light"
              accentColor="#5D70E5"
              minimumDate={new Date(gost.odDatum)}
              maximumDate={new Date(gost.doDatum)}
              onValueChange={(dogadaj, noviDatum) => {
                obradiPomak(noviDatum.toISOString().split("T")[0]);
              }}
            />

            <Pressable style={styles.gumbUkloni} onPress={obradiUklanjanje}>
              <Ionicons name="trash-outline" size={18} color="#DC2626" />
              <Text style={styles.gumbUkloniTekst}>UKLONI ULAZAK</Text>
            </Pressable>

            <Pressable style={styles.gumbZatvori} onPress={() => postaviOdabrani(null)}>
              <Text style={styles.gumbZatvoriTekst}>ZATVORI</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
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
  uklonjen: { backgroundColor: "#F8FAFC", borderWidth: 1, borderColor: "#E2E8F0" },
  tekstBlok: { flex: 1 },
  naslovDolazak: { fontSize: 14, fontWeight: "bold", color: "#166534" },
  naslovOdlazak: { fontSize: 14, fontWeight: "bold", color: "#991B1B" },
  naslovServis: { fontSize: 14, fontWeight: "600", color: "#0F172A" },
  naslovUklonjen: { fontSize: 14, fontWeight: "600", color: "#94A3B8" },
  vrati: { fontSize: 11, color: "#CBD5E1", marginTop: 1 },
  opis: { fontSize: 12, color: "#475569", marginTop: 1 },
  rucno: { fontSize: 11, color: "#5D70E5", marginTop: 1 },
  prazanDan: { flex: 1, paddingVertical: 12, paddingHorizontal: 14 },
  boravak: { fontSize: 13, color: "#94A3B8" },
  pozadina: {
    flex: 1, backgroundColor: "rgba(15,23,42,0.5)",
    justifyContent: "center", alignItems: "center", padding: 20,
  },
  modalKartica: {
    backgroundColor: "white", borderRadius: 16, padding: 16, width: "100%",
  },
  modalNaslov: {
    fontSize: 17, fontWeight: "bold", color: "#0F172A", textAlign: "center",
  },
  modalPodnaslov: {
    fontSize: 14, color: "#64748B", textAlign: "center", marginTop: 2,
  },
  modalOznaka: {
    fontSize: 11, fontWeight: "700", color: "#94A3B8",
    letterSpacing: 0.5, marginTop: 14, marginBottom: 4,
  },
  gumbUkloni: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    backgroundColor: "#FEE2E2", borderRadius: 10, paddingVertical: 13, marginTop: 10,
  },
  gumbUkloniTekst: { color: "#DC2626", fontSize: 14, fontWeight: "bold" },
  gumbZatvori: {
    alignItems: "center", paddingVertical: 12, marginTop: 4,
  },
  gumbZatvoriTekst: { color: "#64748B", fontSize: 14, fontWeight: "600" },
});