import { create } from 'zustand';
import { Street, Review, ReviewCategoryRatings, ParkingType, AuthUser, StreetAmenity } from '../types';
import { calculateStreetAggregates } from '../services/ratingCalculator';

export type BottomSheetSnap = 'hidden' | 'peek' | 'half' | 'full';

interface StreetUIState {
  // Autenticazione Utente (Google OAuth 2.0)
  currentUser: AuthUser | null;
  isAuthModalOpen: boolean;
  loginWithGoogle: (user: AuthUser) => void;
  logout: () => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;

  // Mappa & Ricerca
  mapCenter: [number, number];
  zoom: number;
  searchQuery: string;
  setMapCenter: (center: [number, number], zoom?: number) => void;
  setSearchQuery: (query: string) => void;

  // Collezione delle strade sul territorio (Inizia VUOTA per crescita organica)
  streets: Street[];
  addOrSelectStreet: (params: {
    name: string;
    city: string;
    postalCode?: string;
    latitude: number;
    longitude: number;
  }) => Street;

  // Aggiunta / Modifica Recensione & Ricalcolo Dinamico
  addReviewToStreet: (
    streetId: string,
    reviewData: {
      userId: string;
      userName: string;
      avatarUrl?: string;
      ratings: ReviewCategoryRatings;
      overallRating: number;
      comment?: string;
      parkingTypes: ParkingType[];
      hasCyclePath: boolean;
      amenities?: StreetAmenity[];
    }
  ) => void;

  // Filtri attivi
  activeFilters: import('../services/streetFilterService').StreetFilterCriteria;
  setFilter: (key: keyof import('../services/streetFilterService').StreetFilterCriteria, value: any) => void;
  resetFilters: () => void;

  // Selezione Strada & Bottom Sheet
  selectedStreet: Street | null;
  sheetSnap: BottomSheetSnap;
  selectStreet: (street: Street | null) => void;
  setSheetSnap: (snap: BottomSheetSnap) => void;

  // Modale 'Lascia / Modifica una Recensione'
  isReviewModalOpen: boolean;
  targetStreetForReview: Street | null;
  editingReview: Review | null;
  openReviewModal: (street: Street, reviewToEdit?: Review) => void;
  closeReviewModal: () => void;

  // Modale 'Fuori Zona'
  isOutOfAreaModalOpen: boolean;
  openOutOfAreaModal: () => void;
  closeOutOfAreaModal: () => void;
}

