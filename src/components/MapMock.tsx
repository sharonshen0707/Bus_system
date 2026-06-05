import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bus, Clock, Phone, AlertTriangle, ShieldCheck, Compass, Layers, Info, Maximize2, Minimize2 } from 'lucide-react';

interface MapMockProps {
  onSelectRoute?: (routeId: string) => void;
  selectedRouteId?: string;
}

export default function MapMock({ onSelectRoute, selectedRouteId }: MapMockProps) {
  // Tabs: "" (All Overview) or individual route IDs
  const [hoveredBus, setHoveredBus] = useState<any>(null);
  const [clickedBus, setClickedBus] = useState<any>(null);
  const [selectedStation, setSelectedStation] = useState<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Definition of the 7 NCU routes with their color schemes and display attributes
  const routePaths = [
    {
      id: '132',
      name: '132',
      color: '#10b981', // green
      themeColor: 'emerald',
      enName: 'Chungli Bus Station ➔ National Central University',
      from: '中壢公車站',
      to: '中央大學',
      operators: '中壢客運 (03-425-5722) / 桃園客運 (03-375-3711)',
      interval: '尖峰 15 分, 離峰 30 分鐘',
      timetable: {
        weekday: { outbound: '06:15 - 22:25', inbound: '06:35 - 22:50' },
        holiday: { outbound: '07:00 - 22:00', inbound: '07:25 - 22:25' }
      },
      stations: [
        { name: '中壢公車站', id: 'st-132-1' },
        { name: '第一銀行', id: 'st-132-2' },
        { name: '第一市場', id: 'st-132-3' },
        { name: '舊社', id: 'st-132-4' },
        { name: '新明國中(民族路)', id: 'st-132-5' },
        { name: '廣興', id: 'st-132-6' },
        { name: '仁愛新村', id: 'st-132-7' },
        { name: '青果市場', id: 'st-132-8' },
        { name: '五權', id: 'st-132-9' },
        { name: '祐民醫院', id: 'st-132-10' },
        { name: '高雙里', id: 'st-132-11' },
        { name: '三民五興路口', id: 'st-132-12' },
        { name: '土地公廟', id: 'st-132-13' },
        { name: '三民中正路口', id: 'st-132-14' },
        { name: '中央大學正門', id: 'st-132-15' },
        { name: '中央大學觀景台', id: 'st-132-16' },
        { name: '中央大學後門', id: 'st-132-17' },
        { name: '中央大學依仁堂', id: 'st-132-18' },
        { name: '中大湖', id: 'st-132-19' },
        { name: '中央大學警衛室', id: 'st-132-20' }
      ]
    },
    {
      id: '172',
      name: '172',
      color: '#f97316', // orange
      themeColor: 'orange',
      enName: 'National Central University ➔ THSR Taoyuan Station',
      from: '中央大學',
      to: '高鐵桃園站',
      operators: '中壢客運 (03-425-5722) / 桃園客運 (03-375-3711)',
      interval: '班距 120 - 130 分鐘',
      timetable: {
        weekday: { outbound: '07:30 - 17:50', inbound: '08:00 - 18:20' },
        holiday: { outbound: '09:30 - 17:50', inbound: '10:00 - 18:20' }
      },
      stations: [
        { name: '中央大學警衛室', id: 'st-172-1' },
        { name: '中大湖', id: 'st-172-2' },
        { name: '中央大學依仁堂', id: 'st-172-3' },
        { name: '中央大學後門', id: 'st-172-4' },
        { name: '中央大學觀景台', id: 'st-172-5' },
        { name: '中央大學正門', id: 'st-172-6' },
        { name: '潤泰公司', id: 'st-172-7' },
        { name: '三座厝', id: 'st-172-8' },
        { name: '三民里', id: 'st-172-9' },
        { name: '崎頂', id: 'st-172-10' },
        { name: '三宏', id: 'st-172-11' },
        { name: '水圳頭', id: 'st-172-12' },
        { name: '內厝', id: 'st-172-13' },
        { name: '聖德路口', id: 'st-172-14' },
        { name: '領航南文德路口', id: 'st-172-15' },
        { name: '領航南公園路口', id: 'st-172-16' },
        { name: '青埔', id: 'st-172-17' },
        { name: '青埔致遠一路口', id: 'st-172-18' },
        { name: '中厝', id: 'st-172-19' },
        { name: '高鐵桃園站', id: 'st-172-20' }
      ]
    },
    {
      id: '172A',
      name: '172A',
      color: '#a855f7', // purple
      themeColor: 'purple',
      enName: 'Chung Yuan Christian Univ ➔ THSR ➔ Central Univ',
      from: '中原大學',
      to: '中央大學',
      operators: '中壢客運 (03-425-5722) / 桃園客運 (03-375-3711)',
      interval: '固定班次 (試辦聯合營運)',
      timetable: {
        weekday: { outbound: '08:10, 12:10, 16:10', inbound: '09:20, 13:20, 17:20' },
        holiday: { outbound: '無行駛', inbound: '無行駛' }
      },
      stations: [
        { name: '中原大學全人村', id: 'st-172a-1' },
        { name: '中原大學信實宿舍', id: 'st-172a-2' },
        { name: '普忠路', id: 'st-172a-3' },
        { name: '中園育樂街口', id: 'st-172a-4' },
        { name: '中園福州二街口', id: 'st-172a-5' },
        { name: '中福派出所', id: 'st-172a-6' },
        { name: '啟英高中', id: 'st-172a-7' },
        { name: '玉尊宮', id: 'st-172a-8' },
        { name: '土地宮', id: 'st-172a-9' },
        { name: '桃園大圳橋', id: 'st-172a-10' },
        { name: '萬能科技大學', id: 'st-172a-11' },
        { name: '賴厝', id: 'st-172a-12' },
        { name: '謝厝', id: 'st-172a-13' },
        { name: '大江購物中心', id: 'st-172a-14' },
        { name: '鄉界', id: 'st-172a-15' },
        { name: '寶城', id: 'st-172a-16' },
        { name: '上岡崎', id: 'st-172a-17' },
        { name: '岡崎', id: 'st-172a-18' },
        { name: '青昇路一段132巷口', id: 'st-172a-19' },
        { name: '青埔致遠一路口', id: 'st-172a-20' },
        { name: '中厝', id: 'st-172a-21' },
        { name: '高鐵桃園站', id: 'st-172a-22' },
        { name: '中厝', id: 'st-172a-23' },
        { name: '青埔致遠一路口', id: 'st-172a-24' },
        { name: '青埔', id: 'st-172a-25' },
        { name: '領航南公園路口', id: 'st-172a-26' },
        { name: '領航南文德路口', id: 'st-172a-27' },
        { name: '桃園國際棒球場', id: 'st-172a-28' },
        { name: '聖德路口', id: 'st-172a-29' },
        { name: '內厝', id: 'st-172a-30' },
        { name: '水圳頭', id: 'st-172a-31' },
        { name: '三宏', id: 'st-172a-32' },
        { name: '崎頂', id: 'st-172a-33' },
        { name: '三民里', id: 'st-172a-34' },
        { name: '三座厝', id: 'st-172a-35' },
        { name: '潤泰公司', id: 'st-172a-36' },
        { name: '中央大學正門', id: 'st-172a-37' },
        { name: '中央大學警衛室', id: 'st-172a-38' },
        { name: '中大湖', id: 'st-172a-39' },
        { name: '中央大學依仁堂', id: 'st-172a-40' },
        { name: '中央大學後門', id: 'st-172a-41' },
        { name: '中央大學觀景台', id: 'st-172a-42' }
      ]
    },
    {
      id: '173',
      name: '173',
      color: '#64748b', // grey
      themeColor: 'slate',
      enName: 'Central Univ ➔ THSR Taoyuan Station (via Linghang N. Rd)',
      from: '中央大學',
      to: '高鐵桃園站',
      operators: '桃園客運 (03-375-3711) / 中壢客運 (03-425-5722)',
      interval: '例假日及停課期間停駛 (平日營運)',
      timetable: {
        weekday: { outbound: '07:05 - 17:15', inbound: '07:45 - 18:00' },
        holiday: { outbound: '停駛', inbound: '停駛' }
      },
      stations: [
        { name: '中央大學警衛室', id: 'st-173-1' },
        { name: '中大湖', id: 'st-173-2' },
        { name: '中央大學依仁堂', id: 'st-173-3' },
        { name: '中央大學後門', id: 'st-173-4' },
        { name: '中央大學觀景台', id: 'st-173-5' },
        { name: '中央大學正門', id: 'st-173-6' },
        { name: '潤泰公司', id: 'st-173-7' },
        { name: '三座厝', id: 'st-173-8' },
        { name: '三民里', id: 'st-173-9' },
        { name: '崎頂', id: 'st-173-10' },
        { name: '三宏', id: 'st-173-11' },
        { name: '水圳頭', id: 'st-173-12' },
        { name: '內厝', id: 'st-173-13' },
        { name: '聖德路口', id: 'st-173-14' },
        { name: '捷運桃園體育園區站(領航北路)', id: 'st-173-15' },
        { name: '永裕路口', id: 'st-173-16' },
        { name: '領航北民權路口', id: 'st-173-17' },
        { name: '青埔國中', id: 'st-173-18' },
        { name: '高鐵桃園站', id: 'st-173-19' }
      ]
    },
    {
      id: '133',
      name: '133',
      color: '#0284c7', // blue
      themeColor: 'sky',
      enName: 'Chungli Bus Station ➔ National Central University',
      from: '中壢客運中壢總站',
      to: '中央大學',
      operators: '中壢客運 (03-425-5722)',
      interval: '尖峰 20-30 分, 離峰 40-60 分鐘',
      timetable: {
        weekday: { outbound: '06:25 - 22:15', inbound: '06:50 - 22:40' },
        holiday: { outbound: '07:15 - 22:00', inbound: '07:40 - 22:25' }
      },
      stations: [
        { name: '中壢客運中壢總站', id: 'st-133-1' },
        { name: '第一銀行', id: 'st-133-2' },
        { name: '第一市場', id: 'st-133-3' },
        { name: '舊社', id: 'st-133-4' },
        { name: '新明國中(民族路)', id: 'st-133-5' },
        { name: '廣興', id: 'st-133-6' },
        { name: '仁愛新村', id: 'st-133-7' },
        { name: '青果市場', id: 'st-133-8' },
        { name: '五權', id: 'st-133-9' },
        { name: '祐民醫院', id: 'st-133-10' },
        { name: '高雙里', id: 'st-133-11' },
        { name: '三民五興路口', id: 'st-133-12' },
        { name: '土地公廟', id: 'st-133-13' },
        { name: '三民中正路口', id: 'st-133-14' },
        { name: '中央大學正門', id: 'st-133-15' },
        { name: '中央大學警衛室', id: 'st-133-16' },
        { name: '中大湖', id: 'st-133-17' },
        { name: '中央大學依仁堂', id: 'st-133-18' },
        { name: '中央大學後門', id: 'st-133-19' },
        { name: '中央大學觀景台', id: 'st-133-20' }
      ]
    },
    {
      id: '133A',
      name: '133A',
      color: '#f43f5e', // rose
      themeColor: 'rose',
      enName: 'Chungli ➔ NCU (via Old Street Creek Station)',
      from: '中壢客運中壢總站',
      to: '中央大學',
      operators: '中壢客運 (03-425-5722)',
      interval: '經老街溪捷運站 每日固定班次',
      timetable: {
        weekday: { outbound: '07:20, 10:40, 14:40', inbound: '08:00, 11:20, 15:20' },
        holiday: { outbound: '08:20, 11:40', inbound: '09:00, 12:20' }
      },
      stations: [
        { name: '中壢客運中壢總站', id: 'st-133a-1' },
        { name: '中央延平路口', id: 'st-133a-2' },
        { name: '中央新生路口', id: 'st-133a-3' },
        { name: '捷運老街溪站(中央西路)', id: 'st-133a-4' },
        { name: '民權路口', id: 'st-133a-5' },
        { name: '新明國小', id: 'st-133a-6' },
        { name: '曉明幼稚園', id: 'st-133a-7' },
        { name: '華宏補習班', id: 'st-133a-8' },
        { name: '中壢高中(中央西路)', id: 'st-133a-9' },
        { name: '中壢高中(志廣路)', id: 'st-133a-10' },
        { name: '天祥醫院(志廣路)', id: 'st-133a-11' },
        { name: '三民', id: 'st-133a-12' },
        { name: '中央大學正門', id: 'st-133a-13' },
        { name: '中央大學警衛室', id: 'st-133a-14' },
        { name: '中大湖', id: 'st-133a-15' },
        { name: '中央大學依仁堂', id: 'st-133a-16' },
        { name: '中央大學後門', id: 'st-133a-17' },
        { name: '中央大學觀景台', id: 'st-133a-18' }
      ]
    },
    {
      id: '9025A',
      name: '9025A',
      color: '#ec4899', // pink
      themeColor: 'pink',
      enName: 'Chungli Bus Station ➔ Songshan Airport',
      from: '中壢公車站',
      to: '松山機場',
      operators: '中壢客運 (03-425-5722) / 指南客運 (02-2433-6111)',
      interval: '國道路線班表, 尖峰 10-15 分鐘',
      timetable: {
        weekday: { outbound: '05:40 - 22:30', inbound: '06:40 - 23:40' },
        holiday: { outbound: '06:10 - 22:00', inbound: '07:10 - 23:05' }
      },
      stations: [
        { name: '中壢公車站', id: 'st-9025a-1' },
        { name: '舊社', id: 'st-9025a-2' },
        { name: '新明國中', id: 'st-9025a-3' },
        { name: '中央大學警衛室', id: 'st-9025a-4' },
        { name: '中央大學依仁堂', id: 'st-9025a-5' },
        { name: '宏國大樓', id: 'st-9025a-6' },
        { name: '捷運環北站', id: 'st-9025a-7' },
        { name: '行天宮', id: 'st-9025a-8' },
        { name: '臺北大學(臺北校區)', id: 'st-9025a-9' },
        { name: '松山機場', id: 'st-9025a-10' }
      ]
    }
  ];

  // Dynamic live vehicles list with their reported status & current last stop indicators
  const activeBuses = [
    {
      id: 'bus-132-1',
      routeName: '132',
      from: '中壢公車站',
      to: '中央大學',
      status: '正常',
      speed: '38 km/h',
      delayMins: 0,
      confidence: '高可信度 (92%)',
      passengers: 24,
      lastStop: '五權',
      isOutbound: true
    },
    {
      id: 'bus-132-2',
      routeName: '132',
      from: '中央大學',
      to: '中壢公車站',
      status: '正常',
      speed: '42 km/h',
      delayMins: 1,
      confidence: '高可信度 (90%)',
      passengers: 18,
      lastStop: '中央大學依仁堂',
      isOutbound: false
    },
    {
      id: 'bus-172-1',
      routeName: '172',
      from: '中央大學',
      to: '高鐵桃園站',
      status: '延遲中',
      speed: '12 km/h (路阻)',
      delayMins: 12,
      confidence: '疑似異動 (62%)',
      passengers: 35,
      lastStop: '三民里',
      isOutbound: true
    },
    {
      id: 'bus-172A-1',
      routeName: '172A',
      from: '中原大學',
      to: '中央大學',
      status: '正常',
      speed: '45 km/h',
      delayMins: 0,
      confidence: '中可信度 (81%)',
      passengers: 19,
      lastStop: '寶城',
      isOutbound: false
    },
    {
      id: 'bus-9025A-1',
      routeName: '9025A',
      from: '中壢公車站',
      to: '松山機場',
      status: '正常',
      speed: '58 km/h',
      delayMins: 0,
      confidence: '高可信度 (95%)',
      passengers: 42,
      lastStop: '中央大學警衛室',
      isOutbound: true
    },
    {
      id: 'bus-9025A-2',
      routeName: '9025A',
      from: '松山機場',
      to: '中壢公車站',
      status: '嚴重延遲',
      speed: '0 km/h (塞車)',
      delayMins: 28,
      confidence: '高強度報警 (99%)',
      passengers: 48,
      lastStop: '宏國大樓',
      isOutbound: false
    },
    {
      id: 'bus-173-1',
      routeName: '173',
      from: '中央大學',
      to: '高鐵桃園站',
      status: '末班車已過',
      speed: '──',
      delayMins: 0,
      confidence: '已收班 (100%)',
      passengers: 0,
      lastStop: '青埔國中',
      isOutbound: true
    }
  ];

  // Pick focused route
  const selectedRoute = routePaths.find(r => r.id === selectedRouteId);

  // Filter dynamic vehicles matching current selected filters
  const currentBuses = activeBuses.filter(bus => 
    !selectedRouteId || bus.routeName === selectedRouteId
  );

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  return (
    <div 
      id="map-app-container" 
      className={
        isFullscreen 
          ? "fixed inset-0 z-[9999] w-screen h-screen bg-[#0c0e12] flex flex-col font-sans select-none text-left"
          : "relative w-full h-[540px] bg-[#0c0e12] border border-slate-800/90 rounded-3xl overflow-hidden shadow-2xl flex flex-col font-sans select-none text-left"
      }
    >
      
      {/* MAP HEADER / STATUS CONTROL BAR */}
      <div id="map-control-hdr" className="z-10 bg-[#12151c]/95 border-b border-slate-800/80 px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-500/10 rounded-lg text-indigo-400 border border-indigo-500/20">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-black text-slate-100 flex items-center gap-1.5 uppercase font-mono tracking-wider">
              <span>站牌動態電子位置版</span>
              <span className="text-[9.5px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20 font-sans font-bold flex items-center gap-1">
                ● LIVE 即時監控已就緒
              </span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Dynamic Navigation Tabs inside visual panel */}
          <div className="flex items-center bg-[#181c25] p-1 rounded-xl border border-slate-800 text-xs text-slate-300 gap-0.5">
            <button
              onClick={() => onSelectRoute && onSelectRoute('')}
              className={`px-2.5 py-1 rounded-lg font-black transition-all cursor-pointer ${
                !selectedRouteId 
                  ? 'bg-slate-700 text-white shadow-2xs' 
                  : 'hover:text-slate-100 hover:bg-[#1f2430]'
              }`}
            >
              🗺️ 全線縱覽
            </button>
            <div className="w-[1px] h-3 bg-slate-850 mx-0.5" />
            {routePaths.map(r => (
              <button
                key={`tab-b-${r.id}`}
                onClick={() => onSelectRoute && onSelectRoute(r.id)}
                style={selectedRouteId === r.id ? { borderColor: r.color, color: r.color } : {}}
                className={`px-2 py-1 rounded-lg font-mono font-black transition-all cursor-pointer border ${
                  selectedRouteId === r.id 
                    ? 'bg-slate-800/20 shadow-inner' 
                    : 'border-transparent text-slate-400 hover:text-slate-100'
                }`}
              >
                {r.name}
              </button>
            ))}
          </div>

          {/* Fullscreen Toggle Button */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 bg-[#181c25] hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer flex items-center justify-center shadow-3xs group shrink-0 outline-none"
            title={isFullscreen ? "關閉全螢幕 (ESC)" : "放大成全螢幕"}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
            ) : (
              <Maximize2 className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
            )}
          </button>
        </div>
      </div>

      {/* MAP WORKSPACE */}
      <div id="map-workspace-viewport" className="relative flex-1 flex bg-[#0c0e12] overflow-hidden min-h-0">
        
        {/* VIEW 1: UNIVERSAL ALL-ROUTE STRAIGHT TRACKS OVERVIEW */}
        {!selectedRouteId ? (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
            <div className="bg-[#11141c] border border-slate-800/50 p-4 rounded-2xl">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-3">
                <Compass className="w-3.5 h-3.5 text-blue-400" />
                全桃園客運大中壢校園幹線 — 回報路網即時縱覽
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                以下列出所有一條龍筆直動態路線示意。點擊任何一條客運軌道，即可切換進入「高精度站牌模擬電子板」查看最齊全的站點資訊與平日、假日首末班時刻。
              </p>
            </div>

            <div className="space-y-4">
              {routePaths.map((route) => {
                const buses_on_route = activeBuses.filter(b => b.routeName === route.id);
                return (
                  <div 
                    key={`overview-lane-${route.id}`}
                    onClick={() => onSelectRoute && onSelectRoute(route.id)}
                    className="group bg-[#11141c] hover:bg-[#161a25] transition-all duration-300 border border-slate-800 hover:border-slate-700/80 p-4 rounded-2xl cursor-pointer shadow-sm relative overflow-hidden"
                  >
                    {/* Visual left accent bar matching route color */}
                    <div 
                      className="absolute left-0 top-0 bottom-0 w-1.5" 
                      style={{ backgroundColor: route.color }} 
                    />

                    <div className="flex items-center justify-between mb-3 pl-2">
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-10 h-6 rounded-md flex items-center justify-center text-xs font-black font-mono shadow-xs text-white"
                          style={{ backgroundColor: route.color }}
                        >
                          {route.name}
                        </span>
                        <div>
                          <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1">
                            <span>{route.from}</span>
                            <span className="text-slate-500">➔</span>
                            <span>{route.to}</span>
                          </h4>
                          <span className="text-[9px] font-mono text-slate-500 uppercase font-black">{route.enName}</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-slate-400">
                          共 {route.stations.length} 站
                        </span>
                        <div className="text-[9px] text-slate-500 font-semibold mt-0.5">
                          {buses_on_route.length > 0 ? `🔥 正在追蹤：${buses_on_route.length} 輛車` : '⚪ 暫無營運車載GPS數據'}
                        </div>
                      </div>
                    </div>

                    {/* Compact simple linear strip map for overview */}
                    <div className="relative pt-2 pb-1 px-3">
                      {/* Grey straight backing line */}
                      <div className="absolute left-3 right-3 top-4 h-[4px] bg-slate-800 rounded-full" />
                      
                      {/* Active colored line segment showing length */}
                      <div 
                        className="absolute left-3 top-4 h-[4px] opacity-70 rounded-full transition-all duration-500"
                        style={{ 
                          backgroundColor: route.color,
                          width: `${Math.min(100, Math.max(30, buses_on_route.length * 35))}%` 
                        }}
                      />

                      {/* Display small nodes in sequence */}
                      <div className="relative flex justify-between items-center z-10">
                        {route.stations.map((station, sIdx) => {
                          const hasBus = buses_on_route.some(b => b.lastStop === station.name);
                          const isFirst = sIdx === 0;
                          const isLast = sIdx === route.stations.length - 1;
                          const showLabel = isFirst || isLast || hasBus;

                          return (
                            <div key={`st-ov-${station.id}`} className="relative flex flex-col items-center">
                              {/* Station node bullet */}
                              <div 
                                className={`w-3.5 h-3.5 rounded-full border-2 bg-[#0c0e12] flex items-center justify-center transition-all ${
                                  hasBus 
                                    ? 'border-indigo-400 scale-125 z-20' 
                                    : 'border-slate-700'
                                }`}
                              >
                                {hasBus && (
                                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
                                )}
                              </div>

                              {/* Stop text label (only first, last, or active bus stops to prevent chaos) */}
                              {showLabel && (
                                <span className={`absolute top-4 text-[9px] whitespace-nowrap font-black tracking-tight ${
                                  hasBus 
                                    ? 'text-indigo-400 bg-indigo-950/80 px-1.5 py-0.5 rounded border border-indigo-900/40 z-30' 
                                    : 'text-slate-500'
                                }`}>
                                  {station.name}
                                </span>
                              )}

                              {/* Realtime Bus indicator placement overlay */}
                              {hasBus && (
                                <div className="absolute -top-7 z-30 animate-bounce">
                                  <div className="bg-indigo-500 text-white p-1 rounded-full shadow-lg border border-indigo-400">
                                    <Bus className="w-3 h-3" />
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          
          /* VIEW 2: DEDICATED HIGH FIDELITY ELECTRONIC STRIP-MAP DISPLAY FOR SELECT LINE */
          <div className="flex-1 flex flex-col bg-[#0b0c10] overflow-hidden">
            
            {/* TAIPEI BUS-STYLE HEADER BLOCK */}
            <div 
              className="px-6 py-4 flex items-center justify-between text-white border-b-4 select-none shrink-0"
              style={{ backgroundColor: selectedRoute?.color || '#3b82f6', borderColor: '#ffffff22' }}
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl font-extrabold font-mono tracking-tighter drop-shadow-md">
                  {selectedRoute?.name}
                </span>
                <div className="w-[2px] h-10 bg-white/20 self-center" />
                <div className="text-left">
                  <div className="text-xl font-black tracking-wider flex items-center gap-2">
                    <span>{selectedRoute?.from}</span>
                    <span className="text-white/60">➔</span>
                    <span>{selectedRoute?.to}</span>
                  </div>
                  <div className="text-[11px] font-mono font-semibold text-white/70 uppercase tracking-widest mt-0.5">
                    {selectedRoute?.enName}
                  </div>
                </div>
              </div>
              <div className="text-right text-xs bg-black/20 px-3.5 py-1.5 rounded-xl border border-white/10 hidden md:block">
                <div className="font-bold flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  <span>營運業者資訊</span>
                </div>
                <div className="text-[10px] text-white/80 font-medium mt-0.5">
                  {selectedRoute?.operators}
                </div>
              </div>
            </div>

            {/* LOWER CONTENT AREA: STRIP MAP (LEFT) & TIMETABLE/SIDEBAR (RIGHT, 靠右對齊) */}
            <div className="flex-1 flex flex-col lg:flex-row-reverse overflow-hidden">
              
              {/* RIGHT TIMETABLE / Disclaimers Block (靠右對齊, 營運首末班車卡片小一點) */}
              <div className="w-full lg:w-[245px] bg-[#11141c] border-b lg:border-b-0 lg:border-l border-slate-800/80 p-3 overflow-y-auto no-scrollbar shrink-0 flex flex-col justify-between text-xs space-y-3">
                <div className="space-y-3">
                  
                  {/* Route Information & Simplified Linear Track Map */}
                  <div className="bg-[#090b0f] p-2.5 rounded-xl border border-slate-800/60 text-left space-y-2.5">
                    <div>
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-0.5">路線說明</span>
                      <h4 className="text-[11.5px] font-bold text-white flex items-center gap-1">
                        <span className="font-mono px-1.5 py-0.2 rounded bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 text-[10px]">
                          {selectedRoute?.name} 路
                        </span>
                        <span className="truncate">{selectedRoute?.from} ➔ {selectedRoute?.to}</span>
                      </h4>
                      <p className="text-[10px] font-bold text-slate-400 mt-1 leading-tight">
                        班距班表：{selectedRoute?.interval}
                      </p>
                    </div>

                    {/* Miniature Horizontal Straight Track (一條龍筆直動態路線示意圖) */}
                    <div className="border-t border-slate-800/40 pt-2">
                      <span className="text-[8.5px] font-black text-indigo-400 uppercase tracking-widest block mb-1.5 font-mono">
                        🧭 筆直動態路線示意圖
                      </span>
                      <div className="relative pt-1 pb-1 px-1 bg-black/45 rounded-lg border border-slate-900/60">
                        {/* Grey straight backing line */}
                        <div className="absolute left-2.5 right-2.5 top-[9px] h-[3px] bg-slate-800 rounded-full" />
                        
                        {/* Active line width depending on buses count */}
                        <div 
                          className="absolute left-2.5 top-[9px] h-[3px] opacity-65 rounded-full transition-all duration-300"
                          style={{ 
                            backgroundColor: selectedRoute?.color || '#4f46e5',
                            width: `${Math.min(100, Math.max(35, currentBuses.length * 30))}%` 
                          }}
                        />

                        <div className="relative flex justify-between items-center z-10 font-sans">
                          {selectedRoute?.stations.map((station, sIdx) => {
                            const hasBus = currentBuses.some(b => b.lastStop === station.name);
                            const isFirst = sIdx === 0;
                            const isLast = sIdx === (selectedRoute?.stations.length || 0) - 1;
                            const showLabel = isFirst || isLast || hasBus;

                            return (
                              <div key={`st-mini-${station.id}`} className="relative flex flex-col items-center">
                                {/* Station dot */}
                                <div 
                                  className={`w-1.5 h-1.5 rounded-full border bg-[#090b0f] flex items-center justify-center transition-all ${
                                    hasBus ? 'border-indigo-400 scale-125 z-20 bg-indigo-500' : 'border-slate-600'
                                  }`}
                                />
                                {showLabel && (
                                  <span 
                                    className={`absolute top-2.5 text-[7.5px] tracking-tighter leading-none select-none font-black ${
                                      hasBus 
                                        ? 'text-indigo-400 font-black z-30 bg-slate-950 px-1 rounded-xs' 
                                        : 'text-slate-600 font-semibold'
                                    }`}
                                  >
                                    {station.name.length > 2 ? station.name.substring(0, 2) : station.name}
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Times Grid - Make cards smaller */}
                  <div className="space-y-2">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">營運首末班車時間</span>
                    
                    {/* Weekday Timetable - 小卡片 */}
                    <div className="bg-[#181d28]/95 p-2 rounded-lg border border-slate-800/80 shadow-3xs">
                      <div className="flex items-center justify-between text-[9px] font-black mb-1 text-[#38bdf8]">
                        <span className="flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          <span>平日營運班時刻</span>
                        </span>
                        <span>平日</span>
                      </div>
                      <div className="space-y-0.5 text-[10px] text-slate-300 font-semibold leading-relaxed">
                        <div className="flex justify-between">
                          <span className="text-slate-400">往程：</span>
                          <span>{selectedRoute?.timetable.weekday.outbound}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">回程：</span>
                          <span>{selectedRoute?.timetable.weekday.inbound}</span>
                        </div>
                      </div>
                    </div>

                    {/* Holiday Timetable - 小卡片 */}
                    <div className="bg-[#181d28]/95 p-2 rounded-lg border border-slate-800/80 shadow-3xs">
                      <div className="flex items-center justify-between text-[9px] font-black mb-1 text-[#fbbf24]">
                        <span className="flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          <span>假日營運班時刻</span>
                        </span>
                        <span>假日</span>
                      </div>
                      <div className="space-y-0.5 text-[10px] text-slate-300 font-semibold leading-relaxed">
                        <div className="flex justify-between">
                          <span className="text-slate-400">往程：</span>
                          <span>{selectedRoute?.timetable.holiday.outbound}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">回程：</span>
                          <span>{selectedRoute?.timetable.holiday.inbound}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Operational Directions & Color Legend */}
                  <div className="bg-[#161a25]/60 p-2.5 rounded-lg border border-slate-800/65 space-y-1 text-left">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-0.5">對應圖輯色彩</span>
                    <div className="flex items-center justify-between text-[10px] text-slate-300 font-medium font-semibold">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-1 rounded-xs bg-amber-400" />
                        <span>往程 (黃線)</span>
                      </span>
                      <span className="text-amber-400 font-bold scale-95 pr-1">往 {selectedRoute?.to}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-300 font-medium font-semibold">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-1 rounded-xs bg-rose-500" />
                        <span>返程 (紅線)</span>
                      </span>
                      <span className="text-rose-500 font-bold scale-95 pr-1">往 {selectedRoute?.from}</span>
                    </div>
                  </div>
                </div>

                {/* Taiwanese retro joint operation label at bottom */}
                <div className="pt-1.5 border-t border-slate-800/70 text-[9.5px] text-slate-500 font-bold leading-normal hidden lg:block text-center select-none">
                  <span className="text-[#38bdf8] block font-extrabold">※ 自 115 年 06 月 01 日起</span>
                  <span>中大校園聯合客運動態營運</span>
                </div>
              </div>

              {/* RIGHT HIGH-QUALITY STRIP-MAP GRAPH FOR INTERACTION */}
              <div className="flex-1 flex flex-col p-4 overflow-y-auto no-scrollbar space-y-6 min-h-0 bg-[#07090c]">
                
                {/* TRACK 1: OUTBOUND STRIP TRACK (往程 - GOLDEN/YELLOW LINE) */}
                <div className="bg-[#0f1118]/85 border border-slate-800/60 p-5 rounded-2xl relative">
                  
                  {/* Track label tag */}
                  <div className="absolute top-4 left-4 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black px-2.5 py-0.5 rounded-md flex items-center gap-1 uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    <span>往程行駛軌道 (OUTBOUND PATH) ➔ 往 {selectedRoute?.to}</span>
                  </div>

                  {/* Horizontal Scroll Track */}
                  <div className="overflow-x-auto pt-10 pb-20 no-scrollbar relative w-full mt-4">
                    <div className="flex items-start min-w-max px-8 relative h-[140px]">
                      
                      {/* Backing straight orange/golden pipeline */}
                      <div className="absolute left-12 right-12 top-[14px] h-[5px] bg-[#1a1c22] border-y border-slate-800 rounded-full" />
                      <div className="absolute left-12 right-12 top-[14px] h-[5px] bg-amber-400 opacity-80 rounded-full" />
                      
                      {selectedRoute?.stations.map((station, sIdx) => {
                        // Find if there is an active bus precisely at this outbound stop
                        const matchingBus = currentBuses.find(
                          b => b.lastStop === station.name && b.isOutbound
                        );

                        return (
                          <div 
                            key={`ob-st-${station.id}`} 
                            style={{ width: '72px' }}
                            className="flex flex-col items-center flex-shrink-0 relative group"
                          >
                            {/* Station Bullet Node */}
                            <button
                              onClick={() => setSelectedStation({ ...station, route: selectedRoute.name, isOutbound: true })}
                              className={`w-5 h-5 rounded-full border-4 flex items-center justify-center transition-all duration-300 relative z-10 outline-none ${
                                matchingBus 
                                  ? 'bg-[#0f1118] border-indigo-500 scale-125 hover:border-white shadow-lg' 
                                  : 'bg-[#0f1118] border-amber-400 hover:bg-amber-400/20 hover:scale-110 shadow-xs'
                              }`}
                            >
                              {/* Inner status dot */}
                              <div className={`w-1.5 h-1.5 rounded-full ${matchingBus ? 'bg-indigo-400' : 'bg-transparent'}`} />
                            </button>

                            {/* VERTICAL CHINESE TAIWANESE-STYLE STATION TITLE */}
                            <span 
                              className={`mt-4 text-[11px] font-black tracking-wider leading-relaxed text-center block whitespace-nowrap [writing-mode:vertical-rl] select-none ${
                                matchingBus 
                                  ? 'text-indigo-400 font-extrabold font-sans' 
                                  : 'text-slate-300 hover:text-white transition-colors'
                              }`}
                              style={{ maxHeight: '110px' }}
                            >
                              {station.name}
                            </span>

                            {/* Realtime Bus Pin Overlay */}
                            {matchingBus && (
                              <div 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setClickedBus(matchingBus);
                                }}
                                onMouseEnter={() => setHoveredBus(matchingBus)}
                                onMouseLeave={() => setHoveredBus(null)}
                                className="absolute -top-11 z-30 flex flex-col items-center cursor-pointer hover:scale-110 active:scale-95 transition-all"
                              >
                                {/* Glowing halo check */}
                                <div className="absolute inset-0 bg-indigo-500/30 rounded-full animate-ping -z-10 scale-150" />
                                
                                <div className="bg-indigo-500 border border-indigo-400 shadow-xl px-2.5 py-1 rounded-xl flex items-center gap-1.5 text-white">
                                  <Bus className="w-3.5 h-3.5 animate-bounce" />
                                  <span className="text-[10px] font-black font-mono tracking-wider">{matchingBus.routeName}</span>
                                </div>
                                <div className="w-2 h-2 bg-indigo-500 border-r border-b border-indigo-400 rotate-45 -mt-1 shadow-md" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* TRACK 2: INBOUND STRIP TRACK (返程 - VIBRANT RED LINE) */}
                <div className="bg-[#0f1118]/85 border border-slate-800/60 p-5 rounded-2xl relative">
                  
                  {/* Track label tag */}
                  <div className="absolute top-4 left-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-black px-2.5 py-0.5 rounded-md flex items-center gap-1 uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                    <span>返程行駛軌道 (INBOUND PATH) ➔ 往 {selectedRoute?.from}</span>
                  </div>

                  {/* Horizontal Scroll Track */}
                  <div className="overflow-x-auto pt-10 pb-20 no-scrollbar relative w-full mt-4">
                    <div className="flex items-start min-w-max px-8 relative h-[140px]">
                      
                      {/* Backing straight red pipeline */}
                      <div className="absolute left-12 right-12 top-[14px] h-[5px] bg-[#1a1c22] border-y border-slate-800 rounded-full" />
                      <div className="absolute left-12 right-12 top-[14px] h-[5px] bg-rose-500 opacity-80 rounded-full" />
                      
                      {/* Keep natural reverse station order for inbound commute alignment! */}
                      {[...(selectedRoute?.stations || [])].reverse().map((station, sIdx) => {
                        // Find if there is an active bus precisely at this inbound stop
                        const matchingBus = currentBuses.find(
                          b => b.lastStop === station.name && !b.isOutbound
                        );

                        return (
                          <div 
                            key={`ib-st-${station.id}`} 
                            style={{ width: '72px' }}
                            className="flex flex-col items-center flex-shrink-0 relative group"
                          >
                            {/* Station Bullet Node */}
                            <button
                              onClick={() => setSelectedStation({ ...station, route: selectedRoute.name, isOutbound: false })}
                              className={`w-5 h-5 rounded-full border-4 flex items-center justify-center transition-all duration-300 relative z-10 outline-none ${
                                matchingBus 
                                  ? 'bg-[#0f1118] border-indigo-500 scale-125 hover:border-white shadow-lg' 
                                  : 'bg-[#0f1118] border-rose-500 hover:bg-rose-500/20 hover:scale-110 shadow-xs'
                              }`}
                            >
                              {/* Inner status dot */}
                              <div className={`w-1.5 h-1.5 rounded-full ${matchingBus ? 'bg-indigo-400' : 'bg-transparent'}`} />
                            </button>

                            {/* VERTICAL CHINESE TAIWANESE-STYLE STATION TITLE */}
                            <span 
                              className={`mt-4 text-[11px] font-black tracking-wider leading-relaxed text-center block whitespace-nowrap [writing-mode:vertical-rl] select-none ${
                                matchingBus 
                                  ? 'text-indigo-400 font-extrabold font-sans' 
                                  : 'text-slate-300 hover:text-white transition-colors'
                              }`}
                              style={{ maxHeight: '110px' }}
                            >
                              {station.name}
                            </span>

                            {/* Realtime Bus Pin Overlay */}
                            {matchingBus && (
                              <div 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setClickedBus(matchingBus);
                                }}
                                onMouseEnter={() => setHoveredBus(matchingBus)}
                                onMouseLeave={() => setHoveredBus(null)}
                                className="absolute -top-11 z-30 flex flex-col items-center cursor-pointer hover:scale-110 active:scale-95 transition-all"
                              >
                                {/* Glowing halo check */}
                                <div className="absolute inset-0 bg-indigo-500/30 rounded-full animate-ping -z-10 scale-150" />
                                
                                <div className="bg-indigo-500 border border-indigo-400 shadow-xl px-2.5 py-1 rounded-xl flex items-center gap-1.5 text-white">
                                  <Bus className="w-3.5 h-3.5 animate-bounce" />
                                  <span className="text-[10px] font-black font-mono tracking-wider">{matchingBus.routeName}</span>
                                </div>
                                <div className="w-2 h-2 bg-indigo-500 border-r border-b border-indigo-400 rotate-45 -mt-1 shadow-md" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>

      {/* FLOAT MODAL: DETAILED POPUP CARD FOR BUS STATIONS */}
      <AnimatePresence>
        {selectedStation && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs pointer-events-auto"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-[#161a25]/95 border border-slate-800 shadow-2xl p-6 rounded-3xl max-w-sm w-full text-left"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-[10px] uppercase font-black text-indigo-400 font-mono tracking-widest">
                  📍 電子客運站牌詳情
                </span>
                <button 
                  onClick={() => setSelectedStation(null)}
                  className="text-slate-400 hover:text-white text-sm font-black p-1 bg-slate-850 hover:bg-slate-800 rounded-full w-6 h-6 flex items-center justify-center transition-colors cursor-pointer"
                >
                  ×
                </button>
              </div>

              <div className="my-4 space-y-3">
                <h4 className="text-base font-black text-white flex items-center gap-2">
                  <span>📍</span>
                  <span>{selectedStation.name}</span>
                </h4>
                
                <div className="p-3 bg-[#0d0f14] rounded-2xl border border-slate-850 space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold">目前經停：</span>
                    <span className="font-black text-indigo-400">{selectedStation.route} 路公車</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold">行駛方向：</span>
                    <span className={`font-black ${selectedStation.isOutbound ? 'text-amber-400' : 'text-rose-500'}`}>
                      {selectedStation.isOutbound ? '往程 (往高鐵/松山/終點)' : '返程 (回中壢/普忠/起點)'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold">雙向定位：</span>
                    <span className="text-emerald-400 font-extrabold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> GPS 天線定位優良
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 font-medium leading-relaxed bg-slate-900/40 p-3 rounded-xl border border-slate-850/50">
                  此站牌為中壢客運與桃園客運校園通勤幹線之重要停靠點。電子核對看板已與桃園公車動態系統 (ebus) 以及乘客一鍵報報機制完全對齊，能極其精確地追蹤公車是否「已離站」及「班次延誤」狀態。
                </p>
              </div>

              <button
                onClick={() => setSelectedStation(null)}
                className="w-full bg-slate-800 hover:bg-slate-700 font-bold text-xs py-2.5 rounded-xl text-white transition-all cursor-pointer"
              >
                關閉
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOAT MODAL: DETAILED POPUP CARD FOR SELECTED ACTIVE BUS */}
      <AnimatePresence>
        {clickedBus && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs pointer-events-auto"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-[#12141c]/95 border border-slate-800 shadow-2xl p-6 rounded-3xl max-w-sm w-full text-left"
            >
              {(() => {
                let statusColor = 'text-emerald-400 bg-[#10b981]/10 border-emerald-500/20';
                let dotColor = 'bg-emerald-500';
                if (clickedBus.status === '延遲中') {
                  statusColor = 'text-orange-400 bg-orange-500/10 border-orange-500/20';
                  dotColor = 'bg-orange-500';
                } else if (clickedBus.status === '嚴重延遲') {
                  statusColor = 'text-red-400 bg-red-500/10 border-red-500/20';
                  dotColor = 'bg-red-500';
                } else if (clickedBus.status === '末班車已過') {
                  statusColor = 'text-slate-400 bg-slate-500/10 border-slate-500/20';
                  dotColor = 'bg-slate-400';
                }

                return (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div className="flex items-center gap-1.5">
                        <span className="text-white text-xs font-black font-mono px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700">
                          {clickedBus.routeName} 路
                        </span>
                        <span className="text-[10px] text-slate-400 font-extrabold font-mono uppercase tracking-widest">GPS 專線定位車輛</span>
                      </div>
                      <button 
                        onClick={() => setClickedBus(null)} 
                        className="text-slate-400 hover:text-white text-sm font-black p-1 bg-slate-850 hover:bg-slate-800 rounded-full w-6 h-6 flex items-center justify-center transition-colors cursor-pointer"
                      >
                        ×
                      </button>
                    </div>

                    <div className="space-y-2 text-xs leading-relaxed">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-semibold">起訖點：</span>
                        <span className="text-slate-100 font-extrabold truncate max-w-[160px]">{clickedBus.from} 往 {clickedBus.to}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-semibold">估計速度：</span>
                        <span className="text-slate-200 font-mono font-black">{clickedBus.speed}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-semibold">當前或最近停靠：</span>
                        <span className="text-indigo-400 font-black">📍 {clickedBus.lastStop}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-semibold">當前載客量：</span>
                        <span className="text-slate-300 font-bold font-mono">{clickedBus.passengers} 人在車上</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-semibold">可信度驗證：</span>
                        <span className="text-emerald-400 font-black flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          {clickedBus.confidence}
                        </span>
                      </div>

                      <div className={`mt-3 flex items-center justify-between px-3 py-2 rounded-xl border ${statusColor}`}>
                        <span className="font-extrabold flex items-center gap-1.5 text-[11px]">
                          <span className={`w-1.5 h-1.5 rounded-full ${dotColor} ${clickedBus.status !== '末班車已過' ? 'animate-pulse' : ''}`} />
                          {clickedBus.status}
                        </span>
                        {clickedBus.delayMins > 0 ? (
                          <span className="font-black font-mono text-[11px] text-red-400">延遲 +{clickedBus.delayMins} 分鐘</span>
                        ) : (
                          <span className="font-extrabold text-[11px] text-emerald-400">準點營運</span>
                        )}
                      </div>
                    </div>

                    <p className="text-[10px] text-slate-500 font-bold border-t border-slate-800 pt-3 leading-relaxed">
                      ※ 此 GPS 車載定位數據是由中壢客運動態、桃園市公車處 ebus API 以及大中立乘客「一鍵報報」即時校對回傳折疊而成，能有效修正系統延遲。
                    </p>

                    <button
                      onClick={() => setClickedBus(null)}
                      className="w-full bg-slate-800 hover:bg-slate-700 font-bold text-xs py-2.5 rounded-xl text-white transition-all cursor-pointer"
                    >
                      關閉
                    </button>
                  </div>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER GENERAL LEGEND BAR */}
      <div id="map-legend-footer" className="bg-[#12151c]/90 border-t border-slate-850 px-4 py-2 text-[10px] text-slate-500 font-extrabold flex flex-wrap gap-x-4 gap-y-1.5 items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-slate-400">定位點燈分類：</span>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#10b981]" />
            <span>🟢 正常班次</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#f97316]" />
            <span>🟠 延遲班次</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#ef4444]" />
            <span>🔴 嚴重塞車</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#64748b]" />
            <span>⚫ 離峰收班</span>
          </div>
        </div>
        <div>
          <span>※ 點擊線路軌道站點，立刻查詢詳細公車一條龍即時定位。</span>
        </div>
      </div>

    </div>
  );
}
