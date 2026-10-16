import React, { useState, useEffect } from 'react';
import { LandingPage, ButtonConfig } from '../../types/schema';
import { SectionRenderer } from './SectionRenderer';
import { CheckoutModal } from './CheckoutModal';
import { api } from '../../services/api';
import * as Icons from 'lucide-react';

interface PublicPageRendererProps {
  page: LandingPage;
  isPreview?: boolean;
  onBackToDashboard?: () => void;
  onEditPage?: () => void;
}

export const PublicPageRenderer: React.FC<PublicPageRendererProps> = ({
  page,
  isPreview = false,
  onBackToDashboard,
  onEditPage,
}) => {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | undefined>(page.associatedProductId);

  // Track page view and scroll depth
  useEffect(() => {
    api.trackEvent({ type: 'view', pageSlug: page.slug });

    let maxScroll = 0;
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const currentPercent = Math.round((window.scrollY / scrollHeight) * 100);
        if (currentPercent > maxScroll) {
          maxScroll = currentPercent;
          if (maxScroll % 25 === 0) {
            api.trackEvent({ type: 'scroll', pageSlug: page.slug, scrollDepth: maxScroll });
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [page.slug]);

  // Handle CTA button actions
  const handleButtonClick = (btn: ButtonConfig) => {
    api.trackEvent({ type: 'cta_click', pageSlug: page.slug, details: btn.text });

    if (btn.actionType === 'checkout') {
      setSelectedProductId(btn.productId || page.associatedProductId);
      setIsCheckoutOpen(true);
    } else if (btn.actionType === 'scroll_to' && btn.targetSectionId) {
      const target = document.getElementById(btn.targetSectionId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (btn.actionType === 'whatsapp' && btn.whatsappNumber) {
      const cleanNum = btn.whatsappNumber.replace(/[^0-9]/g, '');
      const msg = encodeURIComponent(btn.whatsappMessage || 'Hello! I am interested in your offer.');
      window.open(`https://wa.me/${cleanNum}?text=${msg}`, '_blank');
    } else if (btn.actionType === 'external_url' && btn.destinationUrl) {
      window.open(btn.destinationUrl, '_blank');
    } else if (btn.actionType === 'download' && btn.downloadUrl) {
      window.open(btn.downloadUrl, '_blank');
    } else {
      // Default to checkout for high conversion
      setSelectedProductId(page.associatedProductId);
      setIsCheckoutOpen(true);
    }
  };

  // Find sticky CTA if enabled in any section's primary button
  const stickyButton = page.sections
    .map((s) => s.primaryButton)
    .find((b) => b && (b.isStickyMobile || b.isStickyDesktop));

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Top Preview Bar if in Admin Preview mode */}
      {isPreview && (
        <div className="sticky top-0 z-40 bg-slate-950 text-white px-4 py-2 flex items-center justify-between text-xs border-b border-slate-800 shadow-md">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Live Interactive Preview
            </span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-300 font-medium">/{page.slug}</span>
            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-slate-800 text-slate-300">
              {page.status}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {onEditPage && (
              <button
                onClick={onEditPage}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium flex items-center gap-1"
              >
                <Icons.Edit3 className="w-3.5 h-3.5" />
                <span>Open Visual Builder</span>
              </button>
            )}
            {onBackToDashboard && (
              <button
                onClick={onBackToDashboard}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-medium"
              >
                Exit Preview
              </button>
            )}
          </div>
        </div>
      )}

      {/* Render All Page Sections */}
      <main>
        {page.sections
          .filter((s) => s.isVisible)
          .map((section) => (
            <SectionRenderer
              key={section.id}
              section={section}
              onButtonClick={handleButtonClick}
              onLeadSubmit={(formData) => {
                api.submitLead({
                  pageId: page.id,
                  formType: section.type === 'contact_form' ? 'contact' : 'lead',
                  name: formData.name,
                  email: formData.email,
                  phone: formData.phone,
                  message: formData.message,
                });
              }}
            />
          ))}
      </main>

      {/* Sticky Mobile/Desktop Purchase Bar */}
      {stickyButton && (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 shadow-2xl flex items-center justify-between max-w-xl mx-auto rounded-t-2xl sm:max-w-2xl">
          <div className="hidden sm:block">
            <div className="font-bold text-slate-900 text-sm">{page.title}</div>
            <div className="text-xs text-slate-500">Instant digital access • 30-day guarantee</div>
          </div>
          <button
            onClick={() => handleButtonClick(stickyButton)}
            style={{ backgroundColor: stickyButton.bgColor || '#2563eb', color: '#ffffff' }}
            className="w-full sm:w-auto px-6 py-3 font-bold text-sm rounded-xl shadow-lg hover:opacity-90 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Icons.Sparkles className="w-4 h-4" />
            <span>{stickyButton.text || 'Order Now'}</span>
          </button>
        </div>
      )}

      {/* Full Funnel Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        productId={selectedProductId}
        pageId={page.id}
        pageTitle={page.title}
        onOrderSuccess={(order) => {
          console.log('Order completed:', order);
        }}
      />
    </div>
  );
};
