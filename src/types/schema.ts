/**
 * Shared Type Definitions for OmniFunnel AI Landing Page Builder
 */

export type DeviceMode = 'desktop' | 'tablet' | 'mobile';

export type SectionType =
  | 'announcement_bar'
  | 'header'
  | 'hero'
  | 'product_gallery'
  | 'image_text'
  | 'video_text'
  | 'image_gallery'
  | 'video_section'
  | 'benefits'
  | 'features'
  | 'problem_solution'
  | 'how_it_works'
  | 'comparison_table'
  | 'product_inclusions'
  | 'bonus_section'
  | 'pricing_cards'
  | 'countdown_timer'
  | 'trust_badges'
  | 'statistics'
  | 'logo_strip'
  | 'before_after'
  | 'testimonials'
  | 'faq_accordion'
  | 'guarantee'
  | 'delivery_info'
  | 'lead_form'
  | 'contact_form'
  | 'newsletter'
  | 'whatsapp_cta'
  | 'appointment_cta'
  | 'payment_methods'
  | 'order_summary'
  | 'custom_content'
  | 'spacer_divider'
  | 'footer';

export type ButtonActionType =
  | 'checkout'
  | 'external_url'
  | 'internal_link'
  | 'whatsapp'
  | 'form_submit'
  | 'scroll_to'
  | 'popup'
  | 'download';

export interface ButtonConfig {
  id: string;
  text: string;
  actionType: ButtonActionType;
  destinationUrl?: string;
  targetSectionId?: string;
  productId?: string;
  whatsappNumber?: string;
  whatsappMessage?: string;
  downloadUrl?: string;
  bgColor: string;
  textColor: string;
  hoverBgColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius: string; // 'none' | 'sm' | 'md' | 'lg' | 'full'
  fontSize: string; // 'sm' | 'base' | 'lg' | 'xl'
  fontWeight: string; // 'medium' | 'semibold' | 'bold'
  paddingX: string;
  paddingY: string;
  isFullWidth?: boolean;
  icon?: string; // lucide icon name
  shadow?: string; // 'none' | 'sm' | 'md' | 'lg' | 'glow'
  animation?: 'none' | 'pulse' | 'bounce' | 'shine';
  isStickyMobile?: boolean;
  isStickyDesktop?: boolean;
}

export interface SectionStyles {
  bgColor: string;
  bgGradient?: string;
  bgImage?: string;
  bgOverlayOpacity?: number; // 0 - 100
  textColor: string;
  accentColor?: string;
  paddingTop: number; // in pixels
  paddingBottom: number;
  maxWidth: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  alignment: 'left' | 'center' | 'right';
  borderRadius?: string;
  shadow?: string;
  hideOnDesktop?: boolean;
  hideOnMobile?: boolean;
}

export interface SectionItem {
  id: string;
  title?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  icon?: string;
  price?: number;
  originalPrice?: number;
  badge?: string;
  button?: ButtonConfig;
  features?: string[];
  rating?: number;
  authorName?: string;
  authorRole?: string;
  authorAvatar?: string;
  isSample?: boolean;
  question?: string;
  answer?: string;
  category?: string;
  comparisonValues?: { [key: string]: string | boolean };
}

export interface Section {
  id: string;
  type: SectionType;
  name: string;
  isVisible: boolean;
  isLocked: boolean;
  layoutVariant?: string; // e.g. 'split' | 'centered' | 'full_image' | 'video_bg' | 'cards' | 'accordion'
  
  // Text content
  eyebrow?: string;
  title: string;
  subtitle?: string;
  description?: string;
  supportingLine1?: string;
  supportingLine2?: string;
  supportingLine3?: string;
  additionalParagraph?: string;
  
  // Media
  primaryImage?: string;
  primaryImageAlt?: string;
  mobileImage?: string;
  videoUrl?: string;
  videoType?: 'youtube' | 'vimeo' | 'mp4';
  videoAutoplay?: boolean;
  videoMuted?: boolean;
  videoLoop?: boolean;
  
  // CTAs
  primaryButton?: ButtonConfig;
  secondaryButton?: ButtonConfig;
  
  // Specific data
  priceText?: string;
  discountText?: string;
  trustBadgeList?: string[];
  countdownTarget?: string; // ISO date string
  
  // Dynamic list items (testimonials, faqs, benefits, pricing tiers, logos)
  items?: SectionItem[];
  
  // Form fields if section is a form
  formFields?: {
    id: string;
    label: string;
    type: 'text' | 'email' | 'tel' | 'textarea' | 'select';
    placeholder?: string;
    required: boolean;
    options?: string[];
  }[];

  styles: SectionStyles;
}

