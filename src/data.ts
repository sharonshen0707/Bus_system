import { BusRoute, CrowdReport, DataSource, AnomalyEvent, DelayTrendPoint } from './types';

export const initialRoutes: BusRoute[] = [
  {
    id: '132',
    name: '132',
    from: '中壢',
    to: '中央大學',
    estimateMin: 3,
    credibility: '高可信度',
    confidencePct: 92,
    status: '正常',
    punctuality: 94,
    activeBuses: 8,
    normalBuses: 8,
    delayMins: 0,
  },
  {
    id: '172',
    name: '172',
    from: '中壢',
    to: '中央大學',
    estimateMin: 12,
    credibility: '疑似異動',
    confidencePct: 62,
    status: '延遲',
    punctuality: 81,
    activeBuses: 5,
    normalBuses: 4,
    delayMins: 12,
  },
  {
    id: '172A',
    name: '172A',
    from: '中壢',
    to: '中央大學',
    estimateMin: 8,
    credibility: '中可信度',
    confidencePct: 81,
    status: '正常',
    punctuality: 88,
    activeBuses: 3,
    normalBuses: 3,
    delayMins: 0,
    isTrial: true,
    trialPeriod: '試辦期間：2026/03/01 - 2026/08/31',
    routeStatus: '試辦中',
  },
  {
    id: '173',
    name: '173',
    from: '中央大學',
    to: '高鐵桃園站',
    estimateMin: -1, // 末班車已過
    credibility: '疑似已過站',
    confidencePct: 20,
    status: '末班車已過',
    punctuality: 0,
    activeBuses: 0,
    normalBuses: 0,
    delayMins: 0,
  },
  {
    id: '133',
    name: '133',
    from: '中壢',
    to: '中央大學',
    estimateMin: 5,
    credibility: '高可信度',
    confidencePct: 95,
    status: '正常',
    punctuality: 96,
    activeBuses: 4,
    normalBuses: 4,
    delayMins: 0,
  },
  {
    id: '133A',
    name: '133A',
    from: '中壢',
    to: '中央大學',
    estimateMin: 14,
    credibility: '高可信度',
    confidencePct: 90,
    status: '正常',
    punctuality: 91,
    activeBuses: 2,
    normalBuses: 2,
    delayMins: 0,
    isTrial: true,
    trialPeriod: '試辦期間：2026/04/15 - 2026/10/14',
    routeStatus: '試辦中',
  },
  {
    id: '9025A',
    name: '9025A',
    from: '中壢',
    to: '松山機場',
    estimateMin: 15,
    credibility: '中可信度',
    confidencePct: 78,
    status: '延遲',
    punctuality: 83,
    activeBuses: 6,
    normalBuses: 5,
    delayMins: 25,
  },
];

export const initialReports: CrowdReport[] = [
  {
    id: 'rep-1',
    routeName: '132 往 中央大學',
    stationName: '中壢公車站',
    category: '公車已離站',
    content: '132剛剛提前2分鐘開走，沒在站牌等滿，造成3個學生坐不到。',
    time: '14:41',
    timestamp: Date.now() - 120000, // 2 mins ago
    user: '中大學生王同學',
    likes: 12,
    status: '已處理',
    anonymous: false,
  },
  {
    id: 'rep-2',
    routeName: '172 往 中央大學',
    stationName: '三民里',
    category: '班次延遲',
    content: '因中正路前方施工塞車嚴重，班次延誤了15分鐘。',
    time: '14:36',
    timestamp: Date.now() - 480000, // 8 mins ago
    user: '乘客李小姐',
    likes: 8,
    status: '待審核',
    anonymous: false,
  },
  {
    id: 'rep-3',
    routeName: '9025A 往 松山機場',
    stationName: '新明國中',
    category: '班次未出現',
    content: '表定14:15的班次一直沒有出現在新明國中站牌，疑似漏班。',
    time: '14:28',
    timestamp: Date.now() - 960000, // 16 mins ago
    user: '通勤族陳先生',
    likes: 5,
    status: '已處理',
    anonymous: false,
  },
  {
    id: 'rep-4',
    routeName: '172A 往 中央大學',
    stationName: '寶城',
    category: '方向或班次不符',
    content: '來車顯示為172A，但是路線走法跟原本網頁公布的繞法好像有出入。',
    time: '14:21',
    timestamp: Date.now() - 1380000, // 23 mins ago
    user: '週六乘客黃大明',
    likes: 3,
    status: '已處理',
    anonymous: false,
  },
  {
    id: 'rep-5',
    routeName: '132 往 中央大學',
    stationName: '中大湖',
    category: '公車已離站',
    content: '車子剛剛走，趕不及上車，大家真的要看好即時動態！',
    time: '14:34',
    timestamp: Date.now() - 600000,
    user: '匿名乘客',
    likes: 15,
    status: '已處理',
    anonymous: true,
  },
];

