import { StyleSheet, Text, View, Pressable } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Pressable><Text style={styles.title}>GUEST MANAGER</Text></Pressable>
      <Pressable><Text style={styles.cards}>STANJE VILLE</Text></Pressable>
      <Pressable><Text style={styles.cards}>APARTMANI</Text></Pressable>
      <Pressable><Text style={styles.cards}>SLOBODNO</Text></Pressable>
      <Pressable><Text style={styles.cards}>DNEVNI PLAN</Text></Pressable>
      <Pressable><Text style={styles.cards}>RASPORED GOSTIJU</Text></Pressable>
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
