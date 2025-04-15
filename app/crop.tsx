import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image, StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { useEffect, useState } from 'react';
import ImagePicker from 'react-native-image-crop-picker';

export default function CropScreen() {
  const { uri } = useLocalSearchParams();
  const router = useRouter();

  const [hasPermission, setHasPermission] = useState(false);
  const [croppedImageUri, setCroppedImageUri] = useState<string | null>(null);
  const imageUri = uri.toString();

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === 'granted') {
        setHasPermission(true);
      } else {
        alert('Permissão para acessar a mídia é necessária.');
      }
    })();
  }, []);

  const handleCrop = async () => {
    try {
      const croppedImage = await ImagePicker.openCropper({
        path: imageUri,
        width: 300,
        height: 300,
        cropping: true,
        mediaType: 'photo'
      });
      setCroppedImageUri(croppedImage.path);
    } catch (error) {
      console.error('Erro ao cortar a imagem:', error);
    }
  };

  const handleConfirm = () => {
    router.replace({ pathname: '/', params: { imageUri: croppedImageUri || imageUri } });
  };

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Solicitando permissão para acessar a mídia...</Text>
      </View>
    );
  }

  if (!imageUri) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Imagem não encontrada.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: croppedImageUri || imageUri }}
        style={styles.image}
        resizeMode="contain"
      />
      <TouchableOpacity style={styles.button} onPress={handleCrop}>
        <Text style={styles.buttonText}>Cortar Imagem</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleConfirm}>
        <Text style={styles.buttonText}>Confirmar Recorte</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: '80%',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
});