export const initialDataSources: DataSource[] = [
  {
    id: 'src-1',
    name: '公路客運即時動態資訊網',
    status: '正常',
    latency: 0.8,
    url: 'https://www.taiwanbus.tw/eBUSPage/Query/QueryResult.aspx?rno=9025A&rn=1713338108231&lan=C',
    hasTimetable: true,
    hasDepartureTime: true,
    accuracyNote: '準確度高 • 即時校準',
    desc: '最精確的國家級公路客活動態 API，提供完整時刻表與即時發車時間。'
  },
  {
    id: 'src-2',
    name: '台北市公車資訊 (MQS 行動版)',
    status: '正常',
    latency: 1.4,
    url: 'https://pda5284.gov.taipei/MQS/route.jsp?rid=17489',
    hasTimetable: false,
    hasDepartureTime: false,
    accuracyNote: '常規監控中',
    desc: '傳統舊版台北市公車 MQS API，提供公車路線資訊。'
  },
  {
    id: 'src-3',
    name: '台灣雲端公車 (YunBus)',
    status: '正常',
    latency: 1.1,
    url: 'https://yunbus.tw/lite/route.php?id=THB9025A',
    hasTimetable: false,
    hasDepartureTime: true,
    accuracyNote: '即時數據獲取',
    desc: '輕量化捷徑公車整合網，提供發車時間與預測。'
  },
  {
    id: 'src-4',
    name: '桃園公車動態資訊系統',
    status: '正常',
    latency: 5.8,
    url: 'https://ebus.tycg.gov.tw/ebus/driving-map/65433',
    hasTimetable: true,
    hasDepartureTime: false,
    accuracyNote: '區域動態監控',
    desc: '串接中央公路客運動態，提供桃園市地區公車資訊。'
  },
  {
    id: 'src-5',
    name: '中大群眾即時一鍵回報與志願者流',
    status: '正常',
    latency: 0.2,
    url: '#',
    hasTimetable: true,
    hasDepartureTime: true,
    accuracyNote: '高可信度群眾校驗 • 100% 現場實況',
    desc: '本校園整合網絡利用乘客與站牌志願者上傳照片、GPS 實時核對，補足官方 API 未即時同步之落差。'
  }
];

export const initialAnomalies: AnomalyEvent[] = [
  {
    id: 'an-1',
    routeName: '9025A 路 中壢 ➔ 松山機場',
    fromStation: '新明國中',
    toStation: '松山機場',
    type: '嚴重延遲',
    detail: '五股-林口路段壅塞，預估晚點 25 分鐘',
    time: '14:41',
  },
  {
    id: 'an-2',
    routeName: '172 路 中壢 ➔ 中央大學',
    fromStation: '三民里',
    toStation: '中央大學正門',
    type: '延遲',
    detail: '中正路下水道工程路縮，預估延誤 12 分鐘',
    time: '14:39',
  },
  {
    id: 'an-3',
    routeName: '173 路 中央大學 ➔ 高鐵桃園站',
    fromStation: '中央大學正門',
    toStation: '高鐵桃園站',
    type: '末班車已過',
    detail: '今日末班車已於 13:30 發出 (假日班次略減)',
    time: '14:25',
  },
];

