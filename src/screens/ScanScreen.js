import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { Button, Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TaraEkrani() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [photo, setPhoto] = useState(null);

  if (!permission) return <View style={styles.container} />;

  const izinIste = async () => {
    if (!permission.canAskAgain) {
      Linking.openSettings();
    } else {
      await requestPermission();
    }
  };

  if (!permission.granted) {
    return (
      <View style={styles.izinContainer}>
        <Text style={styles.izinMetni}>
          Bitkini analiz edebilmemiz için kameraya erişim izni vermelisin.
        </Text>
        <Button onPress={izinIste} title="Kameraya İzin Ver" />
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photoData = await cameraRef.current.takePictureAsync();
        setPhoto(photoData.uri);
      } catch (error) {
        console.log("Fotoğraf çekilirken hata oluştu:", error);
      }
    }
  };

  if (photo) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: photo }} style={styles.camera} />
        <View style={styles.onizlemeButonlari}>
          <Button title="Yeniden Çek" onPress={() => setPhoto(null)} color="red" />
          <Button 
            title="Bitkiyi Analiz Et" 
            onPress={() => alert("Analiz API'si ilerleyen haftalarda eklenecek!")} 
            color="green" 
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing="back" ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.shutterButton} onPress={takePicture}>
            <View style={styles.shutterInside} />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  izinContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  izinMetni: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 40,
  },
  shutterButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterInside: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  onizlemeButonlari: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#fff',
  }
});