import { Review, ReviewCategoryRatings, Street } from '../types';

export const CATEGORY_KEYS: (keyof ReviewCategoryRatings)[] = [
  'roadSurface',
  'groundSignage',
  'verticalSignage',
  'parkingQuantity',
  'sidewalkQuality',
  'lighting',
  'cleanliness',
  'accessibility',
  'rainDrainage',
  'greeneryShade',
  'quietness',
  'intersectionVisibility',
  'laneWidth',
];

/**
 * Arrotonda un numero a N cifre decimali (default 2)
 */
export const roundToDecimals = (num: number, decimals: number = 2): number => {
  const factor = Math.pow(10, decimals);
  return Math.round((num + Number.EPSILON) * factor) / factor;
};

/**
 * Calcola il punteggio complessivo (Overall Rating) di una singola recensione
 * facendo la media aritmetica delle categorie obbligatorie.
 */
export const calculateSingleReviewOverallScore = (
  ratings: ReviewCategoryRatings
): number => {
  const sum = CATEGORY_KEYS.reduce((acc, key) => acc + (ratings[key] || 0), 0);
  return roundToDecimals(sum / CATEGORY_KEYS.length, 2);
};

/**
 * Calcola le medie per ogni singola categoria e il Global Score aggregato
 * a partire da un array di recensioni associate a una strada.
 */
export const calculateStreetAggregates = (
  reviews: Pick<Review, 'ratings'>[]
): {
  categoryAverages: ReviewCategoryRatings;
  globalScore: number;
  totalReviews: number;
} => {
  const totalReviews = reviews.length;

  // Inizializza con zero se non ci sono ancora recensioni
  if (totalReviews === 0) {
    const emptyCategories: ReviewCategoryRatings = {
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
    };

    return {
      categoryAverages: emptyCategories,
      globalScore: 0,
      totalReviews: 0,
    };
  }

  // Somma i punteggi di ciascuna categoria
  const categorySums: Record<keyof ReviewCategoryRatings, number> = {
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
  };

  for (const review of reviews) {
    for (const key of CATEGORY_KEYS) {
      categorySums[key] += review.ratings[key] || 0;
    }
  }

  // Calcola la media per ogni categoria
  const categoryAverages = {} as ReviewCategoryRatings;
  for (const key of CATEGORY_KEYS) {
    categoryAverages[key] = roundToDecimals(categorySums[key] / totalReviews, 1);
  }

  // Global Score: Media delle medie di tutte le categorie
  const sumOfAverages = CATEGORY_KEYS.reduce(
    (acc, key) => acc + categoryAverages[key],
    0
  );
  const globalScore = roundToDecimals(sumOfAverages / CATEGORY_KEYS.length, 2);

  return {
    categoryAverages,
    globalScore,
    totalReviews,
  };
};

/**
 * Aggiornamento incrementale O(1) in tempo reale:
 * Calcola le nuove medie quando viene aggiunta una nuova recensione,
 * evitando di ricalcolare l'intera cronologia dal database.
 */
export const recalculateIncrementalAverages = (
  currentStreet: Pick<Street, 'categoryAverages' | 'reviewsCount'>,
  newReviewRatings: ReviewCategoryRatings
): {
  newCategoryAverages: ReviewCategoryRatings;
  newGlobalScore: number;
  newReviewsCount: number;
} => {
  const currentCount = currentStreet.reviewsCount;
  const newReviewsCount = currentCount + 1;

  const newCategoryAverages = {} as ReviewCategoryRatings;

  for (const key of CATEGORY_KEYS) {
    const currentCategoryAverage = currentStreet.categoryAverages[key] || 0;
    // Formula incrementale: (MediaVecchia * N + NuovoValore) / (N + 1)
    const newCategoryAvg =
      (currentCategoryAverage * currentCount + newReviewRatings[key]) /
      newReviewsCount;
    newCategoryAverages[key] = roundToDecimals(newCategoryAvg, 2);
  }

  const sumOfAverages = CATEGORY_KEYS.reduce(
    (acc, key) => acc + newCategoryAverages[key],
    0
  );
  const newGlobalScore = roundToDecimals(sumOfAverages / CATEGORY_KEYS.length, 2);

  return {
    newCategoryAverages,
    newGlobalScore,
    newReviewsCount,
  };
};
