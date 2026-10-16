import React, { useState, useEffect } from 'react';
import { BrandSettings } from '../../types/schema';
import { api } from '../../services/api';
import * as Icons from 'lucide-react';

export const BrandSettingsPanel: React.FC = () => {
  const [brand, setBrand] = useState<BrandSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    loadBrand();
  }, []);

  const loadBrand = async () => {
    setLoading(true);
    try {
      const data = await api.getBrand();
      setBrand(data);
    } catch {
      console.error('Failed to load brand');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand) return;
    try {
      const updated = await api.updateBrand(brand);
      setBrand(updated);
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 3000);
    } catch {
      alert('Failed to update brand settings');
    }
  };

  const applyPreset = (presetName: string) => {
    if (!brand) return;
    if (presetName === 'saas') {
      setBrand({
        ...brand,
        primaryColor: '#2563eb',
        secondaryColor: '#0f172a',
        accentColor: '#10b981',
        borderRadius: 'lg',
        buttonStyle: 'rounded',
      });
    } else if (presetName === 'dark') {
      setBrand({
        ...brand,
        primaryColor: '#6366f1',
        secondaryColor: '#09090b',
        accentColor: '#38bdf8',
        backgroundColor: '#09090b',
        textColor: '#f8fafc',
        headingColor: '#ffffff',
        borderRadius: 'xl',
      });
    } else if (presetName === 'minimal') {
      setBrand({
        ...brand,
        primaryColor: '#18181b',
        secondaryColor: '#ffffff',
        accentColor: '#52525b',
        borderRadius: 'none',
        buttonStyle: 'flat',
      });
    } else if (presetName === 'bold') {
      setBrand({
        ...brand,
        primaryColor: '#dc2626',
        secondaryColor: '#0f172a',
        accentColor: '#f59e0b',
        borderRadius: 'full',
      });
    }
  };

  if (loading || !brand) return null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Brand & Design System</h2>
          <p className="text-slate-500 text-xs mt-0.5">
            Centralized design tokens, brand identities, typography hierarchy, and global style presets.
          </p>
        </div>
        {savedMessage && (
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5 animate-in fade-in">
            <Icons.Check className="w-4 h-4" />
            <span>Brand settings updated!</span>
          </span>
        )}
      </div>

      {/* Preset Pickers */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Instant Design Presets
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { id: 'saas', name: 'Modern SaaS', colors: ['#2563eb', '#0f172a', '#10b981'] },
            { id: 'dark', name: 'Premium Dark', colors: ['#6366f1', '#09090b', '#38bdf8'] },
            { id: 'minimal', name: 'Editorial Minimal', colors: ['#18181b', '#ffffff', '#52525b'] },
            { id: 'bold', name: 'High-Converting Bold', colors: ['#dc2626', '#0f172a', '#f59e0b'] },
          ].map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => applyPreset(preset.id)}
              className="p-3 rounded-2xl border border-slate-200 hover:border-blue-500 text-left transition-all hover:shadow-sm"
            >
              <div className="flex gap-1.5 mb-2">
                {preset.colors.map((c, i) => (
                  <span key={i} className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: c }} />
                ))}
              </div>
              <div className="text-xs font-bold text-slate-900">{preset.name}</div>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6 text-xs">
        {/* Colors */}
        <div>
          <h3 className="font-bold text-slate-900 text-sm mb-3">Color Palette</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Primary Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={brand.primaryColor}
                  onChange={(e) => setBrand({ ...brand, primaryColor: e.target.value })}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200"
                />
                <input
                  type="text"
                  value={brand.primaryColor}
                  onChange={(e) => setBrand({ ...brand, primaryColor: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Secondary Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={brand.secondaryColor}
                  onChange={(e) => setBrand({ ...brand, secondaryColor: e.target.value })}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200"
                />
                <input
                  type="text"
                  value={brand.secondaryColor}
                  onChange={(e) => setBrand({ ...brand, secondaryColor: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Accent Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={brand.accentColor}
                  onChange={(e) => setBrand({ ...brand, accentColor: e.target.value })}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200"
                />
                <input
                  type="text"
                  value={brand.accentColor}
                  onChange={(e) => setBrand({ ...brand, accentColor: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Company Identity */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm mb-3">Company Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Brand Name</label>
              <input
                type="text"
                value={brand.brandName}
                onChange={(e) => setBrand({ ...brand, brandName: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Support Email</label>
              <input
                type="email"
                value={brand.contactEmail}
                onChange={(e) => setBrand({ ...brand, contactEmail: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Logo URL</label>
              <input
                type="text"
                value={brand.logoUrl}
                onChange={(e) => setBrand({ ...brand, logoUrl: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Favicon URL</label>
              <input
                type="text"
                value={brand.faviconUrl || ''}
                onChange={(e) => setBrand({ ...brand, faviconUrl: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow cursor-pointer transition-all active:scale-98"
          >
            Save Brand System
          </button>
        </div>
      </form>
    </div>
  );
};
