export interface SleepLog {
  id: string;
  date: string; // YYYY-MM-DD
  bedtime: string; // hh:mm (Time in Bed - Start)
  sol: number; // Sleep Onset Latency (minutes)
  waso: number; // Wake After Sleep Onset (minutes)
  finalAwakening: string; // hh:mm
  wakeTime: string; // hh:mm (Time in Bed - End)
  ema: number; // Early Morning Awakening (minutes) - auto/manual
  restfulnessScore: number; // 1 to 5
  daytimeDisruptionScore: number; // 1 to 5
  notes: string;
  
  // Calculated fields (stored for history)
  tibMinutes: number; // Total Time in Bed
  tstMinutes: number; // Total Sleep Time
  sePercent: number; // Sleep Efficiency (%)
}

export interface AdviceItem {
  id: string;
  type: 'se' | 'sol' | 'waso' | 'subjective' | 'general';
  level: 'good' | 'warning' | 'info';
  title: string;
  message: string;
}

export interface AdviceResult {
  efficiencyAdvice: AdviceItem;
  solAdvice?: AdviceItem;
  wasoAdvice?: AdviceItem;
  subjectiveAdvice?: AdviceItem;
  overallSummary: string;
}

export interface SleepColumn {
  id: string;
  title: string;
  category: '基礎知識' | '実践法' | '生活習慣' | 'リカバリー';
  readTimeMinutes: number;
  summary: string;
  content: string; // Markdown / HTML text
  tags: string[];
  imageUrl?: string;
}

export interface PeriodStats {
  avgTSTMinutes: number;
  avgSEPercent: number;
  avgSOLMinutes: number;
  avgWASOMinutes: number;
  avgRestfulness: number;
  avgDaytimeDisruption: number;
  totalLogs: number;
}
