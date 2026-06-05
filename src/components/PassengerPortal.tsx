import React, { useState, useRef } from 'react';
import { 
  Search, Bell, Star, RefreshCw, AlertTriangle, ChevronRight, ChevronDown, 
  ThumbsUp, UserCheck, ShieldCheck, Heart, User, Send, CheckCircle2, 
  MapPin, Upload, Clock, Compass, FileText, ChevronLeft, Layers
} from 'lucide-react';
import { BusRoute, CrowdReport, ReportCategory, DataSource } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { ReportsDonutChart } from './MyCharts';
import { getRouteDataSources } from '../data';

interface PassengerPortalProps {
  routes: BusRoute[];
  reports: CrowdReport[];
  dataSources?: DataSource[];
  onSubmitReport: (report: Omit<CrowdReport, 'id' | 'timestamp' | 'likes' | 'status'>) => void;
  onLikeReport: (id: string) => void;
}

const getFirstStationOfRoute = (routeName: string): string => {
  switch (routeName) {
    case '132': return '中壢公車站';
    case '133': return '中壢客運中壢總站';
    case '133A': return '中壢客運中壢總站';
    case '172': return '中央大學警衛室';
    case '173': return '中央大學警衛室';
    case '172A': return '中原大學全人村';
    case '9025A': return '中壢公車站';
    default: return '中壢火車站';
  }
};

const ROUTE_STATIONS: Record<string, string[]> = {
  '132': [
    '中壢公車站', '第一銀行', '第一市場', '舊社', '新明國中(民族路)', '廣興', '仁愛新村', '青果市場', '五權', '祐民醫院', '高雙里', '三民五興路口', '土地公廟', '三民中正路口', '中央大學正門', '中央大學觀景台', '中央大學後門', '中央大學依仁堂', '中大湖', '中央大學警衛室'
  ],
  '172': [
    '中央大學警衛室', '中大湖', '中央大學依仁堂', '中央大學後門', '中央大學觀景台', '中央大學正門', '潤泰公司', '三座厝', '三民里', '崎頂', '三宏', '水圳頭', '內厝', '聖德路口', '領航南文德路口', '領航南公園路口', '青埔', '青埔致遠一路口', '中厝', '高鐵桃園站'
  ],
  '172A': [
    '中原大學全人村', '中原大學信實宿舍', '普忠路', '中園育樂街口', '中園福州二街口', '中福派出所', '啟英高中', '玉尊宮', '土地宮', '桃園大圳橋', '萬能科技大學', '賴厝', '謝厝', '大江購物中心', '鄉界', '寶城', '上岡崎', '岡崎', '青昇路一段132巷口', '青埔致遠一路口', '中厝', '高鐵桃園站', '領航南公園路口', '領航南文德路口', '桃園國際棒球場', '聖德路口', '內厝', '水圳頭', '三宏', '崎頂', '三民里', '三座厝', '潤泰公司', '中央大學正門', '中央大學警衛室', '中大湖', '中央大學依仁堂', '中央大學後門', '中央大學觀景台'
  ],
  '173': [
    '中央大學警衛室', '中大湖', '中央大學依仁堂', '中央大學後門', '中央大學觀景台', '中央大學正門', '潤泰公司', '三座厝', '三民里', '崎頂', '三宏', '水圳頭', '內厝', '聖德路口', '捷運桃園體育園區站(領航北路)', '永裕路口', '領航北民權路口', '青埔國中', '高鐵桃園站'
  ],
  '133': [
    '中壢客運中壢總站', '第一銀行', '第一市場', '舊社', '新明國中(民族路)', '廣興', '仁愛新村', '青果市場', '五權', '祐民醫院', '高雙里', '三民五興路口', '土地公廟', '三民中正路口', '中央大學正門', '中央大學警衛室', '中大湖', '中央大學依仁堂', '中央大學後門', '中央大學觀景台'
  ],
  '133A': [
    '中壢客運中壢總站', '中央延平路口', '中央新生路口', '捷運老街溪站(中央西路)', '民權路口', '新明國小', '曉明幼稚園', '華宏補習班', '中壢高中(中央西路)', '中壢高中(志廣路)', '天祥醫院(志廣路)', '三民', '中央大學正門', '中央大學警衛室', '中大湖', '中央大學依仁堂', '中央大學後門', '中央大學觀景台'
  ],
  '9025A': [
    '中壢公車站', '舊社', '新明國中', '中央大學警衛室', '中央大學依仁堂', '宏國大樓', '捷運環北站', '行天宮', '臺北大學(臺北校區)', '松山機場'
  ]
};

