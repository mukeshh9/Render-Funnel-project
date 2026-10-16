import React, { useState, useEffect } from 'react';
import { PolicyDocument } from '../../types/schema';
import { api } from '../../services/api';
import * as Icons from 'lucide-react';

export const PoliciesManager: React.FC = () => {
  const [policies, setPolicies] = useState<PolicyDocument[]>([]);
  const [selectedPolicyId, setSelectedPolicyId] = useState<string>('pol-privacy');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    loadPolicies();
  }, []);

  const loadPolicies = async () => {
    try {
      const data = await api.getPolicies();
      setPolicies(data);
      if (data.length > 0) setSelectedPolicyId(data[0].id);
    } catch {
      console.error('Failed to load policies');
    }
  };

  const currentPolicy = policies.find((p) => p.id === selectedPolicyId);

  const handleUpdateCurrent = (field: keyof PolicyDocument, value: any) => {
    if (!currentPolicy) return;
    setPolicies(policies.map((p) => (p.id === currentPolicy.id ? { ...p, [field]: value } : p)));
  };

  const handleSave = async () => {
    if (!currentPolicy) return;
    setSaving(true);
    try {
      await api.updatePolicy(currentPolicy.id, currentPolicy);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch {
      alert('Failed to save policy');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Policies & Legal Center</h2>
          <p className="text-slate-500 text-xs mt-0.5">
            Manage mandatory e-commerce policies for digital downloads, physical returns, and consumer transparency.
          </p>
        </div>
        {saveSuccess && (
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
            <Icons.Check className="w-4 h-4" />
            <span>Policy document saved</span>
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left policy list */}
        <div className="md:col-span-4 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-4 space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2 block">
            Standard Legal Documents ({policies.length})
          </span>
          {policies.map((pol) => (
            <button
              key={pol.id}
              onClick={() => setSelectedPolicyId(pol.id)}
              className={`w-full text-left p-3 rounded-2xl text-xs font-bold flex items-center justify-between transition-colors ${
                selectedPolicyId === pol.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className="truncate">{pol.title}</span>
              <Icons.FileText className="w-4 h-4 opacity-70 shrink-0" />
            </button>
          ))}
        </div>

        {/* Right policy editor */}
        <div className="md:col-span-8 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          {currentPolicy ? (
            <>
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{currentPolicy.title}</h3>
                  <span className="text-xs text-slate-400 font-mono">
                    Public Slug: /{currentPolicy.slug} • Last updated: {currentPolicy.lastUpdated}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-all active:scale-98 flex items-center gap-1.5"
                >
                  <Icons.Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Policy Content (Markdown Supported)
                </label>
                <textarea
                  rows={14}
                  value={currentPolicy.content}
                  onChange={(e) => handleUpdateCurrent('content', e.target.value)}
                  className="w-full p-4 rounded-2xl border border-slate-300 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          ) : (
            <div className="py-20 text-center text-slate-400">Select a policy to edit.</div>
          )}
        </div>
      </div>
    </div>
  );
};
