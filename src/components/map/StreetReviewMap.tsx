import React from 'react';
import { MapPin, Navigation, Plus, Minus, Layers } from 'lucide-react';
import { useStreetStore } from '../../store/useStreetStore';
import { filterStreets } from '../../services/streetFilterService';
import { Street } from '../../types';

// Dati mock per l'area pilota "Riviera delle Palme" con segmentazione strade
export const MOCK_STREETS: Street[] = [
  {
    id: 'sbt-lungomare',
    name: 'Lungomare San Benedetto del Tronto',
    city: 'San Benedetto del Tronto',
    postalCode: '63074',
    latitude: 42.9380,
    longitude: 13.8890,
    avgOverallRating: 4.4,
    reviewsCount: 78,
    hasCyclePath: true,
    commonParkingTypes: ['PAID'],
    categoryAverages: {
      roadSurface: 4.4, groundSignage: 4.6, verticalSignage: 4.5,
      parkingQuantity: 2.8, sidewalkQuality: 4.9, lighting: 4.7,
      cleanliness: 4.8, accessibility: 4.8,
    },
    // Segmentazione per una strada lunga oltre 4 Km:
    segments: [
      {
        id: 'seg-lm-nord',
        streetId: 'sbt-lungomare',
        segmentName: 'Lungomare Nord (Giardino Tematico)',
        civicRange: 'Concessioni 1 - 35',
        latitude: 42.9490,
        longitude: 13.8870,
        avgOverallRating: 4.7,
        reviewsCount: 32,
        hasCyclePath: true,
        commonParkingTypes: ['PAID'],
        categoryAverages: {
          roadSurface: 4.8, groundSignage: 4.7, verticalSignage: 4.8,
          parkingQuantity: 3.0, sidewalkQuality: 5.0, lighting: 4.9,
          cleanliness: 4.9, accessibility: 4.9,
        }
      },
      {
        id: 'seg-lm-centro',
        streetId: 'sbt-lungomare',
        segmentName: 'Lungomare Centro (Pineta)',
        civicRange: 'Concessioni 36 - 80',
        latitude: 42.9360,
        longitude: 13.8910,
        avgOverallRating: 4.3,
        reviewsCount: 26,
        hasCyclePath: true,
        commonParkingTypes: ['PAID'],
        categoryAverages: {
          roadSurface: 4.2, groundSignage: 4.5, verticalSignage: 4.3,
          parkingQuantity: 2.5, sidewalkQuality: 4.7, lighting: 4.5,
          cleanliness: 4.6, accessibility: 4.6,
        }
      },
      {
        id: 'seg-lm-sud',
        streetId: 'sbt-lungomare',
        segmentName: 'Lungomare Sud (Rotonda Porto d\'Ascoli)',
        civicRange: 'Concessioni 81 - 118',
        latitude: 42.9210,
        longitude: 13.8960,
        avgOverallRating: 4.1,
        reviewsCount: 20,
        hasCyclePath: true,
        commonParkingTypes: ['PAID', 'FREE'],
        categoryAverages: {
          roadSurface: 4.0, groundSignage: 4.3, verticalSignage: 4.2,
          parkingQuantity: 3.2, sidewalkQuality: 4.8, lighting: 4.6,
          cleanliness: 4.5, accessibility: 4.7,
        }
      }
    ],
    reviews: [
      {
        id: 'r-lm1',
        userId: 'u1',
        user: { id: 'u1', name: 'Laura V.' },
        streetId: 'sbt-lungomare',
        comment: 'Passeggiata meravigliosa con giardini tematici curatissimi e pista ciclabile separata dai pedoni.',
        ratings: { roadSurface: 5, groundSignage: 5, verticalSignage: 4, parkingQuantity: 3, sidewalkQuality: 5, lighting: 5, cleanliness: 5, accessibility: 5 },
        overallRating: 4.62,
        parkingTypes: ['PAID'],
        hasCyclePath: true,
        createdAt: '2026-09-18T18:30:00Z',
      },
    ],
  },
  {
    id: 'sbt-moretti',
    name: 'Viale Secondo Moretti',
    city: 'San Benedetto del Tronto',
    postalCode: '63074',
    latitude: 42.9460,
    longitude: 13.8812,
    avgOverallRating: 4.6,
    reviewsCount: 42,
    hasCyclePath: true,
    commonParkingTypes: ['FREE', 'PAID'],
    categoryAverages: {
      roadSurface: 4.8, groundSignage: 4.5, verticalSignage: 4.6,
      parkingQuantity: 3.2, sidewalkQuality: 4.9, lighting: 4.8,
      cleanliness: 4.7, accessibility: 4.8,
    },
    reviews: [
      {
        id: 'r-sbt1',
        userId: 'u1',
        user: { id: 'u1', name: 'Andrea M.' },
        streetId: 'sbt-moretti',
        comment: 'Zona pedonale curatissima, pavimentazione eccellente e ottima illuminazione serale.',
        ratings: { roadSurface: 5, groundSignage: 4, verticalSignage: 5, parkingQuantity: 3, sidewalkQuality: 5, lighting: 5, cleanliness: 5, accessibility: 5 },
        overallRating: 4.62,
        parkingTypes: ['PAID'],
        hasCyclePath: true,
        createdAt: '2026-09-18T18:30:00Z',
      },
    ],
  },
  {
    id: 'grott-1',
    name: 'Lungomare Alcide De Gasperi',
    city: 'Grottammare',
    postalCode: '63066',
    latitude: 42.9850,
    longitude: 13.8720,
    avgOverallRating: 4.3,
    reviewsCount: 29,
    hasCyclePath: true,
    commonParkingTypes: ['PAID'],
    categoryAverages: {
      roadSurface: 4.2, groundSignage: 4.4, verticalSignage: 4.3,
      parkingQuantity: 3.0, sidewalkQuality: 4.5, lighting: 4.4,
      cleanliness: 4.6, accessibility: 4.5,
    },
    reviews: [
      {
        id: 'r-grott1',
        userId: 'u2',
        user: { id: 'u2', name: 'Giulia B.' },
        streetId: 'grott-1',
        comment: 'Pista ciclabile spettacolare che collega fino a Cupra e San Benedetto. Posti auto estivi ridotti.',
        ratings: { roadSurface: 4, groundSignage: 5, verticalSignage: 4, parkingQuantity: 3, sidewalkQuality: 5, lighting: 4, cleanliness: 5, accessibility: 4 },
        overallRating: 4.25,
        parkingTypes: ['PAID'],
        hasCyclePath: true,
        createdAt: '2026-09-19T11:10:00Z',
      },
    ],
  },
  {
    id: 'cento-1',
    name: 'Via Salaria',
    city: 'Monteprandone (Centobuchi)',
    postalCode: '63076',
    latitude: 42.9160,
    longitude: 13.8640,
    avgOverallRating: 3.1,
    reviewsCount: 31,
    hasCyclePath: false,
    commonParkingTypes: ['FREE', 'PARKING_DISC'],
    categoryAverages: {
      roadSurface: 3.0, groundSignage: 3.2, verticalSignage: 3.5,
      parkingQuantity: 3.8, sidewalkQuality: 2.7, lighting: 3.2,
      cleanliness: 3.1, accessibility: 2.8,
    },
    reviews: [
      {
        id: 'r-cento1',
        userId: 'u3',
        user: { id: 'u3', name: 'Matteo P.' },
        streetId: 'cento-1',
        comment: 'Molto trafficata durante le ore di punta. I marciapiedi avrebbero bisogno di rifacimento in alcuni tratti.',
        ratings: { roadSurface: 3, groundSignage: 3, verticalSignage: 4, parkingQuantity: 4, sidewalkQuality: 2, lighting: 3, cleanliness: 3, accessibility: 3 },
        overallRating: 3.12,
        parkingTypes: ['FREE'],
        hasCyclePath: false,
        createdAt: '2026-09-20T16:45:00Z',
      },
    ],
  },
  {
    id: 'pda-1',
    name: 'Via Mare (Porto d\'Ascoli)',
    city: 'San Benedetto del Tronto',
    postalCode: '63074',
    latitude: 42.9120,
    longitude: 13.8880,
    avgOverallRating: 2.6,
    reviewsCount: 22,
    hasCyclePath: false,
    commonParkingTypes: ['FREE'],
    categoryAverages: {
      roadSurface: 2.4, groundSignage: 2.5, verticalSignage: 2.8,
      parkingQuantity: 3.5, sidewalkQuality: 2.5, lighting: 2.7,
      cleanliness: 2.3, accessibility: 2.5,
    },
    reviews: [
      {
        id: 'r-pda1',
        userId: 'u4',
        user: { id: 'u4', name: 'Luca F.' },
        streetId: 'pda-1',
        comment: 'Asfalto con rattoppi e tombini sconnessi. Poca illuminazione nei pressi della ferrovia.',
        ratings: { roadSurface: 2, groundSignage: 2, verticalSignage: 3, parkingQuantity: 4, sidewalkQuality: 2, lighting: 2, cleanliness: 2, accessibility: 2 },
        overallRating: 2.38,
        parkingTypes: ['FREE'],
        hasCyclePath: false,
        createdAt: '2026-09-21T08:15:00Z',
      },
    ],
  },
];

