import React, { useState, useEffect } from 'react';
import {
  Section,
  ButtonConfig,
  DeviceMode,
} from '../../types/schema';
import * as Icons from 'lucide-react';

interface SectionRendererProps {
  section: Section;
  isEditor?: boolean;
  isSelected?: boolean;
  deviceMode?: DeviceMode;
  onSelect?: () => void;
  onButtonClick?: (btn: ButtonConfig) => void;
  onLeadSubmit?: (formData: Record<string, string>) => void;
}

export const SectionRenderer: React.FC<SectionRendererProps> = ({
  section,
  isEditor = false,
  isSelected = false,
  deviceMode = 'desktop',
  onSelect,
  onButtonClick,
  onLeadSubmit,
}) => {
  if (!section.isVisible && !isEditor) return null;

  // Render Lucide Icon dynamically
  const renderIcon = (name?: string, className = 'w-5 h-5') => {
    if (!name) return null;
    const IconComponent = (Icons as any)[name] || Icons.HelpCircle;
    return <IconComponent className={className} />;
  };

  // Button Component
  const renderButton = (btn?: ButtonConfig, isSecondary = false) => {
    if (!btn || !btn.text) return null;

    const baseClass = `inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer ${
      btn.isFullWidth ? 'w-full' : ''
    } ${btn.animation === 'pulse' ? 'animate-pulse' : btn.animation === 'bounce' ? 'animate-bounce' : ''}`;

    const radiusMap: Record<string, string> = {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-xl',
      full: 'rounded-full',
    };

    const sizePaddingMap: Record<string, string> = {
      sm: 'px-4 py-2 text-sm',
      base: 'px-5 py-2.5 text-base',
      lg: 'px-8 py-3.5 text-lg',
      xl: 'px-10 py-4 text-xl',
    };

    const radius = radiusMap[btn.borderRadius] || 'rounded-xl';
    const padding = sizePaddingMap[btn.fontSize] || 'px-6 py-3 text-base';

    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (onButtonClick) onButtonClick(btn);
        }}
        style={{
          backgroundColor: btn.bgColor || (isSecondary ? 'transparent' : '#2563eb'),
          color: btn.textColor || '#ffffff',
          borderColor: btn.borderColor || 'transparent',
          borderWidth: btn.borderWidth || 0,
          boxShadow: btn.shadow === 'glow' ? '0 10px 25px -5px rgba(37, 99, 235, 0.4)' : undefined,
        }}
        className={`${baseClass} ${radius} ${padding} shadow-sm hover:opacity-95 active:scale-98`}
      >
        {btn.icon && <span className="mr-2">{renderIcon(btn.icon, 'w-5 h-5')}</span>}
        <span>{btn.text}</span>
      </button>
    );
  };

  // Section Styles
  const containerStyle: React.CSSProperties = {
    backgroundColor: section.styles.bgColor || '#ffffff',
    backgroundImage: section.styles.bgGradient || undefined,
    color: section.styles.textColor || '#1e293b',
    paddingTop: `${section.styles.paddingTop || 40}px`,
    paddingBottom: `${section.styles.paddingBottom || 40}px`,
    textAlign: section.styles.alignment || 'left',
  };

  const maxWidthClass = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-5xl',
    xl: 'max-w-6xl',
    '2xl': 'max-w-7xl',
    full: 'max-w-full',
  }[section.styles.maxWidth || 'xl'];

  // Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Countdown State
  const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number }>({
    d: 1,
    h: 23,
    m: 59,
    s: 59,
  });

  useEffect(() => {
    if (section.type !== 'countdown_timer') return;
    const target = section.countdownTarget ? new Date(section.countdownTarget).getTime() : Date.now() + 48 * 3600 * 1000;
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, target - now);
      setTimeLeft({
        d: Math.floor(diff / (1000 * 60 * 60 * 24)),
        h: Math.floor((diff / (1000 * 60 * 60)) % 24),
        m: Math.floor((diff / 1000 / 60) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [section.type, section.countdownTarget]);

  // Lead Form Local State
  const [leadFormData, setLeadFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  // Render individual section contents
  const renderSectionBody = () => {
    switch (section.type) {
      case 'announcement_bar':
        return (
          <div className="flex items-center justify-center text-sm md:text-base font-medium px-4">
            <span>{section.title}</span>
            {section.primaryButton && (
              <span className="ml-4">{renderButton(section.primaryButton)}</span>
            )}
          </div>
        );

      case 'hero':
        const isSplit = section.layoutVariant === 'split';
        const isCentered = section.layoutVariant === 'centered';

        return (
          <div className={`${maxWidthClass} mx-auto px-4 md:px-8`}>
            <div className={`grid gap-12 items-center ${isSplit && !isCentered ? 'lg:grid-cols-12' : 'grid-cols-1 text-center'}`}>
              <div className={`${isSplit && !isCentered ? 'lg:col-span-7' : 'max-w-3xl mx-auto'}`}>
                {section.eyebrow && (
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs md:text-sm font-semibold tracking-wide bg-blue-50 text-blue-700 border border-blue-200 mb-6">
                    {section.eyebrow}
                  </div>
                )}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-slate-900 mb-6">
                  {section.title}
                </h1>
                {section.subtitle && (
                  <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-6 font-normal">
                    {section.subtitle}
                  </p>
                )}

                {/* Supporting bullet lines */}
                {(section.supportingLine1 || section.supportingLine2 || section.supportingLine3) && (
                  <div className="space-y-2.5 mb-8">
                    {section.supportingLine1 && (
                      <div className="flex items-center gap-2.5 text-slate-700 text-sm md:text-base font-medium">
                        <Icons.CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span>{section.supportingLine1.replace(/^✓\s*/, '')}</span>
                      </div>
                    )}
                    {section.supportingLine2 && (
                      <div className="flex items-center gap-2.5 text-slate-700 text-sm md:text-base font-medium">
                        <Icons.CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span>{section.supportingLine2.replace(/^✓\s*/, '')}</span>
                      </div>
                    )}
                    {section.supportingLine3 && (
                      <div className="flex items-center gap-2.5 text-slate-700 text-sm md:text-base font-medium">
                        <Icons.CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span>{section.supportingLine3.replace(/^✓\s*/, '')}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Pricing or discount callout */}
                {(section.priceText || section.discountText) && (
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    {section.priceText && (
                      <span className="text-2xl font-black text-slate-900">{section.priceText}</span>
                    )}
                    {section.discountText && (
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-xs font-bold tracking-wider uppercase">
                        {section.discountText}
                      </span>
                    )}
                  </div>
                )}

                {/* CTAs */}
                <div className={`flex flex-wrap gap-4 items-center ${isCentered ? 'justify-center' : 'justify-start'}`}>
                  {renderButton(section.primaryButton)}
                  {renderButton(section.secondaryButton, true)}
                </div>
              </div>

              {/* Hero Image or Mockup */}
              {section.primaryImage && isSplit && !isCentered && (
                <div className="lg:col-span-5 relative">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200/80 bg-white">
                    <img
                      src={section.primaryImage}
                      alt={section.primaryImageAlt || 'Hero visual'}
                      className="w-full h-auto object-cover max-h-[480px]"
                      loading="lazy"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'countdown_timer':
        return (
          <div className={`${maxWidthClass} mx-auto px-4 text-center`}>
            {section.title && <h2 className="text-2xl font-bold mb-2">{section.title}</h2>}
            {section.subtitle && <p className="text-sm opacity-80 mb-6">{section.subtitle}</p>}
            <div className="flex justify-center gap-3 md:gap-6 my-2">
              {[
                { label: 'Days', val: timeLeft.d },
                { label: 'Hours', val: timeLeft.h },
                { label: 'Minutes', val: timeLeft.m },
                { label: 'Seconds', val: timeLeft.s },
              ].map((unit, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center bg-white shadow-md rounded-xl p-3 md:p-5 min-w-[70px] md:min-w-[95px] border border-slate-200"
                >
                  <span className="text-2xl md:text-4xl font-extrabold text-blue-600 font-mono">
                    {String(unit.val).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wider text-slate-500 mt-1">
                    {unit.label}
                  </span>
                </div>
              ))}
            </div>
            {section.primaryButton && <div className="mt-6">{renderButton(section.primaryButton)}</div>}
          </div>
        );

      case 'features':
      case 'benefits':
      case 'product_inclusions':
        return (
          <div className={`${maxWidthClass} mx-auto px-4 md:px-8`}>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-3">{section.title}</h2>
              {section.subtitle && <p className="text-base md:text-lg text-slate-600">{section.subtitle}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(section.items || []).map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
                    {renderIcon(item.icon || 'Sparkles', 'w-6 h-6')}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'problem_solution':
        return (
          <div className={`${maxWidthClass} mx-auto px-4 md:px-8`}>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-3">{section.title}</h2>
              {section.subtitle && <p className="text-slate-600">{section.subtitle}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {(section.items || []).map((item, idx) => {
                const isProblem = idx === 0;
                return (
                  <div
                    key={item.id || idx}
                    className={`p-8 rounded-2xl border ${
                      isProblem
                        ? 'bg-red-50/50 border-red-200 text-red-950'
                        : 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      {isProblem ? (
                        <Icons.XCircle className="w-7 h-7 text-red-600" />
                      ) : (
                        <Icons.CheckCircle2 className="w-7 h-7 text-emerald-600" />
                      )}
                      <h3 className="text-xl font-bold">{item.title}</h3>
                    </div>
                    <p className="text-sm md:text-base opacity-90 leading-relaxed">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'pricing_cards':
        return (
          <div className={`${maxWidthClass} mx-auto px-4 md:px-8`}>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-3">{section.title}</h2>
              {section.subtitle && <p className="text-slate-600">{section.subtitle}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
              {(section.items || []).map((tier, idx) => {
                const isHighlight = !!tier.badge;
                return (
                  <div
                    key={tier.id || idx}
                    className={`relative bg-white rounded-3xl p-8 border flex flex-col justify-between ${
                      isHighlight
                        ? 'border-blue-600 shadow-xl ring-2 ring-blue-600'
                        : 'border-slate-200 shadow-sm'
                    }`}
                  >
                    {tier.badge && (
                      <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-black tracking-wider uppercase px-4 py-1 rounded-full shadow-sm">
                        {tier.badge}
                      </span>
                    )}

                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{tier.title}</h3>
                      <div className="flex items-baseline gap-2 mb-6">
                        <span className="text-4xl font-extrabold text-slate-900">${tier.price}</span>
                        {tier.originalPrice && (
                          <span className="text-lg text-slate-400 line-through">${tier.originalPrice}</span>
                        )}
                        <span className="text-xs text-slate-500 font-medium">/ lifetime</span>
                      </div>

                      {tier.features && (
                        <ul className="space-y-3 mb-8">
                          {tier.features.map((feat, fIdx) => (
                            <li key={fIdx} className="flex items-start gap-2.5 text-sm text-slate-700">
                              <Icons.Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div>
                      {tier.button ? (
                        renderButton({ ...tier.button, isFullWidth: true })
                      ) : (
                        renderButton({
                          id: `btn-tier-${idx}`,
                          text: `Select ${tier.title}`,
                          actionType: 'checkout',
                          bgColor: isHighlight ? '#2563eb' : '#0f172a',
                          textColor: '#ffffff',
                          borderRadius: 'lg',
                          fontSize: 'base',
                          fontWeight: 'bold',
                          paddingX: '6',
                          paddingY: '3',
                          isFullWidth: true,
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'testimonials':
        return (
          <div className={`${maxWidthClass} mx-auto px-4 md:px-8`}>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-3">{section.title}</h2>
              {section.subtitle && <p className="text-slate-600">{section.subtitle}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {(section.items || []).map((t, idx) => (
                <div
                  key={t.id || idx}
                  className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-1 text-amber-400 mb-4">
                      {Array.from({ length: t.rating || 5 }).map((_, sIdx) => (
                        <Icons.Star key={sIdx} className="w-4 h-4 fill-amber-400" />
                      ))}
                      {t.isSample && (
                        <span className="ml-auto text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                          Sample Testimonial
                        </span>
                      )}
                    </div>
                    <p className="text-slate-700 text-base leading-relaxed italic mb-6">"{t.description}"</p>
                  </div>

                  <div className="flex items-center gap-3">
                    {t.authorAvatar ? (
                      <img
                        src={t.authorAvatar}
                        alt={t.authorName}
                        className="w-11 h-11 rounded-full object-cover border border-slate-200"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                        {t.authorName?.[0] || 'U'}
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-bold text-slate-900">{t.authorName}</div>
                      <div className="text-xs text-slate-500">{t.authorRole}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'faq_accordion':
        return (
          <div className={`${maxWidthClass} mx-auto px-4 md:px-8`}>
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-3">{section.title}</h2>
              {section.subtitle && <p className="text-slate-600">{section.subtitle}</p>}
            </div>

            <div className="space-y-3 max-w-3xl mx-auto">
              {(section.items || []).map((item, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={item.id || idx}
                    className="border border-slate-200 rounded-xl bg-white overflow-hidden transition-all shadow-sm"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full text-left px-6 py-4 flex items-center justify-between font-semibold text-slate-900 hover:bg-slate-50/70"
                    >
                      <span className="text-base md:text-lg pr-4">{item.question}</span>
                      <Icons.ChevronDown
                        className={`w-5 h-5 text-slate-500 shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-5 pt-1 text-slate-600 text-sm md:text-base leading-relaxed border-t border-slate-100">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'statistics':
        return (
          <div className={`${maxWidthClass} mx-auto px-4 md:px-8 text-center`}>
            {section.title && <h2 className="text-2xl font-bold mb-8">{section.title}</h2>}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(section.items || []).map((stat, idx) => (
                <div key={idx} className="p-6">
                  <div className="text-4xl md:text-5xl font-black text-blue-500 mb-2">{stat.title}</div>
                  <div className="text-sm md:text-base font-medium opacity-80">{stat.description}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'lead_form':
      case 'contact_form':
      case 'newsletter':
        return (
          <div className={`${maxWidthClass} mx-auto px-4 md:px-8`}>
            <div className="max-w-xl mx-auto bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-lg text-slate-900">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-extrabold mb-2">{section.title}</h2>
                {section.subtitle && <p className="text-slate-600 text-sm">{section.subtitle}</p>}
              </div>

              {leadSubmitted ? (
                <div className="p-6 bg-emerald-50 text-emerald-800 rounded-xl text-center border border-emerald-200">
                  <Icons.CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                  <h3 className="font-bold text-lg mb-1">Thank You!</h3>
                  <p className="text-sm">We received your inquiry and will reach out shortly.</p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!leadFormData.email) return;
                    if (onLeadSubmit) onLeadSubmit(leadFormData);
                    setLeadSubmitted(true);
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={leadFormData.name}
                      onChange={(e) => setLeadFormData({ ...leadFormData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="jane@example.com"
                      value={leadFormData.email}
                      onChange={(e) => setLeadFormData({ ...leadFormData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={leadFormData.phone}
                      onChange={(e) => setLeadFormData({ ...leadFormData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      How Can We Help You?
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Tell us about your requirements..."
                      value={leadFormData.message}
                      onChange={(e) => setLeadFormData({ ...leadFormData, message: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-98"
                  >
                    Submit Request
                  </button>
                  <p className="text-[11px] text-center text-slate-400">
                    🔒 We respect your privacy. No spam guaranteed.
                  </p>
                </form>
              )}
            </div>
          </div>
        );

      case 'footer':
        return (
          <div className={`${maxWidthClass} mx-auto px-4 md:px-8 text-center`}>
            <div className="font-bold text-lg mb-2 text-white">{section.title}</div>
            {section.description && <p className="text-sm opacity-70 mb-6 max-w-md mx-auto">{section.description}</p>}
            <div className="flex flex-wrap justify-center gap-6 text-xs opacity-80 mb-6">
              <a href="#privacy" className="hover:underline">Privacy Policy</a>
              <a href="#terms" className="hover:underline">Terms of Service</a>
              <a href="#refund" className="hover:underline">Refund Policy</a>
              <a href="#contact" className="hover:underline">Contact Support</a>
            </div>
            <div className="text-xs opacity-50">
              © {new Date().getFullYear()} {section.title}. All rights reserved.
            </div>
          </div>
        );

      default:
        return (
          <div className={`${maxWidthClass} mx-auto px-4 py-6`}>
            <h3 className="text-xl font-bold mb-2">{section.title}</h3>
            {section.subtitle && <p className="text-sm opacity-80">{section.subtitle}</p>}
          </div>
        );
    }
  };

  return (
    <section
      id={section.id}
      onClick={() => isEditor && onSelect && onSelect()}
      style={containerStyle}
      className={`relative transition-all ${
        isEditor ? 'hover:outline-dashed hover:outline-2 hover:outline-blue-400 cursor-pointer' : ''
      } ${isSelected ? 'ring-2 ring-blue-600 ring-offset-2 z-10' : ''}`}
    >
      {/* Editor Badge indicator */}
      {isEditor && (
        <div className="absolute top-2 left-3 opacity-60 hover:opacity-100 transition-opacity z-20">
          <span className="text-[10px] font-mono uppercase bg-slate-900/80 text-white px-2 py-0.5 rounded shadow">
            {section.name || section.type}
          </span>
        </div>
      )}

      {renderSectionBody()}
    </section>
  );
};
