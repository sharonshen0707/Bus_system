import React, { useState } from 'react';
import { 
  Bus, Monitor, Smartphone, LayoutGrid, CheckCircle2, RefreshCw, 
  Play, Volume2, ShieldCheck, HelpCircle, UserCheck, AlertTriangle
} from 'lucide-react';
import { initialRoutes, initialReports, initialDataSources, initialAnomalies, initialDelayTrends } from './data';
import { BusRoute, CrowdReport, DataSource, AnomalyEvent, DelayTrendPoint, ReportCategory } from './types';
import PassengerPortal from './components/PassengerPortal';
import AdminDashboard from './components/AdminDashboard';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [viewMode, setViewMode] = useState<'split' | 'passenger' | 'admin'>('split');
  
  // Application Data States
  const [routes, setRoutes] = useState<BusRoute[]>(initialRoutes);
  const [reports, setReports] = useState<CrowdReport[]>(initialReports);
  const [dataSources, setDataSources] = useState<DataSource[]>(initialDataSources);
  const [anomalies, setAnomalies] = useState<AnomalyEvent[]>(initialAnomalies);
  const [delayTrends, setDelayTrends] = useState<DelayTrendPoint[]>(initialDelayTrends);

  // System Event Logs for visual interest
  const [logs, setLogs] = useState<string[]>([
    '09:41:30 - [📡 系統] 順利整合其餘 7 個公共交通 Open API API。',
    '09:39:21 - [⚠️ 警告] 第三平台 C API 響應時間達 6.3 秒，權重已自動調降。',
    '09:35:10 - [📱 群眾] 使用者 B 提交「172 路 班次延遲」通報，標記為待審核。',
    '09:21:44 - [📡 系統] 官方網站爬蟲回傳正常 (延遲 1.0s)。'
  ]);

  const addLog = (message: string) => {
    const time = new Date().toLocaleTimeString('zh-TW', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs(prev => [`${time} - ${message}`, ...prev.slice(0, 5)]);
  };

  // Submit report handler (Invoked from Smartphone mockup)
  const handleSubmitReport = (newRep: Omit<CrowdReport, 'id' | 'timestamp' | 'likes' | 'status'>) => {
    const reportId = `rep-${Date.now()}`;
    const reportRecord: CrowdReport = {
      ...newRep,
      id: reportId,
      timestamp: Date.now(),
      likes: 0,
      status: '待審核'
    };

    // Update reports feed
    setReports(prev => [reportRecord, ...prev]);

    // Add visual system log
    addLog(`[📱 乘客一鍵報報] 收到來自「${newRep.user}」的「${newRep.category}」回報，站點：${newRep.stationName}。`);

    // Dynamically affect system metrics based on category to prove high-fidelity coupling!
    const updatedRoutes = routes.map(route => {
      // If student reports 132 bus has left/missed, automatically adjust 132 metrics
      if (newRep.routeName.includes(route.name)) {
        let nextMin = route.estimateMin;
        let cred = route.credibility;
        let confidence = route.confidencePct;

        if (newRep.category === '公車已離站') {
          nextMin = -1; // Flag as already left
          cred = '疑似已過站';
          confidence = 88;
        } else if (newRep.category === '班次延遲') {
          nextMin = Math.min(25, route.estimateMin + 5);
          cred = '疑似異動';
          confidence = 65;
        } else if (newRep.category === '班次未出現') {
          nextMin = -1;
          cred = '疑似異動';
          confidence = 50;
        }

        return {
          ...route,
          estimateMin: nextMin,
          credibility: cred,
          confidencePct: confidence,
          status: (newRep.category === '公車已離站' || newRep.category === '班次未出現') ? '末班車已過' as const : '延遲' as const
        };
      }
      return route;
    });

    setRoutes(updatedRoutes);

    // Create an active anomaly event dynamically
    const anomalyRecord: AnomalyEvent = {
      id: `an-${Date.now()}`,
      routeName: `${newRep.routeName} • ${newRep.category}`,
      fromStation: newRep.stationName,
      toStation: '終點站',
      type: newRep.category === '班次延遲' ? '延遲' : '嚴重延遲',
      detail: `現場旅客回報: "${newRep.content}"`,
      time: newRep.time
    };

    setAnomalies(prev => [anomalyRecord, ...prev]);
  };

  // Like report handler (Passengers upvoting a report they also experienced)
  const handleLikeReport = (id: string) => {
    setReports(prev => prev.map(r => {
      if (r.id === id) {
        addLog(`[👍 乘客驗證] 使用者對回報「${r.category}」按下確認同意，支持票 (+1)`);
        return { ...r, likes: r.likes + 1 };
      }
      return r;
    }));
  };

  // Verify and broadcast report handler (Invoked from Admin panel)
  const handleVerifyReport = (id: string) => {
    setReports(prev => prev.map(r => {
      if (r.id === id) {
        addLog(`[⚖️ 管理授權] 核實並廣播回報 [${r.category}]。到站預估時間已向周邊站牌完成更新廣播！`);
        return { ...r, status: '已處理' as const, likes: r.likes + 10 };
      }
      return r;
    }));

    // Raise general route confidence levels because of verification logic
    setRoutes(prev => prev.map(route => {
      // Find matching route to turn credibility back to "高可信度"
      return {
        ...route,
        credibility: '高可信度' as const,
        confidencePct: Math.min(100, route.confidencePct + 5)
      };
    }));
  };

  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-300 flex flex-col font-sans transition-colors duration-300">
      
      {/* Master SaaS Control Panel Header */}
      <header className="bg-[#16191f] border-b border-slate-800/80 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 select-none shrink-0 shadow-lg shadow-black/20">
        
        {/* Brand System Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <Bus className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-white font-sans">
                公車資訊整合與回報系統
              </span>
              <span className="bg-indigo-500/15 text-indigo-400 font-extrabold text-[9px] px-1.5 py-0.5 rounded-md border border-indigo-500/30 uppercase tracking-widest animate-pulse">
                Sandbox v1.2
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
              「多源API對比 ➔ 群眾一鍵回報 ➔ 智能決策」智慧公共運輸完整閉環模擬沙盒
            </p>
          </div>
        </div>

        {/* Master View Switches */}
        <div className="flex bg-[#0f1115] border border-slate-800 p-1.5 rounded-2xl gap-1">
          <button 
            onClick={() => setViewMode('split')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black tracking-wide transition-all uppercase ${viewMode === 'split' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>🖥️ 雙端互動沙盒</span>
          </button>
          
          <button 
            onClick={() => setViewMode('passenger')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black tracking-wide transition-all uppercase ${viewMode === 'passenger' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Smartphone className="w-4 h-4" />
            <span>📱 僅乘客手機 App</span>
          </button>

          <button 
            onClick={() => setViewMode('admin')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black tracking-wide transition-all uppercase ${viewMode === 'admin' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Monitor className="w-4 h-4" />
            <span>📊 僅管理後台</span>
          </button>
        </div>

      </header>

      {/* Main Workspace Frame */}
      <main className="flex-1 overflow-auto bg-[#0f1115] p-4 lg:p-6 no-scrollbar">

        {/* System Introduction Banner (approx 200 words Taiwanese Traditional Chinese) */}
        <div className="mb-6 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-start md:items-center gap-4 shadow-lg text-left">
          <div className="w-10 h-10 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center shrink-0">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div className="space-y-2 flex-1">
            <h3 className="text-xs font-black text-slate-100 uppercase tracking-widest flex items-center gap-1.5">
              <span>系統操作指引 & 功能簡介</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </h3>
            <p className="text-[10.5px] text-slate-400 font-semibold leading-relaxed">
              本系統為「中大智慧交通與群眾回報整合系統」，專為中央大學核心公車路線（172、172A、173、133、133A、132、9025A）打造。系統結合「多源API數據比對」與「群眾一鍵回報」雙向驗證機制。乘客可透過手機端登入 Google 帳號，快速回報公車已離站、延遲或漏班等即時動態，讓回報歷史被安全記錄並追蹤；管理端則可於即時監控中心對群眾回報進行核實、一鍵廣播修正到站估時並調整班次可信度，形成即時透明、資訊對稱的智慧大眾運輸閉環，全方位改善校園通勤效率。
            </p>
            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-300 p-2.5 rounded-xl text-[10px] font-bold leading-relaxed flex items-start gap-1.5">
              <span className="shrink-0 text-amber-400 font-extrabold">⚠️ 資訊串接與數據來源聲明：</span>
              <span>
                受限於沙盒與通訊權限限制，系統未能與客運原廠 API 即時安全對接，<strong>本系統內提供之公車時刻與動態網頁連結「僅供參考」。</strong> 本系統以「群眾校時回報」為主體。當前介面呈現之部分歷史乘客通報與評分，是以多個虛擬回報作為可信度評分（已建立合理之公車動態仿真基準假數據）進行交叉比對演算；同時也與您在左側手機端發送的即時回報進行互動疊加！
              </span>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          
          {/* MODE A: Split Workspace View (Default Recommended) */}
          {viewMode === 'split' && (
            <motion.div 
              key="split-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch"
            >
              {/* Columns 1-4: Smartphone Interactive Mockup */}
              <div className="xl:col-span-4 flex flex-col items-center justify-center p-3 bg-[#16191f]/50 rounded-3xl border border-slate-800/60 relative">
                
                {/* Visual Guidelines Label */}
                <div className="absolute top-4 left-4 flex items-center gap-2 text-[10.5px] font-bold text-slate-400 select-none bg-[#0f1115] border border-slate-800 px-3 py-1 rounded-full">
                  <span>📱 手機端模擬</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                </div>

                <div className="pt-9 pb-3 w-full">
                  <PassengerPortal 
                    routes={routes} 
                    reports={reports} 
                    dataSources={dataSources}
                    onSubmitReport={handleSubmitReport} 
                    onLikeReport={handleLikeReport} 
                  />
                </div>
              </div>

              {/* Columns 5-12: Full Enterprise Admin Dashboard */}
              <div className="xl:col-span-8 flex flex-col justify-start bg-[#0f1115] text-slate-300 rounded-3xl p-4 lg:p-5 border border-slate-800/55 shadow-2xl overflow-hidden relative">
                
                {/* Floating indicator */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/85 select-none">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-md shadow-indigo-500/40" />
                    <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
                      公車大數據整合與即時監控後台 (Web 控制台)
                    </span>
                  </div>
                  
                  {/* Sync status pills */}
                  <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2.5 py-1 rounded-lg border border-indigo-500/20 font-bold animate-pulse">
                    ⚡ 數據流已聯動 (已連接 {dataSources.length} 核心整合來源)
                  </span>
                </div>

                {/* Main Admin dashboard code inside slate background frame */}
                <div className="flex-1">
                  <AdminDashboard 
                    routes={routes} 
                    reports={reports} 
                    dataSources={dataSources} 
                    anomalies={anomalies} 
                    delayTrends={delayTrends} 
                    onVerifyReport={handleVerifyReport} 
                  />
                </div>
              </div>

            </motion.div>
          )}

          {/* MODE B: Passenger Portal Standalone Mode (Centered phone block) */}
          {viewMode === 'passenger' && (
            <motion.div 
              key="passenger-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="flex justify-center items-center py-6"
            >
              <PassengerPortal 
                routes={routes} 
                reports={reports} 
                dataSources={dataSources}
                onSubmitReport={handleSubmitReport} 
                onLikeReport={handleLikeReport} 
              />
            </motion.div>
          )}

          {/* MODE C: Enterprise Admin Dashboard Standalone Mode */}
          {viewMode === 'admin' && (
            <motion.div 
              key="admin-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="bg-[#0f1115] text-slate-300 p-6 rounded-3xl border border-slate-800/50 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80 select-none">
                <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
                  公車資訊整合平台 • 即時異常統計監督
                </span>
                <span className="text-[10px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2.5 py-1 rounded-xl font-bold">
                  🖥️ 全螢幕系統視角
                </span>
              </div>
              <AdminDashboard 
                routes={routes} 
                reports={reports} 
                dataSources={dataSources} 
                anomalies={anomalies} 
                delayTrends={delayTrends} 
                onVerifyReport={handleVerifyReport} 
              />
            </motion.div>
          )}

        </AnimatePresence>

      </main>

      {/* Footer System Console logs matching Screenshot 4 footer styling elements */}
      <footer className="bg-slate-950 border-t border-slate-900 px-6 py-3.5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shrink-0 select-none text-[11px] text-slate-500">
        
        {/* Dynamic Log Feed */}
        <div className="flex-1 flex flex-col md:flex-row md:items-center gap-2 md:gap-4 overflow-hidden text-left">
          <span className="font-extrabold text-emerald-400 uppercase shrink-0 font-mono tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            SYSTEM EVENT LOGS
          </span>
          <div className="flex-1 truncate font-mono text-slate-300 font-semibold">
            {logs[0]}
          </div>
        </div>

        {/* Info Explaner banner with Middle school names removed */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-[10.5px] font-bold text-slate-500">
            中央大學智慧公車資訊整合網絡
          </span>
          <span className="text-slate-700">|</span>
          <span className="text-[10.5px] font-medium text-slate-600 font-mono">
            SECURE SANDBOX ENVIRONMENT
          </span>
        </div>

      </footer>

    </div>
  );
}
