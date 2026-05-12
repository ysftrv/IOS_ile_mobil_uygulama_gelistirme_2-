import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { clearAllPlants, deletePlant, getPlants } from '../services/storageService';
import { colors } from '../utils/theme';

function formatDate(isoString) {
  const d = new Date(isoString);
  const gun = String(d.getDate()).padStart(2, '0');
  const ay = String(d.getMonth() + 1).padStart(2, '0');
  const yil = d.getFullYear();
  return `${gun}/${ay}/${yil}`;
}

function PlantCard({ item, onDelete }) {
  const handleLongPress = () => {
    Alert.alert(
      'Kaydı Sil',
      `"${item.commonName}" bitkisini silmek istiyor musunuz?`,
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => onDelete(item.id),
        },
      ]
    );
  };

  return (
    <TouchableOpacity style={styles.card} onLongPress={handleLongPress} activeOpacity={0.8}>
      {item.imageBase64 ? (
        <Image
          source={{ uri: `data:image/jpeg;base64,${item.imageBase64}` }}
          style={styles.plantImage}
        />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Ionicons name="leaf-outline" size={28} color={colors.primary} />
        </View>
      )}

      <View style={styles.cardInfo}>
        <Text style={styles.commonName} numberOfLines={1}>
          {item.commonName}
        </Text>
        <Text style={styles.scientificName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.date}>{formatDate(item.savedAt)}</Text>
      </View>
    </TouchableOpacity>
  );
}

function EmptyState() {
  return (
    <View style={styles.emptyContainer}>
      <Ionicons name="leaf-outline" size={72} color={colors.tabInactive} />
      <Text style={styles.emptyText}>Henüz kayıtlı bitkiniz yok</Text>
      <Text style={styles.emptySubText}>
        Bir bitki tarayın ve "Bitkiyi Kaydet" butonuna basın.
      </Text>
    </View>
  );
}

export default function MyPlantsScreen() {
  const [plants, setPlants] = useState([]);

  const loadPlants = useCallback(async () => {
    const data = await getPlants();
    setPlants(data);
  }, []);

  useFocusEffect(loadPlants);

  const handleDelete = async (id) => {
    await deletePlant(id);
    setPlants((prev) => prev.filter((p) => p.id !== id));
  };

  const handleClearAll = () => {
    Alert.alert(
      'Tüm Kayıtları Sil',
      'Tüm bitki kayıtlarınız silinecek. Emin misiniz?',
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Tümünü Sil',
          style: 'destructive',
          onPress: async () => {
            await clearAllPlants();
            setPlants([]);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Kayıtlarım</Text>
        {plants.length > 0 && (
          <TouchableOpacity onPress={handleClearAll} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Tümünü Sil</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={plants}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <PlantCard item={item} onDelete={handleDelete} />
        )}
        contentContainerStyle={plants.length === 0 ? styles.emptyList : styles.list}
        ListEmptyComponent={<EmptyState />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  clearButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EF9A9A',
  },
  clearButtonText: {
    color: '#E53935',
    fontSize: 14,
    fontWeight: '500',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 12,
  },
  emptyList: {
    flexGrow: 1,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  plantImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E8F5E9',
  },
  imagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: {
    flex: 1,
  },
  commonName: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  scientificName: {
    fontSize: 13,
    fontStyle: 'italic',
    color: colors.textLight,
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: colors.tabInactive,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 12,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textLight,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    color: colors.tabInactive,
    textAlign: 'center',
    lineHeight: 20,
  },
});
