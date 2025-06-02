import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  Button,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  ActivityIndicator, // Importado para exibir o loading
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ThemedView } from "@/components/ThemedView";
import { useState } from "react";

import TextRecognition from "@react-native-ml-kit/text-recognition";
import { PhotoRecognizer } from "react-native-vision-camera-text-recognition";
import { PhotoProvider } from "@/context/PhotoProvider";
import { IP } from '@env';

export default function HomeScreen() {
  console.log("IP:", IP);
  const router = useRouter();
  const { imageUri } = useLocalSearchParams(); // pega a imagem passada por parâmetro

  const [textImage, settextImage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false); // Estado para controlar o loading

  const handlePhotoPress = () => {
    router.push("/cam");
  };

  const handleRecognizePress = async () => {
    setIsLoading(true); // Ativa o estado de carregamento
    console.log("Starting text recognition with react-native-mlkit...");
    try {
      const result = await TextRecognition.recognize(imageUri as string);
      settextImage(result.text);
      console.log("Recognized text:\n", result.text);
      console.log(`IP:${IP}`);
      fetch(`http://${IP}:3000/analyze-complexity`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: result.text }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Server response:", data);
          router.push({ pathname: "/result", params: { value: JSON.stringify(data) } });
        })
        .catch((error) => {
          console.error("Error sending recognized text to server:", error);
        });

    } catch (error) {
      console.error("Text recognition failed:", error);
    } finally {
      setIsLoading(false); // Desativa o estado de carregamento
    }
  };

  const photoRecognizer = async () => {
    console.log(
      "Starting text reognition with react-native-vision-camera-text-recognition..."
    );

    try {
      const result = await PhotoRecognizer({
        uri: imageUri as string,
      });

      console.log("Recognized text:\n", result.resultText);
    } catch (error) {
      console.error("Erro ao processar:", error);
    } finally {
      setIsLoading(false); // Desativa o estado de carregamento
    }
  };

  return (
    <PhotoProvider>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <ThemedView style={styles.containerMain}>
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={handlePhotoPress}
            >
              <Ionicons name="camera" size={32} color="white" />
              <Text style={styles.cameraText}>Tirar Foto</Text>
            </TouchableOpacity>
            <View style={styles.container}>
              {imageUri == null ? (
                <Text> Nenhuma imagem carregada</Text>
              ) : (
                <Image
                  source={{ uri: imageUri as string }}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              )}
            </View>
            <TextInput
              style={styles.textInput}
              placeholder="Digite seu prompt..."
              placeholderTextColor="#999"
              multiline
            />

            {isLoading ? ( // Exibe o loading enquanto o estado isLoading for true
              <ActivityIndicator size="large" color="#007AFF" />
            ) : (
              <TouchableOpacity
                style={styles.recognizeButton}
                onPress={handleRecognizePress}
              >
                <Text style={styles.recognizeButtonText}>Reconhecer Texto</Text>
              </TouchableOpacity>
            )}
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </PhotoProvider>
  );
}

const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 60,
    marginVertical: 20,
    textAlign: "center",
    alignItems: "center",
  },
  cameraButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "center",
    marginTop: 40,
  },
  cameraText: {
    color: "white",
    marginLeft: 10,
    fontWeight: "bold",
  },
  textInput: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: "top",
  },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginVertical: 20,
  },
  recognizeButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  recognizeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
