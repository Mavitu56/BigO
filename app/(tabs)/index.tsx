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
    ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import React, { useState, useEffect } from 'react';

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
    const IP = ''
    console.log('IP:', IP);
    const router = useRouter();

    const { imageUri } = useLocalSearchParams(); // pega a imagem passada por parâmetro
    const imageUriString = imageUri?.toString();

    const [contextText, setContextText] = useState('');

    const [processedImageUri, setProcessedImageUri] = useState<string | null>(
        null
    );

    const [textImage, settextImage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false); // Estado para controlar o loading

    // Adicione um estado para controlar qual botão está ativo
    const [activeButton, setActiveButton] = useState<'original' | 'preprocess' | null>(null);

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

    // Altere as funções para atualizar o estado
    const handleOriginal = () => {
        resetFilter();
        setActiveButton('original');
    };

    const handlePreprocess = () => {
        processImage();
        setActiveButton('preprocess');
    };

    const recognizeML = async () => {
        setIsLoading(true);
        console.log('Starting text recognition with react-native-mlkit...');
        try {
            // Usa o arquivo processado se existir, senão usa o original
            const imagePath = processedImageUri || imageUriString;
            const result = await TextRecognition.recognize(imagePath as string);
            settextImage(result.text);
            console.log('Recognized text:\n', result.text);
            console.log(`IP:${IP}`);
            fetch(`http://${IP}:3000/analyze-complexity`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ code: result.text, prompt: contextText }),
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
            'Starting text reognition with react-native-vision-camera-text-recognition...'
        );

        try {
            const result = await PhotoRecognizer({
                uri: imageUriString,
            });

            console.log('Recognized text:\n', result.resultText);
        } catch (error) {
            console.error('Text recognition failed:', error);
        } finally {
            setIsLoading(false); // Desativa o estado de carregamento
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: '#fff' }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.block1}>
                    <Text style={styles.title}>Envie sua imagem</Text>
                    <View style={styles.imageWrapper}>
                        <TouchableOpacity style={styles.imageUploadBox} onPress={handlePhotoPress}>
                            {imageUriString ? (
                                <Image
                                    source={{ uri: processedImageUri || imageUriString }}
                                    style={styles.previewImage}
                                    resizeMode="contain" // garante que a imagem inteira aparece
                                />
                            ) : (
                                <Ionicons name="camera" size={40} color="#fff" />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={[
                            styles.actionButton,
                            activeButton === 'original' && styles.active,
                            !imageUriString && styles.deactivate,
                        ]}
                        onPress={handleOriginal}
                        disabled={!imageUriString}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.actionButtonText}>Original</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.actionButton,
                            activeButton === 'preprocess' && styles.active,
                            !imageUriString && styles.deactivate,
                        ]}
                        onPress={handlePreprocess}
                        disabled={!imageUriString}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.actionButtonText}>Pré-Processar Imagem</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.block2}>
                    <Text style={styles.subtitle}>Envie o contexto</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Tenho um código em python que faz uma multiplicação de matriz..."
                        placeholderTextColor="#999"
                        multiline
                        value={contextText}
                        onChangeText={setContextText}
                    />
                </View>

                {isLoading && (
                    <ActivityIndicator size="large" color="#9762F6" style={{ marginVertical: 20 }} />
                )}

                <TouchableOpacity
                    style={[
                        styles.uploadButton,
                        !imageUriString && styles.uploadButtonDisabled,
                    ]}
                    onPress={recognizeML}
                    disabled={!imageUriString}
                >
                    <Text style={styles.uploadButtonText}>Fazer o Upload</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        padding: 24, // padding mais generoso
        paddingTop: 40, // espaço extra no topo
        paddingBottom: 10,
        backgroundColor: '#fff',
    },
    block1: {
        marginBottom: 20, // mais espaço entre blocos
    },
    block2: {
        marginBottom: 40, // mais espaço entre blocos
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16, // espaçamento mais generoso após o título
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    imageWrapper: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    imageUploadBox: {
        backgroundColor: '#9762F6',
        borderRadius: 12,
        width: '100%',
        height: 220, // altura maior pra acomodar bem a imagem
        justifyContent: 'center',
        alignItems: 'center',
    },
    previewImage: {
        width: '100%',
        height: '100%',
    },
    textInput: {
        borderColor: '#c2a8fa',
        borderWidth: 2,
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        minHeight: 140,
        textAlignVertical: 'top',
    },
    uploadButtonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: 'bold',
    },
    uploadButton: {
        backgroundColor: '#9762F6',
        paddingVertical: 18,
        borderRadius: 20,
        alignItems: 'center',
    },
    uploadButtonDisabled: {
        backgroundColor: '#C0A4F3', // cor mais clara para desabilitado
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 20,
    },
    actionButton: {
        backgroundColor: '#C0A4F3',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    actionButtonDisabled: {
        backgroundColor: '#d3d3d3',
    },
    actionButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    active: {
        backgroundColor: '#9762F6', // cor para ativo
    },
    deactivate: {
        backgroundColor: '#C0A4F3', // cor para desativado
    },
});
