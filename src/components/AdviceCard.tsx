import React from 'react';
import type { AdviceResult, AdviceItem } from '../types/sleep';
import { CheckCircle2, AlertTriangle, Info, Sparkles, Lightbulb } from 'lucide-react';

interface AdviceCardProps {
  advice: AdviceResult;
}

export const AdviceCard: React.FC<AdviceCardProps> = ({ advice }) => {
  const renderItem = (item?: AdviceItem) => {
    if (!item) return null;

    let icon = <Info className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />;
    let badgeClass = 'bg-cyan-950/60 text-cyan-200 border-cyan-700/60';

    if (item.level === 'good') {
      icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />;
      badgeClass = 'bg-emerald-950/60 text-emerald-200 border-emerald-700/60';
    } else if (item.level === 'warning') {
      icon = <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />;
      badgeClass = 'bg-amber-950/60 text-amber-200 border-amber-700/60';
    }

    return (
      <div key={item.id} className={`p-4 rounded-xl border ${badgeClass} space-y-1.5 transition-all shadow-sm`}>
        <div className="flex items-start space-x-2.5">
          {icon}
          <div>
            <h4 className="text-sm font-bold tracking-wide">{item.title}</h4>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mt-1">{item.message}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800 relative overflow-hidden">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white shadow-md shadow-cyan-950/40">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
            <span>AIスリープ・アドバイス</span>
          </h3>
          <p className="text-xs text-slate-300">入力された睡眠指標に基づく判定コメント</p>
        </div>
      </div>

      {/* 総合サマリー */}
      <div className="mb-4 p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 flex items-start space-x-3">
        <Lightbulb className="w-5 h-5 text-amber-300 mt-0.5 shrink-0 animate-pulse" />
        <p className="text-xs sm:text-sm font-semibold text-slate-100 leading-relaxed">
          {advice.overallSummary}
        </p>
      </div>

      {/* 個別診断リスト */}
      <div className="space-y-3">
        {renderItem(advice.efficiencyAdvice)}
        {renderItem(advice.solAdvice)}
        {renderItem(advice.wasoAdvice)}
        {renderItem(advice.subjectiveAdvice)}
      </div>
    </div>
  );
};
