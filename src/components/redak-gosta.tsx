import { StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { bojaZaTipGosta, Gost } from "../data/gosti";
import formatirajDatum from "../utils/datum";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


export default function RedakGosta(props: { gostProp: Gost }) {
    const gost = props.gostProp;

    return (
        <View
            style={[
                styles.kartica,
                { backgroundColor: bojaZaTipGosta[gost.tipGosta] },
            ]}
        >
            <Text style={styles.apartman}>{gost.apartman}</Text>

            <View style={styles.sredina}>
                <Text style={styles.ime}>{gost.ime}</Text>

                <View style={styles.donjiRed}>
                    <View style={styles.osobe}>
                        <Text style={styles.info}>{gost.odrasli}</Text>
                        <Ionicons name="person-outline" size={14} color="#334155" />
                    </View>

                    <View style={styles.osobe}>
                        <Text style={styles.info}>{gost.djeca}</Text>
                        <MaterialCommunityIcons name="baby-bottle-outline" size={14} color="#334155" />
                    </View>

                    <Text style={styles.info}>do {formatirajDatum(gost.doDatum)}</Text>
                </View>
            </View>

            <Ionicons name="arrow-forward" size={26} color="#0F172A" />
        </View>
    );
}

const styles = StyleSheet.create({
    kartica: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 20,
        paddingVertical: 16,
        paddingHorizontal: 18,
        gap: 14,
    },
    apartman: {
        width: 40,
        fontSize: 20,
        fontWeight: "bold",
        color: "#0F172A",
    },
    sredina: {
        flex: 1,
        gap: 4,
    },
    ime: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#0F172A",
    },
    donjiRed: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    osobe: {
        flexDirection: "row",
        alignItems: "center",
        gap: 3,
    },
    info: {
        fontSize: 14,
        fontWeight: "600",
        color: "#334155",
    },
});