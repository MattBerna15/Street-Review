import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Navigation, Loader2 } from 'lucide-react';
import { useStreetStore } from '../../store/useStreetStore';
import { isCoordinateInsideGeofence } from '../../services/geofenceValidator';
import { GEOFENCE_CONFIG } from '../../config/geofence';

interface MapSearchBarProps {
  onSelectSuggestion?: (item: any) => void;
}

interface PlacePrediction {
  placeId: string;
  mainText: string;
  secondaryText: string;
  description: string;
}

export const MapSearchBar: React.FC<MapSearchBarProps> = ({ onSelectSuggestion }) => {
  const { searchQuery, setSearchQuery, setMapCenter, openOutOfAreaModal, addOrSelectStreet } = useStreetStore();
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const autocompleteServiceRef = useRef<any>(null);
  const placesServiceRef = useRef<any>(null);

  // Chiudi quando l'utente clicca altrove sullo schermo/mappa
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Inizializza il servizio Places di Google se disponibile
  useEffect(() => {
    if (window.google?.maps?.places) {
      autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
      placesServiceRef.current = new window.google.maps.places.PlacesService(
        document.createElement('div')
      );
    }
  }, []);

  // Predizioni dinamiche SOLO quando l'utente scrive almeno 2 o 3 caratteri
  useEffect(() => {
    const query = searchQuery.trim();

    // Se la barra è vuota o ha meno di 3 caratteri, chiudi la tendina
    if (query.length < 3) {
      setPredictions([]);
      setIsOpen(false);
      return;
    }

    if (!autocompleteServiceRef.current && window.google?.maps?.places) {
      autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
      placesServiceRef.current = new window.google.maps.places.PlacesService(
        document.createElement('div')
      );
    }

    if (autocompleteServiceRef.current) {
      setIsLoading(true);

      const bounds = new window.google.maps.LatLngBounds(
        new window.google.maps.LatLng(GEOFENCE_CONFIG.boundingBox.south, GEOFENCE_CONFIG.boundingBox.west),
        new window.google.maps.LatLng(GEOFENCE_CONFIG.boundingBox.north, GEOFENCE_CONFIG.boundingBox.east)
      );

      autocompleteServiceRef.current.getPlacePredictions(
        {
          input: query,
          componentRestrictions: { country: 'it' },
          bounds: bounds,
        },
        (results: any[], status: any) => {
          setIsLoading(false);
          if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
            setPredictions(
              results.slice(0, 5).map((r) => ({
                placeId: r.place_id,
                mainText: r.structured_formatting?.main_text || r.description,
                secondaryText: r.structured_formatting?.secondary_text || '',
                description: r.description,
              }))
            );
            setIsOpen(true);
          } else {
            setPredictions([]);
            setIsOpen(false);
          }
        }
      );
    }
  }, [searchQuery]);

  const handleSelectPlace = (place: PlacePrediction) => {
    setIsOpen(false);
    setSearchQuery(place.mainText);

    if (placesServiceRef.current && window.google) {
      placesServiceRef.current.getDetails(
        { placeId: place.placeId, fields: ['geometry', 'name', 'formatted_address'] },
        (details: any, status: any) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && details?.geometry?.location) {
            const lat = details.geometry.location.lat();
            const lng = details.geometry.location.lng();

            // Verifica Geofencing
            if (isCoordinateInsideGeofence(lat, lng)) {
              setMapCenter([lat, lng], 16);
              // Genera dinamicamente il PIN (o selezionalo se esiste già)
              addOrSelectStreet({
                name: place.mainText,
                city: place.secondaryText ? place.secondaryText.split(',')[0].trim() : 'San Benedetto del Tronto',
                latitude: lat,
                longitude: lng,
              });
              onSelectSuggestion?.({ name: place.mainText, coords: [lat, lng] });
            } else {
              openOutOfAreaModal();
            }
          }
        }
      );
    }
  };

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          if (isCoordinateInsideGeofence(latitude, longitude)) {
            setMapCenter([latitude, longitude], 16);
          } else {
            openOutOfAreaModal();
          }
        },
        (err) => console.warn('Geolocalizzazione non consentita', err)
      );
    }
  };

  return (
    <div ref={containerRef} className="absolute top-4 left-4 right-28 sm:right-auto sm:w-96 z-30 pointer-events-auto">
      <div className="relative bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 flex items-center px-4 py-2.5 transition-all focus-within:shadow-2xl focus-within:ring-2 focus-within:ring-blue-500/30">
        {isLoading ? (
          <Loader2 className="text-blue-500 mr-3 animate-spin flex-shrink-0" size={18} />
        ) : (
          <Search className="text-slate-400 mr-3 flex-shrink-0" size={18} />
        )}

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cerca..."
          className="w-full bg-transparent text-slate-800 placeholder-slate-400 text-sm font-semibold focus:outline-none"
        />

        {searchQuery ? (
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setIsOpen(false);
            }}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 mr-1"
          >
            <X size={16} />
          </button>
        ) : null}

        <button
          type="button"
          onClick={handleLocateMe}
          title="Centra sulla mia posizione"
          className="p-1.5 text-blue-600 hover:text-blue-700 rounded-xl hover:bg-blue-50 transition-colors"
        >
          <Navigation size={17} />
        </button>
      </div>

      {/* Tendina dinamica: appare SOLO quando ci sono predizioni e la barra non è vuota */}
      {isOpen && predictions.length > 0 && (
        <div className="mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden divide-y divide-slate-100 animate-fade-in">
          {predictions.map((p) => (
            <div
              key={p.placeId}
              onClick={() => handleSelectPlace(p)}
              className="flex items-center gap-3 p-3.5 hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0">
                <MapPin size={15} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">{p.mainText}</p>
                {p.secondaryText && (
                  <p className="text-xs text-slate-400 truncate">{p.secondaryText}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