export const initialDelayTrends: DelayTrendPoint[] = [
  { time: '08:00', route132: 5, route172: 8, route9025A: 12 },
  { time: '09:00', route132: 8, route172: 12, route9025A: 15 },
  { time: '10:00', route132: 12, route172: 9, route9025A: 14 },
  { time: '11:00', route132: 18, route172: 11, route9025A: 13 },
  { time: '12:00', route132: 25, route172: 14, route9025A: 21 },
  { time: '13:00', route132: 21, route172: 18, route9025A: 23 },
  { time: '14:00', route132: 22, route172: 15, route9025A: 26 },
];

export function getRouteDataSources(routeIdOrName: string): DataSource[] {
  const matchedRoute = routeIdOrName
    .replace(' 往 松山機場', '')
    .replace(' 往 中央大學', '')
    .replace(' 往 高鐵桃園站', '')
    .replace('路', '')
    .trim();

  const volunteerSource: DataSource = {
    id: 'src-5',
    name: '中大群眾即時一鍵回報與志願者流',
    status: '正常',
    latency: 0.2,
    url: '#',
    hasTimetable: true,
    hasDepartureTime: true,
    accuracyNote: '高可信度群眾校驗 • 100% 現場實況',
    desc: '本校園整合網絡利用乘客與站牌志願者上傳照片、GPS 實時核對，補足官方 API 未即時同步之落差。'
  };

  if (matchedRoute === '9025A') {
    return [
      {
        id: 'src-1',
        name: '公路客運網',
        status: '正常',
        latency: 0.8,
        url: 'https://www.taiwanbus.tw/eBUSPage/Query/QueryResult.aspx?rno=9025A&rn=1713338108231&lan=C',
        hasTimetable: true,
        hasDepartureTime: true,
        accuracyNote: '準確的資料來源',
        desc: '官方公路客運動態 API，提供最準確的全天時刻表與班次即時發車時間。'
      },
      {
        id: 'src-2',
        name: '台北公車動態',
        status: '正常',
        latency: 1.4,
        url: 'https://pda5284.gov.taipei/MQS/route.jsp?rid=17489',
        hasTimetable: false,
        hasDepartureTime: false,
        accuracyNote: '即時到站/動態',
        desc: '台北市 MQS 行動公車資訊，提供即時路線動態，但無固定歷史班次時刻表。'
      },
      {
        id: 'src-3',
        name: '雲端公車',
        status: '正常',
        latency: 1.1,
        url: 'https://yunbus.tw/lite/route.php?id=THB9025A',
        hasTimetable: false,
        hasDepartureTime: true,
        accuracyNote: '即時到站備援',
        desc: '雲端 Lite 公車網，提供即時到站預估與車流輔助追蹤。'
      },
      {
        id: 'src-4',
        name: '桃園公車動態',
        status: '正常',
        latency: 5.8,
        url: 'https://ebus.tycg.gov.tw/ebus/driving-map/65433',
        hasTimetable: true, // 串接公路客運網
        hasDepartureTime: false, // 往中壢火車站發車時間未更新
        accuracyNote: '串接公路客運（往中壢火車站發車時間錯誤）',
        desc: '桃園客運本系統提供即時地圖，然而往中壢火車站發車班次顯示過時錯誤，請作對比。'
      },
      volunteerSource
    ];
  }

  if (matchedRoute === '172' || matchedRoute === '173' || matchedRoute === '172A') {
    const urls = {
      '172': {
        official: 'https://www.chunglibus.com.tw/route/172-2.html',
        tycg: 'https://ebus.tycg.gov.tw/ebus/driving-map/3221',
        busgooo: 'https://www.busgooo.com/bus/TAO3221',
        yunbus: 'https://yunbus.tw/lite/route.php?id=TAO3221'
      },
      '173': {
        official: 'https://www.chunglibus.com.tw/route/173.html',
        tycg: 'https://ebus.tycg.gov.tw/ebus/driving-map/1730',
        busgooo: 'https://www.busgooo.com/bus/TAO1730',
        yunbus: 'https://yunbus.tw/lite/route.php?id=TAO1730'
      },
      '172A': {
        official: 'https://www.chunglibus.com.tw/route/172A.html',
        tycg: 'https://ebus.tycg.gov.tw/ebus/driving-map/1721',
        busgooo: 'https://www.busgooo.com/bus/TAO1721',
        yunbus: 'https://yunbus.tw/lite/route.php?id=TAO1721'
      }
    }[matchedRoute as '172' | '173' | '172A'];

    return [
      {
        id: 'src-chungli',
        name: '中壢客運',
        status: '正常',
        latency: 0.9,
        url: urls.official,
        hasTimetable: true,
        hasDepartureTime: true,
        accuracyNote: matchedRoute === '172A' ? '官方班表/試辦路線' : '官方班表',
        desc: `${matchedRoute} 路中壢客運官方發布之營運班表，提供最權威的發車時間與主要班點。`
      },
      {
        id: 'src-tycg',
        name: '桃園公車動態',
        status: '正常',
        latency: 1.2,
        url: urls.tycg,
        hasTimetable: true,
        hasDepartureTime: true,
        accuracyNote: '即時到站/動態',
        desc: '桃園市政府公車動態資訊系統，即時更新當前公車 GPS 與預計到站秒數。'
      },
      {
        id: 'src-busgooo',
        name: 'Busgooo/TDX',
        status: '正常',
        latency: 1.5,
        url: urls.busgooo,
        hasTimetable: true,
        hasDepartureTime: true,
        accuracyNote: '班表備援',
        desc: '介接 TDX 全國運輸不定期同步班表，提供多站點發車時間與歷史班次記錄。'
      },
      {
        id: 'src-yunbus',
        name: '雲端公車',
        status: '正常',
        latency: 1.1,
        url: urls.yunbus,
        hasTimetable: false,
        hasDepartureTime: false,
        accuracyNote: '即時到站備援',
        desc: '雲端 Lite 公車網，提供即時到站預估與車流輔助追蹤（無提供正式歷史時刻）。'
      },
      volunteerSource
    ];
  }

  // 132, 133, 133A custom handlers based on specific lists
  if (matchedRoute === '132') {
    return [
      {
        id: 'src-tycg-132',
        name: '桃園公車動態',
        status: '正常',
        latency: 1.2,
        url: 'https://ebus.tycg.gov.tw/ebus/driving-map/3220',
        hasTimetable: true,
        hasDepartureTime: true,
        accuracyNote: '即時到站/動態',
        desc: '桃園公車動態資訊系統，提供對應的 GPS 與行進中即時到站估時。'
      },
      {
        id: 'src-busgooo-132',
        name: 'Busgooo/TDX',
        status: '正常',
        latency: 1.4,
        url: 'https://www.busgooo.com/bus/TAO3220',
        hasTimetable: true,
        hasDepartureTime: true,
        accuracyNote: '班表備援',
        desc: '介接 TDX 全國運輸不定期同步班表，提供多站點發車時間與歷史班次記錄。'
      },
      {
        id: 'src-yunbus-132',
        name: '雲端公車',
        status: '正常',
        latency: 1.1,
        url: 'https://yunbus.tw/lite/route.php?id=TAO3220',
        hasTimetable: false,
        hasDepartureTime: false,
        accuracyNote: '即時到站備援',
        desc: '雲端 Lite 公車網，提供即時到站預估與車流輔助追蹤（無提供正式歷史時刻）。'
      },
      volunteerSource
    ];
  }

  if (matchedRoute === '133') {
    return [
      {
        id: 'src-chungli-133',
        name: '中壢客運',
        status: '正常',
        latency: 0.8,
        url: 'https://www.chunglibus.com.tw/route/133-2.html',
        hasTimetable: true,
        hasDepartureTime: true,
        accuracyNote: '官方班表/營運來源',
        desc: '中壢客運官方發佈之營運班表與路線，最核心的行車依據。'
      },
      {
        id: 'src-tycg-133',
        name: '桃園公車動態',
        status: '正常',
        latency: 1.2,
        url: 'https://ebus.tycg.gov.tw/ebus/driving-map/133',
        hasTimetable: true,
        hasDepartureTime: true,
        accuracyNote: '即時到站/動態',
        desc: '桃園公車動態資訊系統，提供對應的 GPS 與行進中即時到站估時。'
      },
      {
        id: 'src-busgooo-133',
        name: 'Busgooo/TDX',
        status: '正常',
        latency: 1.4,
        url: 'https://www.busgooo.com/bus/TAO133',
        hasTimetable: true,
        hasDepartureTime: true,
        accuracyNote: '班表備援',
        desc: '介接 TDX 全國運輸不定期同步班表，提供多站點發車時間與歷史班次記錄。'
      },
      {
        id: 'src-yunbus-133',
        name: '雲端公車',
        status: '正常',
        latency: 1.1,
        url: 'https://yunbus.tw/lite/route.php?id=TAO133',
        hasTimetable: false,
        hasDepartureTime: false,
        accuracyNote: '即時到站備援',
        desc: '雲端 Lite 公車網，提供即時到站預估與車流輔助追蹤（無提供正式歷史時刻）。'
      },
      volunteerSource
    ];
  }

  if (matchedRoute === '133A') {
    return [
      {
        id: 'src-chungli-133a',
        name: '中壢客運',
        status: '正常',
        latency: 0.8,
        url: 'https://www.chunglibus.com.tw/route/133A.html',
        hasTimetable: true,
        hasDepartureTime: true,
        accuracyNote: '官方班表/試辦路線',
        desc: '中壢客運官方發佈之營運班表與試辦路線，最核心的行車依據。'
      },
      {
        id: 'src-tycg-133a',
        name: '桃園公車動態',
        status: '正常',
        latency: 1.2,
        url: 'https://ebus.tycg.gov.tw/ebus/driving-map/1331',
        hasTimetable: true,
        hasDepartureTime: true,
        accuracyNote: '即時到站/動態',
        desc: '桃園公車動態資訊系統，提供對應的 GPS 與行進中即時到站估時。'
      },
      {
        id: 'src-busgooo-133a',
        name: 'Busgooo/TDX',
        status: '正常',
        latency: 1.4,
        url: 'https://www.busgooo.com/bus/TAO1331',
        hasTimetable: true,
        hasDepartureTime: true,
        accuracyNote: '班表備援',
        desc: '介接 TDX 全國運輸不定期同步班表，提供多站點發車時間與歷史班次記錄。'
      },
      {
        id: 'src-yunbus-133a',
        name: '雲端公車',
        status: '正常',
        latency: 1.1,
        url: 'https://yunbus.tw/lite/route.php?id=TAO1331',
        hasTimetable: false,
        hasDepartureTime: false,
        accuracyNote: '即時到站備援',
        desc: '雲端 Lite 公車網，提供即時到站預估與車流輔助追蹤（無提供正式歷史時刻）。'
      },
      volunteerSource
    ];
  }

  // Fallback to average initial sources
  return [
    {
      id: 'src-tycg-gen',
      name: '桃園公車動態',
      status: '正常',
      latency: 1.2,
      url: 'https://ebus.tycg.gov.tw/ebus/driving-map/65433',
      hasTimetable: true,
      hasDepartureTime: true,
      accuracyNote: '即時到站/動態',
      desc: '桃園公車動態資訊系統主站。'
    },
    volunteerSource
  ];
}

