/**
  時刻文字列 "HH:mm" をその日の開始（00:00）からの経過分に変換
 */
export function timeToMinutes(timeStr: string): number {
  if (!timeStr || !timeStr.includes(':')) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

/**
 * 就寝時刻から起床時刻までの総臥床時間(TIB)を計算（分単位）
 * 日跨ぎ（例: 23:30就寝 → 07:00起床）に完全対応
 */
export function calculateTIB(bedtime: string, wakeTime: string): number {
  const startMins = timeToMinutes(bedtime);
  const endMins = timeToMinutes(wakeTime);

  if (endMins >= startMins) {
    return endMins - startMins;
  } else {
    // 日を跨いだ場合 (例: 23:30 (1410分) 〜 07:00 (420分) -> 1440 - 1410 + 420 = 450分)
    return 1440 - startMins + endMins;
  }
}

/**
 * 最終覚醒時刻から起床時刻までの経過時間(EMA)を計算（分単位）
 */
export function calculateEMA(finalAwakening: string, wakeTime: string): number {
  if (!finalAwakening || !wakeTime) return 0;
  const finalMins = timeToMinutes(finalAwakening);
  const wakeMins = timeToMinutes(wakeTime);

  if (wakeMins >= finalMins) {
    return wakeMins - finalMins;
  } else {
    // 日跨ぎ（深夜に最終覚醒、翌朝起床など）
    return 1440 - finalMins + wakeMins;
  }
}

/**
 * 実睡眠時間 (TST) を計算 (分単位)
 * TST = TIB - (SOL + WASO + EMA)
 */
export function calculateTST(
  tibMinutes: number,
  sol: number,
  waso: number,
  ema: number
): number {
  const awakeTotal = (sol || 0) + (waso || 0) + (ema || 0);
  return Math.max(0, tibMinutes - awakeTotal);
}

/**
 * 睡眠効率 (SE) を計算 (%) - 小数第1位四捨五入
 * SE = (TST / TIB) * 100
 */
export function calculateSE(tstMinutes: number, tibMinutes: number): number {
  if (tibMinutes <= 0) return 0;
  const ratio = (tstMinutes / tibMinutes) * 100;
  return Math.round(ratio * 10) / 10;
}

/**
 * 分単位の数値を「X時間Y分」形式の文字列に変換
 */
export function formatMinutesToHM(minutes: number): string {
  if (minutes <= 0) return '0分';
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs === 0) return `${mins}分`;
  if (mins === 0) return `${hrs}時間`;
  return `${hrs}時間${mins}分`;
}

/**
 * 日付フォーマットヘルパー (YYYY-MM-DD -> M月D日(曜日))
 */
export function formatDateJP(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T00:00:00');
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const days = ['日', '月', '火', '水', '木', '金', '土'];
  const dayOfWeek = days[date.getDay()];
  return `${month}月${day}日(${dayOfWeek})`;
}
