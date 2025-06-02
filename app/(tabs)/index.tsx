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
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import { useState } from 'react';

import TextRecognition from '@react-native-ml-kit/text-recognition';
import { PhotoRecognizer } from 'react-native-vision-camera-text-recognition';
import { PhotoProvider } from '@/context/PhotoProvider';

import {
  BorderTypes,
  ColorConversionCodes,
  DataTypes,
  ObjectType,
  OpenCV,
  AdaptiveThresholdTypes,
  ThresholdTypes,
  MorphShapes,
  MorphTypes,
  InterpolationFlags,
} from 'react-native-fast-opencv';
import * as fs from 'expo-file-system';

export default function HomeScreen() {
  const router = useRouter();

  const [textImage, settextImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false); // Estado para controlar o loading
  const { imageUri } = useLocalSearchParams(); // pega a imagem passada por parâmetro
  const imageUriString = imageUri?.toString();

  const [processedImageUri, setProcessedImageUri] = useState<string | null>(
    null
  );

  const handlePhotoPress = () => {
    setProcessedImageUri(null);
    settextImage('');
    router.push('/cam');
  };

  /**  Filtros */
  // Voltar para a imagem original
  const resetFilter = () => {
    setProcessedImageUri(null);
  };

  // Função para processar a imagem
  // Converte a imagem para tons de cinza
  const processImage = async () => {
    if (!imageUriString) return;

    // Lê o arquivo e converte para base64
    const base64 = await fs.readAsStringAsync(imageUriString, {
      encoding: fs.EncodingType.Base64,
    });

    // Cria matriz a partir do base64
    const src = OpenCV.base64ToMat(base64);
    const dst = OpenCV.createObject(ObjectType.Mat, 0, 0, DataTypes.CV_8U);

    // Converte para tons de cinza
    OpenCV.invoke('cvtColor', src, dst, ColorConversionCodes.COLOR_BGR2GRAY);

    // Aplica um desfoque gaussiano
    const kernel = OpenCV.createObject(ObjectType.Size, 5, 5);

    OpenCV.invoke('GaussianBlur', dst, dst, kernel, 0);

    // Converte de volta para base64
    const result = OpenCV.toJSValue(dst);

    // Gera um nome único para o arquivo temporário baseado na imagem
    const tempFilePath =
      fs.cacheDirectory + `processed_image_${Date.now()}.png`;
    await fs.writeAsStringAsync(tempFilePath, result.base64, {
      encoding: fs.EncodingType.Base64,
    });
    setProcessedImageUri(tempFilePath);

    // Libera recursos
    OpenCV.clearBuffers();
  };

  const handleRecognizePress = async () => {
    setIsLoading(true); // Ativa o estado de carregamento
    console.log('Starting text recognition with react-native-mlkit...');
    try {
      // Usa o arquivo processado se existir, senão usa o original
      const imagePath = processedImageUri || imageUriString;
      const result = await TextRecognition.recognize(imagePath);
      settextImage(result.text);
      console.log('Recognized text:\n', result.text);
      // console.log(`IP:${IP}`);
      fetch(`http://localhost:3000/analyze-complexity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: result.text }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Server response:', data);
          router.push({
            pathname: '/result',
            params: { value: JSON.stringify(data) },
          });
        })
        .catch((error) => {
          console.error('Error sending recognized text to server:', error);
        });
    } catch (error) {
      console.error('Text recognition failed:', error);
    } finally {
      setIsLoading(false); // Desativa o estado de carregamento
    }
  };

  const photoRecognizer = async () => {
    console.log(
      'Starting text reognition with react-native-vision-camera-text-recognition...'
    );

    try {
      const result = await PhotoRecognizer({
        uri: imageUriString,
      });

      console.log('Recognized text:\n', result.resultText);
    } catch (error) {
      console.error('Erro ao processar:', error);
    } finally {
      setIsLoading(false); // Desativa o estado de carregamento
    }
  };

  return (
    <PhotoProvider>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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
                  source={{
                    uri: processedImageUri || imageUriString,
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                />
              )}
            </View>
            {imageUriString && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginVertical: 16,
                }}
              >
                <TouchableOpacity
                  style={{ flex: 1, alignItems: 'center' }}
                  onPress={resetFilter}
                >
                  <Text style={{ color: '#007AFF', fontWeight: 'bold' }}>
                    Original
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ flex: 1, alignItems: 'center' }}
                  onPress={processImage}
                >
                  <Text style={{ color: '#007AFF', fontWeight: 'bold' }}>
                    Pré-Processar Imagem
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            <Button title="Reconhecer Texto" onPress={handleRecognizePress} />
            {textImage != '' && (
              <Text style={[styles.textInput, { marginVertical: 20 }]}>
                {textImage}
              </Text>
            )}
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
  recognizeButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  recognizeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
