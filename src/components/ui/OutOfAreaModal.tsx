import React, { useState } from 'react';
import { MapPin, Sparkles, Navigation, X, Bell, CheckCircle } from 'lucide-react';
import { useStreetStore } from '../../store/useStreetStore';
import { GEOFENCE_CONFIG } from '../../config/geofence';

export const OutOfAreaModal: React.FC = () => {
  const { isOutOfAreaModalOpen, closeOutOfAreaModal, setMapCenter, setSearchQuery } = useStreetStore();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  if (!isOutOfAreaModalOpen) return null;

  const handleReturnToPilotArea = () => {
    setMapCenter([GEOFENCE_CONFIG.center.lat, GEOFENCE_CONFIG.center.lng], 14);
    setSearchQuery('');
    closeOutOfAreaModal();
  };

  const handleNotifyMe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail('');
        closeOutOfAreaModal();
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-slide-up relative">
        {/* Tasto chiusura */}
        <button
          onClick={closeOutOfAreaModal}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors z-10"
        >
          <X size={18} />
        </button>

        {/* Header con gradiente e icona Riviera */}
        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 p-6 text-white text-center relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="w-16 h-16 mx-auto bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-3 shadow-inner">
            <span className="text-3xl">🌴</span>
          </div>

          <span className="inline-flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm mb-2">
            <Sparkles size={12} /> Beta Pilota Locale
          </span>
          <h3 className="text-2xl font-black tracking-tight">Stiamo arrivando!</h3>
        </div>

        {/* Corpo Messaggio */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-600 leading-relaxed text-center">
            Per ora <span className="font-semibold text-slate-900">Street Review</span> è attivo
            solo nella <span className="text-blue-600 font-semibold">Riviera delle Palme</span> e dintorni per i nostri primi test sul campo.
          </p>

          {/* Badge Comuni Inclusi */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-2">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
              Aree attive nella fase pilota:
            </p>
            <div className="flex flex-wrap justify-center gap-1.5">
              {[
                'San Benedetto del Tronto',
                'Porto d\'Ascoli',
                'Grottammare',
                'Monteprandone',
                'Centobuchi',
                'Acquaviva Picena',
              ].map((loc) => (
                <span
                  key={loc}
                  className="text-xs bg-white text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs font-medium"
                >
                  📍 {loc}
                </span>
              ))}
            </div>
          </div>

          {/* Form Avvisami */}
          {!isSubscribed ? (
            <form onSubmit={handleNotifyMe} className="space-y-2 pt-1">
              <p className="text-xs text-slate-500 text-center">
                Vuoi Street Review anche nella tua città?
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Inserisci la tua email..."
                  className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-all"
                >
                  <Bell size={14} /> Avvisami
                </button>
              </div>
            </form>
          ) : (
            <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2">
              <CheckCircle size={16} /> Ti avviseremo non appena attiveremo la tua zona!
            </div>
          )}

          {/* CTA: Torna a San Benedetto */}
          <button
            type="button"
            onClick={handleReturnToPilotArea}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all mt-2"
          >
            <Navigation size={15} />
            Esplora San Benedetto del Tronto
          </button>
        </div>
      </div>
    </div>
  );
};
