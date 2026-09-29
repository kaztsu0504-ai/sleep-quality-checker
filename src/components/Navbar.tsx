import React from 'react';
import { Moon, BarChart2, BookOpen, PenTool, Database } from 'lucide-react';

interface NavbarProps {
  activeTab: 'daily' | 'dashboard' | 'columns';
  setActiveTab: (tab: 'daily' | 'dashboard' | 'columns') => void;
  onOpenDataModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenDataModal }) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800 mb-6">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Logo & Title */}
        <div className="flex items-center justify-between w-full sm:w-auto">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('daily')}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-cyan-500 to-amber-400 p-[2px] shadow-lg shadow-cyan-950/50">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Moon className="w-5 h-5 text-amber-300 fill-amber-300/40" />
              </div>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-slate-100 via-cyan-100 to-indigo-200 bg-clip-text text-transparent">
                SomnoCraft
              </h1>
              <p className="text-xs text-cyan-400 font-bold">スリープダイアリー / 睡眠日誌</p>
            </div>
          </div>

          <button
            onClick={onOpenDataModal}
            className="sm:hidden flex items-center space-x-1 px-3 py-1.5 text-xs font-bold text-cyan-300 bg-slate-900 border border-slate-700 rounded-xl"
            title="データ管理"
          >
            <Database className="w-4 h-4 text-cyan-400" />
            <span>データ</span>
          </button>
        </div>

        {/* Navigation Tabs (スマホで大きな押しやすいタブ) */}
        <nav className="flex items-center justify-center space-x-1 sm:space-x-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('daily')}
            className={`flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 min-h-[42px] ${
              activeTab === 'daily'
                ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md shadow-cyan-950/60 ring-1 ring-cyan-400/30'
                : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800'
            }`}
          >
            <PenTool className="w-4 h-4 shrink-0" />
            <span>今日の記録</span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 min-h-[42px] ${
              activeTab === 'dashboard'
                ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md shadow-cyan-950/60 ring-1 ring-cyan-400/30'
                : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800'
            }`}
          >
            <BarChart2 className="w-4 h-4 shrink-0" />
            <span>履歴 & 分析</span>
          </button>

          <button
            onClick={() => setActiveTab('columns')}
            className={`flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 min-h-[42px] ${
              activeTab === 'columns'
                ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md shadow-cyan-950/60 ring-1 ring-cyan-400/30'
                : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <span>睡眠コラム</span>
          </button>
        </nav>

        {/* PC表示用データボタン */}
        <div className="hidden sm:flex items-center">
          <button
            onClick={onOpenDataModal}
            className="flex items-center space-x-2 px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-200 hover:text-cyan-300 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 rounded-xl transition-colors min-h-[42px]"
          >
            <Database className="w-4 h-4 text-cyan-400" />
            <span>データ管理</span>
          </button>
        </div>

      </div>
    </header>
  );
};
