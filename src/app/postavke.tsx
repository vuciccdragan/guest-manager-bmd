import { useAuth } from "@/context/auth-context";
import { View, Pressable, Text, StyleSheet } from "react-native"

export default function PostaviPostavke() {
    const { odjaviSe } = useAuth();
    return (
        <View>
            <Pressable style={styles.gumbOdjava} onPress={odjaviSe}>
                <Text style={styles.gumbOdjavaTekst}>ODJAVI SE</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    gumbOdjava: {
        backgroundColor: "#FEE2E2",
        borderRadius: 12,
        paddingVertical: 15,
        alignItems: "center",
        marginTop: 20,
    },
    gumbOdjavaTekst: {
        color: "#DC2626",
        fontSize: 15,
        fontWeight: "bold",
    },
})