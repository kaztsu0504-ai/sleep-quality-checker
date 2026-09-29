import React, { useState, useEffect } from 'react';
import type { SleepLog } from '../types/sleep';
import { calculateTIB, calculateEMA, calculateTST, calculateSE } from '../utils/calculations';
import { generateSleepAdvice } from '../utils/adviceEngine';
import { ScoreRating } from './ScoreRating';
import { SummaryCards } from './SummaryCards';
import { AdviceCard } from './AdviceCard';
import { Calendar, Clock, Save, CheckCircle, RefreshCw, FileText, Activity } from 'lucide-react';

interface DailyFormProps {
  onSaveLog: (log: Omit<SleepLog, 'id' | 'tibMinutes' | 'tstMinutes' | 'sePercent' | 'ema'> & { id?: string; ema?: number }) => void;
  editingLog?: SleepLog | null;
  onClearEdit?: () => void;
}

export const DailyForm: React.FC<DailyFormProps> = ({
  onSaveLog,
  editingLog,
  onClearEdit,
}) => {
  const getTodayStr = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const [date, setDate] = useState<string>(getTodayStr());
  const [bedtime, setBedtime] = useState<string>('23:30');
  const [sol, setSol] = useState<number>(15);
  const [waso, setWaso] = useState<number>(10);
  const [finalAwakening, setFinalAwakening] = useState<string>('06:45');
  const [wakeTime, setWakeTime] = useState<string>('07:00');
  const [emaManual, setEmaManual] = useState<number | null>(null);
  const [restfulnessScore, setRestfulnessScore] = useState<number>(4);
  const [daytimeDisruptionScore, setDaytimeDisruptionScore] = useState<number>(1);
  const [notes, setNotes] = useState<string>('');

  const [isSavedNotice, setIsSavedNotice] = useState<boolean>(false);

  useEffect(() => {
    if (editingLog) {
      setDate(editingLog.date);
      setBedtime(editingLog.bedtime);
      setSol(editingLog.sol);
      setWaso(editingLog.waso);
      setFinalAwakening(editingLog.finalAwakening);
      setWakeTime(editingLog.wakeTime);
      setEmaManual(editingLog.ema);
      setRestfulnessScore(editingLog.restfulnessScore);
      setDaytimeDisruptionScore(editingLog.daytimeDisruptionScore);
      setNotes(editingLog.notes || '');
    }
  }, [editingLog]);

  const tibMinutes = calculateTIB(bedtime, wakeTime);
  const autoEma = calculateEMA(finalAwakening, wakeTime);
  const effectiveEma = emaManual !== null ? emaManual : autoEma;
  const tstMinutes = calculateTST(tibMinutes, sol, waso, effectiveEma);
  const sePercent = calculateSE(tstMinutes, tibMinutes);

  const previewLog: Partial<SleepLog> = {
    date,
    bedtime,
    sol,
    waso,
    finalAwakening,
    wakeTime,
    ema: effectiveEma,
    restfulnessScore,
    daytimeDisruptionScore,
    tibMinutes,
    tstMinutes,
    sePercent,
  };

  const adviceResult = generateSleepAdvice(previewLog);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveLog({
      id: editingLog?.id,
      date,
      bedtime,
      sol,
      waso,
      finalAwakening,
      wakeTime,
      ema: effectiveEma,
      restfulnessScore,
      daytimeDisruptionScore,
      notes,
    });

    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);

    if (editingLog && onClearEdit) {
      onClearEdit();
    }
  };

  const handleResetForm = () => {
    setDate(getTodayStr());
    setBedtime('23:30');
    setSol(15);
    setWaso(10);
    setFinalAwakening('06:45');
    setWakeTime('07:00');
    setEmaManual(null);
    setRestfulnessScore(4);
    setDaytimeDisruptionScore(1);
    setNotes('');
    if (onClearEdit) onClearEdit();
  };

  return (
    <div className="space-y-6">
      
      {/* 編集バナー */}
      {editingLog && (
        <div className="p-4 rounded-2xl bg-indigo-950/90 border border-indigo-500/50 flex items-center justify-between text-sm text-indigo-100 shadow-lg">
          <span className="font-bold flex items-center space-x-2">
            <Activity className="w-5 h-5 text-indigo-400" />
            <span>【編集モード】{editingLog.date} の記録を編集しています</span>
          </span>
          <button
            onClick={handleResetForm}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
          >
            新規入力に戻る
          </button>
        </div>
      )}

      {/* リアルタイム計算結果サマリー */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-slate-100 uppercase tracking-wider flex items-center space-x-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            <span>リアルタイム計算プレビュー</span>
          </h2>
          <span className="text-xs text-slate-300">入力にあわせて自動算出</span>
        </div>
        <SummaryCards
          tibMinutes={tibMinutes}
          tstMinutes={tstMinutes}
          sePercent={sePercent}
          sol={sol}
          waso={waso}
          ema={effectiveEma}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 入力フォーム */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 glass-panel rounded-2xl p-5 sm:p-6 border border-slate-800 space-y-6">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-base sm:text-lg font-bold text-slate-100 flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-cyan-400" />
              <span>{editingLog ? '睡眠日誌の編集' : '今日の睡眠を記録する'}</span>
            </h3>
            <button
              type="button"
              onClick={handleResetForm}
              className="text-xs sm:text-sm text-slate-400 hover:text-slate-200 flex items-center space-x-1"
            >
              <RefreshCw className="w-4 h-4" />
              <span>リセット</span>
            </button>
          </div>

          {/* 1. 日付 */}
          <div>
            <label className="block text-sm font-bold text-slate-200 mb-1.5">
              1. 記録対象の日付
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-500 rounded-xl px-4 py-3 text-base text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 min-h-[48px]"
            />
          </div>

          {/* 2 & 6. 就寝時刻 と 起床時刻 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-200 mb-1">
                2. 就寝時刻 (寝床に入った時間)
              </label>
              <input
                type="time"
                value={bedtime}
                onChange={(e) => setBedtime(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-500 rounded-xl px-4 py-3 text-base text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 min-h-[48px]"
              />
              <span className="text-xs text-slate-400 mt-1 block">布団に入った時刻 (hh:mm)</span>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-200 mb-1">
                6. 起床時刻 (布団を出た時間)
              </label>
              <input
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-500 rounded-xl px-4 py-3 text-base text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 min-h-[48px]"
              />
              <span className="text-xs text-slate-400 mt-1 block">布団を出て活動開始した時刻</span>
            </div>
          </div>

          {/* 3 & 4. 入眠潜時 (SOL) と 中途覚醒 (WASO) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            {/* SOL */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-slate-200">
                  3. 入眠潜時 (SOL / 寝付くまで)
                </label>
                <span className="text-base font-extrabold text-cyan-400">{sol} 分</span>
              </div>
              <input
                type="range"
                min={0}
                max={120}
                step={5}
                value={sol}
                onChange={(e) => setSol(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer h-3 rounded-lg bg-slate-800"
              />
              <div className="flex gap-2 pt-1 flex-wrap">
                {[5, 15, 30, 45, 60].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setSol(m)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      sol === m
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-400 ring-1 ring-cyan-400'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {m}分
                  </button>
                ))}
              </div>
            </div>

            {/* WASO */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-slate-200">
                  4. 中途覚醒時間 (WASO / 夜間覚醒)
                </label>
                <span className="text-base font-extrabold text-cyan-400">{waso} 分</span>
              </div>
              <input
                type="range"
                min={0}
                max={180}
                step={5}
                value={waso}
                onChange={(e) => setWaso(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer h-3 rounded-lg bg-slate-800"
              />
              <div className="flex gap-2 pt-1 flex-wrap">
                {[0, 10, 20, 30, 60].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setWaso(m)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      waso === m
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-400 ring-1 ring-cyan-400'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {m}分
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* 5 & 7. 最終覚醒時刻 & 早朝覚醒時間 (EMA) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-200 mb-1">
                5. 最終覚醒時刻 (朝最後に目覚めた時間)
              </label>
              <input
                type="time"
                value={finalAwakening}
                onChange={(e) => setFinalAwakening(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-500 rounded-xl px-4 py-3 text-base text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 min-h-[48px]"
              />
              <span className="text-xs text-slate-400 mt-1 block">朝、最後に完全に目が覚めた時刻</span>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-bold text-slate-200">
                  7. 早朝覚醒時間 (EMA)
                </label>
                <span className="text-xs text-slate-300">
                  自動算出: <strong className="text-cyan-400 font-bold">{autoEma}分</strong>
                </span>
              </div>
              <input
                type="number"
                min={0}
                max={300}
                value={effectiveEma}
                onChange={(e) => setEmaManual(Number(e.target.value))}
                placeholder={`自動算出: ${autoEma}分`}
                className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-500 rounded-xl px-4 py-3 text-base text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 min-h-[48px]"
              />
              <span className="text-xs text-slate-400 mt-1 block">目覚めてから布団を出るまでの時間（分）</span>
            </div>
          </div>

          {/* 8 & 9. 熟睡感スコア と 日中支障度スコア */}
          <div className="pt-3 border-t border-slate-800 space-y-5">
            <ScoreRating
              label="8. 熟睡感スコア"
              sublabel="起きたときのすっきり感や熟睡度（1:全く眠れなかった 〜 5:ぐっすり眠れた）"
              value={restfulnessScore}
              onChange={setRestfulnessScore}
              type="restfulness"
            />

            <ScoreRating
              label="9. 日中の支障度スコア"
              sublabel="日中の強い眠気や倦怠感の度合い（1:全く支障なし 〜 5:非常に強い眠気）"
              value={daytimeDisruptionScore}
              onChange={setDaytimeDisruptionScore}
              type="disruption"
            />
          </div>

          {/* 10. メモ欄 */}
          <div className="pt-3 border-t border-slate-800">
            <label className="block text-sm font-bold text-slate-200 mb-1.5 flex items-center space-x-1.5">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>10. メモ欄 (自由記述)</span>
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="カフェイン摂取（16時以降コーヒー）、運動（夜ジョギング）、アルコール、ストレスなど..."
              className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-500 rounded-xl p-3.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none"
            />
          </div>

          {/* 送信ボタン */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="submit"
              className="w-full sm:flex-1 bg-gradient-to-r from-indigo-600 via-cyan-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-black py-4 px-6 rounded-2xl shadow-xl shadow-cyan-950/70 transition-all duration-200 flex items-center justify-center space-x-2 text-base cursor-pointer active:scale-98 min-h-[52px]"
            >
              <Save className="w-5 h-5" />
              <span>{editingLog ? '更新して保存する' : '睡眠日誌を保存する'}</span>
            </button>

            {isSavedNotice && (
              <span className="flex items-center space-x-1 text-sm text-emerald-400 font-bold animate-bounce">
                <CheckCircle className="w-5 h-5" />
                <span>保存完了！</span>
              </span>
            )}
          </div>

        </form>

        {/* 右カラム: リアルタイムアドバイスプレビュー */}
        <div className="lg:col-span-5 space-y-4">
          <AdviceCard advice={adviceResult} />

          {/* 睡眠計算式の補足ヘルプ */}
          <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-800 text-xs sm:text-sm text-slate-300 space-y-2">
            <h4 className="font-bold text-slate-200 flex items-center space-x-1.5 text-sm sm:text-base">
              <span>💡 睡眠指標の計算方法</span>
            </h4>
            <ul className="space-y-1.5 list-disc list-inside text-xs sm:text-sm leading-relaxed">
              <li><strong className="text-slate-100">TIB (総臥床時間):</strong> 就寝時刻〜起床時刻</li>
              <li><strong className="text-slate-100">TST (実睡眠時間):</strong> TIB - (SOL + WASO + EMA)</li>
              <li><strong className="text-slate-100">SE (睡眠効率):</strong> (TST / TIB) × 100%</li>
            </ul>
          </div>
        </div>

      </div>

    </div>
  );
};
