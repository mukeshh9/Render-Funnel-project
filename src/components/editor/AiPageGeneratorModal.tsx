import React, { useState } from 'react';
import { api } from '../../services/api';
import { LandingPage } from '../../types/schema';
import * as Icons from 'lucide-react';

interface AiPageGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPageGenerated: (page: LandingPage) => void;
}

export const AiPageGeneratorModal: React.FC<AiPageGeneratorModalProps> = ({
  isOpen,
  onClose,
  onPageGenerated,
}) => {
  const [productName, setProductName] = useState('');
  const [niche, setNiche] = useState('Digital Products & Software');
  const [audience, setAudience] = useState('');
  const [tone, setTone] = useState('Urgent, Persuasive, & High-Conversion');
  const [keyFeatures, setKeyFeatures] = useState('');
  const [price, setPrice] = useState('$49');
  const [offerType, setOfferType] = useState('digital');

  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim()) {
      setError('Please provide a product or offer name');
      return;
    }

    setLoading(true);
    setError('');
    setLoadingStep('Connecting to Gemini 3.8 Flash model...');

    try {
      setTimeout(() => setLoadingStep('Drafting benefit-driven headlines & hero copy...'), 800);
      setTimeout(() => setLoadingStep('Assembling feature blocks, FAQs, and urgency timers...'), 1800);

      const res = await api.generateAiPage({
        productName,
        niche,
        audience,
        tone,
        keyFeatures,
        price,
        offerType,
      });

      if (res.page) {
        // Save to backend pages store
        const created = await api.createPage({
          title: res.page.title,
          slug: res.page.slug,
          category: offerType as any,
          seo: res.page.seo,
          sections: res.page.sections,
        });

        onPageGenerated(created);
        onClose();
      } else {
        throw new Error('Failed to generate page schema');
      }
    } catch (err: any) {
      setError(err.message || 'Generation failed. Please try again.');
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center">
                <Icons.Sparkles className="w-5 h-5 text-yellow-300" />
              </span>
              <h3 className="font-extrabold text-lg">AI Landing Page Generator</h3>
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              className="text-white/80 hover:text-white transition-colors"
            >
              <Icons.X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-blue-100 text-xs">
            Powered by Gemini 3.8 Flash. Generates high-converting headlines, value pillars, objection-crushing FAQs, and responsive visual layout.
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="py-16 text-center">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <div className="absolute inset-0 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center text-blue-600">
                  <Icons.Sparkles className="w-6 h-6 animate-pulse" />
                </div>
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-1">Architecting Your Landing Page</h4>
              <p className="text-sm text-blue-600 font-medium animate-pulse">{loadingStep}</p>
              <p className="text-xs text-slate-400 mt-4">Takes approximately 3–5 seconds.</p>
            </div>
          ) : (
            <form onSubmit={handleGenerate} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 font-medium">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Product / Offer Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Masterclass Notion Hub, Lumina ANC Headphones"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Industry / Niche
                  </label>
                  <select
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  >
                    <option>Digital Products & Software</option>
                    <option>Ebooks & Guides</option>
                    <option>Video & Creator Assets</option>
                    <option>Physical Products & Hardware</option>
                    <option>Agencies & Consulting</option>
                    <option>Online Courses & Bootcamps</option>
                    <option>Executive Coaching</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Price Point
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. $49, $199, Free"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Target Audience
                </label>
                <input
                  type="text"
                  placeholder="e.g. Content creators, busy executives, remote developers"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Key Benefits or Features (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Instant 10x speedup, 1,200 templates, zero learning curve, 30-day money-back guarantee"
                  value={keyFeatures}
                  onChange={(e) => setKeyFeatures(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer active:scale-98 transition-all"
                >
                  <Icons.Sparkles className="w-4 h-4 text-yellow-300" />
                  <span>Generate Full Landing Page</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
