import { bojaZaTipGosta, gosti, Gost } from "../data/gosti"
import { StyleSheet, Text, View } from "react-native";
import RedakGosta from "../components/redak-gosta";

export default function RasporedGostiju() {
    return (
        <View style={styles.container}>
            {gosti.map(gost => (
                <RedakGosta key={gost.id} gostProp={gost} />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        gap: 12,
    },
});