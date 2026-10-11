import { StyleSheet, View, Text, Pressable, ScrollView } from "react-native";
import { useGosti } from "@/context/gosti-context";
import { useRouter } from "expo-router";
import { pomakniDatum } from "@/utils/datum";
import formatirajDatum from "@/utils/datum";
import { useState } from "react";

export default function DnevniPlan() {
    const { gosti } = useGosti();
    const router = useRouter();
    const [datum, postaviDatum] = useState(new Date().toISOString().split("T")[0]);
    const [odradeni, postaviOdradene] = useState<string[]>([])
    function oznaciGotovo(zadatak: string) {
        if (odradeni.includes(zadatak)) {
            postaviOdradene(odradeni.filter(z => z !== zadatak));
        } else {
            postaviOdradene([...odradeni, zadatak]);
        }
    }
    const odlasci = gosti.filter(gost => gost.doDatum === datum)
    const dolasci = gosti.filter(gost => gost.odDatum === datum)
    const ciscenje = odlasci.map(gost => gost.apartman)
    const nemaNista = odlasci.length === 0 && dolasci.length === 0 && ciscenje.length === 0
    return (
        <View style={styles.containter}>
            <View style={styles.datumRed}>
                <Pressable onPress={() => postaviDatum(pomakniDatum(datum, -1))}>
                    <Text style={styles.strelica}>‹</Text>
                </Pressable>

                <Text style={styles.datum}>{formatirajDatum(datum)}</Text>

                <Pressable onPress={() => postaviDatum(pomakniDatum(datum, 1))}>
                    <Text style={styles.strelica}>›</Text>
                </Pressable>
            </View>
            {nemaNista ? (
                <Text style={styles.prazno}>Nema ničega za odraditi ovaj dan.</Text>
            ) : (
                <>
                    <ScrollView contentContainerStyle={styles.sadrzaj}>
                        <Text style={styles.skupina}>ODJAVE</Text>
                        {odlasci.map(gost => (
                            <Text key={gost.id} style={styles.zadatak}>{gost.ime} · {gost.apartman}</Text>
                        ))}

                        <Text style={styles.skupina}>DOLASCI</Text>
                        {dolasci.map(gost => (
                            <Text key={gost.id} style={styles.zadatak}>{gost.ime} · {gost.apartman}</Text>
                        ))}

                        <Text style={styles.skupina}>ČIŠĆENJE</Text>
                        {ciscenje.map(oznaka => {
                            const kljuc = datum + "-ciscenje-" + oznaka;
                            return (
                                <Pressable key={kljuc} style={styles.zadatak} onPress={() => oznaciGotovo(kljuc)}>
                                    <Text style={[styles.zadatakTekst, odradeni.includes(kljuc) && styles.gotovo]}>{oznaka}</Text>
                                </Pressable>
                            );
                        })}
                    </ScrollView>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    containter: {
        flex: 1,
        backgroundColor: "#EEF2F6",
    },
    datumRed: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: "white",
    },
    strelica: {
        fontSize: 30,
        color: "#5D70E5",
        paddingHorizontal: 16,
    },
    datum: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#0F172A",
    },
    sadrzaj: {
        padding: 20,
        gap: 8,
    },
    skupina: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#94A3B8",
        letterSpacing: 0.6,
        marginTop: 18,
        marginBottom: 6,
    },
    zadatak: {
        backgroundColor: "white",
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 14,
    },
    zadatakTekst: {
        fontSize: 15,
        color: "#0F172A",
    },
    gotovo: {
        textDecorationLine: "line-through",
        color: "#94A3B8",
    },
    prazno: {
        marginTop: 18,
        paddingHorizontal: 14,
        fontSize: 13,
        color: "#94A3B8",
        fontStyle: "italic",
    },
});