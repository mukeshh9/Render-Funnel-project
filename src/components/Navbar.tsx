import React from 'react';
import * as Icons from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenAiGenerator: () => void;
  onCreateBlankPage: () => void;
  hasGeminiKey?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenAiGenerator,
  onCreateBlankPage,
  hasGeminiKey = true,
}) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'pages', label: 'Pages', icon: 'FileText' },
    { id: 'templates', label: 'Templates', icon: 'LayoutTemplate' },
    { id: 'products', label: 'Products', icon: 'ShoppingBag' },
    { id: 'gateways', label: '10 Gateways', icon: 'CreditCard' },
    { id: 'brand', label: 'Brand', icon: 'Palette' },
    { id: 'policies', label: 'Policies', icon: 'Shield' },
    { id: 'analytics', label: 'Analytics', icon: 'BarChart2' },
  ];

  const renderIcon = (name: string) => {
    const Component = (Icons as any)[name] || Icons.Circle;
    return <Component className="w-4 h-4 shrink-0" />;
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950 border-b border-slate-800 text-white select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => onSelectTab('overview')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-black text-white text-base shadow-md group-hover:scale-105 transition-transform">
            ⚡
          </div>
          <div>
            <div className="font-extrabold text-sm sm:text-base tracking-tight text-white flex items-center gap-1.5">
              <span>OmniFunnel</span>
              <span className="text-[10px] font-black uppercase tracking-wider bg-blue-600 text-white px-1.5 py-0.5 rounded">
                AI Pro
              </span>
            </div>
            <div className="text-[10px] text-slate-400 -mt-0.5 hidden sm:block">
              Visual Landing Page & Funnel Platform
            </div>
          </div>
        </div>

        {/* Center Nav Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/80 p-1 rounded-2xl border border-slate-800 text-xs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {renderIcon(tab.icon)}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenAiGenerator}
            className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer transition-all active:scale-98"
          >
            <Icons.Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span className="hidden sm:inline">AI Generator</span>
          </button>

          <button
            onClick={onCreateBlankPage}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <Icons.Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Page</span>
          </button>
        </div>
      </div>

      {/* Mobile Nav Tabs Bar */}
      <div className="lg:hidden flex items-center overflow-x-auto px-4 py-2 bg-slate-900 border-t border-slate-800/80 gap-1 text-xs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`px-3 py-1 rounded-lg font-semibold shrink-0 flex items-center gap-1.5 ${
              activeTab === tab.id ? 'bg-blue-600 text-white' : 'text-slate-400'
            }`}
          >
            {renderIcon(tab.icon)}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </header>
  );
};
