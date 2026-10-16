import React, { useState, useEffect } from 'react';
import {
  LandingPage,
  Section,
  SectionType,
  DeviceMode,
  ButtonConfig,
} from '../../types/schema';
import { SectionRenderer } from '../renderer/SectionRenderer';
import { api } from '../../services/api';
import * as Icons from 'lucide-react';

interface VisualEditorProps {
  pageId: string;
  onExit: () => void;
  onPreview: (page: LandingPage) => void;
}

export const VisualEditor: React.FC<VisualEditorProps> = ({
  pageId,
  onExit,
  onPreview,
}) => {
  const [page, setPage] = useState<LandingPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'saving'>('idle');
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [leftTab, setLeftTab] = useState<'sections' | 'layers' | 'versions'>('sections');

  // History for undo/redo
  const [history, setHistory] = useState<Section[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // AI Rewrite State
  const [aiRewriting, setAiRewriting] = useState(false);
  const [aiVariations, setAiVariations] = useState<string[]>([]);
  const [targetAiField, setTargetAiField] = useState<'title' | 'subtitle' | 'eyebrow' | null>(null);

  // Load page
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await api.getPage(pageId);
        setPage(data);
        if (data.sections.length > 0) {
          setSelectedSectionId(data.sections[0].id);
          setHistory([JSON.parse(JSON.stringify(data.sections))]);
          setHistoryIndex(0);
        }
      } catch (err) {
        console.error('Failed to load page:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [pageId]);

  if (loading || !page) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-900 text-white">
        <Icons.Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-2" />
        <span className="ml-3 font-semibold text-sm">Loading Visual Canvas...</span>
      </div>
    );
  }

  const selectedSection = page.sections.find((s) => s.id === selectedSectionId);

  // Helper to commit state with history
  const updateSections = (newSections: Section[], desc = 'Edit') => {
    setPage((prev) => (prev ? { ...prev, sections: newSections } : prev));

    const nextHistory = history.slice(0, historyIndex + 1);
    nextHistory.push(JSON.parse(JSON.stringify(newSections)));
    if (nextHistory.length > 25) nextHistory.shift();
    setHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);

    // Auto save trigger
    handleSave(newSections, desc);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setPage((p) => (p ? { ...p, sections: JSON.parse(JSON.stringify(prev)) } : p));
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setPage((p) => (p ? { ...p, sections: JSON.parse(JSON.stringify(next)) } : p));
    }
  };

  const handleSave = async (sectionsToSave?: Section[], desc = 'Manual save') => {
    if (!page) return;
    setSaving(true);
    setSaveStatus('saving');
    try {
      const updated = await api.updatePage(
        page.id,
        {
          title: page.title,
          slug: page.slug,
          sections: sectionsToSave || page.sections,
          seo: page.seo,
        },
        desc
      );
      setPage(updated);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2500);
    } catch (err) {
      console.error('Failed to save:', err);
      setSaveStatus('idle');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!page) return;
    try {
      const res = await api.publishPage(page.id);
      setPage(res.page);
      alert('Page published successfully to live environment!');
    } catch (err) {
      alert('Publishing failed.');
    }
  };

  // Section Reordering
  const moveSection = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= page.sections.length) return;
    const cloned = [...page.sections];
    const [moved] = cloned.splice(index, 1);
    cloned.splice(targetIdx, 0, moved);
    updateSections(cloned, `Reordered ${moved.name || moved.type}`);
  };

  const duplicateSection = (id: string) => {
    const idx = page.sections.findIndex((s) => s.id === id);
    if (idx === -1) return;
    const src = page.sections[idx];
    const dupe: Section = {
      ...JSON.parse(JSON.stringify(src)),
      id: `sec-${Date.now()}`,
      name: `${src.name} (Copy)`,
    };
    const cloned = [...page.sections];
    cloned.splice(idx + 1, 0, dupe);
    updateSections(cloned, `Duplicated ${src.name}`);
    setSelectedSectionId(dupe.id);
  };

  const deleteSection = (id: string) => {
    if (page.sections.length <= 1) {
      alert('A landing page must have at least one section.');
      return;
    }
    const cloned = page.sections.filter((s) => s.id !== id);
    updateSections(cloned, 'Deleted section');
    if (selectedSectionId === id) {
      setSelectedSectionId(cloned[0]?.id || null);
    }
  };

  const toggleVisibility = (id: string) => {
    const cloned = page.sections.map((s) => (s.id === id ? { ...s, isVisible: !s.isVisible } : s));
    updateSections(cloned, 'Toggled visibility');
  };

  // Add new section from catalog
  const addSection = (type: SectionType) => {
    const newSec: Section = {
      id: `sec-${Date.now()}`,
      type,
      name: type.replace('_', ' ').toUpperCase(),
      isVisible: true,
      isLocked: false,
      title: type === 'hero' ? 'Transform Your Workflow Today' : `New ${type.replace('_', ' ')}`,
      subtitle: 'Write a persuasive supporting explanation that reinforces the core proposition.',
      primaryButton: {
        id: `btn-${Date.now()}`,
        text: 'Claim Special Offer',
        actionType: 'checkout',
        bgColor: '#2563eb',
        textColor: '#ffffff',
        borderRadius: 'lg',
        fontSize: 'base',
        fontWeight: 'bold',
        paddingX: '6',
        paddingY: '3',
      },
      items: [
        { id: 'item-1', title: 'Highlight 1', description: 'Describe the key benefit here.' },
        { id: 'item-2', title: 'Highlight 2', description: 'Describe the key benefit here.' },
        { id: 'item-3', title: 'Highlight 3', description: 'Describe the key benefit here.' },
      ],
      styles: {
        bgColor: '#ffffff',
        textColor: '#0f172a',
        paddingTop: 50,
        paddingBottom: 50,
        maxWidth: 'xl',
        alignment: 'center',
      },
    };

    const cloned = [...page.sections, newSec];
    updateSections(cloned, `Added ${newSec.name}`);
    setSelectedSectionId(newSec.id);
  };

  // AI Copywriting rewrite
  const handleAiRewrite = async (field: 'title' | 'subtitle' | 'eyebrow', currentText: string) => {
    setAiRewriting(true);
    setTargetAiField(field);
    setAiVariations([]);
    try {
      const res = await api.rewriteText(currentText, 'Increase conversion and emotional hook', 'persuasive');
      setAiVariations(res.variations || []);
    } catch {
      setAiVariations(['Faster results with less effort', 'The all-in-one verified solution', 'Stop wasting hours and take control']);
    } finally {
      setAiRewriting(false);
    }
  };

  // Canvas width based on device preview
  const canvasWidthClass = {
    desktop: 'w-full',
    tablet: 'w-[768px] shadow-2xl rounded-2xl border-8 border-slate-800 my-6',
    mobile: 'w-[375px] shadow-2xl rounded-3xl border-8 border-slate-800 my-6',
  }[deviceMode];

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-900 text-slate-100 overflow-hidden font-sans">
      {/* 1. TOP TOOLBAR */}
      <header className="h-14 border-b border-slate-800 bg-slate-950 px-4 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-semibold transition-colors"
          >
            <Icons.ArrowLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <div className="h-4 w-[1px] bg-slate-800" />
          <input
            type="text"
            value={page.title}
            onChange={(e) => setPage({ ...page, title: e.target.value })}
            className="bg-transparent font-bold text-sm text-slate-200 hover:bg-slate-800/50 px-2 py-1 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 max-w-xs"
          />
          <span className="text-xs text-slate-500 font-mono">/{page.slug}</span>
        </div>

        {/* Responsive device switchers */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
          <button
            onClick={() => setDeviceMode('desktop')}
            className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
              deviceMode === 'desktop' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Desktop 100%"
          >
            <Icons.Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeviceMode('tablet')}
            className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
              deviceMode === 'tablet' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Tablet 768px"
          >
            <Icons.Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeviceMode('mobile')}
            className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
              deviceMode === 'mobile' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Mobile 375px"
          >
            <Icons.Smartphone className="w-4 h-4" />
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Undo / Redo */}
          <div className="flex items-center gap-1 border-r border-slate-800 pr-2">
            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="p-1.5 rounded text-slate-400 hover:text-white disabled:opacity-30"
              title="Undo"
            >
              <Icons.Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="p-1.5 rounded text-slate-400 hover:text-white disabled:opacity-30"
              title="Redo"
            >
              <Icons.Redo2 className="w-4 h-4" />
            </button>
          </div>

          {/* Auto-save status */}
          <span className="text-xs text-slate-400 flex items-center gap-1 px-1">
            {saveStatus === 'saving' ? (
              <>
                <Icons.Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
                <span>Saving...</span>
              </>
            ) : saveStatus === 'saved' ? (
              <>
                <Icons.Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Saved</span>
              </>
            ) : (
              <span>Synced</span>
            )}
          </span>

          {/* Preview Button */}
          <button
            onClick={() => onPreview(page)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Icons.Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>

          {/* Publish Button */}
          <button
            onClick={handlePublish}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Icons.UploadCloud className="w-3.5 h-3.5" />
            <span>{page.status === 'published' ? 'Republish' : 'Publish Live'}</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT SIDEBAR */}
        <aside className="w-72 bg-slate-950 border-r border-slate-800 flex flex-col shrink-0">
          <div className="flex border-b border-slate-800 p-1 bg-slate-900/50 text-xs font-semibold">
            <button
              onClick={() => setLeftTab('sections')}
              className={`flex-1 py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-colors ${
                leftTab === 'sections' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icons.PlusSquare className="w-3.5 h-3.5" />
              <span>Add Sections</span>
            </button>
            <button
              onClick={() => setLeftTab('layers')}
              className={`flex-1 py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-colors ${
                leftTab === 'layers' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icons.Layers className="w-3.5 h-3.5" />
              <span>Layers ({page.sections.length})</span>
            </button>
            <button
              onClick={() => setLeftTab('versions')}
              className={`flex-1 py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-colors ${
                leftTab === 'versions' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icons.History className="w-3.5 h-3.5" />
              <span>History</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {leftTab === 'sections' && (
              <div className="space-y-4">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-1">
                  Click to Append Section
                </div>
                {[
                  { type: 'hero' as SectionType, label: 'Hero Header', icon: 'Layout', desc: 'Split, Centered, or Product Mockup' },
                  { type: 'countdown_timer' as SectionType, label: 'Countdown Timer', icon: 'Clock', desc: 'Real ticking urgency clock' },
                  { type: 'features' as SectionType, label: 'Feature Cards', icon: 'Grid', desc: '3-Column benefits with icons' },
                  { type: 'problem_solution' as SectionType, label: 'Problem vs Solution', icon: 'SplitSquareVertical', desc: 'Contrast pain points with results' },
                  { type: 'pricing_cards' as SectionType, label: 'Pricing Tables', icon: 'CreditCard', desc: 'Single & multi-tier pricing plans' },
                  { type: 'testimonials' as SectionType, label: 'Testimonials', icon: 'MessageSquare', desc: 'Ratings, avatars, verified quotes' },
                  { type: 'faq_accordion' as SectionType, label: 'FAQ Accordion', icon: 'HelpCircle', desc: 'Expandable objection-crushing Q&A' },
                  { type: 'lead_form' as SectionType, label: 'Lead & Contact Form', icon: 'Send', desc: 'Instant inquiry capture funnel' },
                  { type: 'announcement_bar' as SectionType, label: 'Announcement Bar', icon: 'Megaphone', desc: 'Top flash deal ticker' },
                  { type: 'statistics' as SectionType, label: 'Stats Counter', icon: 'BarChart2', desc: 'Social proof numbers' },
                  { type: 'footer' as SectionType, label: 'Page Footer', icon: 'Maximize2', desc: 'Links, copyright, legal links' },
                ].map((item) => (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => addSection(item.type)}
                    className="w-full text-left p-2.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 hover:border-slate-700 transition-all group flex items-start gap-3 cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-600/10 text-blue-400 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                      <Icons.Plus className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-200">{item.label}</div>
                      <div className="text-[11px] text-slate-500">{item.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {leftTab === 'layers' && (
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-1 mb-2">
                  Page Sections Order
                </div>
                {page.sections.map((sec, idx) => (
                  <div
                    key={sec.id}
                    onClick={() => setSelectedSectionId(sec.id)}
                    className={`p-2 rounded-xl border flex items-center justify-between text-xs transition-all cursor-pointer ${
                      selectedSectionId === sec.id
                        ? 'bg-blue-950/40 border-blue-600 text-white font-semibold'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-[10px] text-slate-500 font-mono">{idx + 1}</span>
                      <span className="truncate">{sec.name || sec.type}</span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => moveSection(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 text-slate-400 hover:text-white disabled:opacity-20"
                        title="Move Up"
                      >
                        <Icons.ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => moveSection(idx, 'down')}
                        disabled={idx === page.sections.length - 1}
                        className="p-1 text-slate-400 hover:text-white disabled:opacity-20"
                        title="Move Down"
                      >
                        <Icons.ChevronDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => toggleVisibility(sec.id)}
                        className={`p-1 ${sec.isVisible ? 'text-slate-400 hover:text-white' : 'text-red-400'}`}
                        title={sec.isVisible ? 'Hide' : 'Show'}
                      >
                        {sec.isVisible ? <Icons.Eye className="w-3.5 h-3.5" /> : <Icons.EyeOff className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => duplicateSection(sec.id)}
                        className="p-1 text-slate-400 hover:text-white"
                        title="Duplicate"
                      >
                        <Icons.Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteSection(sec.id)}
                        className="p-1 text-slate-400 hover:text-red-400"
                        title="Delete"
                      >
                        <Icons.Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {leftTab === 'versions' && (
              <div className="space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-1 mb-2">
                  Snapshots & Rollback
                </div>
                {page.versions && page.versions.length > 0 ? (
                  page.versions.map((ver) => (
                    <div
                      key={ver.id}
                      className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-slate-300 font-semibold">
                        <span>{ver.description}</span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(ver.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">{ver.sectionCount} sections included</div>
                      <button
                        type="button"
                        onClick={async () => {
                          if (confirm(`Restore version from ${new Date(ver.timestamp).toLocaleString()}?`)) {
                            const res = await api.rollbackPage(page.id, ver.id);
                            setPage(res.page);
                            alert('Version restored!');
                          }
                        }}
                        className="w-full py-1 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded text-[11px] font-bold transition-colors cursor-pointer"
                      >
                        Rollback to this version
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-slate-500 p-4 text-center">
                    No versions saved yet. Versions are created automatically when you save changes.
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>

        {/* CENTER LIVE CANVAS */}
        <main className="flex-1 bg-slate-950/60 overflow-y-auto flex flex-col items-center p-4">
          <div className={`${canvasWidthClass} bg-white transition-all duration-300 min-h-[85vh]`}>
            {page.sections.map((section) => (
              <SectionRenderer
                key={section.id}
                section={section}
                isEditor={true}
                isSelected={selectedSectionId === section.id}
                deviceMode={deviceMode}
                onSelect={() => setSelectedSectionId(section.id)}
              />
            ))}
          </div>
        </main>

        {/* RIGHT SIDEBAR INSPECTOR */}
        <aside className="w-80 bg-slate-950 border-l border-slate-800 flex flex-col shrink-0">
          <div className="p-3 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Inspector: {selectedSection?.name || 'No selection'}
            </span>
            {selectedSection && (
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-900/50 text-blue-300 font-mono">
                {selectedSection.type}
              </span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs text-slate-300">
            {selectedSection ? (
              <>
                {/* 1. Main Text Content */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between font-bold text-slate-200">
                    <span>Text & Copy</span>
                    <button
                      type="button"
                      onClick={() => handleAiRewrite('title', selectedSection.title)}
                      className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold"
                    >
                      <Icons.Sparkles className="w-3 h-3 text-yellow-400" />
                      <span>AI Rewrite</span>
                    </button>
                  </div>

                  {selectedSection.eyebrow !== undefined && (
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Eyebrow / Badge</label>
                      <input
                        type="text"
                        value={selectedSection.eyebrow || ''}
                        onChange={(e) => {
                          const updated = page.sections.map((s) =>
                            s.id === selectedSection.id ? { ...s, eyebrow: e.target.value } : s
                          );
                          updateSections(updated);
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Headline Title</label>
                    <textarea
                      rows={2}
                      value={selectedSection.title}
                      onChange={(e) => {
                        const updated = page.sections.map((s) =>
                          s.id === selectedSection.id ? { ...s, title: e.target.value } : s
                        );
                        updateSections(updated);
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                    />
                  </div>

                  {/* AI Variations Drawer */}
                  {aiVariations.length > 0 && targetAiField && (
                    <div className="p-3 bg-blue-950/40 border border-blue-700/50 rounded-xl space-y-2">
                      <div className="font-bold text-[11px] text-blue-300 flex items-center gap-1">
                        <Icons.Sparkles className="w-3 h-3" />
                        <span>AI Conversion Variations</span>
                      </div>
                      {aiVariations.map((v, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            const updated = page.sections.map((s) =>
                              s.id === selectedSection.id ? { ...s, [targetAiField]: v } : s
                            );
                            updateSections(updated);
                            setAiVariations([]);
                          }}
                          className="w-full text-left p-2 rounded bg-slate-900/80 hover:bg-blue-900/40 text-[11px] text-slate-200 border border-slate-800 block transition-colors"
                        >
                          "{v}"
                        </button>
                      ))}
                    </div>
                  )}

                  {selectedSection.subtitle !== undefined && (
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Subtitle / Paragraph</label>
                      <textarea
                        rows={3}
                        value={selectedSection.subtitle || ''}
                        onChange={(e) => {
                          const updated = page.sections.map((s) =>
                            s.id === selectedSection.id ? { ...s, subtitle: e.target.value } : s
                          );
                          updateSections(updated);
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  )}

                  {/* Supporting lines if hero */}
                  {selectedSection.type === 'hero' && (
                    <div className="space-y-2 pt-1 border-t border-slate-800/60">
                      <label className="block text-[11px] font-bold text-slate-400">Supporting Checklist</label>
                      <input
                        type="text"
                        placeholder="Line 1"
                        value={selectedSection.supportingLine1 || ''}
                        onChange={(e) => {
                          const updated = page.sections.map((s) =>
                            s.id === selectedSection.id ? { ...s, supportingLine1: e.target.value } : s
                          );
                          updateSections(updated);
                        }}
                        className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-slate-200 text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Line 2"
                        value={selectedSection.supportingLine2 || ''}
                        onChange={(e) => {
                          const updated = page.sections.map((s) =>
                            s.id === selectedSection.id ? { ...s, supportingLine2: e.target.value } : s
                          );
                          updateSections(updated);
                        }}
                        className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-slate-200 text-xs"
                      />
                    </div>
                  )}
                </div>

                {/* 2. Media Image Settings */}
                {selectedSection.primaryImage !== undefined && (
                  <div className="space-y-2 pt-3 border-t border-slate-800">
                    <div className="font-bold text-slate-200">Image Asset</div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Image URL</label>
                      <input
                        type="text"
                        value={selectedSection.primaryImage || ''}
                        onChange={(e) => {
                          const updated = page.sections.map((s) =>
                            s.id === selectedSection.id ? { ...s, primaryImage: e.target.value } : s
                          );
                          updateSections(updated);
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs"
                      />
                    </div>
                  </div>
                )}

                {/* 3. Primary CTA Button Builder */}
                {selectedSection.primaryButton && (
                  <div className="space-y-3 pt-3 border-t border-slate-800">
                    <div className="font-bold text-slate-200 flex items-center justify-between">
                      <span>Primary CTA Button</span>
                      <span className="text-[10px] text-slate-500">Full Builder</span>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Button Text</label>
                      <input
                        type="text"
                        value={selectedSection.primaryButton.text}
                        onChange={(e) => {
                          const updated = page.sections.map((s) =>
                            s.id === selectedSection.id && s.primaryButton
                              ? { ...s, primaryButton: { ...s.primaryButton, text: e.target.value } }
                              : s
                          );
                          updateSections(updated);
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Action Type</label>
                        <select
                          value={selectedSection.primaryButton.actionType}
                          onChange={(e) => {
                            const updated = page.sections.map((s) =>
                              s.id === selectedSection.id && s.primaryButton
                                ? { ...s, primaryButton: { ...s.primaryButton, actionType: e.target.value as any } }
                                : s
                            );
                            updateSections(updated);
                          }}
                          className="w-full px-2 py-1.5 rounded bg-slate-900 border border-slate-800 text-slate-200 text-xs"
                        >
                          <option value="checkout">Open Checkout Funnel</option>
                          <option value="external_url">External Link</option>
                          <option value="scroll_to">Scroll To Section</option>
                          <option value="whatsapp">Open WhatsApp</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Background</label>
                        <input
                          type="color"
                          value={selectedSection.primaryButton.bgColor || '#2563eb'}
                          onChange={(e) => {
                            const updated = page.sections.map((s) =>
                              s.id === selectedSection.id && s.primaryButton
                                ? { ...s, primaryButton: { ...s.primaryButton, bgColor: e.target.value } }
                                : s
                            );
                            updateSections(updated);
                          }}
                          className="w-full h-8 rounded bg-slate-900 border border-slate-800 cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="stickyCheck"
                        checked={!!selectedSection.primaryButton.isStickyMobile}
                        onChange={(e) => {
                          const updated = page.sections.map((s) =>
                            s.id === selectedSection.id && s.primaryButton
                              ? { ...s, primaryButton: { ...s.primaryButton, isStickyMobile: e.target.checked } }
                              : s
                          );
                          updateSections(updated);
                        }}
                        className="rounded bg-slate-900 border-slate-700 text-blue-600"
                      />
                      <label htmlFor="stickyCheck" className="text-xs text-slate-300 font-medium">
                        Sticky Mobile Purchase Bar
                      </label>
                    </div>
                  </div>
                )}

                {/* 4. Section Styling & Spacing */}
                <div className="space-y-3 pt-3 border-t border-slate-800">
                  <div className="font-bold text-slate-200">Styles & Dimensions</div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Background Color</label>
                      <input
                        type="color"
                        value={selectedSection.styles.bgColor || '#ffffff'}
                        onChange={(e) => {
                          const updated = page.sections.map((s) =>
                            s.id === selectedSection.id
                              ? { ...s, styles: { ...s.styles, bgColor: e.target.value } }
                              : s
                          );
                          updateSections(updated);
                        }}
                        className="w-full h-8 rounded bg-slate-900 border border-slate-800 cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Text Color</label>
                      <input
                        type="color"
                        value={selectedSection.styles.textColor || '#0f172a'}
                        onChange={(e) => {
                          const updated = page.sections.map((s) =>
                            s.id === selectedSection.id
                              ? { ...s, styles: { ...s.styles, textColor: e.target.value } }
                              : s
                          );
                          updateSections(updated);
                        }}
                        className="w-full h-8 rounded bg-slate-900 border border-slate-800 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Padding Top (px)</label>
                      <input
                        type="number"
                        min="0"
                        max="200"
                        value={selectedSection.styles.paddingTop}
                        onChange={(e) => {
                          const updated = page.sections.map((s) =>
                            s.id === selectedSection.id
                              ? { ...s, styles: { ...s.styles, paddingTop: parseInt(e.target.value) || 0 } }
                              : s
                          );
                          updateSections(updated);
                        }}
                        className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Padding Bottom (px)</label>
                      <input
                        type="number"
                        min="0"
                        max="200"
                        value={selectedSection.styles.paddingBottom}
                        onChange={(e) => {
                          const updated = page.sections.map((s) =>
                            s.id === selectedSection.id
                              ? { ...s, styles: { ...s.styles, paddingBottom: parseInt(e.target.value) || 0 } }
                              : s
                          );
                          updateSections(updated);
                        }}
                        className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-slate-200"
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-20 text-center text-slate-500">
                <Icons.MousePointerClick className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Click any section on the canvas to inspect its settings.</p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};
