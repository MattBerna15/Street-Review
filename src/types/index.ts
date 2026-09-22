export type ParkingType = 'FREE' | 'PAID' | 'PARKING_DISC' | 'DISABLED' | 'PINK' | 'LOADING_UNLOADING';

export type StreetAmenity =
  | 'EV_CHARGING'        // Colonnine Ricarica Elettrica (EV)
  | 'BIKE_RACKS'          // Rastrelliere per Bici / Micromobilità
  | 'SPEED_BUMPS'         // Dossi / Dissuasori di Velocità
  | 'COBBLESTONE'         // Pavimentazione Speciale (Sanpietrini / Ciottolato)
  | 'DRINKING_FOUNTAIN'   // Fontanella Pubblica
  | 'BENCHES'             // Panchine
  | 'TRASH_BINS';         // Cestini Spazzatura

export interface UserSummary {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface ReviewCategoryRatings {
  roadSurface: number;            // Manto stradale (1-5)
  groundSignage: number;          // Segnaletica a terra (1-5)
  verticalSignage: number;        // Segnaletica verticale (1-5)
  parkingQuantity: number;        // Quantità di parcheggi (1-5)
  sidewalkQuality: number;        // Qualità dei marciapiedi (1-5)
  lighting: number;               // Illuminazione (1-5)
  cleanliness: number;            // Pulizia (1-5)
  accessibility: number;          // Accessibilità (1-5)
  rainDrainage: number;           // Drenaggio Piovano (1-5)
  greeneryShade: number;          // Ombreggiatura e Verde (1-5)
  quietness: number;              // Tranquillità e Silenziosità (1-5)
  intersectionVisibility: number; // Visibilità Incroci (1-5)
  laneWidth: number;              // Larghezza Carreggiata (1-5)
}

export interface Review {
  id: string;
  userId: string;
  user: UserSummary;
  streetId: string;
  comment?: string;
  ratings: ReviewCategoryRatings;
  overallRating: number;
  parkingTypes: ParkingType[];
  hasCyclePath: boolean;
  amenities?: StreetAmenity[];
  createdAt: string;
}

export interface StreetSegment {
  id: string;
  streetId: string;
  segmentName: string;       // es. "Lungomare Sud - Rotonda Porto d'Ascoli"
  civicRange?: string;       // es. "Civici 1-45 / Concessioni 1-25"
  latitude: number;
  longitude: number;
  geohash?: string;
  avgOverallRating: number;
  reviewsCount: number;
  categoryAverages: ReviewCategoryRatings;
  commonParkingTypes: ParkingType[];
  hasCyclePath: boolean;
  amenities?: StreetAmenity[];
}

export interface Street {
  id: string;
  name: string;
  city: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  avgOverallRating: number;
  reviewsCount: number;
  // Medie aggregate per singola categoria
  categoryAverages: ReviewCategoryRatings;
  // Tag prevalenti rilevati dalla community
  commonParkingTypes: ParkingType[];
  hasCyclePath: boolean;
  amenities?: StreetAmenity[];
  segments?: StreetSegment[];
  reviews?: Review[];
}

export interface CreateReviewInput {
  streetId: string;
  comment?: string;
  ratings: ReviewCategoryRatings;
  parkingTypes: ParkingType[];
  hasCyclePath: boolean;
  amenities?: StreetAmenity[];
}
