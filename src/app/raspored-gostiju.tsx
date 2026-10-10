import { StyleSheet, Text, View, Pressable } from "react-native";
import RedakGosta from "../components/redak-gosta";
import { useGosti } from "@/context/gosti-context";
import { apartmani } from "../data/apartmani";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function RasporedGostiju() {
  const { gosti } = useGosti();
  const router = useRouter();
  const slobodniApartmani = apartmani.filter(apartman =>
    !gosti.some(gost => apartman === gost.apartman)
  );

  return (
    <View style={styles.container}>
      <Pressable style={styles.natrag} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={22} color="#5D70E5" />
        <Text style={styles.natragTekst}>Natrag</Text>
        </Pressable>
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
  natrag: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginLeft: 7
  },
  natragTekst: {
    fontSize: 15,
    color: "#5D70E5",
    fontWeight: "600",
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