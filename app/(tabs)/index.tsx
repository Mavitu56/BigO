import { View, TextInput, StyleSheet, TouchableOpacity, Text, Image, Button, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import TextRecognition from '@react-native-ml-kit/text-recognition';
import { useState } from 'react';

export default function HomeScreen() {
  const [textImage, settextImage] = useState<string>("");
  const recognizeML = async () => {
    console.log("Starting text recognition with react-native-mlkit...");
    try {
      const result = await TextRecognition.recognize(imageUri as string);
      settextImage(result.text);
      console.log("Recognized text:\n", result.text);
    } catch (error) {
      console.error("Text recognition failed:", error);
    }
  };
  const router = useRouter();
  const { imageUri } = useLocalSearchParams(); // pega a imagem passada por parâmetro

  const handlePhotoPress = () => {
    router.push('/cam');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <ThemedView style={styles.containerMain}>
          <TouchableOpacity style={styles.cameraButton} onPress={handlePhotoPress}>
            <Ionicons name="camera" size={32} color="white" />
            <Text style={styles.cameraText}>Tirar Foto</Text>
          </TouchableOpacity>

          <View style={styles.container}>
            {imageUri == null ? (
              <Text> Nenhuma imagem carregada</Text>
            ) : (
              <Image source={{ uri: imageUri as string }} style={{ width: 200, height: 200 }} />
            )}
          </View>

          <Button title="Reconhecer Texto" onPress={recognizeML} />

          <TextInput
            style={styles.textInput}
            placeholder="Digite seu prompt..."
            placeholderTextColor="#999"
            value={textImage}
            multiline
          />
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 60,
    marginVertical: 20,
    textAlign: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 40,
  },
  cameraText: {
    color: 'white',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  textInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginVertical: 20,
  },
});
