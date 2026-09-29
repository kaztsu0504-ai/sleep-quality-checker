import { useState, useEffect } from 'react';
import type { SleepLog } from './types/sleep';
import { getStoredLogs, saveLog, deleteLog, resetToMockLogs } from './utils/storage';
import { Navbar } from './components/Navbar';
import { DailyForm } from './components/DailyForm';
import { DashboardCharts } from './components/DashboardCharts';
import { HistoryTable } from './components/HistoryTable';
import { ColumnList } from './components/ColumnList';
import { ExportImportModal } from './components/ExportImportModal';
import { Moon } from 'lucide-react';


export function App() {
  const [activeTab, setActiveTab] = useState<'daily' | 'dashboard' | 'columns'>('daily');
  const [logs, setLogs] = useState<SleepLog[]>([]);
  const [editingLog, setEditingLog] = useState<SleepLog | null>(null);
  const [isDataModalOpen, setIsDataModalOpen] = useState<boolean>(false);

  // 初期化時にLocalStorageからデータロード
  useEffect(() => {
    const loaded = getStoredLogs();
    setLogs(loaded);
  }, []);

  const handleSaveLog = (
    logData: Omit<SleepLog, 'id' | 'tibMinutes' | 'tstMinutes' | 'sePercent' | 'ema'> & { id?: string; ema?: number }
  ) => {
    saveLog(logData);
    const updated = getStoredLogs();

    setLogs(updated);
    setEditingLog(null);
  };

  const handleDeleteLog = (id: string) => {
    const updated = deleteLog(id);
    setLogs(updated);
    if (editingLog?.id === id) {
      setEditingLog(null);
    }
  };

  const handleEditLog = (log: SleepLog) => {
    setEditingLog(log);
    setActiveTab('daily');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetMockData = () => {
    const res = resetToMockLogs();
    setLogs(res);
    setEditingLog(null);
  };

  const handleImportLogs = (imported: SleepLog[]) => {
    try {
      localStorage.setItem('somnocraft_sleep_logs_v1', JSON.stringify(imported));
      setLogs(imported);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      
      {/* ナビゲーションバー */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenDataModal={() => setIsDataModalOpen(true)}
      />

      {/* メインコンテンツエリア */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        
        {/* 今日の記録タブ */}
        {activeTab === 'daily' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <DailyForm
              onSaveLog={handleSaveLog}
              editingLog={editingLog}
              onClearEdit={() => setEditingLog(null)}
            />

            {/* 今日の記録画面の下部にも過去ログ一覧を表示 */}
            <div className="pt-4 border-t border-slate-800/80">
              <HistoryTable
                logs={logs}
                onEditLog={handleEditLog}
                onDeleteLog={handleDeleteLog}
              />
            </div>
          </div>
        )}

        {/* 履歴・グラフ分析タブ */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <DashboardCharts logs={logs} />

            <HistoryTable
              logs={logs}
              onEditLog={handleEditLog}
              onDeleteLog={handleDeleteLog}
            />
          </div>
        )}

        {/* 睡眠コラムタブ */}
        {activeTab === 'columns' && (
          <div className="animate-in fade-in duration-300">
            <ColumnList />
          </div>
        )}

      </main>

      {/* フッター */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-400 bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Moon className="w-4 h-4 text-amber-300" />
            <span className="font-bold text-slate-300">SomnoCraft スリープダイアリー</span>
            <span>- 睡眠の質の見える化と継続的な改善をサポート</span>
          </div>
          <p className="text-[11px] text-slate-400 flex items-center">
            睡眠効率(SE)・入眠潜時(SOL)・中途覚醒(WASO)ルールベース診断搭載
          </p>
        </div>
      </footer>

      {/* データ入出力ダイアログ */}
      <ExportImportModal
        isOpen={isDataModalOpen}
        onClose={() => setIsDataModalOpen(false)}
        logs={logs}
        onResetMockData={handleResetMockData}
        onImportLogs={handleImportLogs}
      />

    </div>
  );
}

export default App;
