import React, { useState } from 'react';
import { Bus, MapPin, ZoomIn, ZoomOut, Maximize2, Layers, ShieldCheck } from 'lucide-react';

interface MapMockProps {
  onSelectRoute?: (routeId: string) => void;
  selectedRouteId?: string;
}

export default function MapMock({ onSelectRoute, selectedRouteId }: MapMockProps) {
  const [zooLevel, setZooLevel] = useState<number>(1.0);
  
  // Hover & Click state for vehicles and station pins
  const [hoveredBus, setHoveredBus] = useState<any>(null);
  const [clickedBus, setClickedBus] = useState<any>(null);
  const [selectedPinInfo, setSelectedPinInfo] = useState<any>(null);

  // Definition of the 7 NCU routes with their color schemes and display attributes
  const routePaths = [
    {
      id: '132',
      name: '132',
      color: '#10b981', // green
      themeColor: 'emerald',
      stations: [
        { name: '中壢公車站', cx: 40, cy: 140, id: 'st-132-1' },
        { name: '第一銀行', cx: 55, cy: 140, id: 'st-132-2' },
        { name: '第一市場', cx: 70, cy: 140, id: 'st-132-3' },
        { name: '舊社', cx: 85, cy: 140, id: 'st-132-4' },
        { name: '新明國中(民族路)', cx: 100, cy: 145, id: 'st-132-5' },
        { name: '廣興', cx: 115, cy: 150, id: 'st-132-6' },
        { name: '仁愛新村', cx: 130, cy: 155, id: 'st-132-7' },
        { name: '青果市場', cx: 145, cy: 160, id: 'st-132-8' },
        { name: '五權', cx: 160, cy: 165, id: 'st-132-9' },
        { name: '祐民醫院', cx: 175, cy: 170, id: 'st-132-10' },
        { name: '高雙里', cx: 190, cy: 170, id: 'st-132-11' },
        { name: '三民五興路口', cx: 205, cy: 170, id: 'st-132-12' },
        { name: '土地公廟', cx: 215, cy: 170, id: 'st-132-13' },
        { name: '三民中正路口', cx: 222, cy: 170, id: 'st-132-14' },
        { name: '中央大學正門', cx: 230, cy: 175, id: 'st-132-15' },
        { name: '中央大學觀景台', cx: 330, cy: 205, id: 'st-132-16' },
        { name: '中央大學後門', cx: 310, cy: 195, id: 'st-132-17' },
        { name: '中央大學依仁堂', cx: 290, cy: 185, id: 'st-132-18' },
        { name: '中大湖', cx: 270, cy: 180, id: 'st-132-19' },
        { name: '中央大學警衛室', cx: 250, cy: 180, id: 'st-132-20' }
      ],
      mockPoints: '40,140 55,140 70,140 85,140 100,145 115,150 130,155 145,160 160,165 175,170 190,170 205,170 215,170 222,170 230,175 330,205 310,195 290,185 270,180 250,180'
    },
    {
      id: '172',
      name: '172',
      color: '#f97316', // orange
      themeColor: 'orange',
      stations: [
        { name: '中央大學警衛室', cx: 250, cy: 180, id: 'st-172-1' },
        { name: '中大湖', cx: 270, cy: 180, id: 'st-172-2' },
        { name: '中央大學依仁堂', cx: 290, cy: 185, id: 'st-172-3' },
        { name: '中央大學後門', cx: 310, cy: 195, id: 'st-172-4' },
        { name: '中央大學觀景台', cx: 330, cy: 205, id: 'st-172-5' },
        { name: '中央大學正門', cx: 230, cy: 175, id: 'st-172-6' },
        { name: '潤泰公司', cx: 210, cy: 160, id: 'st-172-7' },
        { name: '三座厝', cx: 195, cy: 145, id: 'st-172-8' },
        { name: '三民里', cx: 180, cy: 135, id: 'st-172-9' },
        { name: '崎頂', cx: 165, cy: 125, id: 'st-172-10' },
        { name: '三宏', cx: 150, cy: 115, id: 'st-172-11' },
        { name: '水圳頭', cx: 135, cy: 105, id: 'st-172-12' },
        { name: '內厝', cx: 120, cy: 95, id: 'st-172-13' },
        { name: '聖德路口', cx: 105, cy: 85, id: 'st-172-14' },
        { name: '領航南文德路口', cx: 120, cy: 70, id: 'st-172-15' },
        { name: '領航南公園路口', cx: 150, cy: 60, id: 'st-172-16' },
        { name: '青埔', cx: 180, cy: 50, id: 'st-172-17' },
        { name: '青埔致遠一路口', cx: 210, cy: 40, id: 'st-172-18' },
        { name: '中厝', cx: 240, cy: 40, id: 'st-172-19' },
        { name: '高鐵桃園站', cx: 280, cy: 40, id: 'st-172-20' }
      ],
      mockPoints: '250,180 270,180 290,185 310,195 330,205 230,175 210,160 195,145 180,135 165,125 150,115 135,105 120,95 105,85 120,70 150,60 180,50 210,40 240,40 280,40'
    },
    {
      id: '172A',
      name: '172A',
      color: '#a855f7', // purple
      themeColor: 'purple',
      stations: [
        { name: '中原大學全人村', cx: 20, cy: 290, id: 'st-172a-1' },
        { name: '中原大學信實宿舍', cx: 30, cy: 280, id: 'st-172a-2' },
        { name: '普忠路', cx: 45, cy: 270, id: 'st-172a-3' },
        { name: '中園育樂街口', cx: 60, cy: 260, id: 'st-172a-4' },
        { name: '中園福州二街口', cx: 75, cy: 250, id: 'st-172a-5' },
        { name: '中福派出所', cx: 90, cy: 240, id: 'st-172a-6' },
        { name: '啟英高中', cx: 105, cy: 230, id: 'st-172a-7' },
        { name: '玉尊宮', cx: 120, cy: 220, id: 'st-172a-8' },
        { name: '土地宮', cx: 135, cy: 210, id: 'st-172a-9' },
        { name: '桃園大圳橋', cx: 150, cy: 200, id: 'st-172a-10' },
        { name: '萬能科技大學', cx: 165, cy: 190, id: 'st-172a-11' },
        { name: '賴厝', cx: 180, cy: 180, id: 'st-172a-12' },
        { name: '謝厝', cx: 195, cy: 170, id: 'st-172a-13' },
        { name: '大江購物中心', cx: 210, cy: 160, id: 'st-172a-14' },
        { name: '鄉界', cx: 250, cy: 130, id: 'st-172a-15' },
        { name: '寶城', cx: 260, cy: 110, id: 'st-172a-16' },
        { name: '上岡崎', cx: 255, cy: 90, id: 'st-172a-17' },
        { name: '岡崎', cx: 240, cy: 75, id: 'st-172a-18' },
        { name: '青昇路一段132巷口', cx: 225, cy: 55, id: 'st-172a-19' },
        { name: '青埔致遠一路口', cx: 210, cy: 40, id: 'st-172a-20' },
        { name: '中厝', cx: 240, cy: 40, id: 'st-172a-21' },
        { name: '高鐵桃園站', cx: 280, cy: 40, id: 'st-172a-22' },
        { name: '中厝', cx: 240, cy: 40, id: 'st-172a-23' },
        { name: '青埔致遠一路口', cx: 210, cy: 40, id: 'st-172a-24' },
        { name: '青埔', cx: 180, cy: 50, id: 'st-172a-25' },
        { name: '領航南公園路口', cx: 150, cy: 60, id: 'st-172a-26' },
        { name: '領航南文德路口', cx: 120, cy: 70, id: 'st-172a-27' },
        { name: '桃園國際棒球場', cx: 100, cy: 80, id: 'st-172a-28' },
        { name: '聖德路口', cx: 105, cy: 85, id: 'st-172a-29' },
        { name: '內厝', cx: 120, cy: 95, id: 'st-172a-30' },
        { name: '水圳頭', cx: 135, cy: 105, id: 'st-172a-31' },
        { name: '三宏', cx: 150, cy: 115, id: 'st-172a-32' },
        { name: '崎頂', cx: 165, cy: 125, id: 'st-172a-33' },
        { name: '三民里', cx: 180, cy: 135, id: 'st-172a-34' },
        { name: '三座厝', cx: 195, cy: 145, id: 'st-172a-35' },
        { name: '潤泰公司', cx: 210, cy: 160, id: 'st-172a-36' },
        { name: '中央大學正門', cx: 230, cy: 175, id: 'st-172a-37' },
        { name: '中央大學警衛室', cx: 250, cy: 180, id: 'st-172a-38' },
        { name: '中大湖', cx: 270, cy: 180, id: 'st-172a-39' },
        { name: '中央大學依仁堂', cx: 290, cy: 185, id: 'st-172a-40' },
        { name: '中央大學後門', cx: 310, cy: 195, id: 'st-172a-41' },
        { name: '中央大學觀景台', cx: 330, cy: 205, id: 'st-172a-42' }
      ],
      mockPoints: '20,290 30,280 45,270 60,260 75,250 90,240 105,230 120,220 135,210 150,200 165,190 180,180 195,170 210,160 250,130 260,110 255,90 240,75 225,55 210,40 240,40 280,40 240,40 210,40 180,50 150,60 120,70 100,80 105,85 120,95 135,105 150,115 165,125 180,135 195,145 210,160 230,175 250,180 270,180 290,185 310,195 330,205'
    },
    {
      id: '173',
      name: '173',
      color: '#64748b', // grey
      themeColor: 'slate',
      stations: [
        { name: '中央大學警衛室', cx: 250, cy: 180, id: 'st-173-1' },
        { name: '中大湖', cx: 270, cy: 180, id: 'st-173-2' },
        { name: '中央大學依仁堂', cx: 290, cy: 185, id: 'st-173-3' },
        { name: '中央大學後門', cx: 310, cy: 195, id: 'st-173-4' },
        { name: '中央大學觀景台', cx: 330, cy: 205, id: 'st-173-5' },
        { name: '中央大學正門', cx: 230, cy: 175, id: 'st-173-6' },
        { name: '潤泰公司', cx: 210, cy: 160, id: 'st-173-7' },
        { name: '三座厝', cx: 195, cy: 145, id: 'st-173-8' },
        { name: '三民里', cx: 180, cy: 135, id: 'st-173-9' },
        { name: '崎頂', cx: 165, cy: 125, id: 'st-173-10' },
        { name: '三宏', cx: 150, cy: 115, id: 'st-173-11' },
        { name: '水圳頭', cx: 135, cy: 105, id: 'st-173-12' },
        { name: '內厝', cx: 120, cy: 95, id: 'st-173-13' },
        { name: '聖德路口', cx: 105, cy: 85, id: 'st-173-14' },
        { name: '捷運桃園體育園區站(領航北路)', cx: 115, cy: 60, id: 'st-173-15' },
        { name: '永裕路口', cx: 145, cy: 50, id: 'st-173-16' },
        { name: '領航北民權路口', cx: 175, cy: 45, id: 'st-173-17' },
        { name: '青埔國中', cx: 215, cy: 40, id: 'st-173-18' },
        { name: '高鐵桃園站', cx: 280, cy: 40, id: 'st-173-19' }
      ],
      mockPoints: '250,180 270,180 290,185 310,195 330,205 230,175 210,160 195,145 180,135 165,125 150,115 135,105 120,95 105,85 115,60 145,50 175,45 215,40 280,40'
    },
    {
      id: '133',
      name: '133',
      color: '#0284c7', // blue
      themeColor: 'sky',
      stations: [
        { name: '中壢客運中壢總站', cx: 40, cy: 150, id: 'st-133-1' },
        { name: '第一銀行', cx: 55, cy: 150, id: 'st-133-2' },
        { name: '第一市場', cx: 70, cy: 150, id: 'st-133-3' },
        { name: '舊社', cx: 85, cy: 150, id: 'st-133-4' },
        { name: '新明國中(民族路)', cx: 100, cy: 155, id: 'st-133-5' },
        { name: '廣興', cx: 115, cy: 160, id: 'st-133-6' },
        { name: '仁愛新村', cx: 130, cy: 165, id: 'st-133-7' },
        { name: '青果市場', cx: 145, cy: 170, id: 'st-133-8' },
        { name: '五權', cx: 160, cy: 175, id: 'st-133-9' },
        { name: '祐民醫院', cx: 175, cy: 180, id: 'st-133-10' },
        { name: '高雙里', cx: 190, cy: 185, id: 'st-133-11' },
        { name: '三民五興路口', cx: 205, cy: 185, id: 'st-133-12' },
        { name: '土地公廟', cx: 215, cy: 180, id: 'st-133-13' },
        { name: '三民中正路口', cx: 222, cy: 175, id: 'st-133-14' },
        { name: '中央大學正門', cx: 230, cy: 175, id: 'st-133-15' },
        { name: '中央大學警衛室', cx: 250, cy: 180, id: 'st-133-16' },
        { name: '中大湖', cx: 270, cy: 180, id: 'st-133-17' },
        { name: '中央大學依仁堂', cx: 290, cy: 185, id: 'st-133-18' },
        { name: '中央大學後門', cx: 310, cy: 195, id: 'st-133-19' },
        { name: '中央大學觀景台', cx: 330, cy: 205, id: 'st-133-20' }
      ],
      mockPoints: '40,150 55,150 70,150 85,150 100,155 115,160 130,165 145,170 160,175 175,180 190,185 205,185 215,180 222,175 230,175 250,180 270,180 290,185 310,195 330,205'
    },
    {
      id: '133A',
      name: '133A',
      color: '#f43f5e', // rose
      themeColor: 'rose',
      stations: [
        { name: '中壢客運中壢總站', cx: 40, cy: 150, id: 'st-133a-1' },
        { name: '中央延平路口', cx: 50, cy: 110, id: 'st-133a-2' },
        { name: '中央新生路口', cx: 70, cy: 110, id: 'st-133a-3' },
        { name: '捷運老街溪站(中央西路)', cx: 90, cy: 110, id: 'st-133a-4' },
        { name: '民權路口', cx: 110, cy: 110, id: 'st-133a-5' },
        { name: '新明國小', cx: 130, cy: 115, id: 'st-133a-6' },
        { name: '曉明幼稚園', cx: 150, cy: 120, id: 'st-133a-7' },
        { name: '華宏補習班', cx: 170, cy: 125, id: 'st-133a-8' },
        { name: '中壢高中(中央西路)', cx: 190, cy: 130, id: 'st-133a-9' },
        { name: '中壢高中(志廣路)', cx: 200, cy: 140, id: 'st-133a-10' },
        { name: '天祥醫院(志廣路)', cx: 210, cy: 150, id: 'st-133a-11' },
        { name: '三民', cx: 220, cy: 160, id: 'st-133a-12' },
        { name: '中央大學正門', cx: 230, cy: 175, id: 'st-133a-13' },
        { name: '中央大學警衛室', cx: 250, cy: 180, id: 'st-133a-14' },
        { name: '中大湖', cx: 270, cy: 180, id: 'st-133a-15' },
        { name: '中央大學依仁堂', cx: 290, cy: 185, id: 'st-133a-16' },
        { name: '中央大學後門', cx: 310, cy: 195, id: 'st-133a-17' },
        { name: '中央大學觀景台', cx: 330, cy: 205, id: 'st-133a-18' }
      ],
      mockPoints: '40,150 50,110 70,110 90,110 110,110 130,115 150,120 170,125 190,130 200,140 210,150 220,160 230,175 250,180 270,180 290,185 310,195 330,205'
    },
    {
      id: '9025A',
      name: '9025A',
      color: '#ec4899', // pink
      themeColor: 'pink',
      stations: [
        { name: '中壢公車站', cx: 40, cy: 140, id: 'st-9025a-1' },
        { name: '舊社', cx: 85, cy: 140, id: 'st-9025a-2' },
        { name: '新明國中', cx: 100, cy: 145, id: 'st-9025a-3' },
        { name: '中央大學警衛室', cx: 250, cy: 180, id: 'st-9025a-4' },
        { name: '中央大學依仁堂', cx: 290, cy: 185, id: 'st-9025a-5' },
        { name: '宏國大樓', cx: 320, cy: 145, id: 'st-9025a-6' },
        { name: '捷運環北站', cx: 340, cy: 115, id: 'st-9025a-7' },
        { name: '行天宮', cx: 360, cy: 115, id: 'st-9025a-8' },
        { name: '臺北大學(臺北校區)', cx: 375, cy: 115, id: 'st-9025a-9' },
        { name: '松山機場', cx: 390, cy: 115, id: 'st-9025a-10' }
      ],
      mockPoints: '40,140 85,140 100,145 250,180 290,185 320,145 340,115 360,115 375,115 390,115'
    }
  ];

  // Live vehicles dynamic info with coordinates populated
  const activeBuses = [
    {
      id: 'bus-132-1',
      routeName: '132',
      from: '中壢',
      to: '中央大學',
      cx: 160,
      cy: 165,
      status: '正常',
      speed: '38 km/h',
      delayMins: 0,
      confidence: '高可信度 (92%)',
      passengers: 24,
      lastStop: '五權'
    },
    {
      id: 'bus-132-2',
      routeName: '132',
      from: '中央大學',
      to: '中壢',
      cx: 290,
      cy: 185,
      status: '正常',
      speed: '42 km/h',
      delayMins: 1,
      confidence: '高可信度 (90%)',
      passengers: 18,
      lastStop: '中央大學依仁堂'
    },
    {
      id: 'bus-172-1',
      routeName: '172',
      from: '中央大學',
      to: '高鐵桃園站',
      cx: 180,
      cy: 135,
      status: '延遲中',
      speed: '12 km/h (路阻)',
      delayMins: 12,
      confidence: '疑似異動 (62%)',
      passengers: 35,
      lastStop: '三民里'
    },
    {
      id: 'bus-172A-1',
      routeName: '172A',
      from: '中原大學',
      to: '中央大學',
      cx: 260,
      cy: 110,
      status: '正常',
      speed: '45 km/h',
      delayMins: 0,
      confidence: '中可信度 (81%)',
      passengers: 19,
      lastStop: '寶城'
    },
    {
      id: 'bus-9025A-1',
      routeName: '9025A',
      from: '中壢',
      to: '松山機場',
      cx: 250,
      cy: 180,
      status: '正常',
      speed: '58 km/h',
      delayMins: 0,
      confidence: '高可信度 (95%)',
      passengers: 42,
      lastStop: '中央大學警衛室'
    },
    {
      id: 'bus-9025A-2',
      routeName: '9025A',
      from: '松山機場',
      to: '中壢公車站',
      cx: 320,
      cy: 145,
      status: '嚴重延遲',
      speed: '0 km/h (塞車)',
      delayMins: 28,
      confidence: '高強度報警 (99%)',
      passengers: 48,
      lastStop: '宏國大樓'
    },
    {
      id: 'bus-173-1',
      routeName: '173',
      from: '中央大學',
      to: '高鐵桃園站',
      cx: 215,
      cy: 40,
      status: '末班車已過',
      speed: '──',
      delayMins: 0,
      confidence: '疑似異動 (100%)',
      passengers: 0,
      lastStop: '青埔國中'
    }
  ];

  // Handle zooming of standard Sandbox map
  const handleZoomIn = () => {
    setZooLevel(prev => Math.min(prev + 0.2, 2.5));
  };

  const handleZoomOut = () => {
    setZooLevel(prev => Math.max(prev - 0.2, 0.7));
  };

  const currentBuses = activeBuses.filter(bus => 
    !selectedRouteId || bus.routeName === selectedRouteId
  );

  return (
    <div id="map-app-container" className="relative w-full h-[520px] bg-[#0f1115] border border-slate-800/80 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
      
      {/* MAP HEADER / STATUS CONTROL BAR */}
      <div id="map-control-hdr" className="z-10 bg-slate-900/95 border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2.5 select-none text-left">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-500/10 rounded-lg text-indigo-400 border border-indigo-500/20">
            <Layers className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <span className="text-xs font-black text-slate-100 flex items-center gap-1.5 uppercase font-mono tracking-wider">
              <span>校園客運動態整合模擬星圖</span>
              <span className="text-[9px] text-blue-400 bg-blue-500/10 px-1.5 py-0.2 rounded border border-blue-500/20 font-sans font-bold flex items-center gap-1">
                ● SANDBOX 雙向精準追蹤
              </span>
            </span>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
              {selectedRouteId ? `正在過濾：${selectedRouteId} 路公車之正確路軌與站牌` : '對比中大 7 條核心校園客運之即時軌跡與停靠點'}
            </p>
          </div>
        </div>
      </div>

      {/* MAP WORKSPACE */}
      <div id="map-workspace-viewport" className="relative flex-1 bg-[#12151c] overflow-hidden">
        
        {/* ======================= HIGH FIDELITY SVG SANDBOX SIMULATION ======================= */}
        <div id="svg-sandbox-canvas" className="relative w-full h-full">
          {/* Map grid background */}
          <div 
            className="absolute inset-0 opacity-[0.25]"
            style={{
              backgroundImage: `
                radial-gradient(circle, #4f5e75 1.5px, transparent 1.5px),
                linear-gradient(to right, #1e293b 1px, transparent 1px),
                linear-gradient(to bottom, #1e293b 1px, transparent 1px)
              `,
              backgroundSize: '24px 24px, 48px 48px, 48px 48px',
              transform: `scale(${zooLevel})`,
              transition: 'transform 0.2s ease'
            }}
          />

          {/* SVG Canvas depicting lines and checkpoints */}
          <div 
            className="relative w-full h-full"
            style={{
              transform: `scale(${zooLevel})`,
              transformOrigin: 'center center',
              transition: 'transform 0.2s ease'
            }}
          >
            <svg 
              viewBox="0 0 400 320" 
              className="w-full h-full select-none"
            >
              {/* Main Roads / Route Paths */}
              {routePaths.map((route) => {
                const isSelected = selectedRouteId === route.id;
                const isNoneSelected = !selectedRouteId;
                return (
                  <polyline
                    key={`mock-poly-${route.id}`}
                    points={route.mockPoints}
                    fill="none"
                    stroke={route.color}
                    strokeWidth={isSelected ? 6 : isNoneSelected ? 3.5 : 2}
                    strokeDasharray={(route.id === '173') ? "5,5" : "none"}
                    strokeOpacity={isSelected ? 0.95 : isNoneSelected ? 0.7 : 0.25}
                    className="transition-all duration-300 pointer-events-auto cursor-pointer hover:stroke-white/50"
                    onClick={() => onSelectRoute && onSelectRoute(route.id)}
                  />
                );
              })}

              {/* Road name text overlays */}
              <text x="135" y="145" className="text-[7.5px] font-bold fill-slate-500 rotate-[-15] transform origin-left">新生路</text>
              <text x="285" y="145" className="text-[7.5px] font-bold fill-slate-500">中央路</text>
              <text x="140" y="248" className="text-[7.5px] font-bold fill-slate-500 rotate-[30] transform origin-left">環西路</text>
              <text x="120" y="72" className="text-[7.5px] font-bold fill-slate-500">延平路（高速段）</text>

              {/* Station indicators */}
              {routePaths.flatMap(r => r.stations.map(st => ({ ...st, rId: r.id, rColor: r.color, rName: r.name }))).map((station, idx) => {
                const isSelected = selectedRouteId === station.rId;
                const isNoneSelected = !selectedRouteId;
                const isTarget = isSelected || isNoneSelected;

                return (
                  <g 
                    key={`stg-${station.id}-${idx}`} 
                    className="group cursor-pointer"
                    onClick={() => setSelectedPinInfo({ 
                      type: 'sandbox_station', 
                      name: station.name, 
                      route: station.rName 
                    })}
                  >
                    {/* Station pulse circle */}
                    {isTarget && (
                      <circle
                        cx={station.cx}
                        cy={station.cy}
                        r="6"
                        className="fill-indigo-500/20 stroke-indigo-500/30 animate-ping group-hover:scale-150 transition-transform duration-300"
                      />
                    )}
                    <circle
                      cx={station.cx}
                      cy={station.cy}
                      r={isSelected ? "5" : "3.5"}
                      fill="#1d222b"
                      stroke={station.rColor}
                      strokeWidth="2.5"
                      className="transition-all duration-300 shadow-xs"
                    />
                    
                    {/* Station Label */}
                    {isTarget && (
                      <text
                        x={station.cx}
                        y={station.cy - 7}
                        textAnchor="middle"
                        className="text-[6.5px] font-black fill-slate-300 pointer-events-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                      >
                        {station.name}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Star visual emblem for Start Point Terminus */}
              <g transform="translate(18, 140)">
                <rect width="25" height="12" rx="3.5" fill="#4f46e5" opacity="0.9" />
                <text x="12.5" y="8" textAnchor="middle" fill="#ffffff" className="text-[5.5px] font-extrabold font-mono">起 1</text>
              </g>

              {/* Live Bus Positions (Clickable / Hoverable Icons on Sandbox Map) */}
              {currentBuses.map((bus) => {
                let color = '#10b981'; // Green
                if (bus.status === '延遲中') color = '#f97316'; // Orange
                if (bus.status === '嚴重延遲') color = '#ef4444'; // Red
                if (bus.status === '末班車已過') color = '#9ca3af'; // Grey

                const isSelected = clickedBus?.id === bus.id;

                return (
                  <g 
                    key={`mock-bus-g-${bus.id}`}
                    className="cursor-pointer group"
                    onClick={() => setClickedBus(isSelected ? null : bus)}
                    onMouseEnter={() => setHoveredBus(bus)}
                    onMouseLeave={() => setHoveredBus(null)}
                  >
                    {/* High Credibility Badge check on green buses */}
                    {bus.status === '正常' && (
                      <circle
                        cx={bus.cx}
                        cy={bus.cy - 12}
                        r="4"
                        fill="#10b981"
                        className="animate-pulse"
                      />
                    )}

                    {/* Outer halo based on traffic delay */}
                    <circle
                      cx={bus.cx}
                      cy={bus.cy}
                      r={isSelected ? "11" : "9"}
                      fill={color}
                      fillOpacity="0.25"
                      className="animate-pulse"
                      stroke={color}
                      strokeWidth="1.2"
                      strokeDasharray="2,2"
                    />

                    {/* Primary Vehicle circle */}
                    <circle
                      cx={bus.cx}
                      cy={bus.cy}
                      r={isSelected ? "7" : "6"}
                      fill={color}
                      className="transition-all duration-300 hover:scale-125"
                    />

                    {/* White core dot */}
                    <circle
                      cx={bus.cx}
                      cy={bus.cy}
                      r="2.5"
                      fill="#ffffff"
                    />

                    {/* Floating tag of route label */}
                    <g transform={`translate(${bus.cx - 10}, ${bus.cy + 9})`}>
                      <rect 
                        width="20" 
                        height="8" 
                        rx="1.5" 
                        fill="#1d222b" 
                        stroke={color} 
                        strokeWidth="0.8" 
                        className="shadow-2xs" 
                      />
                      <text 
                        x="10" 
                        y="6.2" 
                        textAnchor="middle" 
                        fill="#ffffff" 
                        className="text-[5.5px] font-extrabold font-mono"
                      >
                        {bus.routeName}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Float panel inside Sandbox Map for selected stations */}
          {selectedPinInfo && selectedPinInfo.type === 'sandbox_station' && (
            <div id="st-float-info" className="absolute left-4 bottom-22 bg-[#16191f]/95 border border-slate-800 shadow-xl p-3 rounded-2xl pointer-events-auto max-w-[190px] text-left">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-black text-indigo-400 font-mono">站牌詳情</span>
                <button 
                  onClick={() => setSelectedPinInfo(null)}
                  className="text-slate-400 hover:text-white text-[10px]"
                >
                  關閉 ×
                </button>
              </div>
              <h4 className="text-xs font-black text-white mt-1">📍 {selectedPinInfo.name}</h4>
              <p className="text-[10px] text-slate-400 mt-1 font-semibold leading-relaxed">
                校園與市區通勤重要節點。經停：<strong className="text-indigo-400">{selectedPinInfo.route}路公車</strong>。雙向車流比對良好。
              </p>
            </div>
          )}
        </div>

        {/* ======================= GENERAL OVERLAYS: MAP LEGEND ======================= */}
        <div id="map-legend-overlay" className="absolute bottom-4 left-4 bg-slate-950/95 p-3 rounded-2xl border border-slate-800/80 shadow-md space-y-1.5 pointer-events-auto text-left select-none max-w-[260px]">
          <div className="text-[9px] font-black text-slate-500 tracking-wider">MAP LEGEND 軌跡分類</div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
              <span className="text-[10px] font-black text-slate-200">🟢 準點 (132/172A)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f97316]" />
              <span className="text-[10px] font-black text-slate-200">🟠 延遲 (172路)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] animate-pulse" />
              <span className="text-[10px] font-black text-slate-200">🔴 壅塞 (9025A)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#64748b]" />
              <span className="text-[10px] font-black text-slate-200">⚫ 未出發 (173路)</span>
            </div>
          </div>
        </div>

        {/* ======================= GENERAL OVERLAYS: SIDE CONTROLS toolbar ======================= */}
        <div id="map-zoom-toolbar" className="absolute right-4 top-4 flex flex-col gap-1.5 pointer-events-auto z-10">
          <button 
            id="btn-scale-up"
            onClick={handleZoomIn}
            className="cursor-pointer w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 shadow-xs flex items-center justify-center text-slate-300 hover:bg-slate-800 hover:text-white active:scale-95 transition-all outline-none"
            title="放大"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          
          <button 
            id="btn-scale-down"
            onClick={handleZoomOut}
            className="cursor-pointer w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 shadow-xs flex items-center justify-center text-slate-300 hover:bg-slate-800 hover:text-white active:scale-95 transition-all outline-none"
            title="縮小"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          {/* Dynamic route focus dropdown overlay */}
          <div className="relative group">
            <button 
              id="btn-route-focus"
              className="cursor-pointer w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 shadow-xs flex items-center justify-center text-slate-300 hover:bg-slate-800 hover:text-white active:scale-95 transition-all outline-none"
              title="聚焦特定公車軌跡"
            >
              <Maximize2 className="w-4 h-4 text-indigo-400" />
            </button>
            <div className="absolute right-0 top-0 hidden group-hover:block hover:block bg-slate-950/95 border border-slate-800 rounded-2xl p-2.5 shadow-xl w-32 space-y-1 text-left">
              <span className="text-[8px] font-black text-slate-500 block mb-1">站點路段聚焦</span>
              <button 
                onClick={() => onSelectRoute && onSelectRoute('')}
                className="w-full text-left text-[9.5px] p-1 rounded hover:bg-slate-800 text-slate-300 block font-bold cursor-pointer"
              >
                🌍 顯示全部路線
              </button>
              {routePaths.map(r => (
                <button
                  key={`focus-${r.id}`}
                  onClick={() => onSelectRoute && onSelectRoute(r.id)}
                  className={`w-full text-left text-[9.5px] p-1 rounded hover:bg-slate-800 font-extrabold block cursor-pointer ${
                    selectedRouteId === r.id ? 'text-indigo-400 bg-slate-900/60' : 'text-slate-300'
                  }`}
                >
                  🚌 {r.name} 路
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ======================= VEHICLE DETAILS FLOATING DRAWER ======================= */}
        {(clickedBus || hoveredBus) && (
          <div id="vehicle-details-drawer" className="absolute right-4 bottom-4 w-56 bg-slate-950/95 border border-slate-800/80 shadow-2xl p-3.5 rounded-2xl transition-all duration-300 pointer-events-auto max-w-full text-left z-10">
            {(() => {
              const bus = clickedBus || hoveredBus;
              let statusColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
              let dotColor = 'bg-emerald-500';
              if (bus.status === '延遲中') {
                statusColor = 'text-orange-400 bg-orange-500/10 border-orange-500/20';
                dotColor = 'bg-orange-500';
              } else if (bus.status === '嚴重延遲') {
                statusColor = 'text-red-400 bg-red-500/10 border-red-500/20';
                dotColor = 'bg-red-500';
              } else if (bus.status === '末班車已過') {
                statusColor = 'text-slate-400 bg-slate-500/10 border-slate-500/20';
                dotColor = 'bg-slate-400';
              }

              return (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-white text-xs font-black font-mono px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700">
                        {bus.routeName} 路
                      </span>
                      <span className="text-[10px] text-slate-400 font-black">GPS 追蹤中</span>
                    </div>
                    {clickedBus && (
                      <button 
                        onClick={() => setClickedBus(null)} 
                        className="cursor-pointer text-slate-400 hover:text-white text-xs font-bold leading-none p-1 hover:bg-slate-800 rounded-full transition-colors"
                      >
                        ×
                      </button>
                    )}
                  </div>

                  <div className="space-y-1.5 text-[10.5px] leading-relaxed">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-bold">運行路線:</span>
                      <span className="text-slate-300 font-black truncate max-w-[120px]">{bus.from} 往 {bus.to}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-bold">即時速度:</span>
                      <span className="text-slate-200 font-mono font-bold">{bus.speed}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-bold">最近停靠:</span>
                      <span className="text-indigo-400 font-black">📍 {bus.lastStop}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-bold">估計客流:</span>
                      <span className="text-slate-300 font-bold font-mono">{bus.passengers} 人在車上</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-bold">資訊驗證:</span>
                      <span className="text-emerald-400 font-black flex items-center gap-0.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        {bus.confidence}
                      </span>
                    </div>

                    <div id="bus-status-tag" className={`mt-2 flex items-center justify-between px-2 py-1.5 rounded-xl border ${statusColor}`}>
                      <span className="font-extrabold flex items-center gap-1.5 text-[10px]">
                        <span className={`w-1.5 h-1.5 rounded-full ${dotColor} ${bus.status !== '末班車已過' ? 'animate-pulse' : ''}`} />
                        {bus.status}
                      </span>
                      {bus.delayMins > 0 ? (
                        <span className="font-black font-mono text-[10px] text-red-400">延遲 +{bus.delayMins} 分鐘</span>
                      ) : (
                        <span className="font-extrabold text-[10px] text-emerald-400">正常到站</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

      </div>
    </div>
  );
}
