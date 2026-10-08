import { StyleSheet, Text, View, Pressable } from "react-native";
import { apartmani } from "@/data/apartmani";
import { useRouter } from "expo-router";

export default function Apartmani() {
    const router = useRouter();
  return (
    <View style={styles.container}>
        {apartmani.map(apartman => (
                <Pressable key={apartman} onPress={() => router.push(`/apartman/${apartman}`)}>
                    <Text style={styles.cards}>APARTMAN {apartman}</Text>
                </Pressable>
              ))}
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
