import { Pressable, ScrollView, StyleSheet, Text, View, Modal } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { useGosti } from "@/context/gosti-context";
import { useRouter } from "expo-router";
import { apartmani } from "@/data/apartmani";
import { formatirajDatumGodina } from "@/utils/datum";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function Slobodno() {
    const [datumOd, postaviDatumOd] = useState("");
    const [datumDo, postaviDatumDo] = useState("");
    const [biracOtvoren, postaviBiracOtvoren] = useState<"od" | "do" | null>(null);
    const [odabraniApartman, postaviApartman] = useState("")
    const [otvorenIzbornik, postaviOtvorenIzbornik] = useState(false);

    const danas = new Date().toISOString().split("T")[0];
    const trazeniOd = datumOd === "" ? danas : datumOd;
    const trazeniDo = datumDo === "" ? trazeniOd : datumDo;

    const apartmaniZaPretragu = odabraniApartman === "" ? apartmani : [odabraniApartman]

    const router = useRouter()
    const { gosti } = useGosti();

    const slobodni = apartmaniZaPretragu.filter(apartman => !gosti.some(gost => gost.apartman === apartman && trazeniOd < gost.doDatum && trazeniDo > gost.odDatum))
    const pretragaAktivna = datumOd !== "" || datumDo !== "";

    function sljedeciDolazak(oznaka: string): string | null {
        const buduciGosti = gosti.filter(gost => gost.apartman === oznaka && gost.odDatum > trazeniOd)
        const poredani = [...buduciGosti].sort((a, b) =>
            a.odDatum.localeCompare(b.odDatum)
        );
        if (poredani.length === 0) {
            return null;
        }
        return poredani[0].odDatum;
    }
    return (
        <ScrollView style={styles.ekran} contentContainerStyle={styles.sadrzaj}>

            <Pressable style={styles.natrag} onPress={() => router.back()}>
                <Ionicons name="chevron-back" size={22} color="#5D70E5" />
                <Text style={styles.natragTekst}>Natrag</Text>
            </Pressable>

            <Text style={styles.naslov}>Slobodni apartmani</Text>
            <Text style={styles.podnaslov}>
                {!pretragaAktivna
                    ? `Stanje danas, ${formatirajDatumGodina(danas)}`
                    : datumDo === ""
                        ? `Od ${formatirajDatumGodina(trazeniOd)}`
                        : `${formatirajDatumGodina(trazeniOd)} – ${formatirajDatumGodina(trazeniDo)}`}
            </Text>

            <Modal
                visible={otvorenIzbornik}
                transparent={true}
                animationType="fade"
                onRequestClose={() => postaviOtvorenIzbornik(false)}
            >
                <Pressable style={styles.pozadina} onPress={() => postaviOtvorenIzbornik(false)}>
                    <Pressable style={styles.modalKartica} onPress={() => { }}>
                        <Text style={styles.modalNaslov}>Odaberi apartman</Text>

                        <Pressable style={styles.izbornikStavka} onPress={
                            () => {
                                postaviApartman("");
                                postaviOtvorenIzbornik(false);
                            }
                        }>
                            <Text style={styles.izbornikTekst}>Svi apartmani</Text>
                        </Pressable>

                        {apartmani.map(a => (
                            <Pressable
                                key={a}
                                style={[styles.izbornikStavka, odabraniApartman === a && styles.izbornikOdabran]}
                                onPress={() => {
                                    postaviApartman(a);
                                    postaviOtvorenIzbornik(false);
                                }}
                            >
                                <Text style={[styles.izbornikStavka, odabraniApartman === a && styles.izbornikOdabran]}>{a}</Text>
                            </Pressable>
                        ))}
                    </Pressable>
                </Pressable>
            </Modal>

            <View style={styles.filterKartica}>
                <View style={styles.apartmanBlok}>
                    <Text style={styles.mala}>APARTMAN</Text>
                    <Pressable style={styles.polje} onPress={() => postaviOtvorenIzbornik(true)}>
                        <Ionicons name="home-outline" size={16} color="#64748B" />
                        <Text style={odabraniApartman === "" ? styles.placeholder : styles.poljeTekst}>
                            {odabraniApartman === "" ? "Svi apartmani" : odabraniApartman}
                        </Text>
                    </Pressable>
                </View>
                <View style={styles.red}>
                    <View style={styles.polaRed}>
                        <Text style={styles.mala}>OD</Text>
                        <Pressable style={styles.polje} onPress={() => postaviBiracOtvoren("od")}>
                            <Text style={datumOd === "" ? styles.placeholder : styles.poljeTekst}>
                                {datumOd === "" ? "Odaberi" : formatirajDatumGodina(datumOd)}
                            </Text>
                        </Pressable>
                    </View>

                    <View style={styles.polaRed}>
                        <Text style={styles.mala}>DO</Text>
                        <Pressable style={styles.polje} onPress={() => postaviBiracOtvoren("do")}>
                            <Text style={datumDo === "" ? styles.placeholder : styles.poljeTekst}>
                                {datumDo === "" ? "Odaberi" : formatirajDatumGodina(datumDo)}
                            </Text>
                        </Pressable>
                    </View>
                </View>
                {pretragaAktivna && (
                    <Pressable style={styles.ocisti} onPress={() => {
                        postaviDatumOd("");
                        postaviDatumDo("");
                    }}>
                        <Ionicons name="close-circle" size={16} color="#64748B" />
                        <Text style={styles.ocistiTekst}>Poništi pretragu</Text>
                    </Pressable>
                )}

            </View>

            {slobodni.length === 0 ? (
                <View style={styles.praznoKartica}>
                    <Ionicons name="close-circle-outline" size={40} color="#DC2626" />
                    <Text style={styles.praznoNaslov}>Nema slobodnih apartmana</Text>
                    <Text style={styles.praznoOpis}>
                        Svi su apartmani zauzeti. Pokušajte drugi termin.
                    </Text>
                </View>
            ) : (
                <>
                    <Text style={styles.brojac}>Slobodni apartmani: {slobodni.length}</Text>
                    {
                        slobodni.map(oznaka => (
                            <Pressable key={oznaka} style={styles.kartica}>
                                <View style={styles.oznakaOkvir}>
                                    <Text style={styles.oznakaTekst}>{oznaka}</Text>
                                </View>

                                <View style={styles.tekstBlok}>
                                    <Text style={styles.statusSlobodan}>Slobodan</Text>
                                    <Text style={styles.info}>
                                        {sljedeciDolazak(oznaka) === null
                                            ? `Od ${formatirajDatumGodina(trazeniOd)} nadalje`
                                            : `${formatirajDatumGodina(trazeniOd)} – ${formatirajDatumGodina(sljedeciDolazak(oznaka)!)}`}
                                    </Text>
                                </View>

                            </Pressable>
                        ))}
                </>
            )}

            <Modal
                visible={biracOtvoren !== null}
                transparent={true}
                animationType="fade"
                onRequestClose={() => postaviBiracOtvoren(null)}
            >
                <Pressable style={styles.pozadina} onPress={() => postaviBiracOtvoren(null)}>
                    <Pressable style={styles.modalKartica} onPress={() => { }}>
                        <Text style={styles.modalNaslov}>
                            {biracOtvoren === "od" ? "Datum od" : "Datum do"}
                        </Text>

                        <DateTimePicker
                            value={
                                biracOtvoren === "od"
                                    ? (datumOd === "" ? new Date() : new Date(datumOd))
                                    : (datumDo === "" ? new Date() : new Date(datumDo))
                            }
                            mode="date"
                            display="inline"
                            themeVariant="light"
                            accentColor="#5D70E5"
                            minimumDate={new Date()}
                            onValueChange={(dogadaj, odabrani) => {
                                const tekst = odabrani.toISOString().split("T")[0];
                                if (biracOtvoren === "od") {
                                    postaviDatumOd(tekst);
                                } else {
                                    postaviDatumDo(tekst);
                                }
                            }}
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
    apartmanBlok: {
        marginBottom: 12,
    },
    izbornikOdabran: {
        backgroundColor: "#EEF2FF",
    },
    ekran: { flex: 1, backgroundColor: "#F1F5F9" },
    sadrzaj: { padding: 20, paddingBottom: 40 },
    natrag: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
    natragTekst: { fontSize: 15, color: "#5D70E5", fontWeight: "600" },
    naslov: { fontSize: 28, fontWeight: "bold", color: "#0F172A" },
    podnaslov: { fontSize: 14, color: "#64748B", marginTop: 2, marginBottom: 18 },
    filterKartica: {
        backgroundColor: "white", borderRadius: 16, padding: 14, marginBottom: 20,
    },
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
    placeholder: { fontSize: 15, color: "#94A3B8" },
    ocisti: {
        flexDirection: "row", alignItems: "center", justifyContent: "center",
        gap: 6, marginTop: 12,
    },
    ocistiTekst: { fontSize: 13, color: "#64748B", fontWeight: "500" },
    brojac: {
        fontSize: 12, fontWeight: "bold", color: "#94A3B8",
        letterSpacing: 0.6, marginBottom: 10, textTransform: "uppercase",
    },
    kartica: {
        flexDirection: "row", alignItems: "center", gap: 14,
        backgroundColor: "white", borderRadius: 16, padding: 14, marginBottom: 10,
    },
    oznakaOkvir: {
        width: 48, height: 48, borderRadius: 12, backgroundColor: "#DCFCE7",
        alignItems: "center", justifyContent: "center",
    },
    oznakaTekst: { fontSize: 17, fontWeight: "bold", color: "#16A34A" },
    tekstBlok: { flex: 1 },
    statusSlobodan: { fontSize: 16, fontWeight: "bold", color: "#16A34A" },
    info: { fontSize: 13, color: "#64748B", marginTop: 2 },
    praznoKartica: {
        backgroundColor: "white", borderRadius: 16, padding: 28,
        alignItems: "center", gap: 8, marginTop: 10,
    },
    praznoNaslov: { fontSize: 17, fontWeight: "bold", color: "#0F172A", marginTop: 4 },
    praznoOpis: { fontSize: 14, color: "#64748B", textAlign: "center", lineHeight: 20 },
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
    izbornikStavka: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#F1F5F9",
    },
    izbornikTekst: {
        fontSize: 16,
        fontWeight: "600",
        color: "#0F172A",
    },
    dropdown: {
        backgroundColor: "#5D70E5", borderRadius: 20, paddingVertical: 10, paddingHorizontal: 18,
        flexDirection: "row", alignItems: "center", gap: 10, alignSelf: "flex-start", marginBottom: 13
    },
    dropdownTekst: { color: "white", fontSize: 15, fontWeight: "bold" },
    izbornik: {
        backgroundColor: "#5D70E5", borderRadius: 10, marginTop: 6, paddingVertical: 6,
        alignSelf: "flex-start", minWidth: 160,
    }
});