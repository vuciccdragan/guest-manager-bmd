import { Stack, usePathname, useRouter } from "expo-router";
import { ActivityIndicator, Image, Pressable, StyleSheet, View } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import Octicons from '@expo/vector-icons/Octicons';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GostiProvider } from "@/context/gosti-context";
import { AuthProvider, useAuth } from "@/context/auth-context";
import { useEffect } from "react";
import { PostavkeProvider } from "@/context/postavke-context";
import { ServisiProvider } from "@/context/servisi-context";

export default function RootLayout() {
  return (
    <AuthProvider>
      <PostavkeProvider>
        <GostiProvider>
          <ServisiProvider>
          <Sadrzaj />
          </ServisiProvider>
        </GostiProvider>
      </PostavkeProvider>
    </AuthProvider>
  );
}

function Sadrzaj() {
  const { sesija, ucitavanje } = useAuth();
  const router = useRouter();
  const putanja = usePathname();
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom - 10, 0);

  useEffect(() => {
    if (!ucitavanje && !sesija && putanja !== "/prijava") {
      router.replace("/prijava");
    }
  }, [sesija, ucitavanje, putanja]);

  if (ucitavanje) {
    return (
      <View style={styles.ucitavanje}>
        <ActivityIndicator size="large" color="#5D70E5" />
      </View>
    );
  }

  if (!sesija) {
    return (
      <View style={styles.container}>
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Pressable onPress={() => router.replace("/")}><Image style={styles.tinyLogo} source={require("../../assets/images/villa_bomada_white.png")} /></Pressable>
        <Pressable onPress={() => router.push("/postavke")}>
          <Feather name="settings" size={30} color="white" />
        </Pressable>
      </View>

      <View style={styles.container}>
        <Stack screenOptions={{ headerShown: false }} />
      </View>

      <View style={[styles.footer, { paddingBottom: bottomPadding }]}>
        <Pressable onPress={() => router.push("/stanje-ville")}>
          <EvilIcons name="calendar" size={50} color="white" />
        </Pressable>
        <Pressable onPress={() => router.push("/dnevni-plan")}>
          <Octicons name="checklist" size={30} color="white" />
        </Pressable>
        <Pressable onPress={() => router.push("/dodaj-novi-gost")}>
          <AntDesign name="plus-circle" size={40} color="white" style={styles.addButton} />
        </Pressable>
        <Pressable onPress={() => router.push("/raspored-gostiju")}>
          <Ionicons name="people-outline" size={38} color="white" />
        </Pressable>
        <Pressable onPress={() => router.push("/slobodno")}>
          <MaterialCommunityIcons name="calendar-search" size={30} color="white" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  ucitavanje: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
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