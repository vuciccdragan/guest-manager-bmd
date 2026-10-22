import { Pressable, StyleSheet, Text, View, Alert, TextInput, ActivityIndicator } from "react-native";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";

export default function PrijaviKorisnika() {

    const [email, postaviEmail] = useState("");
    const [lozinka, postaviLozinku] = useState("");
    const [ucitavanje, postaviUcitavanje] = useState(false);
    const router = useRouter();

    async function prijavi() {
        postaviUcitavanje(true);
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: lozinka
        })
        postaviUcitavanje(false);
        if (error) {
            Alert.alert("Greška", error.message);
            return;
        }
        router.replace("/");
    }

    return (
        <View style={styles.ekran}>

            <View style={styles.kartica}>
                <Text style={styles.naslov}>Villa Bomada</Text>
                <Text style={styles.podnaslov}>Prijavite se za nastavak</Text>

                <Text style={styles.oznaka}>EMAIL</Text>
                <TextInput
                    style={styles.polje}
                    value={email}
                    onChangeText={postaviEmail}
                    placeholder="name@example.com"
                    placeholderTextColor="#94A3B8"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoCorrect={false}
                />

                <Text style={styles.oznaka}>LOZINKA</Text>
                <TextInput
                    style={styles.polje}
                    value={lozinka}
                    onChangeText={postaviLozinku}
                    placeholder="••••••••"
                    placeholderTextColor="#94A3B8"
                    secureTextEntry={true}
                    autoCapitalize="none"
                />

                <Pressable
                    style={[styles.gumb, ucitavanje && styles.gumbNeaktivan]}
                    onPress={prijavi}
                    disabled={ucitavanje}
                >
                    {ucitavanje ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.gumbTekst}>PRIJAVI SE</Text>
                    )}
                </Pressable>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    ekran: {
        flex: 1,
        backgroundColor: "#5D70E5",
        justifyContent: "center",
        padding: 24,
    },
    kartica: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 24,
    },
    naslov: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#0F172A",
        textAlign: "center",
    },
    podnaslov: {
        fontSize: 14,
        color: "#64748B",
        textAlign: "center",
        marginTop: 4,
        marginBottom: 24,
    },
    oznaka: {
        fontSize: 11,
        fontWeight: "700",
        color: "#94A3B8",
        letterSpacing: 0.5,
        marginBottom: 6,
        marginTop: 12,
    },
    polje: {
        borderWidth: 1,
        borderColor: "#E2E8F0",
        borderRadius: 10,
        paddingVertical: 13,
        paddingHorizontal: 14,
        fontSize: 16,
        backgroundColor: "#F8FAFC",
        color: "#0F172A",
    },
    gumb: {
        backgroundColor: "#5D70E5",
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: "center",
        marginTop: 28,
    },
    gumbNeaktivan: {
        backgroundColor: "#A5B4FC",
    },
    gumbTekst: {
        color: "white",
        fontSize: 15,
        fontWeight: "bold",
    },
});