import { StyleSheet, Text, View, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>GUEST MANAGER</Text>
      <Pressable onPress={() => router.push("/stanje-ville")}><Text style={styles.cards}>STANJE VILLE</Text></Pressable>
      <Pressable onPress={() => router.push("/apartmani")}><Text style={styles.cards}>APARTMANI</Text></Pressable>
      <Pressable onPress={() => router.push("/slobodno")}><Text style={styles.cards}>SLOBODNO</Text></Pressable>
      <Pressable onPress={() => router.push("/dnevni-plan")}><Text style={styles.cards}>DNEVNI PLAN</Text></Pressable>
      <Pressable onPress={() => router.push("/raspored-gostiju")}><Text style={styles.cards}>RASPORED GOSTIJU</Text></Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E1FAF8",
    gap: 30
  },

  title: {
    fontWeight: "bold",
    fontSize: 40,
    marginBottom: 20,
    color: "#504BAB"
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
