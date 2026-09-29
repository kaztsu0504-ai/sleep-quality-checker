import type { SleepLog, AdviceResult, AdviceItem } from '../types/sleep';


export function generateSleepAdvice(log: Partial<SleepLog>): AdviceResult {
  const se = log.sePercent ?? 0;
  const sol = log.sol ?? 0;
  const waso = log.waso ?? 0;
  const tst = log.tstMinutes ?? 0;
  const restfulness = log.restfulnessScore ?? 3;
  const disruption = log.daytimeDisruptionScore ?? 3;

  // 1. SE 判定
  let efficiencyAdvice: AdviceItem;
  if (se >= 85) {
    efficiencyAdvice = {
      id: 'se-good',
      type: 'se',
      level: 'good',
      title: '良好な睡眠効率（85%以上）',
      message: '良好な睡眠効率です。寝床にいる時間と実際の睡眠がしっかり一致しています。このリズムを維持しましょう。',
    };
  } else if (se >= 80) {
    efficiencyAdvice = {
      id: 'se-normal',
      type: 'se',
      level: 'info',
      title: '標準的な睡眠効率（80%〜84%）',
      message: '標準的な範囲です。日中の眠気や疲労感がないか確認しましょう。',
    };
  } else {
    efficiencyAdvice = {
      id: 'se-low',
      type: 'se',
      level: 'warning',
      title: '睡眠効率の低下（80%未満）',
      message: '寝床にいる時間に対して実睡眠時間が短くなっています。眠気を感じてから寝床に入る、朝目覚めたらダラダラ横にならず起き上がるなどの調整を試してみましょう。',
    };
  }

  // 2. SOL 判定
  let solAdvice: AdviceItem | undefined;
  if (sol >= 30) {
    solAdvice = {
      id: 'sol-high',
      type: 'sol',
      level: 'warning',
      title: '入眠までの時間が長め（30分以上）',
      message: '寝付くまでに時間がかかっているようです。就寝前の画面光（スマホ・PC）のカットや、ぬるめのお湯での入浴、リラックスできるルーティンを取り入れてみてください。',
    };
  }

  // 3. WASO 判定
  let wasoAdvice: AdviceItem | undefined;
  if (waso >= 30) {
    wasoAdvice = {
      id: 'waso-high',
      type: 'waso',
      level: 'warning',
      title: '中途覚醒が目立ちます（30分以上）',
      message: '夜間の覚醒が目立ちます。室温・湿度、寝具環境、就寝前の水分やアルコール摂取量を見直してみましょう。',
    };
  }

  // 4. 主観・客観乖離 & 支障度判定
  let subjectiveAdvice: AdviceItem | undefined;
  if (se >= 85 && tst >= 360 && restfulness <= 2) {
    subjectiveAdvice = {
      id: 'subj-gap-low-rest',
      type: 'subjective',
      level: 'info',
      title: '客観データと熟睡感の乖離',
      message: '睡眠時間と効率は確保されていますが、熟睡感の低さが気になる状態です。深い睡眠（N3/ノンレム睡眠）を増やすため、就寝前の温浴や体温調節、部屋の遮光を見直すことが効果的です。',
    };
  } else if (se < 80 && disruption >= 4) {
    subjectiveAdvice = {
      id: 'subj-high-disruption',
      type: 'subjective',
      level: 'warning',
      title: '日中の支障・眠気が強い状態',
      message: '睡眠効率が低下し、日中の支障スコアが高めです。寝床で起きたまま過ごす時間を減らし、「眠気を感じてから寝床に入る」刺激制御法を試すことで、睡眠の凝縮度が高まります。',
    };
  } else if (restfulness >= 4 && disruption <= 2) {
    subjectiveAdvice = {
      id: 'subj-excellent',
      type: 'subjective',
      level: 'good',
      title: '主観的な満足度が高い状態',
      message: '熟睡感が高く、日中の支障もほとんどありません。非常に素晴らしい睡眠の質が保たれています！',
    };
  }

  // 総合サマリー
  let overallSummary = '';
  if (se >= 85 && restfulness >= 4) {
    overallSummary = '理想的な質の高い睡眠です。素晴らしいコンディションです。';
  } else if (se < 80 || sol >= 30 || waso >= 30) {
    overallSummary = '睡眠の効率またはスムーズな入眠・維持に改善の余地があります。下記のアドバイスをご参照ください。';
  } else {
    overallSummary = '概ね安定した睡眠状態です。小さな調整でさらに質を高められます。';
  }

  return {
    efficiencyAdvice,
    solAdvice,
    wasoAdvice,
    subjectiveAdvice,
    overallSummary,
  };
}
