import React from 'react';
import { 
  X, Star, Bike, MessageSquarePlus, Sparkles, Car, MessageCircleDashed, Clock, Heart, Accessibility, Pencil, Truck
} from 'lucide-react';
import { useStreetStore } from '../../store/useStreetStore';
import { StarRating } from '../ui/StarRating';
import { ParkingType, StreetAmenity } from '../../types';

export const StreetBottomSheet: React.FC = () => {
  const { selectedStreet, sheetSnap, setSheetSnap, selectStreet, openReviewModal, currentUser } = useStreetStore();

  if (!selectedStreet || sheetSnap === 'hidden') return null;

  const isNewStreet = selectedStreet.reviewsCount === 0;

  const userExistingReview = currentUser && selectedStreet?.reviews
    ? selectedStreet.reviews.find(
        (r) =>
          r.userId === currentUser.id ||
          r.user?.id === currentUser.id ||
          r.user?.name === currentUser.name
      )
    : null;

  const getScoreColor = (rating: number) => {
    if (isNewStreet) return 'text-slate-500 bg-slate-100 border-slate-200';
    if (rating >= 4.0) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (rating >= 2.8) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  const getParkingBadgeLabel = (type: ParkingType) => {
    switch (type) {
      case 'FREE': return { label: 'Parcheggio Gratuito', color: 'bg-emerald-50 text-emerald-800 border border-emerald-200', icon: Car };
      case 'PAID': return { label: 'A Pagamento (Blu)', color: 'bg-blue-50 text-blue-800 border border-blue-200', icon: Car };
      case 'PARKING_DISC': return { label: 'Disco Orario', color: 'bg-slate-100 text-slate-700 border border-slate-300', icon: Clock };
      case 'DISABLED': return { label: 'Posti Disabili', color: 'bg-amber-100 text-amber-900 border border-amber-400 font-bold', icon: Accessibility };
      case 'PINK': return { label: 'Posti Rosa', color: 'bg-pink-100 text-pink-800 border border-pink-300 font-bold', icon: Heart };
      case 'LOADING_UNLOADING': return { label: 'Carico / Scarico', color: 'bg-orange-100 text-orange-950 border border-orange-400 font-bold', icon: Truck };
    }
  };

  const getAmenityBadge = (amenity: StreetAmenity) => {
    switch (amenity) {
      case 'EV_CHARGING': return { label: 'Ricarica EV', icon: '⚡', color: 'bg-emerald-50 text-emerald-800 border border-emerald-200' };
      case 'BIKE_RACKS': return { label: 'Rastrelliere Bici', icon: '🚲', color: 'bg-cyan-50 text-cyan-800 border border-cyan-200' };
      case 'SPEED_BUMPS': return { label: 'Dossi / Dissuasori', icon: '⚠️', color: 'bg-orange-50 text-orange-800 border border-orange-200' };
      case 'COBBLESTONE': return { label: 'Ciottolato / Sanpietrini', icon: '🏛️', color: 'bg-stone-100 text-stone-800 border border-stone-300' };
      case 'DRINKING_FOUNTAIN': return { label: 'Fontanella', icon: '💧', color: 'bg-sky-50 text-sky-800 border border-sky-200' };
      case 'BENCHES': return { label: 'Panchine', icon: '🪑', color: 'bg-amber-50 text-amber-800 border border-amber-200' };
      case 'TRASH_BINS': return { label: 'Cestini', icon: '🗑️', color: 'bg-slate-100 text-slate-800 border border-slate-200' };
    }
  };

  const categories = [
    { key: 'roadSurface', label: 'Manto Stradale', val: selectedStreet.categoryAverages?.roadSurface ?? 0 },
    { key: 'groundSignage', label: 'Segnaletica a terra', val: selectedStreet.categoryAverages?.groundSignage ?? 0 },
    { key: 'verticalSignage', label: 'Segnaletica verticale', val: selectedStreet.categoryAverages?.verticalSignage ?? 0 },
    { key: 'parkingQuantity', label: 'Quantità parcheggi', val: selectedStreet.categoryAverages?.parkingQuantity ?? 0 },
    { key: 'sidewalkQuality', label: 'Qualità marciapiedi', val: selectedStreet.categoryAverages?.sidewalkQuality ?? 0 },
    { key: 'lighting', label: 'Illuminazione', val: selectedStreet.categoryAverages?.lighting ?? 0 },
    { key: 'cleanliness', label: 'Pulizia', val: selectedStreet.categoryAverages?.cleanliness ?? 0 },
    { key: 'accessibility', label: 'Accessibilità', val: selectedStreet.categoryAverages?.accessibility ?? 0 },
    { key: 'rainDrainage', label: 'Drenaggio piovano', val: selectedStreet.categoryAverages?.rainDrainage ?? 0 },
    { key: 'greeneryShade', label: 'Ombreggiatura e verde', val: selectedStreet.categoryAverages?.greeneryShade ?? 0 },
    { key: 'quietness', label: 'Tranquillità e silenziosità', val: selectedStreet.categoryAverages?.quietness ?? 0 },
    { key: 'intersectionVisibility', label: 'Visibilità incroci', val: selectedStreet.categoryAverages?.intersectionVisibility ?? 0 },
    { key: 'laneWidth', label: 'Larghezza carreggiata', val: selectedStreet.categoryAverages?.laneWidth ?? 0 },
  ];

  const heightClasses = {
    hidden: 'translate-y-full',
    peek: 'h-[160px]',
    half: 'h-[60vh]',
    full: 'h-[92vh]',
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 bg-white rounded-t-3xl shadow-2xl border-t border-slate-200 flex flex-col transition-all duration-300 ease-out md:max-w-xl md:mx-auto ${heightClasses[sheetSnap]}`}
    >
      {/* Drag Bar & Controlli Header */}
      <div 
        className="w-full pt-3 pb-2 flex flex-col items-center cursor-pointer select-none"
        onClick={() => setSheetSnap(sheetSnap === 'half' ? 'full' : 'half')}
      >
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mb-2" />
      </div>

      <div className="px-5 pb-3 flex items-start justify-between border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">{selectedStreet.name}</h2>
          <p className="text-xs text-slate-500 font-medium">
            {selectedStreet.city} ({selectedStreet.postalCode})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex flex-col items-end">
            <div className={`px-2.5 py-1 rounded-xl font-extrabold text-sm border flex items-center gap-1 ${getScoreColor(selectedStreet.avgOverallRating)}`}>
              {isNewStreet ? (
                <span>Nuova</span>
              ) : (
                <>
                  <Star size={14} className="fill-current text-amber-500" />
                  <span>{selectedStreet.avgOverallRating.toFixed(1)}</span>
                </>
              )}
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5">
              {selectedStreet.reviewsCount} {selectedStreet.reviewsCount === 1 ? 'recensione' : 'recensioni'}
            </span>
          </div>

          <button
            onClick={() => selectStreet(null)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 ml-1"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Contenuto scrollabile */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
        {/* STATO 1: NESSUNA RECENSIONE (Invito alla Community) */}
        {isNewStreet ? (
          <div className="py-6 px-4 bg-slate-50 border border-dashed border-slate-200 rounded-3xl text-center space-y-4">
            <div className="w-14 h-14 mx-auto bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
              <Sparkles size={28} />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                Nessuna recensione ancora
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                Sii il primo a recensire questa strada! Condividi lo stato del manto stradale, dei parcheggi e dell'illuminazione con i cittadini.
              </p>
            </div>

            <button
              type="button"
              onClick={() => openReviewModal(selectedStreet)}
              className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 text-sm transition-all"
            >
              <MessageSquarePlus size={18} />
              Scrivi la prima recensione
            </button>
          </div>
        ) : (
          /* STATO 2: RECENSIONI PRESENTI (Visualizzazione Dati & Breakdown) */
          <>
            {/* Badges e Caratteristiche Veloci */}
            <div className="flex flex-wrap gap-2">
              {selectedStreet.commonParkingTypes.map((t) => {
                const badge = getParkingBadgeLabel(t);
                if (!badge) return null;
                const IconComp = badge.icon;
                return (
                  <span key={t} className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${badge.color}`}>
                    <IconComp size={13} />
                    {badge.label}
                  </span>
                );
              })}

              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
                selectedStreet.hasCyclePath ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
              }`}>
                <Bike size={13} />
                {selectedStreet.hasCyclePath ? 'Pista Ciclabile Presente' : 'Nessuna Ciclabile'}
              </span>

              {selectedStreet.amenities?.map((a) => {
                const badge = getAmenityBadge(a);
                if (!badge) return null;
                return (
                  <span key={a} className={`text-xs font-semibold px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${badge.color}`}>
                    <span>{badge.icon}</span>
                    <span>{badge.label}</span>
                  </span>
                );
              })}
            </div>

            {/* Breakdown Categorie */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Valutazione per Categoria
              </h3>
              <div className="space-y-2.5">
                {categories.map((cat) => (
                  <div key={cat.key} className="flex items-center justify-between text-xs">
                    <span className="text-slate-700 font-medium w-40 truncate">{cat.label}</span>
                    <div className="flex-1 mx-3 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 rounded-full transition-all duration-500" 
                        style={{ width: `${(cat.val / 5) * 100}%` }}
                      />
                    </div>
                    <span className="font-bold text-slate-800 w-8 text-right">{cat.val.toFixed(1)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA: Modifica o Lascia recensione */}
            {userExistingReview ? (
              <button
                type="button"
                onClick={() => openReviewModal(selectedStreet, userExistingReview)}
                className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-bold rounded-2xl shadow-md shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Pencil size={18} />
                Modifica la tua recensione
              </button>
            ) : (
              <button
                type="button"
                onClick={() => openReviewModal(selectedStreet)}
                className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-semibold rounded-2xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <MessageSquarePlus size={18} />
                Lascia una Recensione per questa Via
              </button>
            )}

            {/* Feed Recensioni Utenti */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800">Cosa dicono i residenti ({selectedStreet.reviews?.length || 0})</h3>
                <span className="text-xs text-slate-400">Recenti</span>
              </div>

              {selectedStreet.reviews && selectedStreet.reviews.length > 0 ? (
                <div className="space-y-3">
                  {selectedStreet.reviews.map((rev) => {
                    const isMyReview = userExistingReview?.id === rev.id;
                    return (
                      <div key={rev.id} className={`p-3.5 bg-white rounded-2xl shadow-sm space-y-2 border ${isMyReview ? 'border-blue-300 ring-2 ring-blue-50' : 'border-slate-100'}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center text-slate-600 font-bold text-xs flex-shrink-0">
                              {rev.user.avatarUrl ? (
                                <img src={rev.user.avatarUrl} alt={rev.user.name} className="w-full h-full object-cover" />
                              ) : (
                                rev.user.name.charAt(0)
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-xs font-semibold text-slate-800">{rev.user.name}</p>
                                {isMyReview && (
                                  <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                    Tu
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-slate-400">{new Date(rev.createdAt).toLocaleDateString('it-IT')}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {isMyReview && (
                              <button
                                type="button"
                                onClick={() => openReviewModal(selectedStreet, rev)}
                                className="p-1 px-2 text-blue-600 hover:bg-blue-50 border border-blue-200 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                                title="Modifica la tua recensione"
                              >
                                <Pencil size={12} />
                                <span>Modifica</span>
                              </button>
                            )}
                            <StarRating value={rev.overallRating} size={14} />
                          </div>
                        </div>

                        {rev.comment && (
                          <p className="text-xs text-slate-600 leading-relaxed pl-10">
                            "{rev.comment}"
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
