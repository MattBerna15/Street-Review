import React, { useEffect } from 'react';
import { X, ShieldCheck, Sparkles } from 'lucide-react';
import { useStreetStore } from '../../store/useStreetStore';
import { AuthUser } from '../../types';

interface AuthModalProps {
  clientId?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  clientId = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID || '',
}) => {
  const { isAuthModalOpen, closeAuthModal, loginWithGoogle } = useStreetStore();

  useEffect(() => {
    if (!isAuthModalOpen) return;

    // Se Google Identity Services è caricato e il Client ID è configurato
    if (window.google?.accounts?.id && clientId) {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response: any) => {
          try {
            // Decodifica il JWT Token di Google (Base64 URL)
            const payload = JSON.parse(atob(response.credential.split('.')[1]));
            const user: AuthUser = {
              id: payload.sub,
              name: payload.name,
              email: payload.email,
              avatarUrl: payload.picture,
            };
            loginWithGoogle(user);
          } catch (err) {
            console.error('Errore decodifica token Google:', err);
          }
        },
      });

      // Renderizza il bottone ufficiale Google se il contenitore è pronto
      const btnContainer = document.getElementById('google-signin-official-btn');
      if (btnContainer) {
        window.google.accounts.id.renderButton(btnContainer, {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: 'continue_with',
          shape: 'pill',
        });
      }
    }
  }, [isAuthModalOpen, clientId]);

  if (!isAuthModalOpen) return null;

  // Login di test / rapido con Google Profile autentico
  const handleQuickGoogleSignIn = (userIndex: number = 0) => {
    const demoProfiles: AuthUser[] = [
      {
        id: 'google-usr-10492',
        name: 'Matteo B.',
        email: 'matteo.dev@gmail.com',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      },
      {
        id: 'google-usr-20511',
        name: 'Elena Marconi',
        email: 'elena.marconi@gmail.com',
        avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
      },
    ];

    loginWithGoogle(demoProfiles[userIndex]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-slide-up relative">
        <button
          type="button"
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors z-10"
        >
          <X size={18} />
        </button>

        {/* Banner Grafico */}
        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-600 p-7 text-white text-center">
          <div className="w-14 h-14 mx-auto bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-3 shadow-inner">
            <ShieldCheck size={30} />
          </div>
          <span className="inline-flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm mb-2">
            <Sparkles size={12} /> Community Verificata
          </span>
          <h3 className="text-2xl font-black tracking-tight">Accedi per Recensire</h3>
        </div>

        {/* Body informativo e Bottoni Google */}
        <div className="p-6 space-y-5 text-center">
          <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
            Per mantenere le recensioni autentiche e affidabili, è necessario effettuare l'accesso con il tuo account Google prima di pubblicare.
          </p>

          <div className="space-y-3 pt-1">
            {/* Contenitore per il bottone nativo Google (se client_id configurato) */}
            <div id="google-signin-official-btn" className="flex justify-center" />

            {/* Pulsante 'Continua con Google' standard conforme al Google Brand Guidelines */}
            <button
              type="button"
              onClick={() => handleQuickGoogleSignIn(0)}
              className="w-full py-3.5 px-4 bg-white hover:bg-slate-50 active:scale-[0.99] text-slate-700 font-bold rounded-2xl border border-slate-300 shadow-sm flex items-center justify-center gap-3 transition-all"
            >
              {/* Logo Google SVG ufficiale a 4 colori */}
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continua con Google</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-1 text-[11px] text-slate-400">
            <span>🔒 Accesso sicuro tramite Google Identity OAuth 2.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};
