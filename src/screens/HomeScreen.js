import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../utils/theme';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ana Sayfa</Text>
        <Text style={styles.subtitle}>[Kullanıcı Karşılama Metni Gelecek]</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Yaklaşan Bakımlar</Text>
        <View style={styles.placeholderCard}>
          <Text>[Örn: Bugün sulanacak bitki uyarısı]</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bitkilerim</Text>
        <View style={styles.grid}>
          <View style={styles.imagePlaceholder}>
            <Text>[Bitki Görseli 1]</Text>
            <Text style={styles.dummyText}>Bitki Adı</Text>
          </View>

          <View style={styles.imagePlaceholder}>
            <Text>[Bitki Görseli 2]</Text>
            <Text style={styles.dummyText}>Bitki Adı</Text>
          </View>
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  header: {
    marginTop: 40, 
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 5,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  placeholderCard: {
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imagePlaceholder: {
    width: '48%',
    height: 120,
    backgroundColor: '#e0e0e0', 
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  dummyText: {
    marginTop: 10,
    color: '#666',
  }
});