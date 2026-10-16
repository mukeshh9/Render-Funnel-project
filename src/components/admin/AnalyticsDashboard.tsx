import React, { useState, useEffect } from 'react';
import { AnalyticsSummary } from '../../types/schema';
import { api } from '../../services/api';
import * as Icons from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const data = await api.getAnalytics();
      setAnalytics(data);
    } catch {
      console.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !analytics) return null;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Conversion Analytics</h2>
          <p className="text-slate-500 text-xs mt-0.5">
            Real-time funnel conversion metrics, CTA click rates, and visitor scroll-depth telemetry.
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-800 border border-blue-200 rounded-xl text-xs font-bold">
          <Icons.Activity className="w-4 h-4 text-blue-600" />
          <span>Real-Time Event Stream</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Gross Funnel Revenue</span>
          <div className="text-3xl font-black text-slate-900 mt-1">${analytics.revenue.toLocaleString()}</div>
          <span className="text-xs text-emerald-600 font-semibold mt-1 block">From verified checkout checkouts</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Page Impressions</span>
          <div className="text-3xl font-black text-slate-900 mt-1">{analytics.totalVisitors.toLocaleString()}</div>
          <span className="text-xs text-slate-400 mt-1 block">~{analytics.uniqueViews} unique visitors</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">CTA Click Volume</span>
          <div className="text-3xl font-black text-slate-900 mt-1">{analytics.ctaClicks.toLocaleString()}</div>
          <span className="text-xs text-blue-600 font-semibold mt-1 block">Across all sticky & hero CTAs</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Average Scroll Depth</span>
          <div className="text-3xl font-black text-slate-900 mt-1">{analytics.avgScrollDepth}%</div>
          <span className="text-xs text-emerald-600 font-semibold mt-1 block">High engagement down to FAQs</span>
        </div>
      </div>

      {/* Top Pages Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
        <div>
          <h3 className="font-bold text-slate-900 text-base">Top Performing Landing Pages</h3>
          <p className="text-xs text-slate-500">Traffic, conversion percentages, and attribution revenue</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                <th className="py-2.5 px-4">Landing Page Title</th>
                <th className="py-2.5 px-4">Views</th>
                <th className="py-2.5 px-4">Conversions</th>
                <th className="py-2.5 px-4">Conversion Rate</th>
                <th className="py-2.5 px-4 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {analytics.topPages.map((page, idx) => {
                const rate = page.views > 0 ? ((page.conversions / page.views) * 100).toFixed(1) : '0.0';
                return (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-bold text-slate-800">{page.title}</td>
                    <td className="py-3 px-4 font-mono">{page.views.toLocaleString()}</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{page.conversions}</td>
                    <td className="py-3 px-4 font-bold text-emerald-600">{rate}%</td>
                    <td className="py-3 px-4 text-right font-black text-slate-900">${page.revenue}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Event Stream */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-3">
        <h3 className="font-bold text-slate-900 text-base">Live Analytics Event Stream</h3>
        <div className="space-y-2">
          {analytics.recentEvents.slice(0, 8).map((evt, idx) => (
            <div
              key={idx}
              className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <span className="font-mono uppercase font-bold text-[10px] px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                  {evt.type}
                </span>
                <span className="font-bold text-slate-800">/{evt.pageSlug}</span>
                {evt.details && <span className="text-slate-500 truncate">• {evt.details}</span>}
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                {new Date(evt.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
