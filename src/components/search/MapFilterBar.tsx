import React from 'react';
import { Filter, Bike, Car, Star, X, Clock, Heart, Accessibility, Truck } from 'lucide-react';
import { useStreetStore } from '../../store/useStreetStore';
import { ParkingType } from '../../types';

export const MapFilterBar: React.FC = () => {
  const { activeFilters, setFilter, resetFilters } = useStreetStore();

  const isFreeParkingActive = activeFilters.parkingTypes?.includes('FREE');
  const isDisabledParkingActive = activeFilters.parkingTypes?.includes('DISABLED');
  const isPinkParkingActive = activeFilters.parkingTypes?.includes('PINK');
  const isParkingDiscActive = activeFilters.parkingTypes?.includes('PARKING_DISC');
  const isLoadingUnloadingActive = activeFilters.parkingTypes?.includes('LOADING_UNLOADING');
  const isBikePathActive = activeFilters.hasCyclePath === true;
  const isRoadSurfaceOver3 = activeFilters.minCategoryRating?.roadSurface === 3;
  const isTopRatedActive = activeFilters.minOverallRating === 4.0;

  const hasAnyFilterActive =
    isFreeParkingActive ||
    isDisabledParkingActive ||
    isPinkParkingActive ||
    isParkingDiscActive ||
    isLoadingUnloadingActive ||
    isBikePathActive ||
    isRoadSurfaceOver3 ||
    isTopRatedActive;

  const toggleParkingFilter = (type: ParkingType) => {
    const current = activeFilters.parkingTypes || [];
    if (current.includes(type)) {
      const updated = current.filter((t) => t !== type);
      setFilter('parkingTypes', updated.length > 0 ? updated : undefined);
    } else {
      setFilter('parkingTypes', [...current, type]);
    }
  };

  return (
    <div className="absolute top-18 left-4 right-4 z-20 flex items-center gap-2 overflow-x-auto no-scrollbar py-1 pointer-events-auto">
      {/* Reset rapido se c'è almeno un filtro attivo */}
      {hasAnyFilterActive && (
        <button
          type="button"
          onClick={resetFilters}
          className="flex-shrink-0 px-3 py-1.5 rounded-full bg-slate-900 text-white text-xs font-semibold flex items-center gap-1 shadow-md hover:bg-slate-800 transition-all cursor-pointer"
        >
          <X size={13} />
          Reset
        </button>
      )}

      {/* Filtro: Parcheggio Gratuito */}
      <button
        type="button"
        onClick={() => toggleParkingFilter('FREE')}
        className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border transition-all shadow-sm cursor-pointer ${
          isFreeParkingActive
            ? 'bg-blue-600 text-white border-blue-600 shadow-blue-500/20'
            : 'bg-white/95 backdrop-blur-md text-slate-700 border-slate-200 hover:bg-slate-50'
        }`}
      >
        <Car size={13} />
        Parcheggio Gratuito
      </button>

      {/* Filtro: Posti Disabili */}
      <button
        type="button"
        onClick={() => toggleParkingFilter('DISABLED')}
        className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border transition-all shadow-sm cursor-pointer ${
          isDisabledParkingActive
            ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-amber-500/30'
            : 'bg-white/95 backdrop-blur-md text-slate-700 border-slate-200 hover:bg-slate-50'
        }`}
      >
        <Accessibility size={13} />
        Posti Disabili
      </button>

      {/* Filtro: Posti Rosa */}
      <button
        type="button"
        onClick={() => toggleParkingFilter('PINK')}
        className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border transition-all shadow-sm cursor-pointer ${
          isPinkParkingActive
            ? 'bg-pink-500 text-white border-pink-600 shadow-pink-500/30'
            : 'bg-white/95 backdrop-blur-md text-slate-700 border-slate-200 hover:bg-slate-50'
        }`}
      >
        <Heart size={13} />
        Posti Rosa
      </button>

      {/* Filtro: Disco Orario */}
      <button
        type="button"
        onClick={() => toggleParkingFilter('PARKING_DISC')}
        className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border transition-all shadow-sm cursor-pointer ${
          isParkingDiscActive
            ? 'bg-slate-800 text-white border-slate-800'
            : 'bg-white/95 backdrop-blur-md text-slate-700 border-slate-200 hover:bg-slate-50'
        }`}
      >
        <Clock size={13} />
        Disco Orario
      </button>

      {/* Filtro: Carico / Scarico Merci */}
      <button
        type="button"
        onClick={() => toggleParkingFilter('LOADING_UNLOADING')}
        className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border transition-all shadow-sm cursor-pointer ${
          isLoadingUnloadingActive
            ? 'bg-orange-500 text-white border-orange-600 shadow-orange-500/30'
            : 'bg-white/95 backdrop-blur-md text-slate-700 border-slate-200 hover:bg-slate-50'
        }`}
      >
        <Truck size={13} />
        Carico/Scarico
      </button>

      {/* Filtro: Pista Ciclabile */}
      <button
        type="button"
        onClick={() => setFilter('hasCyclePath', isBikePathActive ? undefined : true)}
        className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border transition-all shadow-sm ${
          isBikePathActive
            ? 'bg-emerald-600 text-white border-emerald-600 shadow-emerald-500/20'
            : 'bg-white/95 backdrop-blur-md text-slate-700 border-slate-200 hover:bg-slate-50'
        }`}
      >
        <Bike size={13} />
        Pista Ciclabile
      </button>

      {/* Filtro: Manto Stradale > 3 */}
      <button
        type="button"
        onClick={() => {
          if (isRoadSurfaceOver3) {
            setFilter('minCategoryRating', undefined);
          } else {
            setFilter('minCategoryRating', { roadSurface: 3 });
          }
        }}
        className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border transition-all shadow-sm ${
          isRoadSurfaceOver3
            ? 'bg-blue-600 text-white border-blue-600 shadow-blue-500/20'
            : 'bg-white/95 backdrop-blur-md text-slate-700 border-slate-200 hover:bg-slate-50'
        }`}
      >
        <span>🛣️</span>
        Manto Stradale &gt; 3★
      </button>

      {/* Filtro: Top Rated (≥ 4.0) */}
      <button
        type="button"
        onClick={() => setFilter('minOverallRating', isTopRatedActive ? undefined : 4.0)}
        className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border transition-all shadow-sm ${
          isTopRatedActive
            ? 'bg-amber-500 text-white border-amber-500 shadow-amber-500/20'
            : 'bg-white/95 backdrop-blur-md text-slate-700 border-slate-200 hover:bg-slate-50'
        }`}
      >
        <Star size={13} className="fill-current" />
        Media &ge; 4.0★
      </button>
    </div>
  );
};
