import React, { useState } from 'react';
import { 
  Bus, Settings, RefreshCw, AlertTriangle, Calendar, Filter, Search,
  Share2, Shield, Activity, Radio, BarChart2, Users, FileCheck, CheckCircle
} from 'lucide-react';
import { BusRoute, CrowdReport, DataSource, AnomalyEvent, DelayTrendPoint } from '../types';
import MapMock from './MapMock';
import { DelayTrendLineChart } from './MyCharts';
import { getRouteDataSources } from '../data';

interface AdminDashboardProps {
  routes: BusRoute[];
  reports: CrowdReport[];
  dataSources: DataSource[];
  anomalies: AnomalyEvent[];
  delayTrends: DelayTrendPoint[];
  onVerifyReport: (id: string) => void;
}

export default function AdminDashboard({
  routes,
  reports,
  dataSources,
  anomalies,
  delayTrends,
  onVerifyReport
}: AdminDashboardProps) {
  const [selectedRouteFilter, setSelectedRouteFilter] = useState<string>('全部');
  const [selectedMapRoute, setSelectedMapRoute] = useState<string | undefined>(undefined);
  const [isAutoUpdate, setIsAutoUpdate] = useState(true);
  const [dateVal, setDateVal] = useState(() => {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const tzPlus8 = new Date(utc + (3600000 * 8));
    const year = tzPlus8.getFullYear();
    const month = String(tzPlus8.getMonth() + 1).padStart(2, '0');
    const day = String(tzPlus8.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });
  const [sourceRouteId, setSourceRouteId] = useState<string>('9025A');

  // Simulated Metrics calculated from the state
  const totalLanes = 128;
  const activeBuses = 1256;
  const punctualityPct = 88.7;
  const anomalyCount = 27;
  const totalReportsCount = 342 + reports.length - 5; // dynamic offset base on real user reports

  const filteredRouteList = selectedRouteFilter === '全部' 
    ? routes 
    : routes.filter(r => r.name === selectedRouteFilter);

  // Helper styles for route status badges
  const getStatusBadge = (status: string) => {
    switch (status) {
      case '正常':
        return <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-bold border border-emerald-500/20">準點</span>;
      case '延遲':
        return <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full font-bold border border-amber-500/20">延遲</span>;
      case '嚴重延遲':
        return <span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full font-bold border border-red-500/20">嚴重延遲</span>;
      default:
        return <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-bold border border-slate-700/60">末班已過</span>;
    }
  };

  return (
    <div className="space-y-5 p-1 text-slate-300">
      
      {/* Top action/filters bar matching Screenshot 4 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#16191f] p-4 rounded-2xl border border-slate-800/60 shadow-md">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">即時監控中心</h1>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">監控公車營運狀況與即時異常校正</p>
        </div>

        {/* Date, Filters, Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Simulated Date Picker */}
          <div className="flex items-center gap-1.5 bg-[#1d222b] border border-slate-800 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <input 
              type="date" 
              value={dateVal} 
              onChange={(e) => setDateVal(e.target.value)}
              className="bg-transparent border-none outline-none font-medium text-slate-100 cursor-pointer text-[11px]"
              style={{ colorScheme: 'dark' }}
            />
          </div>

          {/* Route Filter Dropdown */}
          <div className="flex items-center gap-1.5 bg-[#1d222b] border border-slate-800 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={selectedRouteFilter}
              onChange={(e) => {
                setSelectedRouteFilter(e.target.value);
                setSelectedMapRoute(e.target.value === '全部' ? undefined : e.target.value);
              }}
              className="bg-transparent border-none outline-none font-semibold text-slate-100 cursor-pointer bg-[#1d222b]"
            >
              <option className="bg-[#16191f] text-white font-semibold" value="全部">全部路線</option>
              <option className="bg-[#16191f] text-white font-semibold" value="132">132 路</option>
              <option className="bg-[#16191f] text-white font-semibold" value="172">172 路</option>
              <option className="bg-[#16191f] text-white font-semibold" value="172A">172A 路</option>
              <option className="bg-[#16191f] text-white font-semibold" value="173">173 路</option>
              <option className="bg-[#16191f] text-white font-semibold" value="133">133 路</option>
              <option className="bg-[#16191f] text-white font-semibold" value="133A">133A 路</option>
              <option className="bg-[#16191f] text-white font-semibold" value="9025A">9025A 路</option>
            </select>
          </div>

          {/* Auto Refresh Toggle */}
          <div className="flex items-center gap-2 bg-[#1d222b] border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300">
            <span className="text-slate-400">自動更新</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={isAutoUpdate}
                onChange={(e) => setIsAutoUpdate(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-8 h-4 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-slate-800 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-600 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-indigo-600" />
            </label>
          </div>

          <button className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg shadow-indigo-500/20 transition-all pointer-events-auto">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>手動刷新</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row (Grid Layout matching Row 1) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 select-none font-sans">
        {[
          { title: '營運中路線', value: `${totalLanes} 條`, change: '+4 條', up: true, icon: Bus, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
          { title: '平均準點率', value: `${punctualityPct}%`, change: '+5.4%', up: true, icon: CheckCircle, color: 'text-sky-400 bg-sky-500/10 border-sky-500/20' },
          { title: '異常事件', value: `${anomalyCount} 件`, change: '-3 件', up: false, icon: AlertTriangle, color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
          { title: '即時回報數', value: `${totalReportsCount} 件`, change: '+8.3%', up: true, icon: Users, color: 'text-violet-400 bg-violet-500/10 border-violet-500/20' },
          { title: '資料來源狀態', value: `${dataSources.filter(s => s.status === '正常').length}/${dataSources.length} 正常`, change: '100% 覆蓋', up: true, icon: Radio, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' }
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-[#16191f] p-3.5 rounded-2xl border border-slate-800/60 shadow-md flex flex-col justify-between hover:border-indigo-500/30 transition-all duration-300">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-extrabold text-slate-500 tracking-wider uppercase">{kpi.title}</span>
                <span className={`p-1.5 rounded-xl border ${kpi.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </span>
              </div>
              <div>
                <div className="text-lg font-black text-white font-mono tracking-tight">{kpi.value}</div>
                <div className="flex items-center gap-1 mt-1 text-[9.5px]">
                  <span className={`font-black ${kpi.up ? 'text-emerald-400' : 'text-emerald-400'}`}>
                    {kpi.up ? '▲' : '▼'} {kpi.change}
                  </span>
                  <span className="text-slate-500 font-bold">相對昨日</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Row 2: Live Map, Anomalies Panel, and Data Source Connection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        
        {/* Block A: Vehicle Position Map (Width 3/5 on large screens) */}
        <div className="lg:col-span-3 bg-[#16191f] p-4 rounded-3xl border border-slate-800/60 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white">即時車輛位置地圖</h3>
            <span className="text-[10px] font-bold text-slate-500">點擊車牌可追蹤該班次</span>
          </div>
          <MapMock 
            selectedRouteId={selectedMapRoute} 
            onSelectRoute={(id) => setSelectedMapRoute(id)} 
          />
        </div>

        {/* Block B & C: Anomalies and Data Sources (Width 2/5 on large screens) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          
          {/* Block B: Realtime Anomalies List */}
          <div className="bg-[#16191f] p-4 rounded-3xl border border-slate-800/60 shadow-md flex-1 flex flex-col min-h-[190px]">
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800/80">
              <h3 className="text-sm font-black text-white">即時異常事件報告</h3>
              <span className="text-[9.5px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20 animate-pulse">
                5 筆進行中
              </span>
            </div>

            <div className="space-y-2 overflow-y-auto max-h-[170px] no-scrollbar flex-1">
              {anomalies.map((an) => (
                <div key={an.id} className="flex gap-2.5 p-2 bg-[#1d222b] rounded-xl hover:bg-[#262c38] transition-colors border border-slate-800/50">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${an.type === '嚴重延遲' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : an.type === '延遲' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-slate-200 line-clamp-1">{an.routeName}</span>
                      <span className="text-[9.5px] font-bold font-mono text-slate-500 shrink-0">{an.time}</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-[10.5px] text-slate-400 font-semibold">{an.detail}</p>
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${an.type === '嚴重延遲' ? 'bg-red-500/15 text-red-400 border border-red-500/20' : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'}`}>
                        {an.type}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Block C: Data Source Status List */}
          <div className="bg-[#16191f] p-4 rounded-3xl border border-slate-800/60 shadow-md flex-1 flex flex-col min-h-[190px]">
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <h3 className="text-sm font-black text-white shrink-0">網頁數據來源狀態監控</h3>
                {selectedRouteFilter === '全部' ? (
                  <select 
                    value={sourceRouteId} 
                    onChange={(e) => setSourceRouteId(e.target.value)}
                    className="ml-2 bg-[#1d222b] border border-slate-700/60 text-[10.5px] font-bold text-slate-300 rounded px-1.5 py-0.5 outline-none cursor-pointer"
                  >
                    <option className="bg-[#16191f] text-white font-semibold" value="9025A">9025A路</option>
                    <option className="bg-[#16191f] text-white font-semibold" value="172">172路</option>
                    <option className="bg-[#16191f] text-white font-semibold" value="172A">172A路</option>
                    <option className="bg-[#16191f] text-white font-semibold" value="173">173路</option>
                    <option className="bg-[#16191f] text-white font-semibold" value="132">132路</option>
                    <option className="bg-[#16191f] text-white font-semibold" value="133">133路</option>
                    <option className="bg-[#16191f] text-white font-semibold" value="133A">133A路</option>
                  </select>
                ) : (
                  <span className="text-[11px] font-black text-indigo-400 bg-indigo-500/10 px-2 py-0.5 border border-indigo-500/20 rounded ml-2">
                    {selectedRouteFilter} 路
                  </span>
                )}
              </div>
              <span className="text-[9.5px] font-bold text-slate-500">更新率: 10s/次</span>
            </div>

            <div className="grid grid-cols-2 gap-2 overflow-y-auto max-h-[170px] no-scrollbar">
              {getRouteDataSources(selectedRouteFilter === '全部' ? sourceRouteId : selectedRouteFilter).map((source) => (
                <div key={source.id} className="p-2.5 bg-[#1d222b] rounded-xl border border-slate-800/50 hover:border-slate-700 transition-all text-left flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center text-xs gap-1">
                      {source.url && source.url !== '#' ? (
                        <a 
                          href={source.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          referrerPolicy="no-referrer"
                          className="font-extrabold text-indigo-400 hover:text-indigo-300 hover:underline truncate pr-1 cursor-pointer flex items-center gap-0.5"
                          title="點擊連結前往"
                        >
                          🔗 <span className="truncate">{source.name}</span>
                        </a>
                      ) : (
                        <span className="font-extrabold text-slate-200 truncate pr-1">{source.name}</span>
                      )}
                      <span className={`w-2 h-2 rounded-full shrink-0 ${source.status === '正常' ? 'bg-emerald-500' : source.status === '延遲' ? 'bg-amber-400' : 'bg-red-500'}`} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mt-1.5 text-[9.5px] font-mono text-slate-500">
                      <span className={`font-bold ${
                        (selectedRouteFilter === '9025A' || (selectedRouteFilter === '全部' && sourceRouteId === '9025A')) && source.name === '桃園公車動態'
                          ? 'text-rose-400 bg-rose-500/10 border border-rose-500/20'
                          : source.status === '正常' ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' : 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
                      } px-1.5 py-0.2 rounded`}>
                        {(selectedRouteFilter === '9025A' || (selectedRouteFilter === '全部' && sourceRouteId === '9025A')) && source.name === '桃園公車動態' ? '未更新/錯誤' : '監控連線'}
                      </span>
                      <span className="font-semibold text-slate-400">{source.latency}s 延遲</span>
                    </div>
                    
                    <div className="mt-1 text-[8.5px] text-slate-400 font-sans tracking-tight border-t border-slate-800/60 pt-1 leading-snug">
                      {source.accuracyNote || '正常串接監控中'}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-2 p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[8.5px] text-amber-300 font-bold leading-normal">
              ⚠️ 系統數據與串接聲明：受限於沙盒憑證與連線握手限制，本系統無法直連官方客運系統 GPS API，<strong>上列各即時動態網頁連結「僅供參考」。</strong>本系統主要以群眾「一鍵動態校對」為主體。目前系統呈現的部分歷史乘客回報多項評分數據，係由系統模擬多用戶交叉比對建立之仿真基準數據（用以演示可信度評分與自動校正演算法），並會即時與您發送的最新報告連動交叉比對。
            </div>
          </div>

        </div>
      </div>

      {/* Row 3: Routes Operating Overview, Live Crowd Reports Feed, and delay trend chart */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        
        {/* Block D: Route Operating Overview Table */}
        <div className="lg:col-span-2 bg-[#16191f] p-4 rounded-3xl border border-slate-800/60 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-black text-white">各路線營運指標</h3>
              <span className="text-[10px] text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                點擊過濾地圖
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500">
                    <th className="pb-2 font-bold select-none text-[10.5px]">路線</th>
                    <th className="pb-2 font-bold select-none text-[10.5px]">營運狀態</th>
                    <th className="pb-2 font-bold select-none text-[10.5px]">準點率</th>
                    <th className="pb-2 font-bold select-none text-[10.5px]">正常/延遲</th>
                    <th className="pb-2 font-bold select-none text-[10.5px] text-right">動作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40 font-semibold text-slate-300">
                  {filteredRouteList.map((route) => (
                    <tr 
                      key={route.id} 
                      className={`hover:bg-[#1d222b]/80 cursor-pointer ${selectedMapRoute === route.id ? 'bg-indigo-500/10' : ''}`}
                      onClick={() => setSelectedMapRoute(selectedMapRoute === route.id ? undefined : route.id)}
                    >
                      <td className="py-2.5">
                        <div className="flex flex-col items-start gap-1">
                          <span className="font-extrabold font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md">
                            {route.name}
                          </span>
                          {route.isTrial && (
                            <span className="text-[8px] font-black text-rose-400 bg-rose-500/10 border border-rose-500/20 px-1 py-0.2 rounded" title={route.trialPeriod}>
                              試辦中
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-2.5">{getStatusBadge(route.status)}</td>
                      <td className="py-2.5 font-mono font-bold text-white">{route.punctuality}%</td>
                      <td className="py-2.5 text-[10.5px] font-mono pr-2 text-slate-400">
                        <span className="text-emerald-400 font-extrabold">{route.normalBuses}</span>
                        <span className="text-slate-600 mx-0.5">/</span>
                        <span className="text-red-400 font-extrabold">{route.activeBuses - route.normalBuses > 0 ? route.activeBuses - route.normalBuses : 0}</span>
                      </td>
                      <td className="py-2.5 text-right">
                        <button className="text-[10px] text-indigo-400 font-bold hover:underline transition-all">
                          {selectedMapRoute === route.id ? '取消鎖定' : '地圖追蹤'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-2 text-center border-t border-slate-800/80">
            <span className="text-[10px] text-slate-500 font-bold">目前共列出 {routes.length} 條核心服務線</span>
          </div>
        </div>

        {/* Block E: Live Crowdsouced Reports Feed (Updates dynamically!) */}
        <div className="lg:col-span-1.5 lg:col-span-2 bg-[#16191f] p-4 rounded-3xl border border-slate-800/60 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-black text-white">最新使用者回報動態</h3>
              <span className="text-[9.5px] font-bold text-slate-500">雙向核對修正中</span>
            </div>

            <div className="space-y-2.5 overflow-y-auto max-h-[220px] pr-1.5 no-scrollbar">
              {reports.map((rep) => {
                let catColor = 'bg-slate-800 text-slate-300 border-slate-700';
                if (rep.category === '公車已離站') catColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
                if (rep.category === '班次延遲') catColor = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
                if (rep.category === '班次未出現') catColor = 'bg-red-500/10 text-red-400 border-red-500/20';

                return (
                  <div key={rep.id} className="p-3 bg-[#1d222b] rounded-2xl hover:bg-[#262c38] transition-colors border border-slate-850/55 space-y-1.5 relative group">
                    <div className="flex items-center justify-between text-[10px] font-bold">
                      <span className={`px-2 py-0.5 rounded-lg border text-[9px] ${catColor}`}>
                        {rep.category}
                      </span>
                      <span className="text-slate-500 font-mono">{rep.time}</span>
                    </div>

                    <div className="text-[11.5px] font-bold text-white">
                      {rep.routeName} • <span className="text-slate-400 font-semibold">{rep.stationName}</span>
                    </div>

                    <p className="text-[10.5px] text-slate-400 font-semibold italic truncate">
                      "{rep.content}"
                    </p>

                    <div className="flex justify-between items-center text-[9px] text-slate-500 font-bold pt-1.5 border-t border-slate-800/80">
                      <span>👤 {rep.user} ({rep.anonymous ? '匿名' : '已登入'})</span>
                      <div className="flex items-center gap-1.5">
                        {rep.status === '待審核' ? (
                          <button 
                            onClick={() => onVerifyReport(rep.id)}
                            className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white px-2 py-0.5 rounded text-[9.5px] font-black transition-all shadow-md shadow-indigo-500/10"
                          >
                            核實並廣播
                          </button>
                        ) : (
                          <span className="text-emerald-400 flex items-center gap-0.5 font-black text-[9.5px]">
                            ✓ 已校對廣播 
                          </span>
                        )}
                        <span className="bg-slate-800 text-slate-350 px-1.5 py-0.2 rounded font-mono">👍 {rep.likes}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-2 text-center text-[10px] text-slate-500 font-semibold border-t border-slate-800/80">
            * 凡待核實項目，管理員點擊「核實並廣播」即可更新前台預估到站時間
          </div>
        </div>

        {/* Block F: Delay Trend Chart Line */}
        <div className="lg:col-span-1.5 bg-[#16191f] p-4 rounded-3xl border border-slate-800/60 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-black text-white">延遲趨勢 (近 6 小時)</h3>
              <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400 bg-[#1d222b] border border-slate-800 px-1.5 py-0.5 rounded">
                <span>近 6 小時</span>
              </div>
            </div>

            {/* Render direct line trend component */}
            <div className="w-full h-[150px] mb-2 bg-[#16191f]">
              <DelayTrendLineChart data={delayTrends} />
            </div>

            {/* Custom chart legend block below to matches designs */}
            <div className="flex items-center justify-around text-[10px] pt-1.5 font-bold text-slate-400 border-t border-slate-800/80">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-1.5 bg-[#10b981] rounded-full" />
                <span>132 路線</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-1.5 bg-[#3b82f6] rounded-full" />
                <span>172 路線</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-1.5 bg-[#f59e0b] rounded-full" />
                <span>9025A 路線</span>
              </div>
            </div>
          </div>

          <div className="pt-2 text-center text-[10px] text-slate-500 font-semibold">
             📊 Y軸：平均延遲分鐘 / X軸：時段
          </div>
        </div>

      </div>

    </div>
  );
}
