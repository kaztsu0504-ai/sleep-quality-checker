import React from 'react';
import { Star, Zap } from 'lucide-react';

interface ScoreRatingProps {
  label: string;
  sublabel?: string;
  value: number;
  onChange: (val: number) => void;
  type?: 'restfulness' | 'disruption';
}

export const ScoreRating: React.FC<ScoreRatingProps> = ({
  label,
  sublabel,
  value,
  onChange,
  type = 'restfulness',
}) => {
  const getRatingInfo = (score: number) => {
    if (type === 'restfulness') {
      switch (score) {
        case 1:
          return { label: '1: 全く眠れなかった', color: 'text-rose-300 border-rose-500/40 bg-rose-950/40' };
        case 2:
          return { label: '2: あまり眠れなかった', color: 'text-orange-300 border-orange-500/40 bg-orange-950/40' };
        case 3:
          return { label: '3: 普通・まあまあ', color: 'text-amber-300 border-amber-500/40 bg-amber-950/40' };
        case 4:
          return { label: '4: しっかり眠れた', color: 'text-emerald-300 border-emerald-500/40 bg-emerald-950/40' };
        case 5:
          return { label: '5: ぐっすり眠れた（快眠）', color: 'text-cyan-300 border-cyan-500/40 bg-cyan-950/40' };
        default:
          return { label: '未選択', color: 'text-slate-400 border-slate-700 bg-slate-900' };
      }
    } else {
      switch (score) {
        case 1:
          return { label: '1: 全く支障なし（快適）', color: 'text-emerald-300 border-emerald-500/40 bg-emerald-950/40' };
        case 2:
          return { label: '2: わずかに気になる程度', color: 'text-cyan-300 border-cyan-500/40 bg-cyan-950/40' };
        case 3:
          return { label: '3: やや眠気やだるさあり', color: 'text-amber-300 border-amber-500/40 bg-amber-950/40' };
        case 4:
          return { label: '4: 強い眠気・効率低下あり', color: 'text-orange-300 border-orange-500/40 bg-orange-950/40' };
        case 5:
          return { label: '5: 非常に強い眠気・倦怠感', color: 'text-rose-300 border-rose-500/40 bg-rose-950/40' };
        default:
          return { label: '未選択', color: 'text-slate-400 border-slate-700 bg-slate-900' };
      }
    }
  };

  const info = getRatingInfo(value);

  return (
    <div className="space-y-2.5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <label className="text-base font-bold text-slate-100">
          {label}
          {sublabel && <span className="block text-xs sm:text-sm text-slate-300 font-normal mt-0.5">{sublabel}</span>}
        </label>
        <span className={`text-xs sm:text-sm px-3 py-1 rounded-lg border font-bold ${info.color} self-start sm:self-auto`}>
          {info.label}
        </span>
      </div>

      <div className="grid grid-cols-5 gap-2 sm:gap-3">
        {[1, 2, 3, 4, 5].map((score) => {
          const isSelected = value === score;
          return (
            <button
              key={score}
              type="button"
              onClick={() => onChange(score)}
              className={`py-3 px-1.5 rounded-2xl border flex flex-col items-center justify-center space-y-1.5 transition-all duration-150 active:scale-95 cursor-pointer min-h-[56px] ${
                isSelected
                  ? 'bg-slate-800 border-cyan-400 shadow-lg shadow-cyan-950/60 scale-[1.03] ring-2 ring-cyan-500/50'
                  : 'bg-slate-900/80 border-slate-700 hover:border-slate-500 text-slate-400 hover:text-slate-200'
              }`}
            >
              {type === 'restfulness' ? (
                <Star
                  className={`w-6 h-6 ${
                    isSelected ? 'text-amber-400 fill-amber-400' : 'text-slate-500'
                  }`}
                />
              ) : (
                <Zap
                  className={`w-6 h-6 ${
                    isSelected ? 'text-cyan-400 fill-cyan-400/30' : 'text-slate-500'
                  }`}
                />
              )}
              <span className={`text-sm sm:text-base font-extrabold ${isSelected ? 'text-slate-100' : 'text-slate-400'}`}>
                {score}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
