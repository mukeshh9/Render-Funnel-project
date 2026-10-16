import React, { useState } from 'react';
import { Template } from '../../types/schema';
import { defaultTemplates } from '../../data/initialData';
import { SectionRenderer } from '../renderer/SectionRenderer';
import { api } from '../../services/api';
import * as Icons from 'lucide-react';

interface TemplatesGalleryProps {
  onUseTemplate: (template: Template) => void;
}

export const TemplatesGallery: React.FC<TemplatesGalleryProps> = ({ onUseTemplate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  const categories = ['All', 'Digital Products', 'Ebooks & Publications', 'Video Bundles', 'Physical Products', 'Agencies', 'Webinars', 'Appointments'];

  const filtered = selectedCategory === 'All'
    ? defaultTemplates
    : defaultTemplates.filter((t) => t.category === selectedCategory);

  const handleCreateFromTemplate = async (tmpl: Template) => {
    try {
      const newPage = await api.createPage({
        title: `${tmpl.name}`,
        slug: `${tmpl.id.replace('tmpl-', '')}-${Math.floor(Math.random() * 900 + 100)}`,
        sections: JSON.parse(JSON.stringify(tmpl.sections)),
      });
      onUseTemplate(tmpl);
    } catch {
      alert('Failed to initialize page from template.');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Template Library</h2>
          <p className="text-slate-500 text-xs mt-0.5">
            12+ conversion-engineered templates for digital goods, video vaults, hardware, courses, and consultancies.
          </p>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Template Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((tmpl) => (
          <div
            key={tmpl.id}
            className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-md transition-shadow"
          >
            <div>
              {/* Thumbnail */}
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img
                  src={tmpl.thumbnail}
                  alt={tmpl.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                  {tmpl.category}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-5">
                <h3 className="font-bold text-slate-900 text-base mb-1">{tmpl.name}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
                  {tmpl.description}
                </p>

                <div className="bg-slate-50 rounded-xl p-2.5 text-[11px] text-slate-600 flex items-center gap-1.5">
                  <Icons.Target className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="truncate"><strong>Ideal For:</strong> {tmpl.idealFor}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-2">
              <button
                onClick={() => setPreviewTemplate(tmpl)}
                className="px-3 py-2 text-slate-700 hover:text-slate-900 text-xs font-bold rounded-xl flex items-center gap-1.5 hover:bg-slate-100 transition-colors"
              >
                <Icons.Eye className="w-4 h-4" />
                <span>Preview</span>
              </button>
              <button
                onClick={() => handleCreateFromTemplate(tmpl)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Icons.Plus className="w-3.5 h-3.5" />
                <span>Use Template</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Template Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 h-[85vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-900 text-base">{previewTemplate.name}</h3>
                <p className="text-xs text-slate-500">{previewTemplate.category} • Full Responsive Preview</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    handleCreateFromTemplate(previewTemplate);
                    setPreviewTemplate(null);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5"
                >
                  <Icons.Plus className="w-4 h-4" />
                  <span>Create Page From This Template</span>
                </button>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <Icons.X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {previewTemplate.sections.map((sec) => (
                <SectionRenderer key={sec.id} section={sec} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
