import * as FileSystem from 'expo-file-system/legacy';

const API_KEY = 'fMF3n4JMbrgUriJCoPvOtYwt9aOTUXdmK27BHWcfpcIKjX8U9t';
const API_URL = 'https://plant.id/api/v3/identification';

export async function identifyPlant(imageUri) {
  console.log('[plantApi] imageUri:', imageUri);

  let base64;
  try {
    base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: 'base64',
    });
    console.log('[plantApi] base64 uzunluğu:', base64?.length);
  } catch (e) {
    console.error('[plantApi] base64 hatası:', e);
    throw new Error('Fotoğraf okunamadı.');
  }

  let response;
  try {
    response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': API_KEY,
      },
      body: JSON.stringify({
        images: [base64],
        classification_level: 'species',
      }),
    });
  } catch (e) {
    console.error('[plantApi] fetch hatası:', e);
    throw new Error('Sunucuya bağlanılamadı. İnternet bağlantınızı kontrol edin.');
  }

  console.log('[plantApi] response status:', response.status);
  const data = await response.json();
  console.log('[plantApi] response body:', JSON.stringify(data, null, 2));

  if (!response.ok) {
    throw new Error(`API hatası: ${response.status}`);
  }

  const suggestion = data?.result?.classification?.suggestions?.[0];
  if (!suggestion) {
    throw new Error('Bitki tanımlanamadı. Lütfen daha net bir fotoğraf deneyin.');
  }

  const name = suggestion.name ?? 'Bilinmiyor';
  const commonNames = suggestion.common_names ?? [];
  const description = suggestion.details?.description?.value ?? 'Açıklama bulunamadı.';

  return {
    name,
    commonName: commonNames[0] ?? name,
    description,
    waterFrequency: 'Haftada 1-2 kez',
    sunlight: 'Parlak dolaylı ışık',
  };
}
