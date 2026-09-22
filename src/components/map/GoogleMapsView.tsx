import React, { useEffect, useRef } from 'react';
import { GEOFENCE_CONFIG } from '../../config/geofence';
import { Street, StreetSegment } from '../../types';
import { useStreetStore } from '../../store/useStreetStore';

interface GoogleMapsViewProps {
  apiKey?: string;
  streets: Street[];
  selectedStreet: Street | null;
  onSelectStreet: (street: Street) => void;
}

declare global {
  interface Window {
    google?: any;
    initGoogleMapCallback?: () => void;
  }
}

export const GoogleMapsView: React.FC<GoogleMapsViewProps> = ({
  apiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyBG2o1VXtr2YPvW4Jj0OixX8rgep0W0Nuk',
  streets,
  selectedStreet,
  onSelectStreet,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // Caricamento asincrono dello script di Google Maps
  useEffect(() => {
    if (!apiKey) return;

    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,marker&callback=initGoogleMapCallback&v=weekly`;
      script.async = true;
      script.defer = true;

      window.initGoogleMapCallback = () => {
        initializeMap();
      };

      document.head.appendChild(script);
    } else {
      initializeMap();
    }

    return () => {
      // Pulizia marker
      markersRef.current.forEach((m) => m.setMap?.(null));
      markersRef.current = [];
    };
  }, [apiKey]);

  const initializeMap = () => {
    if (!mapContainerRef.current || !window.google) return;

    const google = window.google;

    // Configurazione Google Maps con restrizioni Geofencing Riviera delle Palme
    const map = new google.maps.Map(mapContainerRef.current, {
      center: { lat: GEOFENCE_CONFIG.center.lat, lng: GEOFENCE_CONFIG.center.lng },
      zoom: GEOFENCE_CONFIG.defaultZoom,
      minZoom: GEOFENCE_CONFIG.minZoom,
      maxZoom: GEOFENCE_CONFIG.maxZoom,
      mapTypeId: 'roadmap',
      disableDefaultUI: true,
      zoomControl: true,
      // Restrizione rigida per impedire all'utente di uscire dalla zona pilota
      restriction: {
        latLngBounds: {
          south: GEOFENCE_CONFIG.boundingBox.south,
          west: GEOFENCE_CONFIG.boundingBox.west,
          north: GEOFENCE_CONFIG.boundingBox.north,
          east: GEOFENCE_CONFIG.boundingBox.east,
        },
        strictBounds: true,
      },
      // Stile cartografico pulito ad alto contrasto per i nomi delle vie
      styles: [
        { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
        { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#1e293b' }] },
        { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#cbd5e1' }] },
      ],
    });

    mapInstanceRef.current = map;
    renderCustomMarkers(map);
  };

  const renderCustomMarkers = (map: any) => {
    if (!window.google || !map) return;

    // Rimuovi vecchi marker
    markersRef.current.forEach((m) => m.setMap?.(null));
    markersRef.current = [];

    const google = window.google;

    // Estrai tutti i punti: se la via ha segmenti specifici (es. civici o tratti del Lungomare), crea un marker per segmento
    const pointsToRender: {
      street: Street;
      segment?: StreetSegment;
      lat: number;
      lng: number;
      rating: number;
      label: string;
      subLabel?: string;
    }[] = [];

    streets.forEach((st) => {
      if (st.segments && st.segments.length > 0) {
        st.segments.forEach((seg) => {
          pointsToRender.push({
            street: st,
            segment: seg,
            lat: seg.latitude,
            lng: seg.longitude,
            rating: seg.avgOverallRating,
            label: seg.segmentName,
            subLabel: seg.civicRange || st.name,
          });
        });
      } else {
        pointsToRender.push({
          street: st,
          lat: st.latitude,
          lng: st.longitude,
          rating: st.avgOverallRating,
          label: st.name,
          subLabel: st.city,
        });
      }
    });

    pointsToRender.forEach((point) => {
      const isNew = point.street.reviewsCount === 0;

      const getBgColor = (r: number) => {
        if (isNew) return '#475569';    // Slate neutro per nuova via
        if (r >= 4.0) return '#10b981'; // Emerald
        if (r >= 2.8) return '#f59e0b'; // Amber
        return '#f43f5e';               // Rose
      };

      // Crea OverlayView personalizzato per renderizzare badge HTML interattivi
      const Overlay = new google.maps.OverlayView();
      let div: HTMLDivElement | null = null;

      Overlay.onAdd = function () {
        div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.cursor = 'pointer';
        div.style.transform = 'translate(-50%, -100%)';
        div.style.zIndex = selectedStreet?.id === point.street.id ? '999' : '100';

        const isSelected = selectedStreet?.id === point.street.id;

        div.innerHTML = `
          <div style="
            display: flex;
            align-items: center;
            gap: 5px;
            background: ${getBgColor(point.rating)};
            color: white;
            padding: 5px 11px;
            border-radius: 9999px;
            font-weight: 800;
            font-size: 11px;
            box-shadow: 0 10px 15px -3px rgba(0,0,0,0.25);
            border: 2px solid white;
            transition: all 0.2s;
            ${isSelected ? 'transform: scale(1.25); box-shadow: 0 0 0 4px rgba(59,130,246,0.5);' : ''}
          ">
            ${isNew ? '<span style="font-size: 10px;">Nuova</span>' : `<span>★</span><span>${point.rating.toFixed(1)}</span>`}
          </div>
          <div style="
            background: rgba(255,255,255,0.95);
            backdrop-filter: blur(4px);
            padding: 2px 8px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 700;
            color: #1e293b;
            text-align: center;
            white-space: nowrap;
            margin-top: 4px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            border: 1px solid #e2e8f0;
          ">
            ${point.label}
          </div>
        `;

        div.onclick = () => {
          onSelectStreet(point.street);
          map.panTo({ lat: point.lat, lng: point.lng });
        };

        const panes = this.getPanes();
        panes.overlayMouseTarget.appendChild(div);
      };

      Overlay.draw = function () {
        if (!div) return;
        const projection = this.getProjection();
        const pos = projection.fromLatLngToDivPixel(new google.maps.LatLng(point.lat, point.lng));
        if (pos) {
          div.style.left = pos.x + 'px';
          div.style.top = pos.y + 'px';
        }
      };

      Overlay.onRemove = function () {
        if (div && div.parentNode) {
          div.parentNode.removeChild(div);
          div = null;
        }
      };

      Overlay.setMap(map);
      markersRef.current.push(Overlay);
    });
  };

  return (
    <div className="relative w-full h-full min-h-screen">
      <div ref={mapContainerRef} className="w-full h-full min-h-screen" />
    </div>
  );
};
