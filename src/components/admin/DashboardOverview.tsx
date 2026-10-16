import React from 'react';
import { LandingPage, Order, LeadSubmission, AnalyticsSummary } from '../../types/schema';
import * as Icons from 'lucide-react';

interface DashboardOverviewProps {
  pages: LandingPage[];
  orders: Order[];
  leads: LeadSubmission[];
  analytics: AnalyticsSummary | null;
  onEditPage: (pageId: string) => void;
  onPreviewPage: (page: LandingPage) => void;
  onOpenAiGenerator: () => void;
  onCreateBlankPage: () => void;
  onNavigateTab: (tab: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  pages,
  orders,
  leads,
  analytics,
  onEditPage,
  onPreviewPage,
  onOpenAiGenerator,
  onCreateBlankPage,
  onNavigateTab,
}) => {
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.total, 0);

  const totalViews = pages.reduce((sum, p) => sum + (p.viewCount || 0), 0);
  const totalConversions = pages.reduce((sum, p) => sum + (p.conversionCount || 0), 0);
  const avgConversionRate = totalViews > 0 ? ((totalConversions / totalViews) * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* 1. Header Banner & Quick Action Buttons */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur border border-white/20 mb-3">
            <Icons.Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            AI-Powered Visual Funnel Engine
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">
            Build & Launch High-Converting Landing Pages
          </h1>
          <p className="text-blue-100 text-sm leading-relaxed mb-6 font-normal">
            Create conversion-optimized landing pages for digital products, video bundles, courses, physical goods, and agency services with zero code.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenAiGenerator}
              className="px-5 py-3 bg-white text-blue-700 hover:bg-blue-50 font-extrabold text-sm rounded-xl shadow-lg flex items-center gap-2 cursor-pointer transition-transform active:scale-98"
            >
              <Icons.Sparkles className="w-4 h-4 text-blue-600" />
              <span>AI Page Assistant</span>
            </button>
            <button
              onClick={() => onNavigateTab('templates')}
              className="px-5 py-3 bg-blue-600/40 hover:bg-blue-600/60 border border-white/20 font-bold text-sm rounded-xl flex items-center gap-2 cursor-pointer transition-all"
            >
              <Icons.LayoutTemplate className="w-4 h-4" />
              <span>12+ Templates</span>
            </button>
            <button
              onClick={onCreateBlankPage}
              className="px-5 py-3 bg-blue-950/40 hover:bg-blue-950/60 border border-white/20 font-bold text-sm rounded-xl flex items-center gap-2 cursor-pointer transition-all"
            >
              <Icons.Plus className="w-4 h-4" />
              <span>Blank Page</span>
            </button>
          </div>
        </div>

        {/* Decorative background blurbs */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 pointer-events-none flex items-center justify-center">
          <Icons.Zap className="w-96 h-96 -rotate-12 translate-x-12" />
        </div>
      </div>

      {/* 2. Key Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Revenue</span>
            <div className="text-2xl font-black text-slate-900 mt-1">${totalRevenue.toLocaleString()}</div>
            <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-1">
              <Icons.TrendingUp className="w-3 h-3" />
              Verified transactions
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Icons.DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Paid Orders</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{orders.length}</div>
            <span className="text-[11px] text-slate-500 mt-1 block">10 Payment Gateways ready</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Icons.ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Landing Page Views</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{totalViews.toLocaleString()}</div>
            <span className="text-[11px] text-slate-500 mt-1 block">Real-time visitor tracking</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Icons.Eye className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Average Conversion</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{avgConversionRate}%</div>
            <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-1">
              <Icons.CheckCircle className="w-3 h-3" />
              {totalConversions} checkouts
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Icons.Activity className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 3. Active Landing Pages Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Landing Pages</h3>
            <p className="text-xs text-slate-500">Your visual funnels, live URLs, and conversion statistics</p>
          </div>
          <button
            onClick={() => onNavigateTab('pages')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>View All ({pages.length})</span>
            <Icons.ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-100 text-slate-500 text-xs uppercase font-bold tracking-wider">
                <th className="py-3 px-6">Page Title & Slug</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Views</th>
                <th className="py-3 px-4">Orders</th>
                <th className="py-3 px-4">Conv. Rate</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pages.map((page) => {
                const cRate =
                  page.viewCount > 0 ? ((page.conversionCount / page.viewCount) * 100).toFixed(1) : '0.0';
                return (
                  <tr key={page.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900">{page.title}</div>
                      <div className="text-xs text-slate-400 font-mono">/{page.slug}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                          page.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            page.status === 'published' ? 'bg-emerald-500' : 'bg-slate-400'
                          }`}
                        />
                        {page.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-xs font-medium text-slate-600 capitalize">
                      {page.category}
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-700">
                      {page.viewCount.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-700">
                      {page.conversionCount}
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-bold text-emerald-600">{cRate}%</span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onPreviewPage(page)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                          title="Preview Live Page"
                        >
                          <Icons.Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEditPage(page.id)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Icons.Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Bottom Grid: Recent Orders & Recent Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Recent Verified Orders</h3>
              <p className="text-xs text-slate-500">Processed through integrated payment gateways</p>
            </div>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              All Orders
            </button>
          </div>

          <div className="space-y-3">
            {orders.slice(0, 4).map((ord) => (
              <div
                key={ord.id}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-slate-900 text-xs">{ord.productTitle}</div>
                  <div className="text-[11px] text-slate-500">
                    {ord.customerName} ({ord.customerEmail})
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    Order #{ord.orderNumber} • via {ord.gateway.toUpperCase()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-extrabold text-slate-900 text-sm">
                    {ord.currency} ${ord.total}
                  </div>
                  <span className="inline-block mt-0.5 text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Paid
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Leads */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Inbound Leads & Inquiries</h3>
              <p className="text-xs text-slate-500">Form submissions from your landing pages</p>
            </div>
            <button
              onClick={() => onNavigateTab('leads')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              View Inquiries
            </button>
          </div>

          <div className="space-y-3">
            {leads.slice(0, 4).map((lead) => (
              <div
                key={lead.id}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-start justify-between"
              >
                <div>
                  <div className="font-bold text-slate-900 text-xs">{lead.name || 'Anonymous Visitor'}</div>
                  <div className="text-[11px] text-blue-600 font-medium">{lead.email}</div>
                  {lead.message && (
                    <p className="text-[11px] text-slate-600 mt-1 line-clamp-1 italic">
                      "{lead.message}"
                    </p>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 font-mono shrink-0">
                  {new Date(lead.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
