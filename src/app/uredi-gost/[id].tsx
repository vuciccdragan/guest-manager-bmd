import { Pressable, ScrollView, StyleSheet, Text, View, Alert, Modal } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useGosti } from "@/context/gosti-context";
import { formatirajDatum, brojNociUkupno } from "@/utils/datum";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Gost } from "@/data/gosti";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function GostUredi() {
    const parametri = useLocalSearchParams();
    const trazeniId = parseInt(parametri.id as string);
    const router = useRouter();

    const { gosti, urediGosta, obrisiGosta } = useGosti();
    const gost = gosti.find(g => g.id === trazeniId);
    const [datumOd, postaviDatumOd] = useState(gost?.odDatum ?? "")
    const [datumDo, postaviDatumDo] = useState(gost?.doDatum ?? "")
    const [odrasli, postaviOdrasli] = useState(gost?.odrasli ?? 2)
    const [djeca, postaviDjeca] = useState(gost?.djeca ?? 0)
    const [biracOtvoren, postaviBiracOtvoren] = useState<"od" | "do" | null>(null);

    if (!gost) {
        return (
            <View style={styles.ekran}>
                <Text style={styles.poruka}>Gost nije pronađen.</Text>
            </View>
        );
    }

    function spremiPromjene() {
        if (!gost) return;

        if (datumDo <= datumOd) {
            Alert.alert("Greška", "Datum odlaska mora biti nakon datuma dolaska.");
            return;
        }

        const zauzeto = gosti.some(g => g.apartman === gost.apartman && datumOd < g.doDatum && datumDo > g.odDatum && g.id !== gost.id)

        if (zauzeto) {
            Alert.alert("Apartman zauzet", "U tim datumima apartman je već rezerviran.");
            return;
        }

        const izmijenjeniGost: Gost = {
            id: gost.id,
            ime: gost.ime,
            apartman: gost.apartman,
            odDatum: datumOd,
            doDatum: datumDo,
            tipGosta: gost.tipGosta,
            odrasli: odrasli,
            djeca: djeca,
        };

        urediGosta(izmijenjeniGost);

        router.back();
    }

    function odaberiDatum(odabrani: Date) {
        const tekst = odabrani.toISOString().split("T")[0];
        if (biracOtvoren === "od") {
            postaviDatumOd(tekst);
        } else {
            postaviDatumDo(tekst);
        }
    }

    function obrisiRezervaciju() {
        if (!gost) return;
        Alert.alert(
            "Obrisati rezervaciju",
            `Rezervacija za ${gost.ime} bit će trajno obrisana.`,
            [
                { text: "Odustani", style: "cancel" },
                {
                    text: "Obriši", style: "destructive", onPress: () => {
                        obrisiGosta(gost.id)
                        router.back()
                    }
                },
            ]
        );
    }

    return (
        <ScrollView style={styles.ekran} contentContainerStyle={styles.sadrzaj}>

            <Pressable style={styles.natrag} onPress={() => router.back()}>
                <Ionicons name="chevron-back" size={22} color="#5D70E5" />
                <Text style={styles.natragTekst}>Natrag</Text>
            </Pressable>

            <Text style={styles.naslov}>Uredi gosta</Text>
            <Text style={styles.podnaslov}>{gost.ime} · Apartman {gost.apartman}</Text>

            <Text style={styles.oznaka}>TRAJANJE BORAVKA</Text>
            <View style={styles.kartica}>
                <View style={styles.red}>
                    <View style={styles.polaRed}>
                        <Text style={styles.mala}>PRIJAVA</Text>
                        <Pressable style={styles.polje} onPress={() => postaviBiracOtvoren("od")}>
                            <Ionicons name="calendar-outline" size={16} color="#64748B" />
                            <Text style={styles.poljeTekst}>{formatirajDatum(datumOd)}</Text>
                        </Pressable>
                    </View>

                    <View style={styles.polaRed}>
                        <Text style={styles.mala}>ODJAVA</Text>
                        <Pressable style={styles.polje} onPress={() => postaviBiracOtvoren("do")}>
                            <Ionicons name="calendar-outline" size={16} color="#64748B" />
                            <Text style={styles.poljeTekst}>{formatirajDatum(datumDo)}</Text>
                        </Pressable>
                    </View>
                </View>

                <View style={styles.nociRed}>
                    <Ionicons name="moon-outline" size={16} color="#5D70E5" />
                    <Text style={styles.nociTekst}>
                        {brojNociUkupno(datumOd, datumDo)} noći
                    </Text>
                    {(datumOd !== gost.odDatum || datumDo !== gost.doDatum) && (
                        <Text style={styles.promjena}>
                            bilo {brojNociUkupno(gost.odDatum, gost.doDatum)}
                        </Text>
                    )}
                </View>
            </View>

            <Text style={styles.oznaka}>BROJ OSOBA</Text>
            <View style={styles.kartica}>
                <View style={styles.brojacRed}>
                    <Ionicons name="person-outline" size={22} color="#0F172A" />
                    <Text style={styles.brojacNaziv}>Odrasli</Text>
                    <Pressable style={styles.kvadratic} onPress={() => postaviOdrasli(Math.max(odrasli - 1, 1))}>
                        <Ionicons name="remove" size={16} color="white" />
                    </Pressable>
                    <Text style={styles.broj}>{odrasli}</Text>
                    <Pressable
                        style={styles.kvadratic}
                        onPress={() => { if (odrasli + djeca < 5) postaviOdrasli(odrasli + 1); }}
                    >
                        <Ionicons name="add" size={16} color="white" />
                    </Pressable>
                </View>

                <View style={styles.brojacRed}>
                    <MaterialCommunityIcons name="baby-face-outline" size={22} color="#0F172A" />
                    <Text style={styles.brojacNaziv}>Djeca</Text>
                    <Pressable style={styles.kvadratic} onPress={() => postaviDjeca(Math.max(djeca - 1, 0))}>
                        <Ionicons name="remove" size={16} color="white" />
                    </Pressable>
                    <Text style={styles.broj}>{djeca}</Text>
                    <Pressable
                        style={styles.kvadratic}
                        onPress={() => { if (odrasli + djeca < 5) postaviDjeca(djeca + 1); }}
                    >
                        <Ionicons name="add" size={16} color="white" />
                    </Pressable>
                </View>
            </View>

            <View style={styles.gumbRed}>
                <Pressable style={styles.gumbSpremi} onPress={spremiPromjene}>
                    <Ionicons name="checkmark" size={20} color="white" />
                    <Text style={styles.gumbTekst}>SPREMI</Text>
                </Pressable>

                <Pressable style={styles.gumbOdustani} onPress={() => router.back()}>
                    <Text style={styles.gumbOdustaniTekst}>ODUSTANI</Text>
                </Pressable>
            </View>
            <Pressable style={styles.gumbObrisi} onPress={obrisiRezervaciju}>
                <Ionicons name="trash-outline" size={18} color="#DC2626" />
                <Text style={styles.gumbObrisiTekst}>OBRIŠI REZERVACIJU</Text>
            </Pressable>

            <Modal
                visible={biracOtvoren !== null}
                transparent={true}
                animationType="fade"
                onRequestClose={() => postaviBiracOtvoren(null)}
            >
                <Pressable style={styles.pozadina} onPress={() => postaviBiracOtvoren(null)}>
                    <Pressable style={styles.modalKartica} onPress={() => { }}>
                        <Text style={styles.modalNaslov}>
                            {biracOtvoren === "od" ? "Datum prijave" : "Datum odjave"}
                        </Text>

                        <DateTimePicker
                            value={biracOtvoren === "od" ? new Date(datumOd) : new Date(datumDo)}
                            mode="date"
                            display="inline"
                            themeVariant="light"
                            accentColor="#5D70E5"
                            onValueChange={(dogadaj, odabrani) => odaberiDatum(odabrani)}
                        />

                        <Pressable style={styles.modalGumb} onPress={() => postaviBiracOtvoren(null)}>
                            <Text style={styles.modalGumbTekst}>GOTOVO</Text>
                        </Pressable>
                    </Pressable>
                </Pressable>
            </Modal>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    ekran: { flex: 1, backgroundColor: "#F1F5F9" },
    sadrzaj: { padding: 20, paddingBottom: 40 },
    natrag: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
    natragTekst: { fontSize: 15, color: "#5D70E5", fontWeight: "600" },
    naslov: { fontSize: 28, fontWeight: "bold", color: "#0F172A" },
    podnaslov: { fontSize: 14, color: "#64748B", marginTop: 2 },
    oznaka: {
        fontSize: 12, fontWeight: "bold", color: "#94A3B8",
        letterSpacing: 0.6, marginTop: 22, marginBottom: 8,
    },
    kartica: { backgroundColor: "white", borderRadius: 16, padding: 14, gap: 14 },
    red: { flexDirection: "row", gap: 12 },
    polaRed: { flex: 1 },
    mala: {
        fontSize: 11, fontWeight: "700", color: "#94A3B8",
        marginBottom: 5, letterSpacing: 0.5,
    },
    polje: {
        flexDirection: "row", alignItems: "center", gap: 8,
        borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 10,
        paddingVertical: 11, paddingHorizontal: 12, backgroundColor: "#F8FAFC",
    },
    poljeTekst: { fontSize: 15, color: "#0F172A", fontWeight: "500" },
    nociRed: {
        flexDirection: "row", alignItems: "center", gap: 8,
        borderTopWidth: 1, borderTopColor: "#F1F5F9", paddingTop: 12,
    },
    nociTekst: { fontSize: 14, fontWeight: "600", color: "#0F172A" },
    promjena: { fontSize: 13, color: "#94A3B8" },
    brojacRed: { flexDirection: "row", alignItems: "center", gap: 10 },
    brojacNaziv: { flex: 1, fontSize: 15, fontWeight: "600", color: "#0F172A" },
    kvadratic: {
        width: 28, height: 28, borderRadius: 8, backgroundColor: "#5D70E5",
        alignItems: "center", justifyContent: "center",
    },
    broj: { fontSize: 16, fontWeight: "bold", color: "#0F172A", minWidth: 20, textAlign: "center" },
    gumbRed: { flexDirection: "row", gap: 12, marginTop: 28 },
    gumbSpremi: {
        flex: 2, backgroundColor: "#5D70E5", borderRadius: 12, paddingVertical: 15,
        flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    },
    gumbTekst: { color: "white", fontSize: 15, fontWeight: "bold" },
    gumbOdustani: {
        flex: 1,
        backgroundColor: "#E2E8F0",
        borderRadius: 12,
        paddingVertical: 15,
        alignItems: "center",
        justifyContent: "center",
    },
    gumbOdustaniTekst: {
        color: "#475569",
        fontSize: 15,
        fontWeight: "bold",
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
    poruka: { fontSize: 16, color: "#64748B", padding: 20 },
    gumbObrisi: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        marginTop: 16,
        paddingVertical: 14,
    },
    gumbObrisiTekst: {
        color: "#DC2626",
        fontSize: 14,
        fontWeight: "bold",
    },
});