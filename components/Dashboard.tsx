
import React, { useState } from 'react';
import { ReportForm } from './ReportForm';
import { ImprovementForm } from './ImprovementForm';
import { ModemSetupForm } from './ModemSetupForm';
import { DamageReportForm } from './DamageReportForm';
import { JobCompletionForm } from './JobCompletionForm';
import { VehicleLogForm } from './VehicleLogForm';
import { PortChangeForm } from './PortChangeForm';
import { InventoryForm } from './InventoryForm';
import { ReportList } from './ReportList';
import { ConfigTab } from './ConfigTab';
import { Report, ImprovementReport, ModemSetupReport, DamageReport, JobCompletionReport, VehicleLog, PortChangeReport, InventoryLog } from '../types';
import { LayoutGrid, ClipboardList, Settings, Sparkles, Router, AlertTriangle, CheckCircle, Car, Shuffle, Package } from 'lucide-react';

interface DashboardProps {
  ekipKodu: string;
  reports: Report[];
  improvementReports: ImprovementReport[];
  modemReports: ModemSetupReport[];
  damageReports: DamageReport[];
  jobCompletions: JobCompletionReport[];
  vehicleLogs: VehicleLog[];
  portChanges: PortChangeReport[];
  inventoryLogs: InventoryLog[];
  sheetUrl?: string;
  onReportAdded: (report: Report) => void;
  onImprovementReportAdded: (report: ImprovementReport) => void;
  onModemReportAdded: (report: ModemSetupReport) => void;
  onDamageReportAdded: (report: DamageReport) => void;
  onJobCompletionAdded: (report: JobCompletionReport) => void;
  onVehicleLogAdded: (report: VehicleLog) => void;
  onPortChangeAdded: (report: PortChangeReport) => void;
  onInventoryLogAdded: (log: InventoryLog) => void;
  onUpdateSheetUrl: (url: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  ekipKodu, reports, improvementReports, modemReports, damageReports, 
  jobCompletions, vehicleLogs, portChanges, inventoryLogs, sheetUrl, 
  onReportAdded, onImprovementReportAdded, onModemReportAdded, onDamageReportAdded, 
  onJobCompletionAdded, onVehicleLogAdded, onPortChangeAdded, onInventoryLogAdded, onUpdateSheetUrl 
}) => {
  const [activeTab, setActiveTab] = useState<'problem' | 'improvement' | 'modem' | 'damage' | 'job' | 'vehicle' | 'port' | 'inventory' | 'history' | 'settings'>('vehicle');

  const totalJobsDone = jobCompletions.reduce((acc, curr) => acc + curr.isAdedi, 0);

  const navButtonClass = (tab: typeof activeTab, activeColor: string) => `
    w-full flex items-center gap-3 py-3.5 px-4 rounded-xl font-bold transition-all text-[11px] uppercase tracking-wider
    ${activeTab === tab ? `${activeColor} text-white shadow-lg md:translate-x-1` : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}
  `;

  const tabs = [
    { id: 'vehicle', label: 'İŞBAŞI', icon: <Car size={18} />, color: 'bg-cyan-700' },
    { id: 'job', label: 'İŞ BİTİR', icon: <CheckCircle size={18} />, color: 'bg-orange-600' },
    { id: 'inventory', label: 'ENVANTER', icon: <Package size={18} />, color: 'bg-emerald-600' },
    { id: 'modem', label: 'MODEM', icon: <Router size={18} />, color: 'bg-indigo-600' },
    { id: 'port', label: 'PORT', icon: <Shuffle size={18} />, color: 'bg-violet-700' },
    { id: 'problem', label: 'SORUN', icon: <ClipboardList size={18} />, color: 'bg-blue-600' },
    { id: 'improvement', label: 'İYİLEŞTİRME', icon: <Sparkles size={18} />, color: 'bg-teal-600' },
    { id: 'damage', label: 'HASAR', icon: <AlertTriangle size={18} />, color: 'bg-red-600' },
    { id: 'history', label: 'GEÇMİŞ', icon: <LayoutGrid size={18} />, color: 'bg-slate-800' },
    { id: 'settings', label: 'AYAR', icon: <Settings size={18} />, color: 'bg-slate-600' },
  ] as const;

  return (
    <div className="flex flex-col md:flex-row gap-6 items-start">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 flex-shrink-0 md:sticky md:top-20">
        <nav className="bg-white rounded-2xl p-2 shadow-sm border border-slate-200 flex flex-col gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={navButtonClass(tab.id, tab.color)}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
        
        {/* Quick Stats in Sidebar */}
        <div className="mt-4 bg-slate-900 rounded-2xl p-4 text-white hidden md:block">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Günlük Performans</p>
            <div className="flex justify-between items-end">
                <span className="text-2xl font-black">{totalJobsDone}</span>
                <span className="text-[10px] text-orange-400 font-bold uppercase">TAMAMLANAN</span>
            </div>
            <div className="mt-2 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full" style={{ width: `${Math.min(totalJobsDone * 10, 100)}%` }}></div>
            </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
        {activeTab === 'problem' ? (
          <ReportForm ekipKodu={ekipKodu} sheetUrl={sheetUrl} onReportAdded={onReportAdded} onComplete={() => setActiveTab('history')} />
        ) : activeTab === 'inventory' ? (
          <InventoryForm ekipKodu={ekipKodu} sheetUrl={sheetUrl} onLogAdded={onInventoryLogAdded} onComplete={() => {}} />
        ) : activeTab === 'job' ? (
          <JobCompletionForm ekipKodu={ekipKodu} sheetUrl={sheetUrl} jobCompletions={jobCompletions} onReportAdded={onJobCompletionAdded} onComplete={() => {}} />
        ) : activeTab === 'improvement' ? (
          <ImprovementForm ekipKodu={ekipKodu} sheetUrl={sheetUrl} onReportAdded={onImprovementReportAdded} onComplete={() => setActiveTab('history')} />
        ) : activeTab === 'damage' ? (
          <DamageReportForm ekipKodu={ekipKodu} sheetUrl={sheetUrl} onReportAdded={onDamageReportAdded} onComplete={() => setActiveTab('history')} />
        ) : activeTab === 'modem' ? (
          <ModemSetupForm ekipKodu={ekipKodu} sheetUrl={sheetUrl} onReportAdded={onModemReportAdded} onComplete={() => setActiveTab('history')} />
        ) : activeTab === 'port' ? (
          <PortChangeForm ekipKodu={ekipKodu} sheetUrl={sheetUrl} onReportAdded={onPortChangeAdded} onComplete={() => setActiveTab('history')} />
        ) : activeTab === 'vehicle' ? (
          <VehicleLogForm ekipKodu={ekipKodu} sheetUrl={sheetUrl} onReportAdded={onVehicleLogAdded} onComplete={() => setActiveTab('history')} />
        ) : activeTab === 'history' ? (
          <div className="space-y-4">
             {/* Envanter Kayıtları */}
             <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Envanter Hareketleri</span>
                <div className="h-px bg-slate-200 flex-1"></div>
             </div>
             {inventoryLogs.length === 0 ? (
                 <p className="text-center py-4 text-slate-400 text-[10px] font-bold uppercase">Kayıt yok</p>
             ) : (
                inventoryLogs.map(log => (
                    <div key={log.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-2">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${log.actionType === 'receive' ? 'bg-emerald-100 text-emerald-700' : log.actionType === 'install' ? 'bg-indigo-100 text-indigo-700' : 'bg-red-100 text-red-700'}`}>
                                    <Package size={18} />
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-800 text-xs">{log.serialNumber}</h4>
                                    <p className="text-[10px] text-slate-400 font-bold">{log.timestamp}</p>
                                </div>
                            </div>
                            <span className={`text-[8px] font-black px-2 py-1 rounded uppercase tracking-widest ${
                                log.actionType === 'receive' ? 'bg-emerald-50 text-emerald-600' : log.actionType === 'install' ? 'bg-indigo-50 text-indigo-600' : 'bg-red-50 text-red-600'
                            }`}>
                                {log.actionType === 'receive' ? 'TESLİM ALINDI' : log.actionType === 'install' ? 'KURULDU' : 'İADE ALINDI'}
                            </span>
                        </div>
                        {log.hizmetNo && (
                            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                                <span className="text-[8px] font-black text-slate-400 uppercase block">Hizmet Numarası</span>
                                <p className="text-xs font-bold text-slate-700">{log.hizmetNo}</p>
                            </div>
                        )}
                    </div>
                ))
             )}

             <div className="flex items-center gap-2 mt-8 mb-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Port / Devre Değişimleri</span>
                <div className="h-px bg-slate-200 flex-1"></div>
             </div>
             {portChanges.length === 0 ? (
                 <p className="text-center py-4 text-slate-400 text-[10px] font-bold uppercase">Kayıt yok</p>
             ) : (
                portChanges.map(pc => (
                    <div key={pc.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="bg-violet-100 text-violet-700 p-2 rounded-lg">
                                    <Shuffle size={18} />
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-800 text-xs">Hizmet: {pc.hizmetNo}</h4>
                                    <p className="text-[10px] text-slate-400 font-bold">{pc.timestamp}</p>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 bg-slate-50 p-2 rounded-lg border border-slate-100">
                            <div><span className="text-[8px] font-black text-slate-400 uppercase block">YENİ PORT</span><p className="text-xs font-bold text-slate-700">{pc.yeniPort || '-'}</p></div>
                            <div><span className="text-[8px] font-black text-slate-400 uppercase block">YENİ DEVRE</span><p className="text-xs font-bold text-slate-700">{pc.yeniDevre || '-'}</p></div>
                        </div>
                    </div>
                ))
             )}

             <div className="flex items-center justify-between mt-8 mb-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tamamlanan İşler</span>
                <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-orange-200">
                    Toplam Adet: {totalJobsDone}
                </div>
             </div>
             <div className="space-y-3">
               {jobCompletions.length === 0 ? <p className="text-center py-4 text-slate-400 text-[10px] font-bold uppercase">Kayıt yok</p> : jobCompletions.map(jc => (
                    <div key={jc.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex justify-between items-center transition-transform active:scale-[0.98]">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`text-[8px] font-black px-2 py-0.5 rounded-full ${jc.isTipi === 'ARIZA' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>{jc.isTipi}</span>
                                <h4 className="font-black text-slate-800 text-xs">Hizmet: {jc.hizmetNo}</h4>
                            </div>
                            <p className="text-[10px] text-slate-400 font-bold">{jc.timestamp}</p>
                        </div>
                        <div className="text-right"><p className="text-xl font-black text-slate-900">{jc.isAdedi}</p><p className="text-[8px] font-bold text-slate-400 uppercase">ADET</p></div>
                    </div>
                 ))}
             </div>

             <div className="flex items-center gap-2 mt-8 mb-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Genel Kayıtlar (Sorun/İyileştirme/Hasar)</span>
                <div className="h-px bg-slate-200 flex-1"></div>
             </div>
             <ReportList reports={reports} />
          </div>
        ) : (
          <ConfigTab sheetUrl={sheetUrl || ''} onUpdate={onUpdateSheetUrl} />
        )}
      </div>
    </div>
  );
};
