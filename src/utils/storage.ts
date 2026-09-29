import type { SleepLog, PeriodStats } from '../types/sleep';

import { calculateTIB, calculateEMA, calculateTST, calculateSE } from './calculations';

const STORAGE_KEY = 'somnocraft_sleep_logs_v1';

// 初回体験用のリアリティのある14日間モックデータ
const INITIAL_MOCK_LOGS: SleepLog[] = [
  {
    id: 'log-14',
    date: '2026-09-17',
    bedtime: '23:15',
    sol: 15,
    waso: 10,
    finalAwakening: '06:45',
    wakeTime: '07:00',
    ema: 15,
    restfulnessScore: 4,
    daytimeDisruptionScore: 1,
    notes: '22:00以降スマホオフ。入浴後に軽いストレッチ。目覚めすっきり。',
    tibMinutes: 465,
    tstMinutes: 425,
    sePercent: 91.4,
  },
  {
    id: 'log-13',
    date: '2026-09-16',
    bedtime: '23:45',
    sol: 25,
    waso: 20,
    finalAwakening: '06:40',
    wakeTime: '07:00',
    ema: 20,
    restfulnessScore: 3,
    daytimeDisruptionScore: 2,
    notes: '少し仕事の考え事をして入眠に時間がかかる。',
    tibMinutes: 435,
    tstMinutes: 370,
    sePercent: 85.1,
  },
  {
    id: 'log-12',
    date: '2026-09-15',
    bedtime: '00:10',
    sol: 35,
    waso: 40,
    finalAwakening: '06:30',
    wakeTime: '07:15',
    ema: 45,
    restfulnessScore: 2,
    daytimeDisruptionScore: 4,
    notes: '夕食時にカフェイン摂取。夜中に何度か目が覚めダラダラ寝床にいた。',
    tibMinutes: 425,
    tstMinutes: 305,
    sePercent: 71.8,
  },
  {
    id: 'log-11',
    date: '2026-09-14',
    bedtime: '23:00',
    sol: 10,
    waso: 10,
    finalAwakening: '06:20',
    wakeTime: '06:30',
    ema: 10,
    restfulnessScore: 5,
    daytimeDisruptionScore: 1,
    notes: '夕方ジョギング5km。就寝前ハーブティー。熟睡感高め！',
    tibMinutes: 450,
    tstMinutes: 420,
    sePercent: 93.3,
  },
  {
    id: 'log-10',
    date: '2026-09-13',
    bedtime: '23:30',
    sol: 20,
    waso: 15,
    finalAwakening: '06:45',
    wakeTime: '07:00',
    ema: 15,
    restfulnessScore: 4,
    daytimeDisruptionScore: 2,
    notes: '休日前の夜。読書をしてリラックス。',
    tibMinutes: 450,
    tstMinutes: 405,
    sePercent: 90.0,
  },
  {
    id: 'log-9',
    date: '2026-09-12',
    bedtime: '00:30',
    sol: 40,
    waso: 35,
    finalAwakening: '07:30',
    wakeTime: '08:30',
    ema: 60,
    restfulnessScore: 2,
    daytimeDisruptionScore: 3,
    notes: '就寝直前まで映画鑑賞。朝ダラダラ過ごしてしまった。',
    tibMinutes: 480,
    tstMinutes: 345,
    sePercent: 71.9,
  },
  {
    id: 'log-8',
    date: '2026-09-11',
    bedtime: '23:00',
    sol: 15,
    waso: 10,
    finalAwakening: '06:20',
    wakeTime: '06:30',
    ema: 10,
    restfulnessScore: 4,
    daytimeDisruptionScore: 1,
    notes: '定期的な睡眠リズム。体調良好。',
    tibMinutes: 450,
    tstMinutes: 415,
    sePercent: 92.2,
  },
  {
    id: 'log-7',
    date: '2026-09-10',
    bedtime: '23:20',
    sol: 20,
    waso: 15,
    finalAwakening: '06:40',
    wakeTime: '06:50',
    ema: 10,
    restfulnessScore: 4,
    daytimeDisruptionScore: 2,
    notes: '',
    tibMinutes: 450,
    tstMinutes: 405,
    sePercent: 90.0,
  },
  {
    id: 'log-6',
    date: '2026-09-09',
    bedtime: '23:50',
    sol: 30,
    waso: 25,
    finalAwakening: '06:30',
    wakeTime: '07:00',
    ema: 30,
    restfulnessScore: 3,
    daytimeDisruptionScore: 3,
    notes: 'エアコンの温度が高く夜間目が覚めた。',
    tibMinutes: 430,
    tstMinutes: 345,
    sePercent: 80.2,
  },
  {
    id: 'log-5',
    date: '2026-09-08',
    bedtime: '22:50',
    sol: 12,
    waso: 8,
    finalAwakening: '06:25',
    wakeTime: '06:30',
    ema: 5,
    restfulnessScore: 5,
    daytimeDisruptionScore: 1,
    notes: '非常に良好。日中運動あり。',
    tibMinutes: 460,
    tstMinutes: 435,
    sePercent: 94.6,
  },
  {
    id: 'log-4',
    date: '2026-09-07',
    bedtime: '23:10',
    sol: 18,
    waso: 12,
    finalAwakening: '06:35',
    wakeTime: '06:45',
    ema: 10,
    restfulnessScore: 4,
    daytimeDisruptionScore: 2,
    notes: '',
    tibMinutes: 455,
    tstMinutes: 415,
    sePercent: 91.2,
  },
  {
    id: 'log-3',
    date: '2026-09-06',
    bedtime: '00:00',
    sol: 25,
    waso: 20,
    finalAwakening: '07:00',
    wakeTime: '07:30',
    ema: 30,
    restfulnessScore: 3,
    daytimeDisruptionScore: 2,
    notes: '少し寝坊気味。',
    tibMinutes: 450,
    tstMinutes: 375,
    sePercent: 83.3,
  },
  {
    id: 'log-2',
    date: '2026-09-05',
    bedtime: '23:30',
    sol: 15,
    waso: 10,
    finalAwakening: '06:45',
    wakeTime: '07:00',
    ema: 15,
    restfulnessScore: 4,
    daytimeDisruptionScore: 1,
    notes: '',
    tibMinutes: 450,
    tstMinutes: 410,
    sePercent: 91.1,
  },
  {
    id: 'log-1',
    date: '2026-09-04',
    bedtime: '23:00',
    sol: 15,
    waso: 15,
    finalAwakening: '06:20',
    wakeTime: '06:30',
    ema: 10,
    restfulnessScore: 4,
    daytimeDisruptionScore: 2,
    notes: 'モック開始日。安定した睡眠。',
    tibMinutes: 450,
    tstMinutes: 410,
    sePercent: 91.1,
  },
];

