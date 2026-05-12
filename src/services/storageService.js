import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@my_plants';

export async function savePlant(plantData) {
  try {
    const existing = await getPlants();
    const newRecord = {
      id: Date.now(),
      name: plantData.name,
      commonName: plantData.commonName,
      waterFrequency: plantData.waterFrequency,
      sunlight: plantData.sunlight,
      description: plantData.description,
      imageBase64: plantData.imageBase64 ?? null,
      savedAt: new Date().toISOString(),
    };
    const updated = [newRecord, ...existing];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch (e) {
    console.error('[storageService] savePlant hatası:', e);
    return false;
  }
}

export async function getPlants() {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.error('[storageService] getPlants hatası:', e);
    return [];
  }
}

export async function deletePlant(id) {
  try {
    const existing = await getPlants();
    const updated = existing.filter((p) => p.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch (e) {
    console.error('[storageService] deletePlant hatası:', e);
    return false;
  }
}

export async function clearAllPlants() {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (e) {
    console.error('[storageService] clearAllPlants hatası:', e);
    return false;
  }
}
