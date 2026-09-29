import React from 'react';
import type { SleepLog } from '../types/sleep';
import { Download, Upload, RotateCcw, X, FileSpreadsheet } from 'lucide-react';


interface ExportImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: SleepLog[];
  onResetMockData: () => void;
  onImportLogs: (importedLogs: SleepLog[]) => void;
}

export const ExportImportModal: React.FC<ExportImportModalProps> = ({
  isOpen,
  onClose,
  logs,
  onResetMockData,
  onImportLogs,
}) => {
  if (!isOpen) return null;

  // CSV エクスポート
  const handleExportCSV = () => {
    if (!logs || logs.length === 0) return;

    const headers = [
      '日付(date)',
      '就寝時刻(bedtime)',
      '入眠潜時_分(sol)',
      '中途覚醒_分(waso)',
      '最終覚醒時刻(finalAwakening)',
      '起床時刻(wakeTime)',
      '早朝覚醒_分(ema)',
      '総臥床時間_分(tibMinutes)',
      '実睡眠時間_分(tstMinutes)',
      '睡眠効率_パーセント(sePercent)',
      '熟睡感スコア(restfulnessScore)',
      '日中支障度スコア(daytimeDisruptionScore)',
      'メモ(notes)',
    ];

    const rows = logs.map((log) => [
      log.date,
      log.bedtime,
      log.sol,
      log.waso,
      log.finalAwakening,
      log.wakeTime,
      log.ema,
      log.tibMinutes,
      log.tstMinutes,
      log.sePercent,
      log.restfulnessScore,
      log.daytimeDisruptionScore,
      `"${(log.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `sleep_log_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // JSON / CSV インポート
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed)) {
            onImportLogs(parsed);
            alert('JSONデータのインポートに成功しました！');
            onClose();
          }
        } else {
          alert('現在はJSONバックアップファイルの直接復元に対応しています。');
        }
      } catch (err) {
        alert('ファイルの読み込みに失敗しました。');
      }
    };
    reader.readAsText(file);
  };

  // JSON バックアップダウンロード
  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(logs, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `somnocraft_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-lg rounded-2xl border border-slate-700/80 p-5 space-y-5 shadow-2xl shadow-cyan-950/60">
        
        {/* ヘッダー */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
            <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
            <span>データ操作・管理</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1. CSVエクスポート */}
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <h4 className="text-xs font-bold text-slate-200 flex items-center space-x-1.5">
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>CSVエクスポート（表計算ソフト用）</span>
          </h4>
          <p className="text-[11px] text-slate-400">
            全{logs.length}件のログをExcelやGoogleスプレッドシートで読み込めるUTF-8 CSV形式で保存します。
          </p>
          <button
            onClick={handleExportCSV}
            className="w-full py-2 px-3 bg-cyan-700 hover:bg-cyan-600 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center space-x-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSVファイルをダウンロード</span>
          </button>
        </div>

        {/* 2. JSON バックアップ & 復元 */}
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <h4 className="text-xs font-bold text-slate-200 flex items-center space-x-1.5">
            <Upload className="w-3.5 h-3.5 text-indigo-400" />
            <span>JSONバックアップ & 復元</span>
          </h4>
          <p className="text-[11px] text-slate-400">
            データ全体の保存および他のPC・端末への引継ぎ用データです。
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleExportJSON}
              className="flex-1 py-2 px-3 bg-indigo-700 hover:bg-indigo-600 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center space-x-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>JSON保存</span>
            </button>
            <label className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg text-xs transition-colors flex items-center justify-center space-x-1 cursor-pointer border border-slate-700">
              <Upload className="w-3.5 h-3.5" />
              <span>JSON復元</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* 3. モックデータの再読み込み（リセット） */}
        <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-900/40 space-y-2">
          <h4 className="text-xs font-bold text-rose-300 flex items-center space-x-1.5">
            <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
            <span>サンプル（デモ）データの初期化</span>
          </h4>
          <p className="text-[11px] text-slate-400">
            アプリの動作を確認するための14日分の初期デモデータにリセットします。
          </p>
          <button
            onClick={() => {
              if (confirm('現在の記録が初期サンプルデータ（14日分）に置き換わります。よろしいですか？')) {
                onResetMockData();
                onClose();
              }
            }}
            className="w-full py-2 px-3 bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-700/50 font-bold rounded-lg text-xs transition-colors"
          >
            初期サンプルデータにリセットする
          </button>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
          >
            閉じる
          </button>
        </div>

      </div>
    </div>
  );
};
