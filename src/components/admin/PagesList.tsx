import React, { useState } from 'react';
import { LandingPage } from '../../types/schema';
import { api } from '../../services/api';
import * as Icons from 'lucide-react';

interface PagesListProps {
  pages: LandingPage[];
  onRefresh: () => void;
  onEditPage: (pageId: string) => void;
  onPreviewPage: (page: LandingPage) => void;
  onCreateBlankPage: () => void;
  onOpenAiGenerator: () => void;
}

export const PagesList: React.FC<PagesListProps> = ({
  pages,
  onRefresh,
  onEditPage,
  onPreviewPage,
  onCreateBlankPage,
  onOpenAiGenerator,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  const filteredPages = pages.filter((page) => {
    const matchesSearch =
      page.title.toLowerCase().includes(search.toLowerCase()) ||
      page.slug.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || page.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || page.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleDuplicate = async (id: string) => {
    try {
      await api.duplicatePage(id);
      onRefresh();
    } catch {
      alert('Failed to duplicate page.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deletePage(id);
      setDeleteConfirmId(null);
      onRefresh();
    } catch {
      alert('Failed to delete page.');
    }
  };

  const handleCopyLink = (slug: string) => {
    const url = `${window.location.origin}/#/${slug}`;
    navigator.clipboard.writeText(url);
    setCopyFeedback(slug);
    setTimeout(() => setCopyFeedback(null), 2000);
  };

  const handleTogglePublish = async (page: LandingPage) => {
    try {
      if (page.status === 'published') {
        await api.unpublishPage(page.id);
      } else {
        await api.publishPage(page.id);
      }
      onRefresh();
    } catch {
      alert('Failed to update status.');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Landing Pages</h2>
          <p className="text-slate-500 text-xs mt-0.5">
            Manage your visual funnels, duplicate layouts, and monitor conversion velocity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAiGenerator}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-98"
          >
            <Icons.Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Generate With AI</span>
          </button>
          <button
            onClick={onCreateBlankPage}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <Icons.Plus className="w-4 h-4" />
            <span>Create Page</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Icons.Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search pages by title or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status selector */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published Only</option>
            <option value="draft">Drafts Only</option>
          </select>

          {/* Category selector */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="digital">Digital Assets</option>
            <option value="ebook">Ebooks</option>
            <option value="video">Video Bundles</option>
            <option value="physical">Physical Products</option>
            <option value="agency">Agencies & Consulting</option>
            <option value="lead_gen">Lead Generation</option>
          </select>
        </div>
      </div>

      {/* Pages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPages.map((page) => {
          const cRate =
            page.viewCount > 0 ? ((page.conversionCount / page.viewCount) * 100).toFixed(1) : '0.0';

          return (
            <div
              key={page.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden"
            >
              {/* Card top banner */}
              <div className="p-6 border-b border-slate-100 bg-slate-50/40">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize ${
                      page.status === 'published'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        page.status === 'published' ? 'bg-emerald-500' : 'bg-slate-500'
                      }`}
                    />
                    {page.status}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400 capitalize">
                    {page.category}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base mb-1 line-clamp-1">{page.title}</h3>
                <div className="text-xs text-slate-400 font-mono truncate">/{page.slug}</div>
              </div>

              {/* Stats */}
              <div className="p-6 grid grid-cols-3 gap-2 text-center border-b border-slate-100">
                <div className="bg-slate-50 p-2.5 rounded-xl">
                  <div className="text-base font-extrabold text-slate-900">{page.viewCount}</div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">Views</div>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl">
                  <div className="text-base font-extrabold text-slate-900">{page.conversionCount}</div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">Orders</div>
                </div>
                <div className="bg-emerald-50/70 p-2.5 rounded-xl">
                  <div className="text-base font-extrabold text-emerald-700">{cRate}%</div>
                  <div className="text-[10px] uppercase font-bold text-emerald-600 mt-0.5">Conv.</div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-4 bg-slate-50/80 flex items-center justify-between gap-1">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleCopyLink(page.slug)}
                    className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
                    title="Copy Public Link"
                  >
                    {copyFeedback === page.slug ? (
                      <Icons.Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Icons.Share2 className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => onPreviewPage(page)}
                    className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
                    title="Preview Live Page"
                  >
                    <Icons.Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDuplicate(page.id)}
                    className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
                    title="Duplicate Page"
                  >
                    <Icons.Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleTogglePublish(page)}
                    className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
                    title={page.status === 'published' ? 'Unpublish to Draft' : 'Publish Live'}
                  >
                    <Icons.Power className={`w-4 h-4 ${page.status === 'published' ? 'text-emerald-600' : ''}`} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(page.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Page"
                  >
                    <Icons.Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => onEditPage(page.id)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Icons.Edit3 className="w-3.5 h-3.5" />
                  <span>Open Builder</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-200 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <Icons.AlertTriangle className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-base mb-1">Delete Landing Page?</h4>
            <p className="text-xs text-slate-500 mb-6">
              This action is permanent and will remove the public link, conversion tracking, and associated version history.
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
