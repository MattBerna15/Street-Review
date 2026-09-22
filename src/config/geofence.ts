/**
 * Configurazione Geofencing per il lancio locale "Riviera delle Palme"
 * Comprende: San Benedetto del Tronto, Porto d'Ascoli, Grottammare,
 * Monteprandone (incluso Centobuchi) e Acquaviva Picena.
 */

export interface BoundingBox {
  south: number;
  west: number;
  north: number;
  east: number;
}

export const GEOFENCE_CONFIG = {
  regionName: 'Riviera delle Palme & Dintorni',
  // Centro mappa: Rotonda Giorgini / Viale Secondo Moretti, San Benedetto del Tronto
  center: {
    lat: 42.9436,
    lng: 13.8829,
  },
  defaultZoom: 14,
  minZoom: 12, // Evita zoom out eccessivo a livello nazionale
  maxZoom: 19,

  // Bounding Box rettangolare rigido per restrizione mappa (Google Maps / Leaflet)
  boundingBox: {
    south: 42.8850, // Fiume Tronto / confine sud di Porto d'Ascoli e Centobuchi
    west: 13.7800,  // Ovest di Acquaviva Picena e Monteprandone centro
    north: 43.0100, // Confine nord di Grottammare
    east: 13.9250,  // Fascia costiera adriatica
  } as BoundingBox,

  // Raggio massimo in Km dal centro di San Benedetto del Tronto (11 Km copre tutti i comuni target)
  maxRadiusKm: 11.5,

  // Comuni autorizzati per verifica testuale / Place ID
  allowedMunicipalities: [
    'san benedetto del tronto',
    'porto d\'ascoli',
    'grottammare',
    'monteprandone',
    'centobuchi',
    'acquaviva picena',
  ],

  // Configurazione per Google Maps JavaScript API (prop: restriction)
  googleMapsRestriction: {
    latLngBounds: {
      south: 42.8850,
      west: 13.7800,
      north: 43.0100,
      east: 13.9250,
    },
    strictBounds: true, // Impedisce all'utente di trascinare fuori dal box
  },
};
