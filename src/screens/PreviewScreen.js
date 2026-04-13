import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoadingOverlay from '../components/LoadingOverlay';
import { identifyPlant } from '../services/plantApi';
import { colors } from '../utils/theme';

export default function PreviewScreen({ route, navigation }) {
  const { photoUri } = route.params;
  const [loading, setLoading] = useState(false);

  const handleAnaliz = async () => {
    setLoading(true);
    try {
      const result = await identifyPlant(photoUri);
      setLoading(false);
      Alert.alert(
        result.name,
        `Yaygın adı: ${result.commonName}\n\nSulama: ${result.waterFrequency}\nIşık: ${result.sunlight}\n\n${result.description}`,
        [{ text: 'Tamam' }]
      );
    } catch (error) {
      setLoading(false);
      Alert.alert('Hata', error.message, [{ text: 'Tamam' }]);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.geriButon}>
          <Ionicons name="arrow-back" size={24} color={colors.card} />
        </TouchableOpacity>
        <Text style={styles.baslik}>Fotoğraf Önizleme</Text>
        <View style={styles.bosAlan} />
      </View>

      <LoadingOverlay visible={loading} />
      <Image source={{ uri: photoUri }} style={styles.fotograf} resizeMode="cover" />

      <View style={styles.butonlar}>
        <TouchableOpacity
          style={[styles.buton, styles.yenidenCekButon]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="camera-reverse-outline" size={20} color={colors.card} />
          <Text style={styles.butonMetin}>Yeniden Çek</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.buton, styles.analizButon]}
          onPress={handleAnaliz}
        >
          <Ionicons name="leaf-outline" size={20} color={colors.card} />
          <Text style={styles.butonMetin}>Analiz Et</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  geriButon: {
    padding: 4,
  },
  baslik: {
    color: colors.card,
    fontSize: 18,
    fontWeight: '600',
  },
  bosAlan: {
    width: 32,
  },
  fotograf: {
    flex: 1,
    width: '100%',
  },
  butonlar: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    backgroundColor: '#111',
  },
  buton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  yenidenCekButon: {
    backgroundColor: '#555',
  },
  analizButon: {
    backgroundColor: colors.primary,
  },
  butonMetin: {
    color: colors.card,
    fontSize: 16,
    fontWeight: '600',
  },
});
