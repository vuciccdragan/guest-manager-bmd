import { Stack } from "expo-router";
import { Image, StyleSheet, View, Pressable } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import Octicons from '@expo/vector-icons/Octicons';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function RootLayout() {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom - 10, 0);
  const router = useRouter();
  return (
  <View style={styles.container}>
   <View style={[styles.header, { paddingTop: insets.top}]}>
          <Image style={styles.tinyLogo} source={require("../../assets/images/villa_bomada_white.png")}/>
          <Pressable onPress={() => router.push("/postavke")}><Feather name="settings" size={30} color="white" /></Pressable>
    </View>

  <View style={styles.container}>
    <Stack screenOptions={{ headerShown: false}} />
  </View>

  <View style={[styles.footer, { paddingBottom: bottomPadding }]}>
        <Pressable onPress={() => router.push("/stanje-ville")}><EvilIcons name="calendar" size={50} color="white" /></Pressable>
        <Pressable onPress={() => router.push("/dnevni-plan")}><Octicons name="checklist" size={30} color="white" /></Pressable>
        <Pressable onPress={() => router.push("/dodaj-novi-gost")}><AntDesign name="plus-circle" size={40} color="white" style={styles.addButton} /></Pressable>
        <Pressable onPress={() => router.push("/raspored-gostiju")}><Ionicons name="people-outline" size={38} color="white" /></Pressable>
        <Pressable onPress={() => router.push("/slobodno")}><MaterialCommunityIcons name="calendar-search" size={30} color="white" /></Pressable>
      </View>
    
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: "#5D70E5",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  tinyLogo: {
    resizeMode: "contain",
    width: 100,
    height: 50,
  },
  footer: {
    backgroundColor: "#5D70E5",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingVertical: 20,
  },
  addButton: {
    marginTop: -20,
  },
});