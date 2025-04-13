import { View, TextInput, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const router = useRouter();
  const { imageUri } = useLocalSearchParams(); // pega a imagem passada por parâmetro

  const handlePhotoPress = () => {
    router.push('/cam');
  };

  return (
    <ThemedView style={styles.containerMain}>
      <TouchableOpacity style={styles.cameraButton} onPress={handlePhotoPress}>
        <Ionicons name="camera" size={32} color="white" />
        <Text style={styles.cameraText}>Tirar Foto</Text>
      </TouchableOpacity>

      <View style={styles.container}>
      {imageUri == null ? <Text> Nenhuma imagem carregada</Text> : imageUri && (
        <Image source={{ uri: imageUri as string }} style={{ width: 200, height: 200 }} />
      )}
    </View>

      <TextInput
        style={styles.textInput}
        placeholder="Digite seu prompt..."
        placeholderTextColor="#999"
        multiline
      />
    </ThemedView>
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