export interface BrandSettings {
  brandName: string;
  tagline: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  headingColor: string;
  fontFamily: string;
  headingFontFamily: string;
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  buttonStyle: 'flat' | 'rounded' | 'gradient' | 'minimal' | 'bold';
  logoUrl: string;
  headerLogoUrl?: string;
  footerLogoUrl?: string;
  faviconUrl?: string;
  socialSharingImageUrl?: string;
  contactEmail: string;
  contactPhone?: string;
  whatsappNumber?: string;
  businessAddress?: string;
  copyrightText?: string;
}

export interface SeoSettings {
  metaTitle: string;
  metaDescription: string;
  urlSlug: string;
  canonicalUrl?: string;
  socialShareImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  keywords?: string[];
  indexable: boolean;
  structuredDataType?: 'Product' | 'Course' | 'Book' | 'Service' | 'Event' | 'None';
  customHeadCode?: string;
}

export interface PageVersion {
  id: string;
  timestamp: string;
  description: string;
  sectionCount: number;
  sections: Section[];
}

export interface LandingPage {
  id: string;
  title: string;
  slug: string;
  category: 'digital' | 'ebook' | 'video' | 'design' | 'course' | 'coaching' | 'agency' | 'lead_gen' | 'physical' | 'webinar' | 'membership';
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  associatedProductId?: string;
  
  brandOverrides?: Partial<BrandSettings>;
  seo: SeoSettings;
  sections: Section[];
  versions: PageVersion[];
  
  // AB Testing
  isAbTestActive?: boolean;
  variantSlug?: string;
  viewCount: number;
  conversionCount: number;
}

export interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  thumbnail: string;
  idealFor: string;
  colorScheme: string[];
  sections: Section[];
}

export interface ProductVariant {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  sku: string;
  stock: number;
  isDigital?: boolean;
  downloadUrl?: string;
}

export interface Product {
  id: string;
  title: string;
  type: 'digital' | 'physical' | 'bundle' | 'course' | 'consultation' | 'membership' | 'ebook';
  description: string;
  price: number;
  originalPrice?: number;
  currency: string;
  sku: string;
  image: string;
  galleryImages?: string[];
  demoVideoUrl?: string;
  stock: number; // -1 for unlimited digital
  isDigital: boolean;
  digitalDownloadUrl?: string;
  variants?: ProductVariant[];
  associatedPageIds?: string[];
}

export type PaymentGatewayType =
  | 'razorpay'
  | 'cashfree'
  | 'phonepe'
  | 'payu'
  | 'ccavenue'
  | 'easebuzz'
  | 'billdesk'
  | 'instamojo'
  | 'stripe'
  | 'paypal'
  | 'external_link';

export interface PaymentGatewayConfig {
  id: PaymentGatewayType;
  name: string;
  logo: string;
  isEnabled: boolean;
  isSandbox: boolean;
  supportedCurrencies: string[];
  publicKey: string;
  secretKeyMasked: string; // Private key never sent to client
  webhookSecretMasked?: string;
  externalPaymentUrl?: string;
  merchantId?: string;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  pageId: string;
  pageTitle: string;
  productId: string;
  productTitle: string;
  variantTitle?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  quantity: number;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  currency: string;
  gateway: PaymentGatewayType;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'cancelled' | 'refunded';
  transactionId?: string;
  fulfillmentStatus: 'unfulfilled' | 'fulfilled' | 'download_delivered';
  downloadUrl?: string;
  createdAt: string;
  paidAt?: string;
}

export interface LeadSubmission {
  id: string;
  pageId: string;
  pageTitle: string;
  formType: 'lead' | 'contact' | 'newsletter' | 'appointment';
  name?: string;
  email: string;
  phone?: string;
  message?: string;
  customData?: Record<string, string>;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  type: 'text' | 'image' | 'video';
  authorName: string;
  authorRole: string;
  authorAvatar?: string;
  rating: number; // 1-5
  content: string;
  mediaUrl?: string;
  caption?: string;
  isVerifiedPurchase: boolean;
  isSample: boolean; // clearly labelled
  pageIds: string[];
  displayOrder: number;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  displayOrder: number;
  pageIds: string[];
}

export interface PolicyDocument {
  id: string;
  type: 'privacy' | 'terms' | 'refund' | 'shipping' | 'contact' | 'payment' | 'disclaimer' | 'cookie';
  title: string;
  slug: string;
  content: string;
  isPublished: boolean;
  lastUpdated: string;
}

export interface AnalyticsSummary {
  totalVisitors: number;
  uniqueViews: number;
  ctaClicks: number;
  conversions: number;
  conversionRate: number;
  revenue: number;
  avgScrollDepth: number; // %
  topPages: { slug: string; title: string; views: number; conversions: number; revenue: number }[];
  recentEvents: { type: string; pageSlug: string; details: string; timestamp: string }[];
}
