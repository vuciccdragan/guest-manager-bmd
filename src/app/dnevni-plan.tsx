import { StyleSheet, View, Text, Pressable, ScrollView, Modal, TextInput } from "react-native";
import { useGosti } from "@/context/gosti-context";
import { useServisi } from "@/context/servisi-context";
import { useZadatke } from "@/context/zadaci-conext";
import { useOdradeno } from "@/context/odradeno-context";
import { useRouter } from "expo-router";
import { pomakniDatum, formatirajDatum, nazoviDane } from "@/utils/datum";
import { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function DnevniPlan() {
    const { gosti } = useGosti();
    const { servisi } = useServisi();
    const { zadaci, dodajZadatak, prebaciGotov, obrisiZadatak } = useZadatke();
    const { kljucevi, prebaciOdradeno } = useOdradeno();
    const router = useRouter();

    const [datum, postaviDatum] = useState(new Date().toISOString().split("T")[0]);
    const [prikaziBirac, postaviPrikaziBirac] = useState(false);
    const [noviZadatak, postaviNoviZadatak] = useState("");

    async function spremiNoviZadatak() {
        if (noviZadatak.trim() === "") return;
        await dodajZadatak(datum, noviZadatak.trim());
        postaviNoviZadatak("");
    }

    const odlasci = gosti.filter(gost => gost.doDatum === datum);
    const dolasci = gosti.filter(gost => gost.odDatum === datum);
    const ciscenje = odlasci.map(gost => gost.apartman);
    const ulasci = servisi.filter(s => s.datum === datum && !s.uklonjen);
    const mojiZadaci = zadaci.filter(z => z.datum === datum);

    const nemaNista =
        odlasci.length === 0 &&
        dolasci.length === 0 &&
        ulasci.length === 0 &&
        mojiZadaci.length === 0;

    return (
        <View style={styles.containter}>

            <View style={styles.datumRed}>
                <Pressable onPress={() => postaviDatum(pomakniDatum(datum, -1))}>
                    <Text style={styles.strelica}>‹</Text>
                </Pressable>

                <Pressable onPress={() => postaviPrikaziBirac(true)}>
                    <Text style={styles.datum}>{nazoviDane(datum)}, {formatirajDatum(datum)}</Text>
                </Pressable>

                <Pressable onPress={() => postaviDatum(pomakniDatum(datum, 1))}>
                    <Text style={styles.strelica}>›</Text>
                </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.sadrzaj}>

                {nemaNista && (
                    <Text style={styles.prazno}>Nema ničega za odraditi ovaj dan.</Text>
                )}

                {odlasci.length > 0 && (
                    <>
                        <Text style={styles.skupina}>ODJAVE</Text>
                        {odlasci.map(gost => {
                            const kljuc = datum + "-odjava-" + gost.id;
                            const jeGotov = kljucevi.includes(kljuc);
                            return (
                                <Pressable key={kljuc} style={styles.zadatak} onPress={() => prebaciOdradeno(kljuc)}>
                                    <View style={[styles.kruzic, jeGotov && styles.kruzicGotov]}>
                                        {jeGotov && <Ionicons name="checkmark" size={15} color="white" />}
                                    </View>
                                    <Text style={[styles.zadatakTekst, jeGotov && styles.gotovo]}>
                                        {gost.apartman} · {gost.ime}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </>
                )}

                {dolasci.length > 0 && (
                    <>
                        <Text style={styles.skupina}>DOLASCI</Text>
                        {dolasci.map(gost => {
                            const kljuc = datum + "-dolazak-" + gost.id;
                            const jeGotov = kljucevi.includes(kljuc);
                            return (
                                <Pressable key={kljuc} style={styles.zadatak} onPress={() => prebaciOdradeno(kljuc)}>
                                    <View style={[styles.kruzic, jeGotov && styles.kruzicGotov]}>
                                        {jeGotov && <Ionicons name="checkmark" size={15} color="white" />}
                                    </View>
                                    <Text style={[styles.zadatakTekst, jeGotov && styles.gotovo]}>
                                        {gost.apartman} · {gost.ime}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </>
                )}

                {ciscenje.length > 0 && (
                    <>
                        <Text style={styles.skupina}>ČIŠĆENJE</Text>
                        {ciscenje.map(oznaka => {
                            const kljuc = datum + "-ciscenje-" + oznaka;
                            const jeGotov = kljucevi.includes(kljuc);
                            return (
                                <Pressable key={kljuc} style={styles.zadatak} onPress={() => prebaciOdradeno(kljuc)}>
                                    <View style={[styles.kruzic, jeGotov && styles.kruzicGotov]}>
                                        {jeGotov && <Ionicons name="checkmark" size={15} color="white" />}
                                    </View>
                                    <Text style={[styles.zadatakTekst, jeGotov && styles.gotovo]}>
                                        Čišćenje {oznaka}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </>
                )}

                {ulasci.length > 0 && (
                    <>
                        <Text style={styles.skupina}>DNEVNI ULAZAK</Text>
                        {ulasci.map(ulazak => {
                            const gost = gosti.find(g => g.id === ulazak.gostId);
                            if (!gost) return null;

                            const kljuc = datum + "-ulazak-" + ulazak.id;
                            const jeGotov = kljucevi.includes(kljuc);
                            return (
                                <Pressable key={kljuc} style={styles.zadatak} onPress={() => prebaciOdradeno(kljuc)}>
                                    <View style={[styles.kruzic, jeGotov && styles.kruzicGotov]}>
                                        {jeGotov && <Ionicons name="checkmark" size={15} color="white" />}
                                    </View>
                                    <Text style={[styles.zadatakTekst, jeGotov && styles.gotovo]}>
                                        {gost.apartman} · {gost.ime}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </>
                )}

                <Text style={styles.skupina}>OSTALO</Text>

                {mojiZadaci.map(z => (
                    <Pressable key={z.id} style={styles.zadatak} onPress={() => prebaciGotov(z.id)}>
                        <View style={[styles.kruzic, z.gotov && styles.kruzicGotov]}>
                            {z.gotov && <Ionicons name="checkmark" size={15} color="white" />}
                        </View>
                        <Text style={[styles.zadatakTekst, styles.rastegni, z.gotov && styles.gotovo]}>
                            {z.tekst}
                        </Text>
                        <Pressable onPress={() => obrisiZadatak(z.id)} hitSlop={10}>
                            <Ionicons name="close" size={18} color="#CBD5E1" />
                        </Pressable>
                    </Pressable>
                ))}

                <View style={styles.unosRed}>
                    <TextInput
                        style={styles.unos}
                        value={noviZadatak}
                        onChangeText={postaviNoviZadatak}
                        placeholder="Dodaj bilješku…"
                        placeholderTextColor="#94A3B8"
                        onSubmitEditing={spremiNoviZadatak}
                        returnKeyType="done"
                    />
                    <Pressable style={styles.unosGumb} onPress={spremiNoviZadatak}>
                        <Ionicons name="add" size={20} color="white" />
                    </Pressable>
                </View>

            </ScrollView>

            <Modal
                visible={prikaziBirac}
                transparent={true}
                animationType="fade"
                onRequestClose={() => postaviPrikaziBirac(false)}
            >
                <Pressable style={styles.pozadina} onPress={() => postaviPrikaziBirac(false)}>
                    <Pressable style={styles.modalKartica} onPress={() => {}}>
                        <Text style={styles.modalNaslov}>Odaberi datum</Text>

                        <DateTimePicker
                            value={new Date(datum)}
                            mode="date"
                            display="inline"
                            themeVariant="light"
                            accentColor="#5D70E5"
                            onValueChange={(dogadaj, odabrani) => {
                                postaviDatum(odabrani.toISOString().split("T")[0]);
                            }}
                        />

                        <Pressable style={styles.modalGumb} onPress={() => postaviPrikaziBirac(false)}>
                            <Text style={styles.modalGumbTekst}>GOTOVO</Text>
                        </Pressable>
                    </Pressable>
                </Pressable>
            </Modal>

        </View>
    );
}

const styles = StyleSheet.create({
    containter: { flex: 1, backgroundColor: "#EEF2F6" },
    datumRed: {
        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
        paddingHorizontal: 20, paddingVertical: 12, backgroundColor: "white",
    },
    strelica: { fontSize: 30, color: "#5D70E5", paddingHorizontal: 16 },
    datum: { fontSize: 18, fontWeight: "bold", color: "#0F172A" },
    sadrzaj: { padding: 20, gap: 8, paddingBottom: 40 },
    skupina: {
        fontSize: 12, fontWeight: "bold", color: "#94A3B8",
        letterSpacing: 0.6, marginTop: 18, marginBottom: 6,
    },
    zadatak: {
        flexDirection: "row", alignItems: "center", gap: 12,
        backgroundColor: "white", borderRadius: 10,
        paddingVertical: 12, paddingHorizontal: 14,
    },
    zadatakTekst: { fontSize: 15, color: "#0F172A" },
    rastegni: { flex: 1 },
    gotovo: { textDecorationLine: "line-through", color: "#94A3B8" },
    kruzic: {
        width: 22, height: 22, borderRadius: 11, borderWidth: 2,
        borderColor: "#CBD5E1", alignItems: "center", justifyContent: "center",
    },
    kruzicGotov: { backgroundColor: "#22C55E", borderColor: "#22C55E" },
    prazno: {
        marginTop: 18, fontSize: 13,
        color: "#94A3B8", fontStyle: "italic",
    },
    unosRed: {
        flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4,
    },
    unos: {
        flex: 1, backgroundColor: "white", borderRadius: 10,
        paddingVertical: 12, paddingHorizontal: 14,
        fontSize: 15, color: "#0F172A",
    },
    unosGumb: {
        width: 44, height: 44, borderRadius: 10, backgroundColor: "#5D70E5",
        alignItems: "center", justifyContent: "center",
    },
    pozadina: {
        flex: 1, backgroundColor: "rgba(15,23,42,0.5)",
        justifyContent: "center", alignItems: "center", padding: 20,
    },
    modalKartica: { backgroundColor: "white", borderRadius: 16, padding: 16, width: "100%" },
    modalNaslov: {
        fontSize: 16, fontWeight: "bold", color: "#0F172A",
        marginBottom: 8, textAlign: "center",
    },
    modalGumb: {
        backgroundColor: "#5D70E5", borderRadius: 10,
        paddingVertical: 12, alignItems: "center", marginTop: 8,
    },
    modalGumbTekst: { color: "white", fontSize: 15, fontWeight: "bold" },
});