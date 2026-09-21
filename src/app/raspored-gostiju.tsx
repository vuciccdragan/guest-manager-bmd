import { bojaZaTipGosta, gosti, Gost } from "../data/gosti"
import { StyleSheet, Text, View } from "react-native";

export default function RasporedGostiju() {
    return (
            <View style={styles.container}>
                {gosti.map(gost => (
                    <View key={gost.id} style={styles.ime}>
                        <Text>
                        {gost.ime}
                        </Text>
                        <Text>
                            {gost.apartman}
                        </Text>
                        <Text>
                            {gost.odrasli}
                        </Text>
                        <Text>
                            {gost.djeca}
                        </Text>
                        <Text style={[styles.ime, {backgroundColor: bojaZaTipGosta[gost.tipGosta]}]}>
                            {gost.tipGosta}
                        </Text>
                    </View>
                ))
                }
            </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        gap: 12,
    },
    ime: {
        fontWeight: "bold",
        fontSize: 40,
        marginBottom: 20,
    },
});