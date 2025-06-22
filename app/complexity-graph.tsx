import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

// ADICIONADO: Importe o WebView e o postMessage do seu novo arquivo de bridge.
import { WebView, postMessage } from "/home/victor/Documentos/BIGO final/BigO/bridge"; // Ajuste o caminho se necessário

export default function ComplexityGraph() {
    const params = useLocalSearchParams();
    const router = useRouter();

    // REMOVIDO: A ref não é mais necessária para enviar mensagens com a nova abordagem.
    // const webviewRef = useRef<WebView | null>(null);

    const [complexityParams] = useState(() => ({
        current: (params.current as string) || "On",
        new: (params.new as string) || "Ologn",
        value: (params.value as string) || "",
    }));

    const sendParamsToWebView = () => {
        try {
            // ALTERADO: Use a função postMessage importada.
            // O primeiro argumento é o nome do evento que definimos no schema.
            // O segundo é o payload (os dados) que devem corresponder ao schema.
            postMessage("sendComplexityParams", {
                current: complexityParams.current,
                new: complexityParams.new,
            });

            console.log("Parâmetros enviados via webview-bridge:", {
                current: complexityParams.current,
                new: complexityParams.new,
            });
        } catch (error) {
            // A validação do Zod pode disparar um erro se os dados estiverem incorretos.
            console.error("Erro ao enviar parâmetros para o WebView:", error);
        }
    };

    useEffect(() => {
        // Manter um pequeno atraso pode ser bom para garantir que a webview esteja pronta.
        const timer = setTimeout(sendParamsToWebView, 1000);
        return () => clearTimeout(timer);
    }, [complexityParams.current, complexityParams.new]);

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <TouchableOpacity
                    style={styles.refazerHeaderButton}
                    onPress={() =>
                        router.push({ pathname: "/result", params: { value: complexityParams.value } })}
                    activeOpacity={0.8}
                >
                    <MaterialIcons name="arrow-back-ios-new" size={28} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Gráfico de Complexidade</Text>
                <View style={{ width: 44 }} />
            </View>
            <View style={{ flex: 1 }}>
                {/* ALTERADO: Use o componente WebView da nossa bridge */}
                <WebView
                    // REMOVIDO: A ref não é mais necessária aqui.
                    // ref={webviewRef}
                    source={{ uri: "http://192.168.0.47:3001" }}
                    // A prop onMessage ainda pode ser usada para comunicação da web para o RN.
                    onMessage={(event: { nativeEvent: { data: any; }; }) => {
                        console.log("Mensagem recebida do web:", event.nativeEvent.data);
                    }}
                    javaScriptEnabled
                    domStorageEnabled
                />
            </View>
        </View>
    );
}

// ... seus estilos permanecem os mesmos ...
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 40,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 18,
        marginTop: 8,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#22223b',
        textAlign: 'center',
        flex: 1,
    },
    refazerHeaderButton: {
        backgroundColor: '#9762F6',
        borderRadius: 24,
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 3,
    },
});