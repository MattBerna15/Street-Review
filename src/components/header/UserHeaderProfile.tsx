import React, { useState, useRef, useEffect } from 'react';
import { LogIn, LogOut, User, CheckCircle2 } from 'lucide-react';
import { useStreetStore } from '../../store/useStreetStore';

export const UserHeaderProfile: React.FC = () => {
  const { currentUser, logout, openAuthModal } = useStreetStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Chiudi dropdown al click esterno
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="absolute top-4 right-4 z-30 pointer-events-auto">
      {currentUser ? (
        /* UTENTE AUTENTICATO */
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2.5 bg-white/95 backdrop-blur-md pl-2 pr-3.5 py-1.5 rounded-full shadow-lg border border-slate-200 hover:shadow-xl transition-all focus:outline-none"
          >
            {/* Avatar Google */}
            {currentUser.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/20"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                {currentUser.name.charAt(0)}
              </div>
            )}
            <span className="text-xs font-bold text-slate-800 max-w-[110px] truncate hidden sm:inline">
              {currentUser.name.split(' ')[0]}
            </span>
          </button>

          {/* Menù a tendina profilo e logout */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 divide-y divide-slate-100 animate-slide-up">
              <div className="px-3 py-2.5 space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-bold">
                  <CheckCircle2 size={13} /> Account Connesso
                </div>
                <p className="text-xs font-bold text-slate-800 truncate">{currentUser.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                >
                  <LogOut size={15} />
                  <span>Disconnetti</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* MODALITÀ OSPITE: TASTO ACCEDI */
        <button
          type="button"
          onClick={openAuthModal}
          className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-full shadow-lg border border-slate-200 hover:shadow-xl hover:bg-blue-50/50 transition-all text-xs font-bold text-slate-700"
        >
          <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
            <User size={14} />
          </div>
          <span>Accedi</span>
        </button>
      )}
    </div>
  );
};
