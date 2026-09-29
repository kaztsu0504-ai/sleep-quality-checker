import React, { useState } from 'react';
import type { SleepLog } from '../types/sleep';
import { formatDateJP, formatMinutesToHM } from '../utils/calculations';
import { Edit2, Trash2, Calendar, Star, MessageSquare } from 'lucide-react';

interface HistoryTableProps {
  logs: SleepLog[];
  onEditLog: (log: SleepLog) => void;
  onDeleteLog: (id: string) => void;
}

export const HistoryTable: React.FC<HistoryTableProps> = ({
  logs,
  onEditLog,
  onDeleteLog,
}) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const confirmDelete = (id: string) => {
    onDeleteLog(id);
    setDeletingId(null);
  };

  if (!logs || logs.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-8 text-center border border-slate-800 text-slate-300">
        <Calendar className="w-10 h-10 text-slate-500 mx-auto mb-2" />
        <p className="text-base font-bold">記録データがまだありません。</p>
        <p className="text-xs text-slate-400 mt-1">「今日の記録」から睡眠日誌を保存してください。</p>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-cyan-400" />
          <span>睡眠日誌の履歴ログ ({logs.length}件)</span>
        </h3>
        <span className="text-xs text-slate-300 hidden sm:inline">個別に編集・削除可能</span>
      </div>


      {/* モバイル表示 (スマホ用カード形式) */}
      <div className="block lg:hidden divide-y divide-slate-800">
        {logs.map((log) => (
          <div key={log.id} className="p-4 space-y-3 hover:bg-slate-800/30 transition-colors">
            
            <div className="flex items-center justify-between">
              <div>
                <span className="text-base font-black text-slate-100">{formatDateJP(log.date)}</span>
                <span className="text-xs text-slate-400 ml-2 font-mono">({log.date})</span>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-black border ${
                  log.sePercent >= 85
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                    : log.sePercent >= 80
                    ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40'
                    : 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                }`}
              >
                効率 {log.sePercent}%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <div>
                <span className="text-xs text-slate-400 block">就寝 〜 起床</span>
                <span className="font-bold text-slate-200">{log.bedtime} 〜 {log.wakeTime}</span>
                <span className="text-xs text-slate-400 block mt-0.5">TIB: {formatMinutesToHM(log.tibMinutes)}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">実睡眠 (TST)</span>
                <span className="font-black text-cyan-300 text-base">{formatMinutesToHM(log.tstMinutes)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
              <div className="flex items-center space-x-3">
                <span className="flex items-center text-amber-300 font-bold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400 mr-1" />
                  熟睡 {log.restfulnessScore}/5
                </span>
                <span>支障 {log.daytimeDisruptionScore}/5</span>
              </div>

              <div className="flex items-center space-x-2">
                {deletingId === log.id ? (
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => confirmDelete(log.id)}
                      className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold"
                    >
                      削除確定
                    </button>
                    <button
                      onClick={() => setDeletingId(null)}
                      className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded-lg text-xs"
                    >
                      取消
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => onEditLog(log)}
                      className="px-3 py-1.5 bg-slate-800 text-cyan-300 border border-slate-700 rounded-lg font-bold flex items-center space-x-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>編集</span>
                    </button>
                    <button
                      onClick={() => setDeletingId(log.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {log.notes && (
              <p className="text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-850 flex items-start space-x-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                <span className="leading-relaxed">{log.notes}</span>
              </p>
            )}

          </div>
        ))}
      </div>

      {/* デスクトップ表示 (PC用テーブル) */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-200">
          <thead className="bg-slate-900 text-slate-300 uppercase tracking-wider font-bold border-b border-slate-800 text-xs">
            <tr>
              <th className="py-3.5 px-4">日付</th>
              <th className="py-3.5 px-4">就寝 〜 起床</th>
              <th className="py-3.5 px-4">実睡眠 (TST)</th>
              <th className="py-3.5 px-4">睡眠効率 (SE)</th>
              <th className="py-3.5 px-4">覚醒 (SOL/WASO/EMA)</th>
              <th className="py-3.5 px-4">熟睡感</th>
              <th className="py-3.5 px-4">支障度</th>
              <th className="py-3.5 px-4">メモ</th>
              <th className="py-3.5 px-4 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                
                <td className="py-4 px-4 font-bold text-slate-100 whitespace-nowrap">
                  {formatDateJP(log.date)}
                  <span className="block text-xs text-slate-400 font-normal">{log.date}</span>
                </td>

                <td className="py-4 px-4 whitespace-nowrap text-slate-200">
                  <div className="font-semibold">
                    {log.bedtime} → {log.wakeTime}
                  </div>
                  <span className="text-xs text-slate-400 block">TIB: {formatMinutesToHM(log.tibMinutes)}</span>
                </td>

                <td className="py-4 px-4 whitespace-nowrap">
                  <span className="font-black text-cyan-300 text-base">
                    {formatMinutesToHM(log.tstMinutes)}
                  </span>
                </td>

                <td className="py-4 px-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${
                      log.sePercent >= 85
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                        : log.sePercent >= 80
                        ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40'
                        : 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                    }`}
                  >
                    {log.sePercent}%
                  </span>
                </td>

                <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-300">
                  <span>{log.sol}分 / {log.waso}分 / {log.ema}分</span>
                </td>

                <td className="py-4 px-4 whitespace-nowrap font-bold text-amber-300">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{log.restfulnessScore} / 5</span>
                  </div>
                </td>

                <td className="py-4 px-4 whitespace-nowrap text-slate-200">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 font-bold text-xs">
                    {log.daytimeDisruptionScore} / 5
                  </span>
                </td>

                <td className="py-4 px-4 max-w-xs truncate text-slate-300 text-xs">
                  {log.notes ? (
                    <span className="flex items-center space-x-1" title={log.notes}>
                      <MessageSquare className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="truncate">{log.notes}</span>
                    </span>
                  ) : (
                    <span className="text-slate-500">-</span>
                  )}
                </td>

                <td className="py-4 px-4 text-right whitespace-nowrap">
                  {deletingId === log.id ? (
                    <div className="flex items-center justify-end space-x-1.5">
                      <button
                        onClick={() => confirmDelete(log.id)}
                        className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold"
                      >
                        削除確定
                      </button>
                      <button
                        onClick={() => setDeletingId(null)}
                        className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded-lg text-xs"
                      >
                        取消
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onEditLog(log)}
                        className="p-2 text-slate-300 hover:text-cyan-300 hover:bg-slate-800 rounded-xl transition-colors"
                        title="編集"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingId(log.id)}
                        className="p-2 text-slate-300 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-colors"
                        title="削除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
