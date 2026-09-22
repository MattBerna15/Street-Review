import React, { useState, useEffect } from 'react';
import { X, Send, Bike, Car, Check, Edit3, Sparkles } from 'lucide-react';
import { useStreetStore } from '../../store/useStreetStore';
import { CategoryRatingSlider } from '../ui/CategoryRatingSlider';
import { ParkingType, ReviewCategoryRatings, StreetAmenity } from '../../types';

export const LeaveReviewModal: React.FC = () => {
  const {
    isReviewModalOpen,
    targetStreetForReview,
    closeReviewModal,
    addReviewToStreet,
    currentUser,
    editingReview,
  } = useStreetStore();

  const [ratings, setRatings] = useState<ReviewCategoryRatings>({
    roadSurface: 3,
    groundSignage: 3,
    verticalSignage: 3,
    parkingQuantity: 3,
    sidewalkQuality: 3,
    lighting: 3,
    cleanliness: 3,
    accessibility: 3,
    rainDrainage: 3,
    greeneryShade: 3,
    quietness: 3,
    intersectionVisibility: 3,
    laneWidth: 3,
  });

  const [parkingTypes, setParkingTypes] = useState<ParkingType[]>([]);
  const [hasCyclePath, setHasCyclePath] = useState<boolean>(false);
  const [amenities, setAmenities] = useState<StreetAmenity[]>([]);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Precompilazione dei dati se siamo in modalità modifica
  useEffect(() => {
    if (editingReview) {
      setRatings({
        roadSurface: editingReview.ratings?.roadSurface ?? 3,
        groundSignage: editingReview.ratings?.groundSignage ?? 3,
        verticalSignage: editingReview.ratings?.verticalSignage ?? 3,
        parkingQuantity: editingReview.ratings?.parkingQuantity ?? 3,
        sidewalkQuality: editingReview.ratings?.sidewalkQuality ?? 3,
        lighting: editingReview.ratings?.lighting ?? 3,
        cleanliness: editingReview.ratings?.cleanliness ?? 3,
        accessibility: editingReview.ratings?.accessibility ?? 3,
        rainDrainage: editingReview.ratings?.rainDrainage ?? 3,
        greeneryShade: editingReview.ratings?.greeneryShade ?? 3,
        quietness: editingReview.ratings?.quietness ?? 3,
        intersectionVisibility: editingReview.ratings?.intersectionVisibility ?? 3,
        laneWidth: editingReview.ratings?.laneWidth ?? 3,
      });
      setParkingTypes(editingReview.parkingTypes || []);
      setHasCyclePath(editingReview.hasCyclePath || false);
      setAmenities(editingReview.amenities || []);
      setComment(editingReview.comment || '');
    } else {
      setRatings({
        roadSurface: 3,
        groundSignage: 3,
        verticalSignage: 3,
        parkingQuantity: 3,
        sidewalkQuality: 3,
        lighting: 3,
        cleanliness: 3,
        accessibility: 3,
        rainDrainage: 3,
        greeneryShade: 3,
        quietness: 3,
        intersectionVisibility: 3,
        laneWidth: 3,
      });
      setParkingTypes([]);
      setHasCyclePath(false);
      setAmenities([]);
      setComment('');
    }
  }, [editingReview, isReviewModalOpen]);

  if (!isReviewModalOpen || !targetStreetForReview) return null;

  const handleRatingChange = (key: keyof ReviewCategoryRatings, value: number) => {
    setRatings((prev) => ({ ...prev, [key]: value }));
  };

  const toggleParkingType = (type: ParkingType) => {
    setParkingTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleAmenity = (amenity: StreetAmenity) => {
    setAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const overallScore = (
    Object.values(ratings).reduce((acc, curr) => acc + curr, 0) / 13
  ).toFixed(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Salva o aggiorna la recensione collegandola all'account Google autenticato
    addReviewToStreet(targetStreetForReview.id, {
      userId: currentUser?.id || 'google-user-default',
      userName: currentUser?.name || 'Utente Verificato',
      avatarUrl: currentUser?.avatarUrl,
      ratings,
      overallRating: parseFloat(overallScore),
      comment: comment.trim(),
      parkingTypes,
      hasCyclePath,
      amenities,
    });

    await new Promise((resolve) => setTimeout(resolve, 400));
    setIsSubmitting(false);
    closeReviewModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in pointer-events-auto">
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden animate-slide-up">
        {/* Header Modale */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-lg">
                {editingReview ? 'Modifica la tua recensione' : 'Valuta la Strada'}
              </h3>
              {editingReview && (
                <span className="text-[10px] font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Edit3 size={10} /> Modifica
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">{targetStreetForReview.name}, {targetStreetForReview.city}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-xl text-xs font-bold border border-blue-100">
              Media: {overallScore} ★
            </div>
            <button
              type="button"
              onClick={closeReviewModal}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Form Body Scrollabile */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {/* Sezione 1: Categorie di valutazione obbligatorie */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Parametri Principali (1 a 5)
              </h4>
              <span className="text-[11px] text-slate-400">Tutti obbligatori</span>
            </div>

            <CategoryRatingSlider
              label="Manto Stradale"
              description="Assenza di buche, asfalto liscio e regolare"
              value={ratings.roadSurface}
              onChange={(v) => handleRatingChange('roadSurface', v)}
            />
            <CategoryRatingSlider
              label="Segnaletica a Terra"
              description="Strisce pedonali visibili, stop e delimitazioni chiare"
              value={ratings.groundSignage}
              onChange={(v) => handleRatingChange('groundSignage', v)}
            />
            <CategoryRatingSlider
              label="Segnaletica Verticale"
              description="Cartelli visibili, non coperti da rami o graffiti"
              value={ratings.verticalSignage}
              onChange={(v) => handleRatingChange('verticalSignage', v)}
            />
            <CategoryRatingSlider
              label="Quantità di Parcheggi"
              description="Facilità nel trovare posti auto"
              value={ratings.parkingQuantity}
              onChange={(v) => handleRatingChange('parkingQuantity', v)}
            />
            <CategoryRatingSlider
              label="Qualità dei Marciapiedi"
              description="Spazio sufficiente, pavimentazione curata"
              value={ratings.sidewalkQuality}
              onChange={(v) => handleRatingChange('sidewalkQuality', v)}
            />
            <CategoryRatingSlider
              label="Illuminazione Notturna"
              description="Lampioni funzionanti, buona visibilità e sicurezza notturna"
              value={ratings.lighting}
              onChange={(v) => handleRatingChange('lighting', v)}
            />
            <CategoryRatingSlider
              label="Pulizia e Decoro"
              description="Presenza di cestini, pulizia generale"
              value={ratings.cleanliness}
              onChange={(v) => handleRatingChange('cleanliness', v)}
            />
            <CategoryRatingSlider
              label="Accessibilità (PMR e Passeggini)"
              description="Scivoli ai marciapiedi, assenza di barriere architettoniche"
              value={ratings.accessibility}
              onChange={(v) => handleRatingChange('accessibility', v)}
            />
            <CategoryRatingSlider
              label="Drenaggio Piovano"
              description="Efficienza tombini e caditoie, assenza di allagamenti o pozzanghere"
              value={ratings.rainDrainage}
              onChange={(v) => handleRatingChange('rainDrainage', v)}
            />
            <CategoryRatingSlider
              label="Ombreggiatura e Verde"
              description="Presenza di alberi, ombra estiva, radici che non dissestano l'asfalto"
              value={ratings.greeneryShade}
              onChange={(v) => handleRatingChange('greeneryShade', v)}
            />
            <CategoryRatingSlider
              label="Tranquillità e Silenziosità"
              description="Basso livello di rumore, assenza di traffico molesto"
              value={ratings.quietness}
              onChange={(v) => handleRatingChange('quietness', v)}
            />
            <CategoryRatingSlider
              label="Visibilità Incroci"
              description="Facilità di immissione, visuale aperta e specchi parabolici"
              value={ratings.intersectionVisibility}
              onChange={(v) => handleRatingChange('intersectionVisibility', v)}
            />
            <CategoryRatingSlider
              label="Larghezza Carreggiata"
              description="Corsia spaziosa e comoda, facilità di manovra e passaggio"
              value={ratings.laneWidth}
              onChange={(v) => handleRatingChange('laneWidth', v)}
            />
          </div>

          {/* Sezione 2: Tag Specifici Parcheggi (Pill Buttons) */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Tipologia di Parcheggio Presente
            </h4>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'FREE', label: 'Gratuito (Bianche)' },
                { id: 'PAID', label: 'A Pagamento (Blu)' },
                { id: 'PARKING_DISC', label: '⏱️ Disco Orario' },
                { id: 'DISABLED', label: '♿ Posti Disabili' },
                { id: 'PINK', label: '🌸 Posti Rosa' },
                { id: 'LOADING_UNLOADING', label: '🚚 Carico / Scarico Merci' },
              ].map((item) => {
                const isSelected = parkingTypes.includes(item.id as ParkingType);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleParkingType(item.id as ParkingType)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {isSelected && <Check size={14} />}
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sezione 3: Dotazioni e Arredo Urbano (Tag Rapidi) */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Dotazioni e Arredo Urbano (Tag Rapidi)
            </h4>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'EV_CHARGING', label: 'Colonnine EV', icon: '⚡' },
                { id: 'BIKE_RACKS', label: 'Rastrelliere Bici', icon: '🚲' },
                { id: 'SPEED_BUMPS', label: 'Dossi / Dissuasori', icon: '⚠️' },
                { id: 'COBBLESTONE', label: 'Pavimentazione Speciale', icon: '🏛️' },
                { id: 'DRINKING_FOUNTAIN', label: 'Fontanella Pubblica', icon: '💧' },
                { id: 'BENCHES', label: 'Panchine', icon: '🪑' },
                { id: 'TRASH_BINS', label: 'Cestini Spazzatura', icon: '🗑️' },
              ].map((item) => {
                const isSelected = amenities.includes(item.id as StreetAmenity);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleAmenity(item.id as StreetAmenity)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                    {isSelected && <Check size={13} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sezione 3: Pista Ciclabile (Sì/No) */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Presenza Pista Ciclabile
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setHasCyclePath(true)}
                className={`py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
                  hasCyclePath
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Bike size={16} />
                Sì, Presente
              </button>
              <button
                type="button"
                onClick={() => setHasCyclePath(false)}
                className={`py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
                  !hasCyclePath
                    ? 'bg-slate-700 text-white border-slate-700 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                No, Assente
              </button>
            </div>
          </div>

          {/* Sezione 4: Commento Libero */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Commento Libero
            </h4>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Aggiungi dettagli utili per gli altri utenti (es. 'Zona tranquilla di giorno ma rumorosa la sera', 'Marciapiede dissestato vicino al civico 14')..."
              className="w-full text-xs text-slate-800 placeholder-slate-400 p-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3.5 text-white font-bold rounded-2xl shadow-lg active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 text-sm transition-all cursor-pointer ${
                editingReview
                  ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/25'
                  : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/25'
              }`}
            >
              <Send size={16} />
              {isSubmitting
                ? 'Salvataggio in corso...'
                : editingReview
                ? 'Aggiorna recensione'
                : 'Invia Recensione'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
