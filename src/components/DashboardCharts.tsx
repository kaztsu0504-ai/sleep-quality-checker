import React, { useState } from 'react';
import type { SleepLog } from '../types/sleep';
import { calculatePeriodStats } from '../utils/storage';
import { formatMinutesToHM } from '../utils/calculations';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Legend,
  BarChart,
} from 'recharts';
import { TrendingUp, Clock, Percent, Star, Calendar } from 'lucide-react';

interface DashboardChartsProps {
  logs: SleepLog[];
}

export const DashboardCharts: React.FC<DashboardChartsProps> = ({ logs }) => {
  const [period, setPeriod] = useState<7 | 30 | 0>(7);

  const displayLogs = period > 0 ? logs.slice(0, period) : logs;
  const chartData = [...displayLogs].reverse().map((log) => {
    const monthDay = log.date.slice(5).replace('-', '/');
    return {
      date: monthDay,
      fullDate: log.date,
      tstHours: Math.round((log.tstMinutes / 60) * 10) / 10,
      tibHours: Math.round((log.tibMinutes / 60) * 10) / 10,
      tstMinutes: log.tstMinutes,
      tibMinutes: log.tibMinutes,
      sePercent: log.sePercent,
      sol: log.sol,
      waso: log.waso,
      ema: log.ema,
      restfulness: log.restfulnessScore,
      disruption: log.daytimeDisruptionScore,
    };
  });

  const stats = calculatePeriodStats(logs, period);

  return (
    <div className="space-y-6">
      
      {/* 期間選択フィルター & タイトル */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-100 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            <span>睡眠データのトレンド & 分析</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">睡眠時間・効率・構成比を視覚的にチェック</p>
        </div>

        <div className="flex items-center space-x-1.5 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 w-full sm:w-auto">
          <button
            onClick={() => setPeriod(7)}
            className={`flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              period === 7
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-950/60'
                : 'text-slate-300 hover:text-slate-100'
            }`}
          >
            過去7日
          </button>
          <button
            onClick={() => setPeriod(30)}
            className={`flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              period === 30
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-950/60'
                : 'text-slate-300 hover:text-slate-100'
            }`}
          >
            過去30日
          </button>
          <button
            onClick={() => setPeriod(0)}
            className={`flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              period === 0
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-950/60'
                : 'text-slate-300 hover:text-slate-100'
            }`}
          >
            全期間
          </button>
        </div>
      </div>

      {/* 平均サマリーKPIカード */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        
        <div className="glass-card p-4 sm:p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-300 mb-1">
            <span className="text-xs font-bold text-slate-300 uppercase">平均実睡眠 (TST)</span>
            <Clock className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-cyan-300 mt-1">
            {formatMinutesToHM(stats.avgTSTMinutes)}
          </div>
          <div className="text-xs text-slate-300 mt-1">
            対象ログ: {stats.totalLogs}件
          </div>
        </div>

        <div className="glass-card p-4 sm:p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-300 mb-1">
            <span className="text-xs font-bold text-emerald-400 uppercase">平均睡眠効率 (SE)</span>
            <Percent className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-300 mt-1">
            {stats.avgSEPercent}%
          </div>
          <div className="text-xs text-slate-300 mt-1">
            {stats.avgSEPercent >= 85 ? '良好レベル維持中' : '改善の余地あり'}
          </div>
        </div>

        <div className="glass-card p-4 sm:p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-300 mb-1">
            <span className="text-xs font-bold text-indigo-400 uppercase">平均入眠 (SOL)</span>
            <Calendar className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-indigo-300 mt-1">
            {stats.avgSOLMinutes}分
          </div>
          <div className="text-xs text-slate-300 mt-1">
            平均中途覚醒: {stats.avgWASOMinutes}分
          </div>
        </div>

        <div className="glass-card p-4 sm:p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-300 mb-1">
            <span className="text-xs font-bold text-amber-400 uppercase">平均熟睡感</span>
            <Star className="w-5 h-5 text-amber-400 fill-amber-400/40" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-300 mt-1">
            {stats.avgRestfulness} / 5.0
          </div>
          <div className="text-xs text-slate-300 mt-1">
            日中支障度: {stats.avgDaytimeDisruption} / 5
          </div>
        </div>

      </div>

      {/* グラフ 1: 実睡眠時間 (TST) vs 総臥床時間 (TIB) */}
      <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-slate-800 space-y-3">
        <div>
          <h3 className="text-base font-bold text-slate-100">実睡眠時間 (TST) と 総臥床時間 (TIB) の推移</h3>
          <p className="text-xs sm:text-sm text-slate-300">寝床にいた時間（TIB）と実際に眠れていた時間（TST）</p>
        </div>

        <div className="h-64 sm:h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="tstGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="date" stroke="#cbd5e1" fontSize={12} tickLine={false} />
              <YAxis stroke="#cbd5e1" fontSize={12} unit="h" domain={[0, 'auto']} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#475569',
                  borderRadius: '12px',
                  fontSize: '13px',
                  color: '#f8fafc',
                }}
                formatter={(value: any, name: any) => [
                  `${value} 時間`,
                  name === 'tstHours' ? '実睡眠 (TST)' : '総臥床 (TIB)',
                ]}
              />
              <Legend
                wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }}
                formatter={(value) => (value === 'tstHours' ? '実睡眠時間 (TST)' : '総臥床時間 (TIB)')}
              />
              <Bar dataKey="tibHours" fill="#1e293b" stroke="#64748b" radius={[4, 4, 0, 0]} barSize={22} />
              <Area type="monotone" dataKey="tstHours" stroke="#38bdf8" strokeWidth={3} fillOpacity={1} fill="url(#tstGradient)" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* グラフ 2: 睡眠効率 (SE %) の推移 */}
      <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-slate-800 space-y-3">
        <div>
          <h3 className="text-base font-bold text-slate-100">睡眠効率 (SE %) のトレンド推移</h3>
          <p className="text-xs sm:text-sm text-slate-300">85%以上が理想的な基準値です</p>
        </div>

        <div className="h-64 sm:h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="date" stroke="#cbd5e1" fontSize={12} tickLine={false} />
              <YAxis stroke="#cbd5e1" fontSize={12} unit="%" domain={[50, 100]} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#475569',
                  borderRadius: '12px',
                  fontSize: '13px',
                  color: '#f8fafc',
                }}
                formatter={(value: any) => [`${value}%`, '睡眠効率 (SE)']}
              />
              <ReferenceLine y={85} stroke="#10b981" strokeDasharray="4 4" label={{ value: '目標 85%', fill: '#34d399', fontSize: 11, position: 'top' }} />
              <Line
                type="monotone"
                dataKey="sePercent"
                stroke="#10b981"
                strokeWidth={3.5}
                dot={{ fill: '#10b981', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* グラフ 3: 睡眠時間の内訳 */}
      <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-slate-800 space-y-3">
        <div>
          <h3 className="text-base font-bold text-slate-100">寝床での時間の内訳（分）</h3>
          <p className="text-xs sm:text-sm text-slate-300">実睡眠、寝付く時間(SOL)、中途覚醒(WASO)、早朝覚醒(EMA)</p>
        </div>

        <div className="h-64 sm:h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="date" stroke="#cbd5e1" fontSize={12} tickLine={false} />
              <YAxis stroke="#cbd5e1" fontSize={12} unit="分" tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#475569',
                  borderRadius: '12px',
                  fontSize: '13px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="tstMinutes" name="実睡眠 (TST)" stackId="a" fill="#0284c7" />
              <Bar dataKey="sol" name="入眠 (SOL)" stackId="a" fill="#f59e0b" />
              <Bar dataKey="waso" name="中途覚醒 (WASO)" stackId="a" fill="#ef4444" />
              <Bar dataKey="ema" name="早朝覚醒 (EMA)" stackId="a" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
