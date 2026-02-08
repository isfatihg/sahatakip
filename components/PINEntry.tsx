
import React, { useState } from 'react';
import { KeyRound, ShieldAlert } from 'lucide-react';

interface PINEntryProps {
  onLogin: (pin: string) => void;
}

export const PINEntry: React.FC<PINEntryProps> = ({ onLogin }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ekip kodları artık daha uzun (Örn: SAHA17550), bu yüzden min uzunluğu 3 tutuyoruz
    if (pin.trim().length >= 3) {
      onLogin(pin.trim().toUpperCase());
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="mt-20 max-w-sm mx-auto px-4 sm:px-0">
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border border-slate-200">
        <div className="text-center mb-8">
          <div className="bg-blue-100 text-blue-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg">
            <KeyRound size={36} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Sisteme Giriş</h2>
          <p className="text-slate-500 mt-2 font-medium">Ekip kodunuzu girerek devam edin.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-3 text-center uppercase tracking-widest">
              Ekip Kodu
            </label>
            <input
              type="text"
              autoCapitalize="characters"
              autoComplete="username"
              maxLength={15}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className={`w-full text-center text-2xl py-4 border-2 rounded-2xl focus:ring-8 transition-all outline-none bg-white text-slate-900 font-bold uppercase ${
                error ? 'border-red-500 bg-red-50 animate-shake' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-50'
              }`}
              placeholder="SAHA12345"
            />
            <p className="text-[10px] text-center text-slate-400 mt-3 font-medium uppercase italic">
              Örn: SAHA17550 veya KABLO17501
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-200 transition-all transform active:scale-95 uppercase tracking-widest"
          >
            DEVAM ET
          </button>
        </form>

        <div className="mt-8 flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
          <ShieldAlert className="text-slate-400 shrink-0" size={20} />
          <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed">
            Sisteme yapılan tüm kayıtlar GPS ve zaman damgası ile ilgili ekip kodu üzerine işlenmektedir.
          </p>
        </div>
      </div>
    </div>
  );
};
