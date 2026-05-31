export type ReportCategory = '公車已離站' | '班次延遲' | '班次未出現' | '方向或班次不符' | '其他問題';

export interface CrowdReport {
  id: string;
  routeName: string;
  stationName: string;
  category: ReportCategory;
  content: string;
  time: string; // HH:MM
  timestamp: number;
  user: string;
  likes: number;
  status: '已處理' | '審核中' | '待審核';
  photoUrl?: string;
  anonymous: boolean;
}

export interface BusRoute {
  id: string;
  name: string;
  from: string;
  to: string;
  estimateMin: number;
  credibility: '高可信度' | '中可信度' | '疑似異動' | '疑似已過站';
  confidencePct: number;
  status: '正常' | '延遲' | '嚴重延遲' | '末班車已過';
  punctuality: number; // percentage
  activeBuses: number;
  normalBuses: number;
  delayMins: number;
  isTrial?: boolean;
  trialPeriod?: string;
  routeStatus?: string;
}

export interface DataSource {
  id: string;
  name: string;
  status: '正常' | '延遲' | '異常';
  latency: number; // in seconds
  url?: string;
  hasTimetable?: boolean;
  hasDepartureTime?: boolean;
  accuracyNote?: string;
  desc?: string;
}

export interface AnomalyEvent {
  id: string;
  routeName: string;
  fromStation: string;
  toStation: string;
  type: '嚴重延遲' | '延遲' | '末班車已過';
  detail: string;
  time: string;
}

export interface DelayTrendPoint {
  time: string;
  route132: number;
  route172: number;
  route9025A: number;
}
