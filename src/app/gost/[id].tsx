import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { gosti } from "@/data/gosti";

export default function GostDetalji() {
    const parametri = useLocalSearchParams()
    const trazeniId = parseInt(parametri.id as string)

    const gost = gosti.find(gost => gost.id === trazeniId)
    if (!gost) {
        return (
            <View style={styles.container}>
        <Text style={styles.poruka}>Gost nije pronađen.</Text>
      </View>
        );
    }
    return (
         <View style={styles.container}>
      <Text style={styles.ime}>{gost.ime}</Text>
      <Text style={styles.info}>Apartman {gost.apartman}</Text>
    </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 10,
    backgroundColor: "#EEF2F6",
  },
  ime: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#0F172A",
  },
  info: {
    fontSize: 16,
    color: "#334155",
  },
  poruka: {
    fontSize: 16,
    color: "#64748B",
  },
});