export const useStreetStore = create<StreetUIState>((set, get) => ({
  // Stato iniziale: Modalità Ospite (Nessun login richiesto per navigazione e lettura)
  currentUser: null,
  isAuthModalOpen: false,

  loginWithGoogle: (user) => {
    const { targetStreetForReview } = get();
    set({
      currentUser: user,
      isAuthModalOpen: false,
      // Se l'utente stava cliccando per recensire, apri subito il form
      isReviewModalOpen: targetStreetForReview !== null,
    });
  },

  logout: () => set({ currentUser: null }),
  openAuthModal: () => set({ isAuthModalOpen: true }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),

  // Centrato su San Benedetto del Tronto (Riviera delle Palme)
  mapCenter: [42.9436, 13.8829],
  zoom: 14,
  searchQuery: '',
  setMapCenter: (center, zoom = 15) => set({ mapCenter: center, zoom }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  // Inizia con ZERO dati fittizi/mock
  streets: [],

  addOrSelectStreet: ({ name, city, postalCode = '63074', latitude, longitude }) => {
    const { streets } = get();

    // Controlla se la via esiste già nel catalogo locale
    const existing = streets.find(
      (s) =>
        s.name.toLowerCase() === name.toLowerCase() &&
        s.city.toLowerCase() === city.toLowerCase()
    );

    if (existing) {
      set({
        selectedStreet: existing,
        sheetSnap: 'half',
        mapCenter: [existing.latitude, existing.longitude],
      });
      return existing;
    }

    // Crea nuova strada senza recensioni (PIN Neutro/Nuovo)
    const newStreet: Street = {
      id: `street-${Date.now()}`,
      name,
      city,
      postalCode,
      latitude,
      longitude,
      avgOverallRating: 0,
      reviewsCount: 0,
      hasCyclePath: false,
      commonParkingTypes: [],
      amenities: [],
      categoryAverages: {
        roadSurface: 0,
        groundSignage: 0,
        verticalSignage: 0,
        parkingQuantity: 0,
        sidewalkQuality: 0,
        lighting: 0,
        cleanliness: 0,
        accessibility: 0,
        rainDrainage: 0,
        greeneryShade: 0,
        quietness: 0,
        intersectionVisibility: 0,
        laneWidth: 0,
      },
      reviews: [],
    };

    set((state) => ({
      streets: [newStreet, ...state.streets],
      selectedStreet: newStreet,
      sheetSnap: 'half',
      mapCenter: [latitude, longitude],
    }));

    return newStreet;
  },

  addReviewToStreet: (streetId, reviewData) => {
    const { streets, currentUser } = get();

    const updatedStreets = streets.map((s) => {
      if (s.id !== streetId) return s;

      // Verifica se l'utente ha già una recensione per questa via (Vincolo Unicità)
      const existingIndex = s.reviews
        ? s.reviews.findIndex(
            (r) =>
              r.userId === reviewData.userId ||
              r.user?.id === reviewData.userId ||
              (currentUser && r.user?.name === currentUser.name)
          )
        : -1;

      let updatedReviews: Review[];

      if (existingIndex !== -1) {
        // AGGIORNAMENTO IN-PLACE (Modifica della recensione esistente, nessun duplicato)
        const oldRev = s.reviews[existingIndex];
        const editedRev: Review = {
          ...oldRev,
          ratings: reviewData.ratings,
          overallRating: reviewData.overallRating,
          comment: reviewData.comment,
          parkingTypes: reviewData.parkingTypes,
          hasCyclePath: reviewData.hasCyclePath,
          amenities: reviewData.amenities || [],
          createdAt: new Date().toISOString(),
        };
        updatedReviews = [...s.reviews];
        updatedReviews[existingIndex] = editedRev;
      } else {
        // NUOVA RECENSIONE
        const newReview: Review = {
          id: `rev-${Date.now()}`,
          userId: reviewData.userId,
          user: {
            id: reviewData.userId,
            name: reviewData.userName,
            avatarUrl: reviewData.avatarUrl,
          },
          streetId,
          comment: reviewData.comment,
          ratings: reviewData.ratings,
          overallRating: reviewData.overallRating,
          parkingTypes: reviewData.parkingTypes,
          hasCyclePath: reviewData.hasCyclePath,
          amenities: reviewData.amenities || [],
          createdAt: new Date().toISOString(),
        };
        updatedReviews = [newReview, ...(s.reviews || [])];
      }

      // RICALCOLO COMPLETO DELLE MEDIE DI CATEGORIA E PUNTEGGIO GLOBALE
      const aggregates = calculateStreetAggregates(updatedReviews);
      const mergedParkingTypes = Array.from(
        new Set(updatedReviews.flatMap((r) => r.parkingTypes || []))
      );
      const hasCycle = updatedReviews.some((r) => r.hasCyclePath);
      const mergedAmenities = Array.from(
        new Set(updatedReviews.flatMap((r) => r.amenities || []))
      );

      return {
        ...s,
        reviewsCount: updatedReviews.length,
        avgOverallRating: aggregates.globalScore,
        categoryAverages: aggregates.categoryAverages,
        commonParkingTypes: mergedParkingTypes,
        hasCyclePath: hasCycle,
        amenities: mergedAmenities,
        reviews: updatedReviews,
      };
    });

    const updatedCurrentStreet = updatedStreets.find((s) => s.id === streetId) || null;

    set({
      streets: updatedStreets,
      selectedStreet: updatedCurrentStreet,
      editingReview: null,
      isReviewModalOpen: false,
    });
  },

  activeFilters: {},
  setFilter: (key, value) =>
    set((state) => ({
      activeFilters: { ...state.activeFilters, [key]: value },
    })),
  resetFilters: () => set({ activeFilters: {} }),

  selectedStreet: null,
  sheetSnap: 'hidden',
  selectStreet: (street) =>
    set({
      selectedStreet: street,
      sheetSnap: street ? 'half' : 'hidden',
      mapCenter: street ? [street.latitude, street.longitude] : undefined,
    }),
  setSheetSnap: (snap) => set({ sheetSnap: snap }),

  // Controllo permessi: se non loggato, blocca e mostra AuthModal
  isReviewModalOpen: false,
  targetStreetForReview: null,
  editingReview: null,
  openReviewModal: (street, reviewToEdit) => {
    const { currentUser } = get();
    if (!currentUser) {
      set({ isAuthModalOpen: true, targetStreetForReview: street });
    } else {
      // Se non passato esplicitamente, cerca se l'utente ha già una recensione attiva per questa via
      const existing =
        reviewToEdit ||
        street.reviews?.find(
          (r) =>
            r.userId === currentUser.id ||
            r.user?.id === currentUser.id ||
            r.user?.name === currentUser.name
        ) ||
        null;

      set({
        isReviewModalOpen: true,
        targetStreetForReview: street,
        editingReview: existing,
      });
    }
  },
  closeReviewModal: () =>
    set({ isReviewModalOpen: false, targetStreetForReview: null, editingReview: null }),

  isOutOfAreaModalOpen: false,
  openOutOfAreaModal: () => set({ isOutOfAreaModalOpen: true }),
  closeOutOfAreaModal: () => set({ isOutOfAreaModalOpen: false }),
}));
