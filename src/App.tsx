import React from 'react';
import { StreetReviewMap } from './components/map/StreetReviewMap';
import { MapSearchBar } from './components/search/MapSearchBar';
import { MapFilterBar } from './components/search/MapFilterBar';
import { StreetBottomSheet } from './components/street/StreetBottomSheet';
import { LeaveReviewModal } from './components/review/LeaveReviewModal';
import { OutOfAreaModal } from './components/ui/OutOfAreaModal';
import { UserHeaderProfile } from './components/header/UserHeaderProfile';
import { AuthModal } from './components/auth/AuthModal';

export const App: React.FC = () => {
  return (
    <main className="relative w-screen h-screen overflow-hidden font-sans antialiased text-slate-900">
      {/* 1. Barra di ricerca flottante in alto a sinistra */}
      <MapSearchBar />

      {/* 2. Profilo Utente / Tasto Accedi in alto a destra */}
      <UserHeaderProfile />

      {/* 3. Barra orizzontale filtri */}
      <MapFilterBar />

      {/* 4. Mappa interattiva a schermo intero */}
      <StreetReviewMap />

      {/* 5. Bottom Sheet informativo della strada selezionata */}
      <StreetBottomSheet />

      {/* 6. Modale di inserimento recensione (Aperta solo se autenticato) */}
      <LeaveReviewModal />

      {/* 7. Modale Autenticazione Google OAuth 2.0 */}
      <AuthModal />

      {/* 8. Modale Geofencing 'Stiamo arrivando!' */}
      <OutOfAreaModal />
    </main>
  );
};

export default App;
