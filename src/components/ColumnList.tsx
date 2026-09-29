import React, { useState } from 'react';
import { SLEEP_COLUMNS } from '../data/mockColumns';
import type { SleepColumn } from '../types/sleep';
import { BookOpen, Clock, Tag, X, ChevronRight, Sparkles } from 'lucide-react';

export const ColumnList: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeColumn, setActiveColumn] = useState<SleepColumn | null>(null);

  const categories = ['ALL', '基礎知識', '実践法', '生活習慣', 'リカバリー'];

  const filteredColumns = selectedCategory === 'ALL'
    ? SLEEP_COLUMNS
    : SLEEP_COLUMNS.filter((col) => col.category === selectedCategory);

  return (
    <div className="space-y-6">
      
      {/* ヘッダー & カテゴリフィルター */}
      <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-slate-800 space-y-4">
        <div>
          <h2 className="text-base sm:text-xl font-bold text-slate-100 flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <span>お役立ち睡眠コラム（知識集）</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            科学的根拠と実践法に基づく質の高い睡眠テクニックを学べます
          </p>
        </div>

        {/* カテゴリタブ */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md shadow-cyan-950/60'
                  : 'bg-slate-900/90 text-slate-300 hover:text-slate-100 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {cat === 'ALL' ? 'すべてのコラム' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* コラムカードグリッド */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {filteredColumns.map((col) => (
          <div
            key={col.id}
            onClick={() => setActiveColumn(col)}
            className="glass-card rounded-2xl p-5 sm:p-6 border border-slate-800 hover:border-cyan-500/50 transition-all duration-300 cursor-pointer flex flex-col justify-between group active:scale-[0.99]"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-indigo-950/90 text-indigo-300 border border-indigo-500/40 text-xs font-bold">
                  {col.category}
                </span>
                <span className="text-xs text-slate-300 flex items-center space-x-1">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>約{col.readTimeMinutes}分</span>
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-slate-100 group-hover:text-cyan-300 transition-colors leading-snug">
                {col.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3">
                {col.summary}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
              <div className="flex flex-wrap gap-1.5">
                {col.tags.map((tag) => (
                  <span key={tag} className="text-xs text-slate-400 flex items-center space-x-0.5">
                    <Tag className="w-3 h-3 text-cyan-400" />
                    <span>#{tag}</span>
                  </span>
                ))}
              </div>

              <span className="text-xs sm:text-sm text-cyan-400 font-bold group-hover:translate-x-1 transition-transform flex items-center">
                記事を読む
                <ChevronRight className="w-4 h-4 ml-0.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* モーダル（スマホで大きく読みやすい詳細画面） */}
      {activeColumn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-2xl max-h-[90vh] rounded-2xl border border-slate-700 flex flex-col overflow-hidden shadow-2xl shadow-cyan-950/80">
            
            {/* モーダルヘッダー */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/95">
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-full bg-indigo-950 text-indigo-200 border border-indigo-500/40 text-xs font-bold">
                  {activeColumn.category}
                </span>
                <span className="text-xs text-slate-300 flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>約{activeColumn.readTimeMinutes}分</span>
                </span>
              </div>
              <button
                onClick={() => setActiveColumn(null)}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-slate-100 hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* モーダル本文内容 */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-slate-100">
              <h2 className="text-lg sm:text-2xl font-black text-slate-100 leading-snug">
                {activeColumn.title}
              </h2>

              <div className="p-4 rounded-xl bg-cyan-950/50 border border-cyan-700/60 text-xs sm:text-sm text-cyan-200 flex items-start space-x-2.5">
                <Sparkles className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
                <p className="leading-relaxed font-medium">{activeColumn.summary}</p>
              </div>

              {/* 本文（大文字レイアウト） */}
              <div className="space-y-4 leading-relaxed text-slate-200 border-t border-slate-800 pt-4 text-sm sm:text-base">
                {activeColumn.content
                  .trim()
                  .split('\n\n')
                  .map((paragraph, idx) => {
                    if (paragraph.startsWith('### ')) {
                      return (
                        <h3 key={idx} className="text-base sm:text-lg font-bold text-cyan-300 pt-3 border-b border-slate-800 pb-1.5">
                          {paragraph.replace('### ', '')}
                        </h3>
                      );
                    }
                    if (paragraph.startsWith('> ')) {
                      return (
                        <blockquote key={idx} className="p-4 rounded-xl bg-slate-900 border-l-4 border-indigo-500 text-xs sm:text-sm text-slate-100 font-semibold my-2">
                          {paragraph.replace('> ', '')}
                        </blockquote>
                      );
                    }
                    if (paragraph.startsWith('- ')) {
                      return (
                        <ul key={idx} className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-slate-200">
                          {paragraph.split('\n').map((line, lIdx) => (
                            <li key={lIdx}>{line.replace('- ', '')}</li>
                          ))}
                        </ul>
                      );
                    }
                    return (
                      <p key={idx} className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                        {paragraph}
                      </p>
                    );
                  })}
              </div>
            </div>

            {/* モーダルフッター */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/95 flex justify-end">
              <button
                onClick={() => setActiveColumn(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-sm font-bold transition-colors min-h-[44px]"
              >
                閉じる
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
