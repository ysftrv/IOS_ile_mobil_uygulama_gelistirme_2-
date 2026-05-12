import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system/legacy';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { savePlant } from '../services/storageService';
import { colors } from '../utils/theme';

export default function ResultScreen({ route, navigation }) {
  const { plantData, error, imageUri } = route.params ?? {};
  const [saved, setSaved] = useState(false);

  const handleKaydet = async () => {
    let imageBase64 = null;
    if (imageUri) {
      try {
        imageBase64 = await FileSystem.readAsStringAsync(imageUri, {
          encoding: 'base64',
        });
      } catch (e) {
        console.error('[ResultScreen] base64 okunamadı:', e);
      }
    }

    const basari = await savePlant({ ...plantData, imageBase64 });

    if (basari) {
      setSaved(true);
      Alert.alert('Başarılı', 'Bitki başarıyla kaydedildi!');
    } else {
      Alert.alert('Hata', 'Kayıt sırasında bir sorun oluştu, lütfen tekrar deneyin.');
    }
  };

  if (error || !plantData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorWrapper}>
          <Text style={styles.errorEmoji}>🌿</Text>
          <Text style={styles.errorText}>
            Bitki algılanamadı, lütfen daha net bir fotoğraf çekin.
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => navigation.navigate('Tabs', { screen: 'Tara' })}
          >
            <Text style={styles.retryButtonText}>Yeniden Dene</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <Text style={styles.name}>{plantData.name}</Text>
          {plantData.commonName ? (
            <Text style={styles.commonName}>{plantData.commonName}</Text>
          ) : null}

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoText}>💧 {plantData.waterFrequency}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoText}>☀️ {plantData.sunlight}</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.description}>{plantData.description}</Text>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, saved && styles.saveButtonDone]}
          onPress={handleKaydet}
          disabled={saved}
        >
          <Ionicons
            name={saved ? 'checkmark-circle-outline' : 'save-outline'}
            size={20}
            color={colors.card}
          />
          <Text style={styles.saveButtonText}>
            {saved ? 'Kaydedildi ✓' : 'Bitkiyi Kaydet'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.navigate('Tabs', { screen: 'Ana Sayfa' })}
        >
          <Text style={styles.homeButtonText}>Ana Sayfaya Dön</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
  },
  scroll: {
    padding: 20,
    flexGrow: 1,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  name: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 4,
  },
  commonName: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#C8E6C9',
    marginVertical: 16,
  },
  infoRow: {
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: colors.text,
  },
  description: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  saveButtonDone: {
    backgroundColor: '#81C784',
  },
  saveButtonText: {
    color: colors.card,
    fontSize: 16,
    fontWeight: '600',
  },
  homeButton: {
    backgroundColor: '#888',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  homeButtonText: {
    color: colors.card,
    fontSize: 16,
    fontWeight: '600',
  },
  errorWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  errorText: {
    fontSize: 17,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 40,
  },
  retryButtonText: {
    color: colors.card,
    fontSize: 16,
    fontWeight: '600',
  },
});
