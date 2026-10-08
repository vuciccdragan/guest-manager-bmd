import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useGosti } from "@/context/gosti-context";

export default function ApartmanDetalji() {
  const parametri = useLocalSearchParams();
  const oznaka = parametri.oznaka as string;

  const { gosti } = useGosti();
  const danas = new Date().toISOString().split("T")[0];

  const gostiApartmana = gosti.filter(gost => gost.apartman === oznaka);

  const trenutniGost = gostiApartmana.find(
    gost => gost.odDatum <= danas && gost.doDatum >= danas
  );

  return (
    <View style={styles.container}>
      <Text style={styles.naslov}>Apartman {oznaka}</Text>

      {trenutniGost && (
        <View>
          <Text style={styles.zauzet}>ZAUZET</Text>
          <Text style={styles.ime}>{trenutniGost.ime}</Text>
          <Text style={styles.info}>
            {trenutniGost.odrasli + trenutniGost.djeca} osoba · do {trenutniGost.doDatum}
          </Text>
        </View>
      )}

      {!trenutniGost && <Text style={styles.slobodan}>SLOBODAN</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 12,
    backgroundColor: "#EEF2F6",
  },
  naslov: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#0F172A",
  },
  zauzet: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#DC2626",
    marginBottom: 6,
  },
  slobodan: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#16A34A",
  },
  ime: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0F172A",
  },
  info: {
    fontSize: 14,
    color: "#334155",
    marginTop: 4,
  },
});