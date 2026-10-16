import React, { useState, useEffect } from 'react';
import { LandingPage, Order, LeadSubmission, AnalyticsSummary, Template } from './types/schema';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { DashboardOverview } from './components/admin/DashboardOverview';
import { PagesList } from './components/admin/PagesList';
import { TemplatesGallery } from './components/admin/TemplatesGallery';
import { ProductsManager } from './components/admin/ProductsManager';
import { OrdersManager } from './components/admin/OrdersManager';
import { PaymentGatewaysPanel } from './components/admin/PaymentGatewaysPanel';
import { BrandSettingsPanel } from './components/admin/BrandSettingsPanel';
import { PoliciesManager } from './components/admin/PoliciesManager';
import { AnalyticsDashboard } from './components/admin/AnalyticsDashboard';
import { VisualEditor } from './components/editor/VisualEditor';
import { PublicPageRenderer } from './components/renderer/PublicPageRenderer';
import { AiPageGeneratorModal } from './components/editor/AiPageGeneratorModal';
import * as Icons from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [pages, setPages] = useState<LandingPage[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [leads, setLeads] = useState<LeadSubmission[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  // Active Modes
  const [currentEditingPageId, setCurrentEditingPageId] = useState<string | null>(null);
  const [previewPage, setPreviewPage] = useState<LandingPage | null>(null);
  const [isAiGeneratorOpen, setIsAiGeneratorOpen] = useState(false);
  const [hasGeminiKey, setHasGeminiKey] = useState(true);

  // Load all initial state
  const loadData = async () => {
    try {
      const [pgs, ords, lds, anl, health] = await Promise.all([
        api.getPages(),
        api.getOrders(),
        api.getLeads(),
        api.getAnalytics(),
        api.getHealth(),
      ]);
      setPages(pgs);
      setOrders(ords);
      setLeads(lds);
      setAnalytics(anl);
      setHasGeminiKey(health.hasGeminiKey);
    } catch (err) {
      console.error('Initial data load failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Check for hash route (e.g. /#/creatorvault-vfx-bundle) to render public page directly
    const handleHash = async () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (hash && hash !== 'dashboard') {
        try {
          const pg = await api.getPage(hash);
          if (pg) {
            setPreviewPage(pg);
          }
        } catch {
          // not a valid page slug
        }
      }
    };
    handleHash();
  }, []);

  // Handlers
  const handleCreateBlankPage = async () => {
    try {
      const newPage = await api.createPage({
        title: 'New High-Converting Funnel',
        category: 'digital',
      });
      setPages([newPage, ...pages]);
      setCurrentEditingPageId(newPage.id);
    } catch {
      alert('Failed to create page');
    }
  };

  const handleUseTemplate = (tmpl: Template) => {
    loadData();
    // find newly created page and open editor
    api.getPages().then((pgs) => {
      setPages(pgs);
      if (pgs.length > 0) {
        setCurrentEditingPageId(pgs[0].id);
      }
    });
  };

  // Render Visual Editor mode if editing
  if (currentEditingPageId) {
    return (
      <VisualEditor
        pageId={currentEditingPageId}
        onExit={() => {
          setCurrentEditingPageId(null);
          loadData();
        }}
        onPreview={(pg) => {
          setPreviewPage(pg);
        }}
      />
    );
  }

  // Render Public / Live Preview mode
  if (previewPage) {
    return (
      <PublicPageRenderer
        page={previewPage}
        isPreview={true}
        onBackToDashboard={() => {
          setPreviewPage(null);
          window.location.hash = '';
        }}
        onEditPage={() => {
          setCurrentEditingPageId(previewPage.id);
          setPreviewPage(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans flex flex-col">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenAiGenerator={() => setIsAiGeneratorOpen(true)}
        onCreateBlankPage={handleCreateBlankPage}
        hasGeminiKey={hasGeminiKey}
      />

      {/* Main Body Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center text-slate-500">
            <Icons.Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-3" />
            <p className="text-sm font-semibold">Synchronizing OmniFunnel workspace...</p>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <DashboardOverview
                pages={pages}
                orders={orders}
                leads={leads}
                analytics={analytics}
                onEditPage={(id) => setCurrentEditingPageId(id)}
                onPreviewPage={(p) => setPreviewPage(p)}
                onOpenAiGenerator={() => setIsAiGeneratorOpen(true)}
                onCreateBlankPage={handleCreateBlankPage}
                onNavigateTab={setActiveTab}
              />
            )}

            {activeTab === 'pages' && (
              <PagesList
                pages={pages}
                onRefresh={loadData}
                onEditPage={(id) => setCurrentEditingPageId(id)}
                onPreviewPage={(p) => setPreviewPage(p)}
                onCreateBlankPage={handleCreateBlankPage}
                onOpenAiGenerator={() => setIsAiGeneratorOpen(true)}
              />
            )}

            {activeTab === 'templates' && (
              <TemplatesGallery onUseTemplate={handleUseTemplate} />
            )}

            {activeTab === 'products' && <ProductsManager />}

            {activeTab === 'orders' && <OrdersManager />}

            {activeTab === 'gateways' && <PaymentGatewaysPanel />}

            {activeTab === 'brand' && <BrandSettingsPanel />}

            {activeTab === 'policies' && <PoliciesManager />}

            {activeTab === 'analytics' && <AnalyticsDashboard />}
          </>
        )}
      </main>

      {/* AI Page Generation Modal */}
      <AiPageGeneratorModal
        isOpen={isAiGeneratorOpen}
        onClose={() => setIsAiGeneratorOpen(false)}
        onPageGenerated={(newPage) => {
          setPages([newPage, ...pages]);
          setCurrentEditingPageId(newPage.id);
        }}
      />
    </div>
  );
}
