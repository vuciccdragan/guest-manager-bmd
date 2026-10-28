import { StyleSheet, Text, View, Pressable, ScrollView, ActivityIndicator } from "react-native";
import RedakGosta from "../components/redak-gosta";
import { useGosti } from "@/context/gosti-context";
import { apartmani } from "../data/apartmani";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function RasporedGostiju() {
  const danas = new Date().toISOString().split("T")[0];
  const { gosti, ucitavanje } = useGosti();
  const router = useRouter();
  const trenutniGosti = gosti.filter(gost => gost.odDatum <= danas && gost.doDatum > danas)
  const slobodniApartmani = apartmani.filter(apartman =>
    !trenutniGosti.some(gost => gost.apartman === apartman)
  );

  if (ucitavanje) {
    return (
      <View style={styles.sredina}>
        <ActivityIndicator size="large" color="#5D70E5" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.sadrzaj}>
      <Pressable style={styles.natrag} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={22} color="#5D70E5" />
        <Text style={styles.natragTekst}>Natrag</Text>
      </Pressable>
      <Text style={styles.naslov}>
        Trenutno stanje u apartmanima
      </Text>

      {trenutniGosti.map(gost => (
        <RedakGosta key={gost.id} gostProp={gost} />
      ))}

      <Text style={styles.slobodni}>
        Slobodni: {slobodniApartmani.join(" • ")}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEF2F6",
  },
  sadrzaj: {
    padding: 20,
    gap: 14,
  },
  sredina: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
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