export const StreetReviewMap: React.FC = () => {
  const { selectedStreet, selectStreet, activeFilters, streets } = useStreetStore();

  // Applica i filtri dinamici all'elenco delle strade visibili sulla mappa (provenienti da store)
  const visibleStreets = React.useMemo(() => {
    return filterStreets(streets, activeFilters);
  }, [streets, activeFilters]);

  const getPinColor = (street: Street) => {
    if (street.reviewsCount === 0) {
      return 'bg-slate-700 text-white shadow-slate-700/30 border-slate-600';
    }
    const rating = street.avgOverallRating;
    if (rating >= 4.0) return 'bg-emerald-500 text-white shadow-emerald-500/40 border-emerald-600';
    if (rating >= 2.8) return 'bg-amber-500 text-white shadow-amber-500/40 border-amber-600';
    return 'bg-rose-500 text-white shadow-rose-500/40 border-rose-600';
  };

  return (
    <div className="relative w-full h-full min-h-screen bg-slate-100 overflow-hidden select-none">
      {/* Visualizzazione Cartografica: Griglia realistica stile Google Maps con vettori stradali */}
      <div className="absolute inset-0 bg-[#e8ecef]">
        {/* Linee di strade stilizzate in SVG per sfondo realistico interattivo */}
        <svg className="w-full h-full opacity-60 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#d5dbe1" strokeWidth="2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          {/* Strade principali */}
          <path d="M -50 250 L 900 350" stroke="#ffffff" strokeWidth="18" fill="none" />
          <path d="M -50 250 L 900 350" stroke="#f4d06f" strokeWidth="12" fill="none" />
          <path d="M 300 -50 L 420 800" stroke="#ffffff" strokeWidth="16" fill="none" />
          <path d="M 300 -50 L 420 800" stroke="#cbd5e1" strokeWidth="10" fill="none" />
          <path d="M 120 700 Q 400 300 800 150" stroke="#ffffff" strokeWidth="14" fill="none" />
          <path d="M 120 700 Q 400 300 800 150" stroke="#cbd5e1" strokeWidth="8" fill="none" />
        </svg>

        {/* Pin Colorati interattivi delle strade (filtrati) */}
        <div className="absolute inset-0">
          {visibleStreets.map((street, idx) => {
            const isSelected = selectedStreet?.id === street.id;
            // Posizioni simulate a schermo per la demo visiva
            const positions = [
              { top: '38%', left: '42%' },
              { top: '24%', left: '68%' },
              { top: '56%', left: '32%' },
            ];
            const pos = positions[idx % positions.length];

            return (
              <div
                key={street.id}
                style={{ top: pos.top, left: pos.left }}
                onClick={() => selectStreet(street)}
                className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 group z-20 ${
                  isSelected ? 'scale-125 z-30' : 'hover:scale-115'
                }`}
              >
                {/* Badge Pin */}
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-lg border-2 font-bold text-xs transition-all ${getPinColor(
                    street
                  )} ${isSelected ? 'ring-4 ring-blue-500/40 ring-offset-2' : ''}`}
                >
                  <MapPin size={13} className="fill-current" />
                  <span>{street.reviewsCount === 0 ? 'Nuova' : street.avgOverallRating.toFixed(1)}</span>
                </div>

                {/* Nome Via sotto il Pin */}
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded-md shadow-sm border border-slate-200 whitespace-nowrap text-[11px] font-semibold text-slate-700 pointer-events-none">
                  {street.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pulsanti Controlli Flottanti (Zoom / Layer stile Google Maps) */}
      <div className="absolute right-4 bottom-24 sm:bottom-8 z-30 flex flex-col gap-2 pointer-events-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden flex flex-col divide-y divide-slate-100">
          <button
            type="button"
            title="Ingrandisci"
            className="p-3 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
          >
            <Plus size={18} />
          </button>
          <button
            type="button"
            title="Rimpicciolisci"
            className="p-3 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
          >
            <Minus size={18} />
          </button>
        </div>

        <button
          type="button"
          title="Cambia Livello Mappa"
          className="p-3 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-2xl shadow-lg border border-slate-100 transition-colors"
        >
          <Layers size={18} />
        </button>
      </div>

      {/* Legenda rapida punteggi in basso a sinistra */}
      <div className="absolute left-4 bottom-8 z-20 hidden md:flex items-center gap-3 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-100 shadow-md text-xs">
        <span className="font-semibold text-slate-600">Feedback:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-slate-600">≥ 4.0 Buona</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="text-slate-600">2.8 - 3.9 Discreta</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-rose-500" />
          <span className="text-slate-600">&lt; 2.8 Critica</span>
        </div>
      </div>
    </div>
  );
};
