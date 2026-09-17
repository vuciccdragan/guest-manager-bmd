import { gosti } from "../data/gosti"
import { StyleSheet, Text, View } from "react-native";

export default function RasporedGostiju() {
    return (
        <View style = {styles.container}>
            {gosti.map(gost => (
                <Text key = {gost.id} style={styles.ime}>
                    {gost.ime}
                </Text>
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
    ime: {
        fontSize: 18,
    },
});