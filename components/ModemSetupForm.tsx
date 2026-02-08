
import React, { useState } from 'react';
import { ModemSetupReport, ModemTipleri } from '../types';
import { Send, Loader2, Router, Wifi, CheckCircle2 } from 'lucide-react';

interface ModemSetupFormProps {
  ekipKodu: string;
  sheetUrl?: string;
  onReportAdded: (report: ModemSetupReport) => void;
  onComplete: () => void;
}

export const ModemSetupForm: React.FC<ModemSetupFormProps> = ({ ekipKodu, sheetUrl, onReportAdded, onComplete }) => {
  const [formData, setFormData] = useState({
    hizmetNo: '',
    modemTipi: ModemTipleri[0],
    aciklama: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newReport: ModemSetupReport = {
      id: crypto.randomUUID(),
      ...formData,
      ekipKodu,
      timestamp: new Date().toLocaleString('tr-TR'),
      status: 'sent',
      reportType: 'modem_setup'
    };

    if (sheetUrl) {
      try {
        await fetch(sheetUrl, {
          method: 'POST',
          mode: 'no-cors',
          cache: 'no-cache',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify(newReport)
        });
      } catch (err) {
        console.error("Modem submission error:", err);
      }
    }

    onReportAdded(newReport);
    setIsSubmitting(false);
    onComplete();
  };

  const inputClass = "w-full px-4 py-4 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm shadow-sm";
  const labelClass = "text-[10px] font-black text-slate-500 uppercase mb-2 block tracking-widest";

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="bg-indigo-600 p-6 text-white">
        <h3 className="font-black flex items-center gap-3 text-xl uppercase tracking-tight">
          <Router size={24} />
          MODEM KURULUM TALEBİ
        </h3>
        <p className="text-[10px] text-indigo-100 font-bold mt-1 uppercase tracking-widest opacity-80 italic">Kullanıcı adı ve şifre talebi oluşturun</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className={labelClass}>Hizmet No</label>
            <input 
              required 
              type="text" 
              className={inputClass} 
              value={formData.hizmetNo} 
              onChange={e => setFormData({...formData, hizmetNo: e.target.value})} 
              placeholder="Örn: 882194..." 
            />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Modem Tipi / Altyapı</label>
            <select 
              className={inputClass} 
              value={formData.modemTipi} 
              onChange={e => setFormData({...formData, modemTipi: e.target.value})}
            >
              {ModemTipleri.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className={labelClass}>Notlar / Özel Durumlar</label>
          <textarea 
            rows={3} 
            className={inputClass + " resize-none"} 
            value={formData.aciklama} 
            onChange={e => setFormData({...formData, aciklama: e.target.value})} 
            placeholder="Kullanıcı adı ve şifre talebi için ek bilgi..." 
          />
        </div>

        <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex items-start gap-3">
            <Wifi size={20} className="text-indigo-600 mt-0.5 shrink-0" />
            <p className="text-[10px] text-indigo-800 font-bold leading-relaxed uppercase">
                Talebiniz yönetici ekranına düşecektir. Kullanıcı bilgileri tanımlandığında sistemden veya saha sorumlusundan bilgi alabilirsiniz.
            </p>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full bg-slate-900 text-white font-black py-4 rounded-xl flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl hover:bg-black uppercase tracking-widest text-lg"
        >
          {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : <CheckCircle2 size={24} />}
          TALEBİ GÖNDER
        </button>
      </form>
    </div>
  );
};