export default function PassengerPortal({ 
  routes, 
  reports, 
  dataSources = [],
  onSubmitReport, 
  onLikeReport 
}: PassengerPortalProps) {
  // Navigation states inside mobile app
  const [activeTab, setActiveTab] = useState<'search' | 'report' | 'my-reports' | 'info'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoute, setSelectedRoute] = useState<BusRoute>(routes[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getBoardingOptionsForRoute = (routeName: string) => {
    if (routeName === '9025A') {
      return ['中央大學警衛室', '中央大學依仁堂'];
    }
    return ['中央大學警衛室', '中大湖', '中央大學依仁堂', '中央大學後門', '中央大學觀景台'];
  };

  const getDirectionOptionsForRoute = (routeName: string) => {
    if (['132', '172', '172A', '133', '133A'].includes(routeName)) {
      return ['中央大學往中壢', '往 中央大學'];
    }
    if (routeName === '173') {
      return ['往 高鐵桃園站', '往 中央大學'];
    }
    if (routeName === '9025A') {
      return ['往 松山機場', '往 中壢'];
    }
    return ['往 單位', '往 校內'];
  };

  const formatRouteDirection = (routeName: string, dir: string) => {
    if (dir.startsWith('往') || dir.includes('往')) {
      return `${routeName} ${dir}`;
    }
    return `${routeName} 往 ${dir}`;
  };

  const formatDirectionOnly = (dir: string) => {
    if (dir.startsWith('往') || dir.includes('往')) {
      return dir;
    }
    return `往 ${dir}`;
  };

  const [selectedBoardingStop, setSelectedBoardingStop] = useState<string>('中央大學警衛室');
  const [selectedDirection, setSelectedDirection] = useState<string>(() => {
    const route = routes[0];
    const opts = getDirectionOptionsForRoute(route?.name || '132');
    return opts[0] || '中央大學往中壢';
  });

  const getDisplayTo = () => {
    return selectedDirection || selectedRoute.to;
  };

  const handleSelectRoute = (route: BusRoute) => {
    setSelectedRoute(route);
    const validPresets = getBoardingOptionsForRoute(route.name);
    const newRouteStations = ROUTE_STATIONS[route.name] || [];
    let nextStop = selectedBoardingStop;
    if (!validPresets.includes(selectedBoardingStop) && !newRouteStations.includes(selectedBoardingStop)) {
      nextStop = '中央大學警衛室';
      setSelectedBoardingStop('中央大學警衛室');
    }
    const defaultDirections = getDirectionOptionsForRoute(route.name);
    setSelectedDirection(defaultDirections[0] || '中央大學往中壢');
  };

  const handleBoardingStopChange = (stop: string) => {
    setSelectedBoardingStop(stop);
  };
  
  // Google Auth Simulation State
  const [user, setUser] = useState<{
    loggedIn: boolean;
    displayName: string;
    email: string;
    photoURL: string;
  }>(() => {
    const saved = localStorage.getItem('google_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      loggedIn: true, // Default to standard preset login for easy testing
      displayName: '沈湘淇 (Sharon)',
      email: 'sharonshen0707@gmail.com',
      photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80'
    };
  });
  const [showLoginModal, setShowLoginModal] = useState(false);

  const saveUser = (newUser: typeof user) => {
    setUser(newUser);
    localStorage.setItem('google_user', JSON.stringify(newUser));
  };
  
  // Interactive Report Wizard states: 'select-type' | 'fill-form' | 'success'
  const [reportStep, setReportStep] = useState<'select-type' | 'fill-form' | 'success'>('select-type');
  const [selectedCategory, setSelectedCategory] = useState<ReportCategory | null>(null);
  const [reportContent, setReportContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [customTime, setCustomTime] = useState(() => {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const tzPlus8 = new Date(utc + (3600000 * 8));
    const hours = String(tzPlus8.getHours()).padStart(2, '0');
    const minutes = String(tzPlus8.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  });
  const [attachedPhoto, setAttachedPhoto] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  
  // Tab filters in My Reports section
  const [myReportsCategory, setMyReportsCategory] = useState<'全部' | '待審核' | '已處理'>('全部');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Search filter
  const filteredRoutes = routes.filter(r => 
    r.name.includes(searchQuery) || 
    r.from.includes(searchQuery) || 
    r.to.includes(searchQuery)
  );

  // Quick report triggers
  const startReportFlow = (route: BusRoute) => {
    if (!user.loggedIn) {
      setShowLoginModal(true);
      return;
    }
    handleSelectRoute(route);
    setReportStep('select-type');
    setSelectedCategory(null);
    setReportContent('');
    setSelectedCategory(null);
    setAttachedPhoto(null);
    setActiveTab('report');
  };

  // Drag and Drop files handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setAttachedPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const selectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setAttachedPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Simulated preset photo triggers just in case they don't upload
  const setMockPhoto = () => {
    setAttachedPhoto("https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&auto=format&fit=crop&q=60");
  };

  const handleReportSubmit = () => {
    if (!selectedCategory) return;
    onSubmitReport({
      routeName: formatRouteDirection(selectedRoute.name, getDisplayTo()),
      stationName: selectedBoardingStop,
      category: selectedCategory,
      content: reportContent || `${selectedCategory}：情況需要立即核對。`,
      time: customTime,
      anonymous: isAnonymous,
      photoUrl: attachedPhoto || undefined,
      user: isAnonymous ? '匿名乘客' : (user.loggedIn ? `${user.displayName}` : '個人帳號 (沈湘淇)')
    });
    setReportStep('success');
  };

  const getCategoryTheme = (cat: ReportCategory) => {
    switch (cat) {
      case '公車已離站': return { bg: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100', dot: 'bg-emerald-500', color: 'text-emerald-500' };
      case '班次延遲': return { bg: 'bg-amber-50 text-amber-700 hover:bg-amber-100', dot: 'bg-amber-500', color: 'text-amber-500' };
      case '班次未出現': return { bg: 'bg-red-50 text-red-700 hover:bg-red-100', dot: 'bg-red-500', color: 'text-red-500' };
      case '方向或班次不符': return { bg: 'bg-blue-50 text-blue-700 hover:bg-blue-100', dot: 'bg-blue-500', color: 'text-blue-500' };
      default: return { bg: 'bg-purple-50 text-purple-700 hover:bg-purple-100', dot: 'bg-purple-500', color: 'text-purple-500' };
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-[#fafafc] border-[8px] border-slate-900 rounded-[38px] shadow-2xl relative overflow-hidden flex flex-col h-[740px]">
      
      {/* Smartphone Notch Header Overlay */}
      <div className="bg-slate-900 h-6 w-full flex items-center justify-between px-6 text-white text-[11px] font-bold select-none shrink-0 z-20">
        <span>09:41</span>
        <div className="w-20 h-4 bg-black rounded-b-xl mx-auto absolute left-1/2 -translate-x-1/2 top-0" />
        <div className="flex items-center gap-1">
          <span className="text-[10px]">📶</span>
          <span className="text-[10px]">🪫 92%</span>
        </div>
      </div>

      {/* Main Internal Screens */}
      <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth flex flex-col relative bg-stone-50 text-slate-800 pb-16">
        
        <AnimatePresence mode="wait">
          {/* 1. Main Buscar (Bus Query & Details) Portal Tab */}
          {activeTab === 'search' && (
            <motion.div 
              key="search-screen"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="p-4 space-y-4"
            >
              {/* Header Title with Refresh */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">公車查詢</h1>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">即時多網頁比對 與 群眾回報</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {user.loggedIn ? (
                    <div 
                      onClick={() => setShowLoginModal(true)} 
                      className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100/80 px-2 py-0.5 border border-indigo-100 rounded-full cursor-pointer transition-all shadow-3xs"
                    >
                      <img 
                        src={user.photoURL} 
                        alt="avatar" 
                        className="w-5.5 h-5.5 rounded-full border border-indigo-200 object-cover"
                      />
                      <span className="text-[9.5px] font-black text-indigo-800 tracking-tight max-w-[50px] truncate">{user.displayName.replace(/ \((Sharon|Siyu|G)\)/, '')}</span>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setShowLoginModal(true)} 
                      className="flex items-center gap-1 bg-white border border-slate-200 hover:border-slate-300 shadow-3xs px-2.5 py-1 rounded-full text-[9px] font-black text-slate-700 transition-all cursor-pointer outline-none"
                    >
                      <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span>Google 登入</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Input query search */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜尋公車路線、站牌..." 
                  className="w-full bg-white pl-10 pr-4 py-2.5 rounded-2xl text-xs font-semibold text-slate-700 placeholder-slate-400 border border-slate-100 shadow-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                />
              </div>

              {/* Dropdown Route Selector */}
              <div className="relative z-30">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full flex items-center justify-between bg-white px-4 py-3 rounded-2xl border border-slate-100 shadow-xs text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all outline-none"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>選擇公車路線：<span className="text-emerald-700 font-extrabold">{selectedRoute.name} 路 ({formatDirectionOnly(getDisplayTo())})</span></span>
                  </div>
                  <motion.div
                    animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-100 rounded-3xl shadow-lg z-40 overflow-hidden max-h-[220px] overflow-y-auto no-scrollbar divide-y divide-slate-100"
                    >
                      <div className="p-1">
                        {filteredRoutes.map((route) => {
                          const isSel = selectedRoute.id === route.id;
                          return (
                            <div 
                              key={route.id}
                              onClick={() => {
                                handleSelectRoute(route);
                                setIsDropdownOpen(false);
                              }}
                              className={`p-2.5 rounded-xl flex justify-between items-center cursor-pointer transition-all ${
                                isSel ? 'bg-emerald-50 text-emerald-800' : 'hover:bg-slate-50 text-slate-700'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10.5px] font-black font-mono shadow-3xs ${
                                  route.status === '正常' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                                }`}>
                                  {route.name}
                                </span>
                                <div className="text-left">
                                  <div className="text-[11px] font-extrabold text-slate-800">{route.to}</div>
                                  <div className="text-[9px] font-semibold text-slate-400 mt-0.5">{route.from} ➔ {route.to}</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-[10.5px] font-extrabold text-slate-700 font-mono">
                                  {route.estimateMin > 0 ? `${route.estimateMin} 分` : '已過'}
                                </div>
                                <div className="text-[8px] font-bold text-slate-400">
                                  ⭐ {route.credibility}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        {filteredRoutes.length === 0 && (
                          <div className="p-3 text-center text-xs text-slate-400 font-bold">
                            無相符路線
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Station details comparison panel - if route is selected */}
              <div className="bg-white border border-slate-100 p-4 rounded-3xl shadow-xs space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-emerald-800 font-black text-xs font-mono px-2 py-0.5 rounded bg-emerald-50 border border-emerald-100">
                        {selectedRoute.name} 路
                      </span>
                      <span className="text-slate-400 font-bold text-xs">{formatDirectionOnly(getDisplayTo())}</span>
                    </div>
                    <div className="text-xs text-slate-500 font-bold mt-1.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span>目前乘車點：<span className="text-indigo-600 font-extrabold">{selectedBoardingStop}</span></span>
                    </div>

                    {/* Directional Toggle Selector */}
                    <div className="mt-2 text-left bg-slate-50/50 p-2 rounded-2xl border border-slate-100/60">
                      <span className="text-[10px] font-bold text-slate-500 tracking-wider block mb-1.5">
                        🧭 行車方向選擇：
                      </span>
                      <div className="flex gap-1">
                        {getDirectionOptionsForRoute(selectedRoute.name).map((dir) => {
                          const isDirActive = selectedDirection === dir;
                          return (
                            <button
                              key={dir}
                              onClick={() => setSelectedDirection(dir)}
                              className={`flex-1 py-1 px-2 rounded-xl text-[10px] font-black transition-all border cursor-pointer outline-none text-center ${
                                isDirActive 
                                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-3xs' 
                                  : 'bg-white text-slate-600 hover:text-slate-800 border-slate-200/50 hover:bg-slate-50 active:scale-95'
                              }`}
                            >
                              {dir}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mt-2 text-left bg-slate-50/50 p-2 rounded-2xl border border-slate-100/60">
                      <span className="text-[10px] font-bold text-slate-500 tracking-wider block mb-1.5">
                        📍 更換預設上車點：
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {getBoardingOptionsForRoute(selectedRoute.name).map((stop) => {
                          const isActive = selectedBoardingStop === stop;
                           return (
                             <button
                               key={stop}
                               onClick={() => handleBoardingStopChange(stop)}
                               className={`px-2 py-1 rounded-xl text-[10px] font-black transition-all border cursor-pointer outline-none ${
                                 isActive 
                                   ? 'bg-indigo-600 text-white border-indigo-600 shadow-3xs' 
                                   : 'bg-white text-slate-600 hover:text-slate-800 border-slate-200/50 hover:bg-slate-50 active:scale-95'
                               }`}
                             >
                               {stop}
                             </button>
                           );
                         })}
 
                         {/* Dropdown Select for "其他站牌" */}
                         {(() => {
                           const presets = getBoardingOptionsForRoute(selectedRoute.name);
                           const allStations = ROUTE_STATIONS[selectedRoute.name] || [];
                           const otherStations = allStations.filter(st => !presets.includes(st));
                           const isOtherActive = otherStations.includes(selectedBoardingStop);
 
                           if (otherStations.length === 0) return null;
 
                           return (
                             <div className="relative inline-block">
                               <select
                                 value={isOtherActive ? selectedBoardingStop : ""}
                                 onChange={(e) => {
                                   if (e.target.value) {
                                     handleBoardingStopChange(e.target.value);
                                   }
                                 }}
                                 className={`px-2 py-1 pr-6 rounded-xl text-[10px] font-black transition-all border cursor-pointer outline-none appearance-none ${
                                   isOtherActive 
                                     ? 'bg-indigo-600 text-white border-indigo-600 shadow-3xs' 
                                     : 'bg-white text-slate-600 hover:text-slate-800 border-slate-200/50 hover:bg-slate-50 active:scale-95'
                                 }`}
                               >
                                 <option value="" disabled className="text-slate-400 bg-white font-black text-[10px]">
                                   {isOtherActive ? selectedBoardingStop : "其他站牌 ▾"}
                                 </option>
                                 {otherStations.map((stop) => (
                                   <option key={stop} value={stop} className="text-slate-700 bg-white font-extrabold text-[10px]">
                                     {stop}
                                   </option>
                                 ))}
                               </select>
                               <span className={`absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-[7.5px] font-bold ${
                                 isOtherActive ? 'text-indigo-200' : 'text-slate-400'
                               }`}>
                                 ▾
                               </span>
                             </div>
                           );
                         })()}
                       </div>
                     </div>
                     {selectedRoute.isTrial && (
                       <div className="mt-2 flex flex-col gap-0.5 text-left">
                         <span className="inline-flex self-start text-[8.5px] font-black tracking-wider bg-rose-50 text-rose-600 border border-rose-100 px-1.5 py-0.2 rounded">
                           📢 {selectedRoute.routeStatus || '試辦路線'}
                         </span>
                         <p className="text-[8px] font-bold text-slate-400">
                           {selectedRoute.trialPeriod}
                         </p>
                       </div>
                     )}
                   </div>
                  <button className="w-8 h-8 rounded-full bg-slate-50 text-amber-400 flex items-center justify-center hover:scale-110 active:scale-95 transition-all">
                    <Star className="w-4 h-4 fill-amber-400" />
                  </button>
                </div>

                <div className="py-2 flex items-center justify-between border-y border-slate-50">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 tracking-wider">預估到站時間</div>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-3xl font-black text-slate-800 font-mono tracking-tight">
                        {selectedRoute.estimateMin > 0 ? selectedRoute.estimateMin : '已過'}
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        {selectedRoute.estimateMin > 0 ? '分鐘' : '末班車'}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <div className="text-[10px] font-bold text-slate-400 tracking-wider mb-1">資訊可信度</div>
                    <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-100">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-[10px] font-bold">{selectedRoute.credibility} ({selectedRoute.confidencePct}%)</span>
                    </div>
                  </div>
                </div>

                {/* Multiple source comparison side by side (Screenshot 5 detail) */}
                <div className="space-y-2 text-left">
                  <div className="text-[10px] font-bold text-slate-400 tracking-wider mb-1 flex items-center justify-between">
                    <span>各來源動態即時串接比對</span>
                    <span className="text-[8.5px] font-bold text-indigo-500 bg-indigo-50 border border-indigo-100 px-1.5 py-0.2 rounded-md">雙向比對驗證</span>
                  </div>
                  
                  <div className="space-y-1.5">
                    {getRouteDataSources(selectedRoute.name).map((source) => {
                      // Custom estimation calculation based on the source's traits and user requirements
                      let sourceEst = "";
                      
                      // Handling special route cases
                      if (selectedRoute.name === '9025A' && source.name === '桃園公車動態') {
                        sourceEst = "發車未更新/誤";
                      } else if (selectedRoute.estimateMin <= 0) {
                        if (source.hasTimetable) {
                          sourceEst = "末班已過";
                        } else {
                          sourceEst = "無班表估時";
                        }
                      } else {
                        // Standard estimating offset for simulator variety
                        let offset = 0;
                        if (source.id.includes('chungli') || source.id.includes('taoyuan') || source.id === 'src-1') {
                          offset = 0; // most accurate
                        } else if (source.name.includes('桃園公車')) {
                          offset = 0; 
                        } else if (source.name.includes('Busgooo')) {
                          offset = 0;
                        } else if (source.name.includes('雲端公車')) {
                          offset = 1; // minor API lag
                        }
                        
                        sourceEst = `${selectedRoute.estimateMin + offset} 分鐘`;
                      }

                      return (
                        <div key={source.id} className="p-2 bg-slate-50/80 rounded-2xl border border-slate-100 hover:border-indigo-200/60 hover:bg-indigo-50/10 transition-all text-[11px]">
                          <div className="flex justify-between items-start gap-1">
                            <div className="min-w-0 flex-1">
                              {source.url && source.url !== '#' ? (
                                <a 
                                  href={source.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  referrerPolicy="no-referrer"
                                  className="font-black text-[11px] text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1 cursor-pointer"
                                  title="點擊前往原始網頁查詢"
                                >
                                  🔗 {source.name}
                                </a>
                              ) : (
                                <span className="font-extrabold text-[11px] text-slate-800">
                                  🌟 {source.name}
                                </span>
                              )}
                            </div>

                            <div className="text-right shrink-0">
                              <span className={`font-mono font-black text-[10.5px] px-1.5 py-0.5 rounded-lg shadow-3xs ${
                                sourceEst === '發車未更新/誤' ? 'text-rose-600 bg-rose-50 border border-rose-200' : 'text-slate-700 bg-white border border-slate-200/50'
                              }`}>
                                {sourceEst}
                              </span>
                            </div>
                          </div>

                          <div className="mt-1 flex items-center justify-between text-[8.5px] font-bold text-slate-400">
                            <span className="text-slate-400">
                              {source.accuracyNote}
                            </span>
                            <span>{source.latency}s 延遲</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-2 bg-amber-50/60 rounded-xl border border-amber-200/60 text-[8.5px] text-amber-800 font-bold leading-normal">
                    ⚠️ 數據連結與模擬宣告：本系統為「群眾動態回報」研究性概念展示，受限於沙盒憑證與官方數據庫連線限制，上列各快捷網頁與即時預估僅供比對參考。本系統資訊信賴基準主要為乘客一鍵回報；目前預置展示之多筆通報數據係經由系統模擬多用戶交叉比對建立之仿真基準假數據（並會即時疊加您在手機端發出的最新回報與可信度評分）。
                  </div>
                </div>

                <div className="pt-1 select-none">
                  <button 
                    onClick={() => startReportFlow(selectedRoute)}
                    className="w-full bg-[#10b981] hover:bg-[#059669] text-white py-3 px-4 rounded-2xl text-xs font-bold shadow-md shadow-emerald-200 flex items-center justify-center gap-1.5 active:scale-95 transition-all outline-none"
                    id="btn-passenger-onekey"
                  >
                    📝 一鍵回報當前狀態
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* 2. Interactive Crowdsourced Report Core Flow Tab */}
          {activeTab === 'report' && (
            <motion.div 
              key="report-screen"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.15 }}
              className="p-4 space-y-4"
            >
              {/* Report Flow Title */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    if (reportStep === 'fill-form') setReportStep('select-type');
                    else setActiveTab('search');
                  }}
                  className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div>
                  <h1 className="text-sm font-black text-slate-800">一鍵即時回報</h1>
                  <p className="text-[10px] text-slate-400 font-bold">幫助其他乘客對比真實路況，人人受益</p>
                </div>
              </div>

              {/* Progress Stepper Banner */}
              <div className="flex items-center justify-between bg-white border border-slate-50 p-2.5 rounded-xl text-[10px] font-bold text-slate-400">
                <span className={reportStep === 'select-type' ? 'text-blue-600' : 'text-slate-500'}>1. 選擇類型</span>
                <span className="text-slate-300">➔</span>
                <span className={reportStep === 'fill-form' ? 'text-blue-600' : 'text-slate-500'}>2. 填寫細節</span>
                <span className="text-slate-300">➔</span>
                <span className={reportStep === 'success' ? 'text-blue-600' : 'text-slate-500'}>3. 回報成功</span>
              </div>

              {/* Sub-step 1: Select type of delay */}
              {reportStep === 'select-type' && (
                <div className="space-y-3">
                  <div className="bg-emerald-50 rounded-2xl p-3.5 border border-emerald-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-800">{formatRouteDirection(selectedRoute.name, getDisplayTo())}</div>
                      <div className="text-[10px] text-emerald-700 font-bold">預估剩餘: {selectedRoute.estimateMin > 0 ? `${selectedRoute.estimateMin} 分鐘` : '末班已過'} (高可信度)</div>
                    </div>
                  </div>

                  <h3 className="text-[11px] font-bold text-slate-400 tracking-wider">選擇您要回報的異常類型：</h3>
                  <div className="space-y-2 select-none">
                    {[
                      { type: '公車已離站', desc: '公車已經開走，未在站牌停靠', detail: '已過站卻顯示未過' },
                      { type: '班次延遲', desc: '公車比系統預估時間晚到', detail: '因壅塞或事故拖延' },
                      { type: '班次未出現', desc: '預估時間已過，公車仍未出現', detail: '懷疑跳站或末班車已過' },
                      { type: '方向或班次不符', desc: '公車方向或班次與系統顯示相反', detail: '誤導車流或資訊錯誤' },
                      { type: '其他問題', desc: '其他突發狀況與營運異動', detail: '如拋錨故障、臨時改道' }
                    ].map((item) => {
                      const theme = getCategoryTheme(item.type as ReportCategory);
                      return (
                        <div 
                          key={item.type}
                          onClick={() => {
                            setSelectedCategory(item.type as ReportCategory);
                            setReportStep('fill-form');
                          }}
                          className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-2xl cursor-pointer hover:border-slate-300 hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-2.5 h-2.5 rounded-full ${theme.dot}`} />
                            <div>
                              <div className="text-xs font-bold text-slate-800">{item.type}</div>
                              <div className="text-[10px] font-semibold text-slate-400 mt-0.5">{item.desc}</div>
                            </div>
                          </div>
                          <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                            {item.detail}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sub-step 2: Form formulation with Drag & Drop files */}
              {reportStep === 'fill-form' && (
                <div className="space-y-3.5">
                  <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                    <div className="text-[10.5px] font-bold text-slate-400 tracking-wider">申報項目</div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs font-black text-slate-700">{selectedRoute.name} 路 ➔ {selectedCategory}</span>
                      <button 
                        onClick={() => setReportStep('select-type')}
                        className="text-xs text-blue-600 font-bold hover:underline"
                      >
                        修改
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10.5px] font-bold text-slate-400 tracking-wider">詳細描述 (選填)</label>
                    <textarea 
                      value={reportContent}
                      onChange={(e) => setReportContent(e.target.value.substring(0, 100))}
                      rows={3}
                      placeholder="補充說明現場實際路況、公車是否已開走...(限 100 字)"
                      className="w-full bg-white border border-slate-100 rounded-2xl p-3 text-xs font-semibold text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                    />
                    <div className="text-right text-[10px] text-slate-400 font-semibold">
                      {reportContent.length}/100 字
                    </div>
                  </div>

                  {/* Drag and Drop Box with simulated loading presets */}
                  <div className="space-y-1.5">
                    <label className="text-[10.5px] font-bold text-slate-400 tracking-wider">上傳佐證照片 (選填)</label>
                    <div 
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`h-24 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${dragActive ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
                    >
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={selectFile} 
                        className="hidden" 
                        accept="image/*"
                      />
                      {attachedPhoto ? (
                        <div className="relative w-full h-full p-1.5 flex items-center justify-between">
                          <img 
                            src={attachedPhoto} 
                            alt="uploaded Preview" 
                            className="w-16 h-full object-cover rounded-xl"
                          />
                          <span className="text-[10px] text-emerald-600 font-bold px-2">照片上傳成功！</span>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setAttachedPhoto(null);
                            }}
                            className="text-[10px] text-red-500 font-bold hover:underline px-2.5 mr-1"
                          >
                            移除
                          </button>
                        </div>
                      ) : (
                        <div className="text-center p-2">
                          <Upload className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                          <div className="text-[10.5px] font-bold text-slate-600">拖曳檔案至此 或 點選上傳</div>
                          <div className="text-[9px] text-slate-400 font-medium">支援隨附公車站牌/路況影像</div>
                        </div>
                      )}
                    </div>
                    {/* Prest upload buttons to build fluidly */}
                    {!attachedPhoto && (
                      <button 
                        type="button"
                        onClick={setMockPhoto}
                        className="text-[10px] text-slate-500 font-bold bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg border border-slate-200"
                      >
                        ⚡ 帶入站牌預設照片
                      </button>
                    )}
                  </div>

                  {/* Settings section */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between bg-white px-3 py-2.5 rounded-2xl border border-slate-50">
                      <div>
                        <div className="text-[11px] font-bold text-slate-700">匿名回報</div>
                        <div className="text-[9px] text-slate-400 font-bold">開啟後，其他乘客僅能看到匿名發布</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          checked={isAnonymous}
                          onChange={(e) => setIsAnonymous(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500" />
                      </label>
                    </div>

                    <div className="flex items-center justify-between bg-white px-3 py-2.5 rounded-2xl border border-slate-50">
                      <span className="text-[11px] font-bold text-slate-700">回報時間點</span>
                      <input 
                        type="time" 
                        value={customTime}
                        onChange={(e) => setCustomTime(e.target.value)}
                        className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-100"
                      />
                    </div>
                  </div>

                  {/* Submission triggers */}
                  <button 
                    onClick={handleReportSubmit}
                    className="w-full bg-[#10b981] hover:bg-[#059669] text-white py-3 px-4 rounded-2xl text-xs font-bold shadow-md active:scale-95 transition-all outline-none"
                  >
                    🚀 確認送出此異常回報
                  </button>
                </div>
              )}

              {/* Sub-step 3: Complete Success frame */}
              {reportStep === 'success' && (
                <div className="space-y-4 text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-500 animate-bounce">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-zinc-800">感謝您的回報！</h2>
                    <p className="text-xs text-slate-400 font-bold mt-1 max-w-xs mx-auto">您的資訊已寫入比對資料庫，系統正校驗其他来源並廣播更新給後續等車的通勤用戶！</p>
                  </div>

                  <div className="bg-white border border-slate-100 p-4 rounded-3xl text-left space-y-2.5">
                    <div className="text-[10px] font-bold text-slate-400 tracking-wider pb-1.5 border-b border-slate-50">回報內容摘要</div>
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-400">回報路線：</span>
                      <span className="text-slate-700 font-bold">{selectedRoute.name} 路 ({formatDirectionOnly(getDisplayTo())})</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-400">回報站名：</span>
                      <span className="text-slate-700 font-bold">{selectedBoardingStop}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-400">異常類型：</span>
                      <span className="text-red-500 font-extrabold">{selectedCategory}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-400">回報狀態：</span>
                      <span className="text-amber-500 font-extrabold bg-amber-50 px-1.5 py-0.5 rounded text-[10px]">待核實中</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <button 
                      onClick={() => {
                        setActiveTab('my-reports');
                        setReportStep('select-type');
                      }}
                      className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white py-3 px-4 rounded-2xl text-xs font-bold shadow-md shadow-blue-100 transition-all outline-none"
                    >
                      📂 查看我的回報紀錄
                    </button>
                    <button 
                      onClick={() => {
                        setActiveTab('search');
                        setReportStep('select-type');
                      }}
                      className="w-full text-xs text-slate-500 font-bold hover:underline py-1"
                    >
                      返回公車查詢
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* 3. My submitted Records History Tab */}
          {activeTab === 'my-reports' && (
            <motion.div 
              key="myreports-screen"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="p-4 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-base font-black text-slate-800">我的回報紀錄</h1>
                  <p className="text-[10px] text-slate-400 font-bold">追蹤您的回報核實狀態</p>
                </div>
                <div className="text-xs font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-xl">
                  總點數 +35p
                </div>
              </div>

              {/* Google account authentication status block */}
              {!user.loggedIn ? (
                <div className="bg-amber-50/70 border border-amber-100 rounded-3xl p-4 text-center space-y-3 shadow-2xs">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mx-auto text-amber-600">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-800">尚未登入 Google</h3>
                    <p className="text-[10.5px] text-slate-500 font-bold leading-relaxed">
                      請登入您的 Google 帳戶，系統將自動同步並安全儲存您的公車路況回報紀錄。
                    </p>
                  </div>
                  <button 
                    onClick={() => setShowLoginModal(true)}
                    className="w-full bg-[#4285F4] hover:bg-[#357ae8] text-white py-2.5 rounded-xl text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 transition-all outline-none"
                  >
                    <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>Google 帳號登入</span>
                  </button>
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-3.5 flex items-center justify-between shadow-2xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img 
                      src={user.photoURL} 
                      alt="avatar" 
                      className="w-10 h-10 rounded-full border border-emerald-200 object-cover"
                    />
                    <div className="text-left min-w-0">
                      <h3 className="text-xs font-black text-slate-800 truncate">{user.displayName}</h3>
                      <p className="text-[9.5px] text-slate-400 font-bold tracking-tight truncate">{user.email}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => saveUser({ loggedIn: false, displayName: '', email: '', photoURL: '' })}
                    className="text-[10px] text-red-500 font-extrabold px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 transition-all border border-red-100 cursor-pointer"
                  >
                    登出
                  </button>
                </div>
              )}

              {/* Status Filters */}
              <div className="flex gap-2 bg-white p-1 rounded-xl border border-slate-100 text-xs font-bold text-slate-400">
                {(['全部', '待審核', '已處理'] as const).map((filter) => {
                  const active = myReportsCategory === filter;
                  return (
                    <button
                      key={filter}
                      onClick={() => setMyReportsCategory(filter)}
                      className={`flex-1 py-1.5 rounded-lg transition-colors ${active ? 'bg-emerald-500 text-white font-extrabold shadow-2xs' : 'hover:bg-slate-50 hover:text-slate-700'}`}
                    >
                      {filter}
                    </button>
                  );
                })}
              </div>

              {/* Display list of my items */}
              <div className="space-y-2.5 text-left">
                {reports
                  .filter(r => {
                    if (user.loggedIn) {
                      // user is logged in, show reports that are either anonymous but submitted by them or matching user's display name
                      return r.user === user.displayName || r.user === '匿名乘客' || r.user.includes('Sharon') || r.user.includes('Siyu');
                    }
                    // logged out preview mode: show standard reports
                    return r.user === '個人帳號 (沈湘淇)' || r.user === '匿名乘客' || r.user === '中大學生王同學';
                  })
                  .filter(r => myReportsCategory === '全部' || r.status === myReportsCategory)
                  .map((rep) => {
                    const theme = getCategoryTheme(rep.category);
                    return (
                      <div key={rep.id} className="bg-white border border-slate-100 hover:border-slate-200 p-3 rounded-2xl shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={`text-[9.5px] font-black px-2 py-0.5 rounded-md ${theme.bg}`}>
                            {rep.category}
                          </span>
                          <span className={`text-[9.5px] font-bold rounded px-1.5 py-0.5 ${rep.status === '已處理' ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50 animate-pulse'}`}>
                            {rep.status}
                          </span>
                        </div>
                        <div className="text-xs font-bold text-slate-800">
                          {rep.routeName} ➔ {rep.stationName}
                        </div>
                        <p className="text-[10.5px] text-slate-400 font-semibold leading-relaxed">
                          "{rep.content}"
                        </p>
                        <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 pt-1.5 border-t border-slate-50">
                          <span>⏱ 回報時間: {rep.time}</span>
                          <span className="text-emerald-600">👍 已核實 (+10p)</span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </motion.div>
          )}

          {/* 4. Public Live Feeds, Metrics, Explanatory tab */}
          {activeTab === 'info' && (() => {
            const countOf = (cat: ReportCategory) => reports.filter(r => r.category === cat).length;
            const donutSlices = [
              { label: '公車已離站' as const, count: countOf('公車已離站'), color: '#10b981' },
              { label: '班次延遲' as const, count: countOf('班次延遲'), color: '#f59e0b' },
              { label: '班次未出現' as const, count: countOf('班次未出現'), color: '#ef4444' },
              { label: '其他問題' as const, count: countOf('其他問題') + countOf('方向或班次不符'), color: '#8b5cf6' }
            ];
            const activeReportsSum = reports.length;

            return (
              <motion.div 
                key="info-screen"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.15 }}
                className="p-4 space-y-4"
              >
                <div>
                  <h1 className="text-base font-black text-slate-800">即時回報動態與統計</h1>
                  <p className="text-[10px] text-slate-400 font-bold">現場乘客回報，全系統透明更新</p>
                </div>

                {/* Donut Chart visualization matching Screenshot 3 */}
                <div className="bg-white p-3.5 rounded-3xl border border-slate-100 shadow-2xs space-y-1.5">
                  <h2 className="text-[11px] font-bold text-slate-400 tracking-wider">回報統計 (今天)</h2>
                  <ReportsDonutChart categories={donutSlices} totalReports={activeReportsSum} />
                </div>

                {/* Impact Indicators Card Block from Screenshot 3 */}
                <div className="bg-white p-3.5 rounded-3xl border border-slate-100 shadow-2xs space-y-2.5">
                  <h2 className="text-[11px] font-bold text-slate-400 tracking-wider">回報對系統的影響</h2>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-500">已校正班次數</span>
                      <span className="text-emerald-600 font-mono font-bold flex items-center gap-1">
                        5 班 <span className="bg-emerald-50 px-1 py-0.2 rounded text-[10px] text-emerald-700">+2 ➔</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-500">提升時間準確度</span>
                      <span className="text-emerald-600 font-mono font-bold flex items-center gap-1">
                        88.7% <span className="bg-emerald-50 px-1 py-0.2 rounded text-[10px] text-emerald-700">▲ 1.3%</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-500">受益等車通勤族</span>
                      <span className="text-emerald-600 font-mono font-bold flex items-center gap-1">
                        1,256 人 <span className="bg-emerald-50 px-1 py-0.2 rounded text-[10px] text-emerald-700">▲ 234</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Feed of reports directly from other users */}
                <div className="space-y-2.5 select-none">
                  <div className="text-[10.5px] font-bold text-slate-400 tracking-wider">最近 30 分鐘乘客回報</div>
                  {reports.slice(0, 3).map((rep) => {
                    const theme = getCategoryTheme(rep.category);
                    return (
                      <div key={rep.id} className="bg-white border border-slate-100 p-3 rounded-2xl shadow-2xs space-y-1.5">
                        <div className="flex justify-between items-center text-[10px] font-bold">
                          <span className={`px-1.5 py-0.5 rounded ${theme.bg}`}>
                            {rep.category}
                          </span>
                          <span className="text-slate-400">{rep.time}</span>
                        </div>
                        <div className="text-xs font-extrabold text-slate-800">
                          {rep.routeName} • {rep.stationName}
                        </div>
                        <p className="text-[10.5px] text-slate-500 font-semibold italic">"{rep.content}"</p>
                        
                        <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 pt-1 border-t border-slate-50">
                          <span>👤 {rep.user}</span>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => onLikeReport(rep.id)}
                              className="flex items-center gap-1 hover:text-emerald-700 hover:scale-105 transition-all bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-lg border border-emerald-100/50"
                            >
                              <ThumbsUp className="w-2.5 h-2.5" />
                              <span>{rep.likes}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Explaining impact of reporting */}
                <div className="bg-white p-3.5 rounded-3xl border border-slate-100 space-y-2.5">
                  <div className="text-xs font-extrabold text-slate-800">💡 為什麼需要您的回報？</div>
                  <p className="text-[10px] text-slate-500 font-bold leading-relaxed">
                    公車到站資訊常受車流疏失、GPS斷線等因素延遲。透過乘客利用「一鍵回報」功能主動反應當前狀況，系統即可透過權重模型立刻修正預估時間，造福下一位等車旅客！
                  </p>
                </div>
              </motion.div>
            );
          })()}

        </AnimatePresence>

      </div>

      {/* Styled Mobile bottom navigation bar layout */}
      <div className="absolute bottom-0 inset-x-0 h-16 bg-white border-t border-slate-100 flex items-center justify-around px-4 z-10 shrink-0 select-none">
        <button 
          onClick={() => setActiveTab('search')}
          className={`flex flex-col items-center gap-0.5 font-bold transition-all text-[10px] ${activeTab === 'search' ? 'text-emerald-500 scale-105' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Search className="w-4 h-4" />
          <span>查詢</span>
        </button>

        <button 
          onClick={() => setActiveTab('report')}
          className={`flex flex-col items-center gap-0.5 font-bold transition-all text-[10px] ${activeTab === 'report' ? 'text-emerald-500 scale-105' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Compass className="w-4 h-4" />
          <span>回報</span>
        </button>

        <button 
          onClick={() => setActiveTab('my-reports')}
          className={`flex flex-col items-center gap-0.5 font-bold transition-all text-[10px] ${activeTab === 'my-reports' ? 'text-emerald-500 scale-105' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <FileText className="w-4 h-4" />
          <span>我的紀錄</span>
        </button>

        <button 
          onClick={() => setActiveTab('info')}
          className={`flex flex-col items-center gap-0.5 font-bold transition-all text-[10px] ${activeTab === 'info' ? 'text-emerald-500 scale-105' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Layers className="w-4 h-4" />
          <span>即時動態</span>
        </button>
      </div>

      {/* Dynamic Google Login Modal Bottom Sheet Overlay */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="absolute inset-0 bg-black/60 z-50 flex flex-col justify-end">
            <motion.div 
              initial={{ y: 320 }}
              animate={{ y: 0 }}
              exit={{ y: 320 }}
              className="bg-white rounded-t-[32px] p-5.5 space-y-4 shadow-xl text-slate-800 flex flex-col max-h-[75%] overflow-y-auto"
            >
              {/* Google Identity Sheet Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-sm font-black text-slate-800">登入您的 Google 帳號</span>
                </div>
                <button 
                  onClick={() => setShowLoginModal(false)}
                  className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-black hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <p className="text-[10.5px] text-slate-500 font-bold leading-normal text-left">
                請選擇您的 Google 帳戶，同步並追蹤「公車資訊整合與回報系統」的即時路況申報紀錄：
              </p>

              {/* Interactive list of simulated Google accounts */}
              <div className="space-y-2 select-none">
                {[
                  { 
                    name: '沈湘淇 (Sharon)', 
                    email: 'sharonshen0707@gmail.com', 
                    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80' 
                  },
                  { 
                    name: '李思妤 (Siyu)', 
                    email: 'siyu.li.student@gmail.com', 
                    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&auto=format&fit=crop&q=80' 
                  },
                  { 
                    name: '公車客運管理測試員', 
                    email: 'bus.tester.dev@gmail.com', 
                    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80' 
                  }
                ].map((acc) => (
                  <div 
                    key={acc.email}
                    onClick={() => {
                      saveUser({
                        loggedIn: true,
                        displayName: acc.name,
                        email: acc.email,
                        photoURL: acc.avatar
                      });
                      setShowLoginModal(false);
                    }}
                    className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-indigo-50/50 rounded-2xl cursor-pointer border border-slate-100 hover:border-indigo-150 transition-all text-left"
                  >
                    <img src={acc.avatar} alt="avatar" className="w-10 h-10 rounded-full border border-slate-200 shadow-3xs object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-black text-slate-800">{acc.name}</div>
                      <div className="text-[10px] text-slate-400 font-semibold truncate">{acc.email}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-center text-[9px] text-slate-400 font-semibold border-t border-slate-50">
                此沙盒測試系統由 Google Account Hub 安全通道加密處理。
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
