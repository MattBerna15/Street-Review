export interface GeocodedAddress {
  placeId: string;            // ID univoco del provider (es. Mapbox ID o Google Place ID)
  canonicalName: string;      // Nome normalizzato della via (es. "Via Roma")
  city: string;               // Città normalizzata (es. "Milano")
  postalCode: string;         // CAP (es. "20121")
  country: string;            // Paese (es. "Italia")
  latitude: number;
  longitude: number;
  boundingBox?: [number, number, number, number]; // [minLng, minLat, maxLng, maxLat]
}

/**
 * Normalizza il nome di una via per prevenire duplicati causati da differenze
 * di formattazione (es. "via roma 12", "C.so Buenos Aires", "V.le Monza").
 */
export const normalizeStreetName = (rawName: string): string => {
  return rawName
    .trim()
    .toLowerCase()
    // Rimuove numeri civici (le recensioni sono per l'intera via)
    .replace(/,\s*\d+[\w\s\/-]*$/i, '')
    .replace(/\s+\d+[\w\s\/-]*$/i, '')
    // Normalizza abbreviazioni frequenti in italiano
    .replace(/^c\.?so\s+/i, 'corso ')
    .replace(/^v\.?le\s+/i, 'viale ')
    .replace(/^p\.?zza\s+/i, 'piazza ')
    .replace(/^l\.?go\s+/i, 'largo ')
    .replace(/^v\.?\s+/i, 'via ')
    // Rimuove caratteri speciali e doppi spazi
    .replace(/[^\w\sàèéìòù]/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Genera una chiave canonica univoca per il database per verificare
 * l'esistenza della strada prima dell'inserimento.
 */
export const generateCanonicalStreetKey = (
  streetName: string,
  city: string,
  postalCode?: string
): string => {
  const normStreet = normalizeStreetName(streetName);
  const normCity = city.trim().toLowerCase();
  const normCap = (postalCode || '00000').trim();
  return `${normCity}:${normStreet}:${normCap}`;
};

/**
 * Client di integrazione Geocoding (con supporto Mapbox / Nominatim / Google Maps)
 */
export class GeocodingService {
  private mapboxToken?: string;

  constructor(mapboxToken?: string) {
    this.mapboxToken = mapboxToken || process.env.VITE_MAPBOX_ACCESS_TOKEN;
  }

  /**
   * Geocoding tramite Mapbox Geocoding API v5
   */
  async geocodeWithMapbox(query: string): Promise<GeocodedAddress[]> {
    if (!this.mapboxToken) {
      console.warn('Mapbox Token non configurato, fallback su OpenStreetMap Nominatim');
      return this.geocodeWithNominatim(query);
    }

    const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      query
    )}.json?types=address,street&country=it&language=it&access_token=${this.mapboxToken}`;

    const res = await fetch(endpoint);
    if (!res.ok) throw new Error(`Mapbox API error: ${res.statusText}`);
    const data = await res.json();

    return (data.features || []).map((feat: any): GeocodedAddress => {
      const cityContext = feat.context?.find((c: any) => c.id.startsWith('place'));
      const postcodeContext = feat.context?.find((c: any) => c.id.startsWith('postcode'));

      return {
        placeId: feat.id,
        canonicalName: feat.text,
        city: cityContext?.text || 'Sconosciuta',
        postalCode: postcodeContext?.text || '00000',
        country: 'Italia',
        latitude: feat.center[1],
        longitude: feat.center[0],
        boundingBox: feat.bbox,
      };
    });
  }

  /**
   * Geocoding gratuito OpenStreetMap / Nominatim (ideale per sviluppo o open-source)
   */
  async geocodeWithNominatim(query: string): Promise<GeocodedAddress[]> {
    const endpoint = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      query
    )}&format=json&addressdetails=1&countrycodes=it&limit=5`;

    const res = await fetch(endpoint, {
      headers: {
        'User-Agent': 'StreetReviewApp/1.0',
      },
    });

    if (!res.ok) throw new Error(`Nominatim API error: ${res.statusText}`);
    const data = await res.json();

    return data.map((item: any): GeocodedAddress => {
      const addr = item.address || {};
      const roadName = addr.road || addr.pedestrian || addr.street || item.display_name.split(',')[0];
      const city = addr.city || addr.town || addr.village || addr.municipality || 'Sconosciuta';

      return {
        placeId: `osm-${item.osm_id}`,
        canonicalName: roadName,
        city,
        postalCode: addr.postcode || '00000',
        country: addr.country || 'Italia',
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon),
      };
    });
  }
}
