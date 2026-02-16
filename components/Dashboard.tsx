
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
import { 
  LayoutGrid, 
  ClipboardList, 
  Settings, 
  Sparkles, 
  Router, 
  AlertTriangle, 
  CheckCircle, 
  Car, 
  Shuffle, 
  Package,
  ChevronDown,
  X,
  Users,
  Trophy
} from 'lucide-react';

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const totalJobsDone = jobCompletions.reduce((acc, curr) => acc + curr.isAdedi, 0);

  const tabs = [
    { id: 'vehicle', label: 'İŞBAŞI', icon: <Car size={16} />, color: 'bg-cyan-700' },
    { id: 'job', label: 'İŞ BİTİR', icon: <CheckCircle size={16} />, color: 'bg-orange-600' },
    { id: 'inventory', label: 'ENVANTER', icon: <Package size={16} />, color: 'bg-emerald-600' },
    { id: 'modem', label: 'MODEM KURULUM', icon: <Router size={16} />, color: 'bg-indigo-600' },
    { id: 'port', label: 'PORT DEĞİŞİM', icon: <Shuffle size={16} />, color: 'bg-violet-700' },
    { id: 'problem', label: 'SORUNLU İŞ BİLDİR', icon: <ClipboardList size={16} />, color: 'bg-blue-600' },
    { id: 'improvement', label: 'İYİLEŞTİRME', icon: <Sparkles size={16} />, color: 'bg-teal-600' },
    { id: 'damage', label: 'HASAR TESPİT', icon: <AlertTriangle size={16} />, color: 'bg-red-600' },
    { id: 'history', label: 'GEÇMİŞ', icon: <LayoutGrid size={16} />, color: 'bg-slate-800' },
    { id: 'settings', label: 'AYAR', icon: <Settings size={16} />, color: 'bg-slate-600' },
  ] as const;

  const currentTab = tabs.find(t => t.id === activeTab) || tabs[0];

  const handleTabChange = (tabId: typeof activeTab) => {
    setActiveTab(tabId);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white rounded-xl p-2.5 shadow-sm border border-slate-200 flex items-center gap-3">
           <div className="bg-slate-900 text-white p-2 rounded-lg"><Users size={16} /></div>
           <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter leading-none">EKİP</p>
              <h3 className="text-xs font-black text-slate-900 font-mono">{ekipKodu}</h3>
           </div>
        </div>
        <div className="bg-white rounded-xl p-2.5 shadow-sm border border-slate-200 flex items-center gap-3">
           <div className="bg-orange-500 text-white p-2 rounded-lg"><Trophy size={16} /></div>
           <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter leading-none">TOPLAM İŞ</p>
              <h3 className="text-sm font-black text-orange-600">{totalJobsDone}</h3>
           </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start">
        <div className="md:hidden w-full sticky top-[72px] z-40">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`w-full flex items-center justify-between p-3 rounded-xl shadow-md border-2 border-white transition-all ${currentTab.color} text-white`}
          >
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-1.5 rounded-lg">{currentTab.icon}</div>
              <div className="text-left">
                <p className="text-[8px] font-black opacity-70 uppercase tracking-tighter">İŞLEM</p>
                <h2 className="text-xs font-black tracking-tight leading-none">{currentTab.label}</h2>
              </div>
            </div>
            {isMenuOpen ? <X size={16} /> : <ChevronDown size={16} />}
          </button>
          {isMenuOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in slide-in-from-top-2 duration-200">
              <div className="grid grid-cols-1 divide-y divide-slate-100 max-h-[60vh] overflow-y-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center gap-3 p-3 transition-colors ${activeTab === tab.id ? 'bg-slate-50' : 'hover:bg-slate-50'}`}
                  >
                    <div className={`p-1.5 rounded-lg text-white ${tab.color}`}>{tab.icon}</div>
                    <span className={`text-[11px] font-black ${activeTab === tab.id ? 'text-slate-900' : 'text-slate-500'}`}>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="hidden md:block w-60 flex-shrink-0 sticky top-20">
          <nav className="bg-white rounded-xl p-1 shadow-sm border border-slate-200 flex flex-col gap-0.5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2 py-2.5 px-3 rounded-lg font-bold transition-all text-[10px] uppercase tracking-wider ${activeTab === tab.id ? `${tab.color} text-white shadow-md` : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <div className="flex-1 w-full animate-in fade-in duration-300">
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
            <div className="space-y-2"><ReportList reports={reports} /></div>
          ) : (
            <ConfigTab sheetUrl={sheetUrl || ''} onUpdate={onUpdateSheetUrl} />
          )}
        </div>
      </div>
    </div>
  );
};
