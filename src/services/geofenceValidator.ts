import { GEOFENCE_CONFIG } from '../config/geofence';

/**
 * Calcola la distanza in chilometri tra due coordinate GPS con la formula dell'Agosina (Haversine)
 */
export const calculateHaversineDistanceKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Raggio della Terra in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Verifica se una coordinata si trova all'interno della Bounding Box definita
 */
export const isInsideBoundingBox = (lat: number, lng: number): boolean => {
  const { south, west, north, east } = GEOFENCE_CONFIG.boundingBox;
  return lat >= south && lat <= north && lng >= west && lng <= east;
};

/**
 * Verifica completa di Geofencing:
 * 1. Bounding Box check (O(1))
 * 2. Raggio di distanza dal centro di San Benedetto del Tronto
 */
export const isCoordinateInsideGeofence = (lat: number, lng: number): boolean => {
  if (!isInsideBoundingBox(lat, lng)) {
    return false;
  }

  const distanceKm = calculateHaversineDistanceKm(
    GEOFENCE_CONFIG.center.lat,
    GEOFENCE_CONFIG.center.lng,
    lat,
    lng
  );

  return distanceKm <= GEOFENCE_CONFIG.maxRadiusKm;
};

/**
 * Verifica se il comune indicato rientra tra quelli ammessi al lancio locale
 */
export const isMunicipalityAllowed = (cityName: string): boolean => {
  const normalized = cityName.trim().toLowerCase();
  return GEOFENCE_CONFIG.allowedMunicipalities.some((m) =>
    normalized.includes(m) || m.includes(normalized)
  );
};

export class OutOfServiceAreaError extends Error {
  code = 'OUT_OF_SERVICE_AREA';
  status = 403;
  constructor(message?: string) {
    super(
      message ||
        'Recensione non consentita: la posizione selezionata si trova al di fuori dell\'area pilota (Riviera delle Palme).'
    );
  }
}

/**
 * Regola di validazione Backend (utilizzabile in middleware Express / NestJS Guard / Server Action)
 * Blocca l'elaborazione se la recensione o la strada non è nell'area pilota.
 */
export const validateGeofenceForReview = (streetData: {
  latitude: number;
  longitude: number;
  city?: string;
}) => {
  const isGeoValid = isCoordinateInsideGeofence(
    streetData.latitude,
    streetData.longitude
  );

  const isCityValid = streetData.city
    ? isMunicipalityAllowed(streetData.city)
    : true;

  if (!isGeoValid || !isCityValid) {
    throw new OutOfServiceAreaError();
  }

  return true;
};
