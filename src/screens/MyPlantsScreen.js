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
import { clearAllPlants, deletePlant, getPlants, savePlant } from '../services/storageService';
import { colors } from '../utils/theme';

const TEST_PLANTS = [
  {
    name: 'Monstera deliciosa',
    commonName: 'İsviçre Peyniri Bitkisi',
    waterFrequency: 'Haftada 1-2 kez',
    sunlight: 'Parlak dolaylı ışık',
    description: 'Tropikal kökenli, büyük yapraklı bir iç mekan bitkisi.',
    imageBase64: null,
  },
  {
    name: 'Sansevieria trifasciata',
    commonName: 'Kayınvalide Dili',
    waterFrequency: '3-4 haftada bir',
    sunlight: 'Düşük ila parlak dolaylı ışık',
    description: 'Dayanıklı, bakımı kolay bir iç mekan bitkisi.',
    imageBase64: null,
  },
  {
    name: 'Ficus lyrata',
    commonName: 'Keman Yapraklı İncir',
    waterFrequency: 'Haftada 1 kez',
    sunlight: 'Parlak dolaylı ışık',
    description: 'Büyük, dalgalı yapraklarıyla dekoratif bir ağaç türü.',
    imageBase64: null,
  },
];

function formatDate(isoString) {
  const d = new Date(isoString);
  const gun = String(d.getDate()).padStart(2, '0');
  const ay = String(d.getMonth() + 1).padStart(2, '0');
  const yil = d.getFullYear();
  return `${gun}/${ay}/${yil}`;
}

function PlantCard({ item, onDelete }) {
  const handleDelete = () => {
    Alert.alert(
      'Bitkiyi Sil',
      `"${item.commonName}" bitkisini silmek istediğinize emin misiniz?`,
      [
        { text: 'Vazgeç', style: 'cancel' },
        { text: 'Sil', style: 'destructive', onPress: () => onDelete(item.id) },
      ]
    );
  };

  return (
    <View style={styles.card}>
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
        <Text style={styles.infoText}>💧 {item.waterFrequency}</Text>
        <Text style={styles.infoText}>☀️ {item.sunlight}</Text>
        <Text style={styles.date}>{formatDate(item.savedAt)}</Text>
      </View>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Ionicons name="trash-outline" size={20} color="#E53935" />
      </TouchableOpacity>
    </View>
  );
}

function EmptyState() {
  return (
    <View style={styles.emptyContainer}>
      <Ionicons name="leaf-outline" size={72} color={colors.tabInactive} />
      <Text style={styles.emptyText}>Henüz kayıtlı bitkiniz yok</Text>
      <Text style={styles.emptySubText}>
        Bitki taramak için Tara sekmesine gidin.
      </Text>
    </View>
  );
}

export default function MyPlantsScreen() {
  const [plants, setPlants] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadPlants = useCallback(async () => {
    const data = await getPlants();
    setPlants(data);
  }, []);

  useFocusEffect(loadPlants);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPlants();
    setRefreshing(false);
  };

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

  const handleAddTestData = async () => {
    for (const plant of TEST_PLANTS) {
      await savePlant(plant);
    }
    await loadPlants();
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

      <TouchableOpacity style={styles.testButton} onPress={handleAddTestData}>
        <Ionicons name="flask-outline" size={16} color={colors.card} />
        <Text style={styles.testButtonText}>Test Verisi Ekle</Text>
      </TouchableOpacity>

      <FlatList
        data={plants}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <PlantCard item={item} onDelete={handleDelete} />
        )}
        contentContainerStyle={plants.length === 0 ? styles.emptyList : styles.list}
        ListEmptyComponent={<EmptyState />}
        onRefresh={handleRefresh}
        refreshing={refreshing}
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
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginHorizontal: 16,
    marginBottom: 12,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#9E9E9E',
  },
  testButtonText: {
    color: colors.card,
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
    gap: 3,
  },
  commonName: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
  },
  scientificName: {
    fontSize: 13,
    fontStyle: 'italic',
    color: colors.textLight,
  },
  infoText: {
    fontSize: 13,
    color: colors.textLight,
  },
  date: {
    fontSize: 11,
    color: colors.tabInactive,
    marginTop: 2,
  },
  deleteButton: {
    padding: 8,
    alignSelf: 'flex-start',
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
