
import React, { useState, useRef } from 'react';
import { SorunTipi, Report } from '../types';
import { Send, Loader2, AlertTriangle, Camera, MapPin, X } from 'lucide-react';

interface ReportFormProps {
  ekipKodu: string;
  sheetUrl?: string;
  onReportAdded: (report: Report) => void;
  onComplete: () => void;
}

export const ReportForm: React.FC<ReportFormProps> = ({ ekipKodu, sheetUrl, onReportAdded, onComplete }) => {
  const [formData, setFormData] = useState({
    hizmetNo: '',
    saha: '',
    kutu: '',
    sorunTipi: SorunTipi.GPON_SEVIYE_YOK,
    aciklama: ''
  });
  const [photo, setPhoto] = useState<string | null>(null);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const compressImage = (base64Str: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 400; // Base64 için daha küçük boyut (Hücre sınırına sığması için)
        let width = img.width;
        let height = img.height;
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.5));
      };
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string);
        setPhoto(compressed);
      };
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
    if (isSubmitting) return;
    setIsSubmitting(true);

    const newReport: Report = {
      id: crypto.randomUUID(),
      ...formData,
      photo: photo || undefined,
      location: location || undefined,
      ekipKodu,
      timestamp: new Date().toLocaleString('tr-TR'),
      status: 'sent',
      reportType: 'problem'
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
        console.error(err);
      }
    }

    onReportAdded(newReport);
    setIsSubmitting(false);
    onComplete();
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-sm";
  const labelClass = "text-[10px] font-black text-slate-500 uppercase mb-1 block tracking-widest";

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="bg-blue-600 p-6 text-white text-center">
        <h3 className="font-black flex items-center justify-center gap-3 text-xl uppercase tracking-tighter">
          <AlertTriangle size={28} />
          SORUN BİLDİRİMİ
        </h3>
        <p className="text-[10px] font-bold opacity-80 mt-1 uppercase tracking-widest">Saha, Kutu ve Hizmet Bilgilerini Girin</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className={labelClass}>Hizmet Numarası</label>
            <input required type="text" className={inputClass} value={formData.hizmetNo} onChange={e => setFormData({...formData, hizmetNo: e.target.value})} placeholder="88219..." />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Santral / Saha</label>
            <input required type="text" className={inputClass} value={formData.saha} onChange={e => setFormData({...formData, saha: e.target.value})} placeholder="SH-04" />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Kutu / Devre</label>
            <input required type="text" className={inputClass} value={formData.kutu} onChange={e => setFormData({...formData, kutu: e.target.value})} placeholder="K-05" />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Sorun Tipi</label>
            <select className={inputClass} value={formData.sorunTipi} onChange={e => setFormData({...formData, sorunTipi: e.target.value as SorunTipi})}>
              {Object.values(SorunTipi).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className={labelClass}>Açıklama</label>
          <textarea required rows={2} className={inputClass + " resize-none font-medium"} value={formData.aciklama} onChange={e => setFormData({...formData, aciklama: e.target.value})} placeholder="Sorun detayı..." />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button type="button" onClick={() => fileInputRef.current?.click()} className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed p-4 rounded-xl transition-all ${photo ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-blue-50 hover:border-blue-200'}`}>
            <Camera size={24} />
            <span className="text-[10px] font-black uppercase tracking-wider">{photo ? 'DEĞİŞTİR' : 'FOTO ÇEK'}</span>
          </button>
          <button type="button" onClick={handleGetLocation} className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed p-4 rounded-xl transition-all ${location ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-blue-50 hover:border-blue-200'}`}>
            {gettingLocation ? <Loader2 className="animate-spin" size={24} /> : <MapPin size={24} />}
            <span className="text-[10px] font-black uppercase tracking-wider">{location ? 'KONUM TAMAM' : 'KONUM EKLE'}</span>
          </button>
          <input type="file" accept="image/*" capture="environment" className="hidden" ref={fileInputRef} onChange={handlePhotoUpload} />
        </div>

        {photo && (
          <div className="relative rounded-xl overflow-hidden border-2 border-blue-100 shadow-lg group">
            <img src={photo} alt="Önizleme" className="w-full h-32 object-cover" />
            <button type="button" onClick={() => setPhoto(null)} className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full"><X size={16}/></button>
          </div>
        )}

        <button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl hover:bg-black uppercase tracking-widest text-lg border-b-4 border-slate-700"
        >
          {isSubmitting ? <Loader2 className="animate-spin" size={28} /> : <Send size={28} />}
          KAYDET
        </button>
      </form>
    </div>
  );
};
