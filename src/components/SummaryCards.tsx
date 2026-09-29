import React from 'react';
import { Clock, Moon, Percent, AlertCircle } from 'lucide-react';
import { formatMinutesToHM } from '../utils/calculations';

interface SummaryCardsProps {
  tibMinutes: number;
  tstMinutes: number;
  sePercent: number;
  sol: number;
  waso: number;
  ema: number;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  tibMinutes,
  tstMinutes,
  sePercent,
  sol,
  waso,
  ema,
}) => {
  const awakeTotal = (sol || 0) + (waso || 0) + (ema || 0);

  const getSEBadgeClass = (se: number) => {
    if (se >= 85) return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40';
    if (se >= 80) return 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40';
    return 'bg-amber-950/80 text-amber-300 border-amber-500/40';
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      
      {/* 1. 総臥床時間 (TIB) */}
      <div className="glass-card rounded-2xl p-4 sm:p-5 relative overflow-hidden group border border-slate-800 hover:border-indigo-500/40 transition-all duration-300">
        <div className="flex items-center justify-between text-slate-300 mb-2">
          <span className="text-xs sm:text-sm font-bold text-slate-300 tracking-wide uppercase">総臥床時間 (TIB)</span>
          <div className="p-2 rounded-xl bg-indigo-950/80 text-indigo-400 border border-indigo-500/30">
            <Clock className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline space-x-1">
          <span className="text-2xl sm:text-4xl font-black text-slate-100 tracking-tight">
            {formatMinutesToHM(tibMinutes)}
          </span>
        </div>
        <div className="mt-2 text-xs text-slate-300">
          布団の中にいた合計時間 ({tibMinutes}分)
        </div>
        <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-indigo-500/10 rounded-full blur-xl" />
      </div>

      {/* 2. 実睡眠時間 (TST) */}
      <div className="glass-card rounded-2xl p-4 sm:p-5 relative overflow-hidden group border border-slate-800 hover:border-cyan-500/40 transition-all duration-300">
        <div className="flex items-center justify-between text-slate-300 mb-2">
          <span className="text-xs sm:text-sm font-bold text-cyan-400 tracking-wide uppercase">実睡眠時間 (TST)</span>
          <div className="p-2 rounded-xl bg-cyan-950/80 text-cyan-400 border border-cyan-500/30">
            <Moon className="w-5 h-5 fill-cyan-400/20" />
          </div>
        </div>
        <div className="flex items-baseline space-x-1">
          <span className="text-2xl sm:text-4xl font-black text-cyan-300 tracking-tight">
            {formatMinutesToHM(tstMinutes)}
          </span>
        </div>
        <div className="mt-2 text-xs text-cyan-200 font-semibold">
          実際に眠れていた時間 ({tstMinutes}分)
        </div>
        <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-cyan-500/10 rounded-full blur-xl" />
      </div>

      {/* 3. 睡眠効率 (SE) */}
      <div className="glass-card rounded-2xl p-4 sm:p-5 relative overflow-hidden group border border-slate-800 hover:border-emerald-500/40 transition-all duration-300">
        <div className="flex items-center justify-between text-slate-300 mb-2">
          <span className="text-xs sm:text-sm font-bold text-emerald-400 tracking-wide uppercase">睡眠効率 (SE)</span>
          <div className="p-2 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
            <Percent className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl sm:text-4xl font-black text-emerald-300 tracking-tight">
            {sePercent}%
          </span>
          <span className={`text-xs px-2.5 py-0.5 rounded-full border font-bold ${getSEBadgeClass(sePercent)}`}>
            {sePercent >= 85 ? '良好 (85%+)' : sePercent >= 80 ? '標準' : '調整推奨'}
          </span>
        </div>
        <div className="mt-2 text-xs text-slate-300">
          目標目安: 85%以上で質が高い
        </div>
        <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl" />
      </div>

      {/* 4. 夜間覚醒・ロス時間 */}
      <div className="glass-card rounded-2xl p-4 sm:p-5 relative overflow-hidden group border border-slate-800 hover:border-amber-500/40 transition-all duration-300">
        <div className="flex items-center justify-between text-slate-300 mb-2">
          <span className="text-xs sm:text-sm font-bold text-amber-400 tracking-wide uppercase">夜間起きている時間</span>
          <div className="p-2 rounded-xl bg-amber-950/80 text-amber-400 border border-amber-500/30">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline space-x-1">
          <span className="text-3xl sm:text-4xl font-black text-amber-300 tracking-tight">
            {awakeTotal}分
          </span>
        </div>
        <div className="mt-2 text-xs text-slate-300 flex flex-wrap gap-x-2">
          <span>入眠:{sol}分</span>
          <span>中途:{waso}分</span>
          <span>早朝:{ema}分</span>
        </div>
        <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-amber-500/10 rounded-full blur-xl" />
      </div>

    </div>
  );
};
