import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image, StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import React, { useEffect, useState } from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import MaterialIcons from '@expo/vector-icons/MaterialIcons'; // adicionado

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
        cropping: true,
        mediaType: 'photo',
        freeStyleCropEnabled: true,
      });
      console.log('Cropped image:', croppedImage);
      setCroppedImageUri(croppedImage.path);
    } catch (error) {
      console.error('Erro ao cortar a imagem:', error);
    }
  };

  const handleConfirm = () => {
    router.replace({
      pathname: '/',
      params: { imageUri: croppedImageUri || imageUri },
    });
  };

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Solicitando permissão para acessar a mídia...
        </Text>
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
      {/* Header com título e botão refazer à esquerda */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.refazerHeaderButton}
          onPress={() => router.replace('/cam')}
          activeOpacity={0.8}
        >
          <MaterialIcons name="arrow-back-ios-new" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Imagem</Text>
        <View style={{ width: 44 }} pointerEvents="none" />
      </View>

      <Image
        source={{ uri: croppedImageUri || imageUri }}
        style={styles.image}
      />
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.iconButton} onPress={handleCrop}>
          <MaterialIcons name="crop" size={28} color="#fff" />
          <Text style={styles.buttonText}>Cortar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={handleConfirm}>
          <MaterialIcons name="check-circle" size={28} color="#fff" />
          <Text style={styles.buttonText}>Confirmar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: '80%',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    objectFit: 'contain',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 24,
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#9762F6', // alterado
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
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