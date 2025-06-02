import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Camera,
  Point,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';

import { runOnJS } from 'react-native-reanimated';
import { useFocusEffect } from '@react-navigation/native';

export default function CameraScreen() {
  const { hasPermission, requestPermission } = useCameraPermission();
  const [showCamera, setShowCamera] = useState(true);

  const cameraRef = useRef<Camera>(null);
  const router = useRouter();
  const device = useCameraDevice('back');

  // Variáveis de controle para o foco
  const [focusPoint, setFocusPoint] = useState<Point | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [showFocusIndicator, setShowFocusIndicator] = useState(false);

  const focus = useCallback(async (point: Point) => {
    const c = cameraRef.current;
    if (c == null) return;

    setFocusPoint(point);
    setShowFocusIndicator(true);
    setIsFocused(false);

    try {
      await c.focus(point);
      setIsFocused(true);
    } catch (error) {
      console.error('Erro ao focar:', error);
      setIsFocused(false);
    } finally {
      setTimeout(() => {
        setShowFocusIndicator(false);
        setFocusPoint(null);
      }, 2000);
    }
  }, []);

  const gesture = Gesture.Tap().onEnd(({ x, y }) => {
    runOnJS(focus)({ x, y });
  });

  useFocusEffect(
    useCallback(() => {
      setShowCamera(true);
      return () => {
        setShowCamera(false);
      };
    }, [])
  );

  if (!device) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Carregando câmera...</Text>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Precisamos da sua permissão para usar a câmera
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            requestPermission();
          }}
        >
          <Text style={styles.text}>Conceder Permissão</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePhoto = async () => {
    if (cameraRef.current) {
      // Se o usuário não focou, foca no centro antes de tirar a foto
      if (!focusPoint) {
        const { width, height } = Dimensions.get('screen');
        const centerPoint = { x: width / 2, y: height / 2 };
        await focus(centerPoint);
      }
      try {
        const photo = await cameraRef.current.takePhoto({
          enableAutoDistortionCorrection: true,
        });
        photo.path = `file://${photo.path}`;
        console.log(photo);

        // Disable the camera after taking a photo
        setShowCamera(false);

        router.push({ pathname: '/crop', params: { uri: photo.path } });
      } catch (error) {
        console.error('Erro ao tirar foto:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <GestureHandlerRootView style={styles.container}>
        <GestureDetector gesture={gesture}>
          <Camera
            ref={cameraRef}
            style={styles.camera}
            device={device}
            isActive={showCamera}
            outputOrientation="device"
            photo={true}
          />
        </GestureDetector>
      </GestureHandlerRootView>

      {showFocusIndicator && focusPoint && (
        <View
          style={{
            position: 'absolute',
            top: focusPoint.y - 30,
            left: focusPoint.x - 30,
            width: 60,
            height: 60,
            borderRadius: 30,
            borderWidth: 2,
            borderColor: isFocused ? 'rgb(0, 255, 34)' : 'white',
            backgroundColor: 'transparent',
          }}
        />
      )}

      <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
        <MaterialIcons name="camera-alt" size={40} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', backgroundColor: '#000' },
  message: { textAlign: 'center', color: '#fff', marginBottom: 10 },
  camera: { flex: 1 },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  captureButton: {
    position: 'absolute', // Posiciona o botão sobre a câmera
    bottom: 30, // Distância da parte inferior da tela
    alignSelf: 'center', // Centraliza horizontalmente
    backgroundColor: '#007AFF',
    padding: 18,
    borderRadius: 50,
  },
  switchButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 50,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { color: '#fff', fontWeight: 'bold' },
});
