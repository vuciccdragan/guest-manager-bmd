import { StyleSheet, Text, View, Pressable } from "react-native";
import { apartmani } from "@/data/apartmani";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Apartmani() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Pressable style={styles.natrag} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={22} color="#5D70E5" />
        <Text style={styles.natragTekst}>Natrag</Text>
      </Pressable>
      {apartmani.map(apartman => (
        <Pressable key={apartman} onPress={() => router.push(`/apartman/${apartman}`)}>
          <Text style={styles.cards}>APARTMAN {apartman}</Text>
        </Pressable>
      ))}
    </View>
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
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E1FAF8",
    gap: 30
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
