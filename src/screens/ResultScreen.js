import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../utils/theme';

export default function ResultScreen({ route, navigation }) {
  const { plantData, error } = route.params ?? {};

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
  homeButton: {
    backgroundColor: colors.primary,
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
