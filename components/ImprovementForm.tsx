
import React, { useState, useRef } from 'react';
import { ImprovementReport, DurumSecenekleri } from '../types';
import { Send, Loader2, Star, Camera, MapPin, CheckCircle, X } from 'lucide-react';

interface ImprovementFormProps {
  ekipKodu: string;
  sheetUrl?: string;
  onReportAdded: (report: ImprovementReport) => void;
  onComplete: () => void;
}

export const ImprovementForm: React.FC<ImprovementFormProps> = ({ ekipKodu, sheetUrl, onReportAdded, onComplete }) => {
  const [formData, setFormData] = useState({
    yerlesimAdi: '',
    bakimTarihi: new Date().toISOString().split('T')[0],
    kabloDurumu: 'İYİ',
    menholDurumu: 'İYİ',
    direkDurumu: 'İYİ',
    direkDonanimDurumu: 'İYİ',
    kutuKabinDurumu: 'İYİ',
    takdirPuani: 5
  });
  
  const [photo, setPhoto] = useState<string | null>(null);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGetLocation = () => {
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setLocation({ lat: p.coords.latitude, lng: p.coords.longitude });
        setGettingLocation(false);
      },
      () => {
        alert("Konum alınamadı.");
        setGettingLocation(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newReport: ImprovementReport = {
      id: crypto.randomUUID(),
      ...formData,
      photo: photo || undefined,
      location: location || undefined,
      ekipKodu,
      timestamp: new Date().toLocaleString('tr-TR'),
      status: 'sent',
      reportType: 'improvement'
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
        console.error("Improvement submission error:", err);
      }
    }

    onReportAdded(newReport);
    setIsSubmitting(false);
    onComplete();
  };

  const inputClass = "w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 font-bold focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-sm";
  const labelClass = "text-[10px] font-black text-slate-500 uppercase mb-1 block tracking-wider";

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="bg-emerald-600 p-5 text-white">
        <h3 className="font-black flex items-center gap-2 text-lg uppercase tracking-tight">
          <CheckCircle size={22} />
          PASİF ARIZA VE İYİLEŞTİRME
        </h3>
        <p className="text-[10px] text-emerald-100 font-bold mt-1 uppercase tracking-widest opacity-80">Düzenli Bakım ve Tespit Raporu</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className={labelClass}>Yerleşim Yeri veya Sahanın Adı</label>
            <input required type="text" className={inputClass} value={formData.yerlesimAdi} onChange={e => setFormData({...formData, yerlesimAdi: e.target.value})} placeholder="Örn: Kadıköy Merkez / SH-04" />
          </div>
          
          <div>
            <label className={labelClass}>Bakım Yapıldığı Tarih</label>
            <input required type="date" className={inputClass} value={formData.bakimTarihi} onChange={e => setFormData({...formData, bakimTarihi: e.target.value})} />
          </div>

          <div>
            <label className={labelClass}>Takdir Puanı (1-10)</label>
            <div className="flex items-center gap-2">
               <input type="range" min="1" max="10" className="flex-1 accent-emerald-600" value={formData.takdirPuani} onChange={e => setFormData({...formData, takdirPuani: parseInt(e.target.value)})} />
               <span className="font-black text-emerald-600 text-lg w-8 text-center">{formData.takdirPuani}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { id: 'kabloDurumu', label: 'Kablo Durumu' },
            { id: 'menholDurumu', label: 'Menhol/Ek Odası' },
            { id: 'direkDurumu', label: 'Direk Durumu' },
            { id: 'direkDonanimDurumu', label: 'Direk Donanım' },
            { id: 'kutuKabinDurumu', label: 'Kutu / Kabin' }
          ].map(field => (
            <div key={field.id}>
              <label className={labelClass}>{field.label}</label>
              <select className={inputClass} value={(formData as any)[field.id]} onChange={e => setFormData({...formData, [field.id]: e.target.value})}>
                {DurumSecenekleri.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          ))}
        </div>

        {photo && (
          <div className="relative rounded-xl overflow-hidden border-2 border-emerald-100">
            <img src={photo} alt="Bakım Foto" className="w-full h-40 object-cover" />
            <button type="button" onClick={() => setPhoto(null)} className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full"><X size={14}/></button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <button type="button" onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center justify-center gap-1 border-2 border-dashed p-3 rounded-xl border-slate-200 text-slate-500 hover:bg-emerald-50 hover:border-emerald-200 transition-all">
            <Camera size={20} />
            <span className="text-[9px] font-black uppercase">FOTO EKLE</span>
          </button>
          <button type="button" onClick={handleGetLocation} className={`flex flex-col items-center justify-center gap-1 border-2 border-dashed p-3 rounded-xl transition-all ${location ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'border-slate-200 text-slate-500'}`}>
            {gettingLocation ? <Loader2 className="animate-spin" size={20} /> : <MapPin size={20} />}
            <span className="text-[9px] font-black uppercase">{location ? 'KONUM TAMAM' : 'KONUM EKLE'}</span>
          </button>
          <input type="file" accept="image/*" capture="environment" className="hidden" ref={fileInputRef} onChange={handlePhotoUpload} />
        </div>

        <button type="submit" disabled={isSubmitting} className="w-full bg-slate-900 text-white font-black py-4 rounded-xl flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl hover:bg-black uppercase tracking-widest">
          {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
          İYİLEŞTİRMEYİ KAYDET
        </button>
      </form>
    </div>
  );
};
