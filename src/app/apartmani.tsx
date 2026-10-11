import { StyleSheet, Text, View, Pressable, ScrollView } from "react-native";
import { apartmani } from "@/data/apartmani";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Apartmani() {
  const router = useRouter();
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.sadrzaj}>
      <Pressable style={styles.natrag} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={22} color="#5D70E5" />
        <Text style={styles.natragTekst}>Natrag</Text>
      </Pressable>
      {apartmani.map(apartman => (
        <Pressable key={apartman} onPress={() => router.push(`/apartman/${apartman}`)}>
          <Text style={styles.cards}>APARTMAN {apartman}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  natrag: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginLeft: 20
  },
  natragTekst: {
    fontSize: 15,
    color: "#5D70E5",
    fontWeight: "600",
  },

  container: {
    flex: 1,
    backgroundColor: "#E1FAF8",
  },
  sadrzaj: {
    alignItems: "center",
    gap: 30,
    paddingVertical: 40,
    paddingHorizontal: 20,
  },

  cards: {
    backgroundColor: "#5D70E5",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    color: "white",
    fontWeight: "bold",
    fontSize: 30,
  }
});