export function getStoredLogs(): SleepLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_LOGS));
      return INITIAL_MOCK_LOGS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_LOGS));
      return INITIAL_MOCK_LOGS;
    }
    return parsed;
  } catch (e) {
    console.error('Failed to load logs from localStorage', e);
    return INITIAL_MOCK_LOGS;
  }
}

export function saveLog(logData: Omit<SleepLog, 'id' | 'tibMinutes' | 'tstMinutes' | 'sePercent' | 'ema'> & { id?: string; ema?: number }): SleepLog {
  const logs = getStoredLogs();

  const tibMinutes = calculateTIB(logData.bedtime, logData.wakeTime);
  const ema = logData.ema !== undefined && !isNaN(logData.ema)
    ? logData.ema 
    : calculateEMA(logData.finalAwakening, logData.wakeTime);
  const tstMinutes = calculateTST(tibMinutes, logData.sol, logData.waso, ema);
  const sePercent = calculateSE(tstMinutes, tibMinutes);

  const fullLog: SleepLog = {
    ...logData,
    id: logData.id || `log-${Date.now()}`,
    ema,
    tibMinutes,
    tstMinutes,
    sePercent,
  };

  const existingIndex = logs.findIndex((item) => item.id === fullLog.id || item.date === fullLog.date);

  let updatedLogs: SleepLog[];
  if (existingIndex >= 0) {
    updatedLogs = [...logs];
    updatedLogs[existingIndex] = fullLog;
  } else {
    updatedLogs = [fullLog, ...logs];
  }

  // 日付順にソート（降順）
  updatedLogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLogs));
  } catch (e) {
    console.error('Failed to save log to localStorage', e);
  }

  return fullLog;
}

export function deleteLog(id: string): SleepLog[] {
  const logs = getStoredLogs();
  const filtered = logs.filter((log) => log.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error('Failed to delete log', e);
  }
  return filtered;
}

export function resetToMockLogs(): SleepLog[] {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_LOGS));
  } catch (e) {
    console.error('Failed to reset mock data', e);
  }
  return INITIAL_MOCK_LOGS;
}

export function calculatePeriodStats(logs: SleepLog[], periodDays: number = 7): PeriodStats {
  if (!logs || logs.length === 0) {
    return {
      avgTSTMinutes: 0,
      avgSEPercent: 0,
      avgSOLMinutes: 0,
      avgWASOMinutes: 0,
      avgRestfulness: 0,
      avgDaytimeDisruption: 0,
      totalLogs: 0,
    };
  }

  const sliced = periodDays > 0 ? logs.slice(0, periodDays) : logs;
  const count = sliced.length;

  if (count === 0) {
    return {
      avgTSTMinutes: 0,
      avgSEPercent: 0,
      avgSOLMinutes: 0,
      avgWASOMinutes: 0,
      avgRestfulness: 0,
      avgDaytimeDisruption: 0,
      totalLogs: 0,
    };
  }

  const sumTST = sliced.reduce((acc, curr) => acc + curr.tstMinutes, 0);
  const sumSE = sliced.reduce((acc, curr) => acc + curr.sePercent, 0);
  const sumSOL = sliced.reduce((acc, curr) => acc + curr.sol, 0);
  const sumWASO = sliced.reduce((acc, curr) => acc + curr.waso, 0);
  const sumRest = sliced.reduce((acc, curr) => acc + curr.restfulnessScore, 0);
  const sumDisrupt = sliced.reduce((acc, curr) => acc + curr.daytimeDisruptionScore, 0);

  return {
    avgTSTMinutes: Math.round(sumTST / count),
    avgSEPercent: Math.round((sumSE / count) * 10) / 10,
    avgSOLMinutes: Math.round(sumSOL / count),
    avgWASOMinutes: Math.round(sumWASO / count),
    avgRestfulness: Math.round((sumRest / count) * 10) / 10,
    avgDaytimeDisruption: Math.round((sumDisrupt / count) * 10) / 10,
    totalLogs: count,
  };
}
