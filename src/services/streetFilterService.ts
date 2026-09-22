import { ParkingType, ReviewCategoryRatings, Street } from '../types';

export interface StreetFilterCriteria {
  city?: string;
  minOverallRating?: number;
  minCategoryRating?: Partial<Record<keyof ReviewCategoryRatings, number>>;
  parkingTypes?: ParkingType[];
  hasCyclePath?: boolean;
  minReviewsCount?: number;
}

/**
 * Filtra un insieme di strade in memoria (lato client / viewport mappa).
 * 
 * Esempi di utilizzo:
 * - filterStreets(streets, { city: 'Milano', parkingTypes: ['FREE'] })
 * - filterStreets(streets, { minCategoryRating: { roadSurface: 3 } })
 */
export const filterStreets = (
  streets: Street[],
  criteria: StreetFilterCriteria
): Street[] => {
  return streets.filter((street) => {
    // 1. Filtro per Città (case-insensitive)
    if (criteria.city && criteria.city.trim() !== '') {
      if (street.city.toLowerCase() !== criteria.city.trim().toLowerCase()) {
        return false;
      }
    }

    // 2. Filtro per Punteggio Globale Minimo
    if (criteria.minOverallRating !== undefined) {
      if (street.avgOverallRating < criteria.minOverallRating) {
        return false;
      }
    }

    // 3. Filtro per Punteggio Minimo su Categorie Specifiche (es. manto stradale > 3)
    if (criteria.minCategoryRating) {
      for (const [categoryKey, minScore] of Object.entries(criteria.minCategoryRating)) {
        const catKey = categoryKey as keyof ReviewCategoryRatings;
        const currentScore = street.categoryAverages?.[catKey] ?? 0;
        if (minScore !== undefined && currentScore < minScore) {
          return false;
        }
      }
    }

    // 4. Filtro per Tipologia di Parcheggio (es. 'FREE', 'PAID', 'PARKING_DISC')
    if (criteria.parkingTypes && criteria.parkingTypes.length > 0) {
      const hasMatchingParking = criteria.parkingTypes.some((type) =>
        street.commonParkingTypes?.includes(type)
      );
      if (!hasMatchingParking) {
        return false;
      }
    }

    // 5. Filtro per Presenza Pista Ciclabile
    if (criteria.hasCyclePath !== undefined) {
      if (street.hasCyclePath !== criteria.hasCyclePath) {
        return false;
      }
    }

    // 6. Filtro per Numero Minimo di Recensioni (affidabilità statistica)
    if (criteria.minReviewsCount !== undefined) {
      if (street.reviewsCount < criteria.minReviewsCount) {
        return false;
      }
    }

    return true;
  });
};

/**
 * Genera l'oggetto clausola `WHERE` per Prisma ORM o query SQL su PostgreSQL
 * per applicare i filtri direttamente a livello di database.
 */
export const buildPrismaStreetFilterWhere = (criteria: StreetFilterCriteria) => {
  const where: any = {};

  if (criteria.city) {
    where.city = { equals: criteria.city, mode: 'insensitive' };
  }

  if (criteria.minOverallRating !== undefined) {
    where.avgOverallRating = { gte: criteria.minOverallRating };
  }

  if (criteria.minReviewsCount !== undefined) {
    where.reviewsCount = { gte: criteria.minReviewsCount };
  }

  // Filtro su tag parcheggio nell'array PostgreSQL
  if (criteria.parkingTypes && criteria.parkingTypes.length > 0) {
    where.reviews = {
      some: {
        parkingTypes: {
          hasSome: criteria.parkingTypes,
        },
      },
    };
  }

  // Filtro su categorie specifiche calcolate sulle recensioni
  if (criteria.minCategoryRating?.roadSurface) {
    where.reviews = {
      ...where.reviews,
      some: {
        ...where.reviews?.some,
        ratingRoadSurface: { gte: criteria.minCategoryRating.roadSurface },
      },
    };
  }

  return where;
};
