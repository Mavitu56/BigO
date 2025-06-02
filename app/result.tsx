import { useRouter, useLocalSearchParams } from "expo-router";
import { View, Text, Button, StyleSheet } from "react-native";

export default function Result() {
    const router = useRouter();
    const { value } = useLocalSearchParams();

    // Certifique-se de que `value` é um objeto válido
    const parsedValue = typeof value === "string" ? JSON.parse(value) : value;

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Result:</Text>
            {parsedValue &&
                Object.entries(parsedValue).map(([key, val]) => (
                    <Text key={key} style={styles.text}>
                        {key}: {String(val)}
                    </Text>
                ))}
            <Button title="Go Back" onPress={() => router.back()} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    text: {
        fontSize: 18,
        marginBottom: 8,
    },
});