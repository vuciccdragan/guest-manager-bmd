import { StyleSheet, Text, View } from "react-native";
import RedakGosta from "../components/redak-gosta";
import { gosti } from "../data/gosti";
import { apartmani } from "../data/apartmani";

export default function RasporedGostiju() {
  const slobodniApartmani = apartmani.filter(apartman =>
    !gosti.some(gost => apartman === gost.apartman)
  );

  return (
    <View style={styles.container}>
      <Text style={styles.naslov}>
        Trenutno stanje u apartmanima • {gosti.length} gostiju
      </Text>

      {gosti.map(gost => (
        <RedakGosta key={gost.id} gostProp={gost} />
      ))}

      <Text style={styles.slobodni}>
        Slobodni: {slobodniApartmani.join(" • ")}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 14,
    backgroundColor: "#EEF2F6",
  },
  naslov: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#0F172A",
    textAlign: "center",
    marginBottom: 6,
  },
  slobodni: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#475569",
    textAlign: "center",
    marginTop: 10,
  },
});