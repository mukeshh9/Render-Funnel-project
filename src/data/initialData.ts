import {
  LandingPage,
  Template,
  Product,
  PaymentGatewayConfig,
  BrandSettings,
  PolicyDocument,
  Testimonial,
  FaqItem,
} from '../types/schema';

export const defaultBrandSettings: BrandSettings = {
  brandName: 'OmniFunnel Brands',
  tagline: 'High-Converting Digital & Physical Commerce',
  primaryColor: '#2563eb', // Royal Blue
  secondaryColor: '#0f172a', // Deep Slate
  accentColor: '#10b981', // Emerald Green
  backgroundColor: '#ffffff',
  textColor: '#1e293b',
  headingColor: '#0f172a',
  fontFamily: 'Inter, sans-serif',
  headingFontFamily: 'Plus Jakarta Sans, sans-serif',
  borderRadius: 'lg',
  buttonStyle: 'rounded',
  logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
  headerLogoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
  footerLogoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
  faviconUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=64&auto=format&fit=crop&q=80',
  socialSharingImageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80',
  contactEmail: 'support@omnifunnel.app',
  contactPhone: '+1 (800) 555-0199',
  whatsappNumber: '+18005550199',
  businessAddress: '100 Innovation Way, Suite 400, Tech District, CA 94107',
  copyrightText: '© 2026 OmniFunnel Inc. All rights reserved.',
};

export const defaultProducts: Product[] = [
  {
    id: 'prod-vfx-bundle',
    title: 'CreatorVault VFX & LUT Master Suite',
    type: 'digital',
    description: '1,200+ Cinematic LUTs, Sound Effects, 4K Light Leaks, Film Burns, and Motion Title Templates for Premiere Pro, DaVinci, and FCPX.',
    price: 49,
    originalPrice: 199,
    currency: 'USD',
    sku: 'VFX-MST-001',
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80',
    stock: -1,
    isDigital: true,
    digitalDownloadUrl: 'https://downloads.omnifunnel.app/files/CreatorVault_Master_Bundle_v4.zip',
    variants: [
      { id: 'v1', title: 'Standard Edition (Single License)', price: 49, originalPrice: 199, sku: 'VFX-STD', stock: -1, isDigital: true },
      { id: 'v2', title: 'Studio Commercial Bundle (5 Seats + VIP Support)', price: 99, originalPrice: 349, sku: 'VFX-STU', stock: -1, isDigital: true }
    ],
    associatedPageIds: ['page-video-editing-bundle']
  },
  {
    id: 'prod-ebook-solopreneur',
    title: 'The 7-Figure Solopreneur Playbook',
    type: 'ebook',
    description: 'The proven framework to build, automate, and scale a $100k+/month one-person business using modern leverage and AI systems.',
    price: 27,
    originalPrice: 97,
    currency: 'USD',
    sku: 'EBK-SOLO-01',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
    stock: -1,
    isDigital: true,
    digitalDownloadUrl: 'https://downloads.omnifunnel.app/files/7_Figure_Solopreneur_Playbook_Complete.pdf',
    variants: [
      { id: 'v-ebk-1', title: 'PDF + ePub Edition', price: 27, originalPrice: 97, sku: 'EBK-STD', stock: -1, isDigital: true },
      { id: 'v-ebk-2', title: 'Deluxe Edition (+ Notion Dashboard & Templates)', price: 47, originalPrice: 147, sku: 'EBK-DLX', stock: -1, isDigital: true }
    ],
    associatedPageIds: ['page-ebook-sales']
  },
  {
    id: 'prod-aerosound-headphones',
    title: 'AeroSound Pro Active Noise Cancelling Headphones',
    type: 'physical',
    description: 'Custom 40mm titanium drivers, hybrid ANC with transparency mode, 45-hour battery life, and ultra-plush memory foam earcups.',
    price: 149,
    originalPrice: 229,
    currency: 'USD',
    sku: 'AERO-ANC-BLK',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    stock: 85,
    isDigital: false,
    variants: [
      { id: 'v-anc-blk', title: 'Midnight Matte Black', price: 149, originalPrice: 229, sku: 'AERO-BLK', stock: 50 },
      { id: 'v-anc-slv', title: 'Lunar Silver Edition', price: 149, originalPrice: 229, sku: 'AERO-SLV', stock: 35 }
    ],
    associatedPageIds: ['page-physical-product']
  },
  {
    id: 'prod-cro-consultation',
    title: 'GrowthScale CRO Audit & 14-Day Growth Sprint',
    type: 'consultation',
    description: 'Direct conversion rate optimization analysis by senior SaaS growth experts. Heatmap audit, copy overhaul, and 3 full landing page redesigns.',
    price: 1499,
    originalPrice: 2999,
    currency: 'USD',
    sku: 'CRO-SPRINT-01',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80',
    stock: 5,
    isDigital: true,
    associatedPageIds: ['page-cro-agency']
  }
];

export const defaultPaymentGateways: PaymentGatewayConfig[] = [
  {
    id: 'razorpay',
    name: 'Razorpay',
    logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=100&auto=format&fit=crop&q=80',
    isEnabled: true,
    isSandbox: true,
    supportedCurrencies: ['INR', 'USD', 'EUR'],
    publicKey: 'rzp_test_98y4h249h8sd',
    secretKeyMasked: '••••••••••••••••••••••••3a9b',
    webhookSecretMasked: '••••••••••••••••••••••••wh_rzp',
    notes: 'Official Razorpay Checkout integration with UPI, Cards, NetBanking, and Wallets.'
  },
  {
    id: 'stripe',
    name: 'Stripe',
    logo: 'https://images.unsplash.com/photo-1556742049-0a67e5572293?w=100&auto=format&fit=crop&q=80',
    isEnabled: true,
    isSandbox: true,
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD'],
    publicKey: 'pk_test_51MzDemoKeyXyZ1234567890',
    secretKeyMasked: '••••••••••••••••••••••••sec_strp',
    webhookSecretMasked: '••••••••••••••••••••••••whsec_01',
    notes: 'Stripe Elements & Payment Intents supporting credit cards, Apple Pay, Google Pay.'
  },
  {
    id: 'cashfree',
    name: 'Cashfree Payments',
    logo: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=100&auto=format&fit=crop&q=80',
    isEnabled: true,
    isSandbox: true,
    supportedCurrencies: ['INR', 'USD'],
    publicKey: 'cf_app_id_test_923849',
    secretKeyMasked: '••••••••••••••••••••••••cf_sec',
    merchantId: 'CF_MERCH_019',
    notes: 'Cashfree Payment Gateway supporting auto-collect, UPI QR, and seamless mobile checkouts.'
  },
  {
    id: 'phonepe',
    name: 'PhonePe Payment Gateway',
    logo: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=100&auto=format&fit=crop&q=80',
    isEnabled: true,
    isSandbox: true,
    supportedCurrencies: ['INR'],
    publicKey: 'PGTESTPAYUAT',
    secretKeyMasked: '••••••••••••••••••••••••phonepe_salt',
    merchantId: 'PGTESTPAYUAT',
    notes: 'High success-rate UPI, cards, and netbanking gateway in India.'
  },
  {
    id: 'payu',
    name: 'PayU',
    logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=100&auto=format&fit=crop&q=80',
    isEnabled: false,
    isSandbox: true,
    supportedCurrencies: ['INR', 'USD'],
    publicKey: 'payu_key_sandbox_01',
    secretKeyMasked: '••••••••••••••••••••••••payu_salt',
    notes: 'Enterprise payment processing with PayU Biz.'
  },
  {
    id: 'paypal',
    name: 'PayPal',
    logo: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=100&auto=format&fit=crop&q=80',
    isEnabled: true,
    isSandbox: true,
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'AUD'],
    publicKey: 'sb-client-id-sample-9092834',
    secretKeyMasked: '••••••••••••••••••••••••paypal_sec',
    notes: 'Global PayPal Smart Buttons and Pay Later support.'
  },
  {
    id: 'ccavenue',
    name: 'CCAvenue',
    logo: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=100&auto=format&fit=crop&q=80',
    isEnabled: false,
    isSandbox: true,
    supportedCurrencies: ['INR', 'USD', 'AED'],
    publicKey: 'CCA_ACCESS_CODE_TEST',
    secretKeyMasked: '••••••••••••••••••••••••cca_working_key',
    merchantId: 'CCA_MERCHANT_123',
    notes: 'Multi-currency gateway with extensive Indian bank direct debits.'
  },
  {
    id: 'easebuzz',
    name: 'Easebuzz',
    logo: 'https://images.unsplash.com/photo-1556742049-0a67e5572293?w=100&auto=format&fit=crop&q=80',
    isEnabled: false,
    isSandbox: true,
    supportedCurrencies: ['INR'],
    publicKey: 'EB_KEY_DEMO_01',
    secretKeyMasked: '••••••••••••••••••••••••eb_salt',
    notes: 'Fast API-first payment collection gateway.'
  },
  {
    id: 'billdesk',
    name: 'BillDesk',
    logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=100&auto=format&fit=crop&q=80',
    isEnabled: false,
    isSandbox: true,
    supportedCurrencies: ['INR'],
    publicKey: 'BD_CLIENT_TEST',
    secretKeyMasked: '••••••••••••••••••••••••bd_sec',
    notes: 'Enterprise institutional settlement gateway.'
  },
  {
    id: 'instamojo',
    name: 'Instamojo',
    logo: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=100&auto=format&fit=crop&q=80',
    isEnabled: false,
    isSandbox: true,
    supportedCurrencies: ['INR'],
    publicKey: 'test_instamojo_client_id',
    secretKeyMasked: '••••••••••••••••••••••••im_secret',
    notes: 'Creator and digital goods payment links.'
  },
  {
    id: 'external_link',
    name: 'Custom External Payment Link',
    logo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=100&auto=format&fit=crop&q=80',
    isEnabled: true,
    isSandbox: false,
    supportedCurrencies: ['USD', 'INR', 'EUR'],
    publicKey: 'external',
    secretKeyMasked: 'N/A',
    externalPaymentUrl: 'https://buy.stripe.com/example_external_link',
    notes: 'Redirect directly to an external Gumroad, LemonSqueezy, or Shopify cart.'
  }
];

export const defaultPolicies: PolicyDocument[] = [
  {
    id: 'pol-privacy',
    type: 'privacy',
    title: 'Privacy Policy',
    slug: 'privacy-policy',
    isPublished: true,
    lastUpdated: '2026-10-01',
    content: `## 1. Information We Collect
We collect personal information that you provide to us when purchasing digital products, physical items, or services. This includes your name, email address, phone number, and shipping details where applicable.

## 2. How We Use Your Information
- To process, fulfill, and deliver your orders.
- To send transactional order confirmations and digital download credentials.
- To provide customer support and respond to inquiries.
- To comply with applicable tax, financial, and regulatory obligations.

## 3. Data Protection & Security
We use industry-standard encryption protocols (TLS/SSL). We never store raw credit card numbers or security CVV codes on our servers; all payment transactions are tokenized and processed securely through accredited payment partners (e.g. Razorpay, Stripe, Cashfree).

## 4. Third-Party Disclosures
We do not sell, rent, or trade your personal data. Data is shared exclusively with essential infrastructure providers (payment processors, hosting services, and shipping carriers).

## 5. Contacting Us
If you have any questions regarding this Privacy Policy, please email us at support@omnifunnel.app.`
  },
  {
    id: 'pol-terms',
    type: 'terms',
    title: 'Terms and Conditions',
    slug: 'terms-and-conditions',
    isPublished: true,
    lastUpdated: '2026-10-01',
    content: `## 1. Agreement to Terms
By accessing our landing pages and purchasing products or services, you agree to be bound by these Terms and Conditions.

## 2. Digital Product Licenses
Unless otherwise specified, digital products (ebooks, video assets, software templates) are licensed for single-user personal or commercial use. Unauthorized redistribution, resale, or sublicensing is strictly prohibited.

## 3. Pricing and Payments
All prices are displayed in the specified currency. We reserve the right to correct typographical pricing errors before order fulfillment.

## 4. Limitation of Liability
In no event shall the company be liable for indirect, incidental, or consequential damages arising from the use of products or advice provided on this website.`
  },
  {
    id: 'pol-refund',
    type: 'refund',
    title: 'Refund and Cancellation Policy',
    slug: 'refund-policy',
    isPublished: true,
    lastUpdated: '2026-10-01',
    content: `## 1. 30-Day Money-Back Guarantee
We stand behind the quality of our offerings with a transparent 30-day money-back guarantee on eligible products.

## 2. Digital Product Returns
If a digital download file is defective, corrupted, or does not match the product description, contact our support team within 14 days of purchase for a replacement or full refund.

## 3. Physical Product Returns
Physical items must be returned within 30 days of delivery in their original packaging and undamaged condition. Customers are responsible for return shipping unless the item arrived defective.

## 4. Processing Time
Approved refunds are processed back to the original payment method within 5–7 business days depending on your issuing bank.`
  },
  {
    id: 'pol-shipping',
    type: 'shipping',
    title: 'Shipping and Delivery Policy',
    slug: 'shipping-policy',
    isPublished: true,
    lastUpdated: '2026-10-01',
    content: `## 1. Digital Deliveries
Digital products and download links are delivered instantly to your provided email address upon verified payment receipt.

## 2. Physical Deliveries
Physical products are dispatched within 24–48 business hours. Standard domestic delivery typically takes 3–5 business days. International delivery takes 7–14 business days. Tracking details are provided via email.`
  },
  {
    id: 'pol-contact',
    type: 'contact',
    title: 'Contact Us',
    slug: 'contact-us',
    isPublished: true,
    lastUpdated: '2026-10-01',
    content: `## Customer Support & Inquiries
- **Email:** support@omnifunnel.app
- **WhatsApp Support:** +1 (800) 555-0199
- **Operating Hours:** Monday – Friday, 9:00 AM – 6:00 PM PST
- **Physical Headquarters:** 100 Innovation Way, Suite 400, Tech District, CA 94107`
  },
  {
    id: 'pol-payment',
    type: 'payment',
    title: 'Payment Terms & Security',
    slug: 'payment-terms',
    isPublished: true,
    lastUpdated: '2026-10-01',
    content: `## Accepted Payment Methods
We accept major credit/debit cards (Visa, MasterCard, American Express), UPI, Net Banking, Apple Pay, Google Pay, and PayPal. All transactions are securely routed through PCI-DSS Level 1 compliant gateways.`
  },
  {
    id: 'pol-disclaimer',
    type: 'disclaimer',
    title: 'Earning & Results Disclaimer',
    slug: 'disclaimer',
    isPublished: true,
    lastUpdated: '2026-10-01',
    content: `## Disclaimer
Any educational case studies, testimonial figures, or financial examples presented on this site are illustrative of exceptional results and do not guarantee future performance. Your individual results will vary based on effort, market factors, and implementation.`
  },
  {
    id: 'pol-cookie',
    type: 'cookie',
    title: 'Cookie Policy',
    slug: 'cookie-policy',
    isPublished: true,
    lastUpdated: '2026-10-01',
    content: `## Cookies & Tracking Technologies
We utilize essential session cookies for cart and checkout functionality, as well as privacy-conscious analytics to measure page conversion performance. You can adjust your browser settings to decline non-essential cookies.`
  }
];

export const defaultTestimonials: Testimonial[] = [
  {
    id: 't-1',
    type: 'text',
    authorName: 'Marcus Vance',
    authorRole: 'YouTube Filmmaker (450K Subs)',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    rating: 5,
    content: 'The LUTs and sound effects cut my editing timeline in half. Clients immediately noticed the leap in production quality. Best creator investment I made this year.',
    isVerifiedPurchase: true,
    isSample: true,
    pageIds: ['page-video-editing-bundle'],
    displayOrder: 1
  },
  {
    id: 't-2',
    type: 'text',
    authorName: 'Sarah Jenkins',
    authorRole: 'SaaS Founder & Bootstrapper',
    authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
    rating: 5,
    content: 'Straight to the point without filler. The pricing psychology and acquisition teardowns alone helped us double our trial-to-paid conversion rate.',
    isVerifiedPurchase: true,
    isSample: true,
    pageIds: ['page-ebook-sales'],
    displayOrder: 2
  },
  {
    id: 't-3',
    type: 'text',
    authorName: 'David Chen',
    authorRole: 'Audio Engineer & Remote Producer',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    rating: 5,
    content: 'Soundstage is remarkably open for closed-back ANC cans. Battery easily lasts an entire work week of long flights and Zoom meetings.',
    isVerifiedPurchase: true,
    isSample: true,
    pageIds: ['page-physical-product'],
    displayOrder: 3
  },
  {
    id: 't-4',
    type: 'text',
    authorName: 'Elena Rostova',
    authorRole: 'Head of Growth, FinTech Labs',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    rating: 5,
    content: 'The CRO audit exposed massive friction in our signup funnel. Within 3 weeks of deploying their recommendations, customer acquisition cost dropped 28%.',
    isVerifiedPurchase: true,
    isSample: true,
    pageIds: ['page-cro-agency'],
    displayOrder: 4
  }
];

export const defaultFaqs: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'How do I receive my digital files after purchasing?',
    answer: 'Immediately after your payment is verified, you will be redirected to an instant download confirmation screen. In addition, an email with your permanent secure download link and receipt will be dispatched within 60 seconds.',
    category: 'Delivery',
    displayOrder: 1,
    pageIds: ['page-video-editing-bundle', 'page-ebook-sales']
  },
  {
    id: 'faq-2',
    question: 'Can I use these assets in commercial client projects?',
    answer: 'Yes! All digital bundles include a royalty-free commercial license. You can use the assets in client work, commercial YouTube videos, ads, films, and broadcast media with zero attribution needed.',
    category: 'Licensing',
    displayOrder: 2,
    pageIds: ['page-video-editing-bundle']
  },
  {
    id: 'faq-3',
    question: 'What is your refund policy if it does not fit my needs?',
    answer: 'We provide an unconditional 30-day money-back guarantee. If you are not completely satisfied for any reason, reach out to our team at support@omnifunnel.app and we will issue a full 100% refund promptly.',
    category: 'Billing',
    displayOrder: 3,
    pageIds: ['page-video-editing-bundle', 'page-ebook-sales', 'page-physical-product']
  },
  {
    id: 'faq-4',
    question: 'How does the 14-day CRO sprint work?',
    answer: 'Once you book your slot, we conduct an intensive teardown of your analytics, session recordings, and copy. On Day 7, you receive the full audit presentation. By Day 14, we deliver three completely redesigned, high-converting page variants ready to launch.',
    category: 'Services',
    displayOrder: 4,
    pageIds: ['page-cro-agency']
  }
];

export const defaultPages: LandingPage[] = [
  {
    id: 'page-video-editing-bundle',
    title: 'CreatorVault VFX & LUT Master Suite',
    slug: 'creatorvault-vfx-bundle',
    category: 'video',
    status: 'published',
    createdAt: '2026-10-10T12:00:00Z',
    updatedAt: '2026-10-15T09:30:00Z',
    publishedAt: '2026-10-10T14:00:00Z',
    associatedProductId: 'prod-vfx-bundle',
    viewCount: 1420,
    conversionCount: 114,
    seo: {
      metaTitle: 'CreatorVault VFX Suite — 1,200+ Cinematic Video Assets',
      metaDescription: 'Level up your video editing with 1,200+ 4K LUTs, sound effects, light leaks, and drag-and-drop Premiere & DaVinci presets.',
      urlSlug: 'creatorvault-vfx-bundle',
      indexable: true,
      structuredDataType: 'Product',
      socialShareImage: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&auto=format&fit=crop&q=80'
    },
    sections: [
      {
        id: 'sec-announcement',
        type: 'announcement_bar',
        name: 'Launch Discount Bar',
        isVisible: true,
        isLocked: false,
        title: '🔥 FLASH SALE: Save 75% on the Complete Master Bundle — Limited to Next 50 Orders!',
        styles: {
          bgColor: '#0f172a',
          textColor: '#f8fafc',
          paddingTop: 10,
          paddingBottom: 10,
          maxWidth: 'full',
          alignment: 'center'
        }
      },
      {
        id: 'sec-hero',
        type: 'hero',
        name: 'Cinematic Hero Header',
        isVisible: true,
        isLocked: false,
        layoutVariant: 'split',
        eyebrow: '⚡ ALL-IN-ONE VIDEO CREATOR ASSET SUITE',
        title: 'Transform Raw Footage Into Hollywood Cinema in Seconds',
        subtitle: '1,200+ 4K Cinematic LUTs, Sound Effects, Film Mattes, Light Leaks, and Motion Titles designed for Premiere Pro, Final Cut, and DaVinci Resolve.',
        supportingLine1: '✓ Compatible with Apple M-Series, Intel, & Windows',
        supportingLine2: '✓ 100% Commercial Royalty-Free Lifetime License',
        supportingLine3: '✓ Instant Download & One-Click Drag & Drop',
        priceText: 'Only $49 (Regular $199)',
        discountText: 'Save $150 Today',
        primaryImage: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1000&auto=format&fit=crop&q=80',
        primaryImageAlt: 'Creator editing 4K timeline with cinematic grade',
        primaryButton: {
          id: 'btn-hero-cta',
          text: 'Get The Master Suite — Just $49',
          actionType: 'checkout',
          productId: 'prod-vfx-bundle',
          bgColor: '#2563eb',
          textColor: '#ffffff',
          borderRadius: 'lg',
          fontSize: 'lg',
          fontWeight: 'bold',
          paddingX: '8',
          paddingY: '4',
          icon: 'Sparkles',
          shadow: 'glow',
          animation: 'pulse',
          isStickyMobile: true
        },
        secondaryButton: {
          id: 'btn-hero-demo',
          text: 'Watch Asset Demo Reel',
          actionType: 'scroll_to',
          targetSectionId: 'sec-video-showcase',
          bgColor: 'rgba(255, 255, 255, 0.1)',
          textColor: '#0f172a',
          borderColor: '#cbd5e1',
          borderWidth: 1,
          borderRadius: 'lg',
          fontSize: 'base',
          fontWeight: 'semibold',
          paddingX: '6',
          paddingY: '3',
          icon: 'Play'
        },
        styles: {
          bgColor: '#f8fafc',
          textColor: '#0f172a',
          paddingTop: 60,
          paddingBottom: 60,
          maxWidth: 'xl',
          alignment: 'left'
        }
      },
      {
        id: 'sec-countdown',
        type: 'countdown_timer',
        name: 'Urgency Countdown',
        isVisible: true,
        isLocked: false,
        title: 'Special Introductory Price Expiring Soon',
        subtitle: 'Once timer hits zero, price automatically returns to $199 retail.',
        countdownTarget: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
        styles: {
          bgColor: '#eff6ff',
          textColor: '#1e3a8a',
          paddingTop: 24,
          paddingBottom: 24,
          maxWidth: 'lg',
          alignment: 'center'
        }
      },
      {
        id: 'sec-inclusions',
        type: 'product_inclusions',
        name: 'What Is Inside The Bundle',
        isVisible: true,
        isLocked: false,
        title: 'Everything You Need in One Unified Creative Vault',
        subtitle: 'Carefully engineered by award-winning colorists and sound designers.',
        items: [
          {
            id: 'inc-1',
            title: '450+ Cinematic 3D LUTs (.cube)',
            description: 'Rec709, LOG conversions, teal & orange, vintage film emulation, moody Scandinavian, and clean corporate grades.',
            icon: 'Palette'
          },
          {
            id: 'inc-2',
            title: '350+ Foley & Atmospheric SFX (24-bit WAV)',
            description: 'Whooshes, deep cinema risers, bass drops, tech clicks, and environmental ambiences mixed at broadcast standards.',
            icon: 'Volume2'
          },
          {
            id: 'inc-3',
            title: '200+ 4K Film Burns & Light Leaks',
            description: 'Captured on authentic 16mm & 35mm optical lenses. Set blend mode to Screen or Overlay for instant vintage magic.',
            icon: 'Film'
          },
          {
            id: 'inc-4',
            title: '200+ Motion Graphics & Lower Thirds',
            description: 'Customizable text titles, kinetic typography, callouts, and minimalist progress bars with responsive duration.',
            icon: 'Layers'
          }
        ],
        styles: {
          bgColor: '#ffffff',
          textColor: '#0f172a',
          paddingTop: 60,
          paddingBottom: 60,
          maxWidth: 'xl',
          alignment: 'center'
        }
      },
      {
        id: 'sec-testimonials',
        type: 'testimonials',
        name: 'Creator Reviews',
        isVisible: true,
        isLocked: false,
        title: 'Trusted by 4,200+ Creators and Production Studios',
        subtitle: 'Read genuine creator experiences with the CreatorVault suite.',
        items: [
          {
            id: 't-rev-1',
            authorName: 'Marcus Vance',
            authorRole: 'YouTube Filmmaker (450K Subs)',
            authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
            rating: 5,
            description: 'The LUTs and sound effects cut my editing timeline in half. Clients immediately noticed the leap in production quality. Best creator investment I made this year.',
            isSample: true
          },
          {
            id: 't-rev-2',
            authorName: 'Jessica Leigh',
            authorRole: 'Commercial Director, Lumina Media',
            authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
            rating: 5,
            description: 'The 35mm light leaks look so organic—not cheap digital overlay graphics. We used them on a national brand commercial and it looked breathtaking.',
            isSample: true
          }
        ],
        styles: {
          bgColor: '#f8fafc',
          textColor: '#0f172a',
          paddingTop: 60,
          paddingBottom: 60,
          maxWidth: 'xl',
          alignment: 'center'
        }
      },
      {
        id: 'sec-pricing',
        type: 'pricing_cards',
        name: 'Pricing Plans',
        isVisible: true,
        isLocked: false,
        title: 'Choose Your Creative License',
        subtitle: 'Pay once, own forever. Zero recurring subscriptions.',
        items: [
          {
            id: 'tier-std',
            title: 'Creator Single License',
            price: 49,
            originalPrice: 199,
            badge: 'MOST POPULAR',
            features: [
              '1,200+ Video Assets & LUTs',
              'Personal & Commercial YouTube Use',
              'Instant Digital Download',
              'Lifetime Free Updates',
              '30-Day Money-Back Guarantee'
            ],
            button: {
              id: 'btn-buy-std',
              text: 'Download Standard — $49',
              actionType: 'checkout',
              productId: 'prod-vfx-bundle',
              bgColor: '#2563eb',
              textColor: '#ffffff',
              borderRadius: 'lg',
              fontSize: 'base',
              fontWeight: 'bold',
              paddingX: '6',
              paddingY: '3'
            }
          },
          {
            id: 'tier-stu',
            title: 'Agency & Studio Suite',
            price: 99,
            originalPrice: 349,
            features: [
              'Everything in Standard License',
              'Up to 5 Team Editor Seats',
              'Client Deliverable Commercial Rights',
              'Priority 24/7 Slack Support',
              'Uncompressed RAW ProRes 4444 Stems'
            ],
            button: {
              id: 'btn-buy-stu',
              text: 'Download Studio — $99',
              actionType: 'checkout',
              productId: 'prod-vfx-bundle',
              bgColor: '#0f172a',
              textColor: '#ffffff',
              borderRadius: 'lg',
              fontSize: 'base',
              fontWeight: 'bold',
              paddingX: '6',
              paddingY: '3'
            }
          }
        ],
        styles: {
          bgColor: '#ffffff',
          textColor: '#0f172a',
          paddingTop: 60,
          paddingBottom: 60,
          maxWidth: 'xl',
          alignment: 'center'
        }
      },
      {
        id: 'sec-faq',
        type: 'faq_accordion',
        name: 'Frequently Asked Questions',
        isVisible: true,
        isLocked: false,
        title: 'Got Questions? We Have Answers',
        subtitle: 'Everything you need to know about compatibility, licensing, and access.',
        items: [
          {
            id: 'faq-item-1',
            question: 'What video editors are supported?',
            answer: 'CreatorVault assets are standard industry files (.cube, .wav, .mp4 ProRes, and .mogrt). They work seamlessly in Adobe Premiere Pro, After Effects, DaVinci Resolve, Final Cut Pro X, and CapCut Desktop.'
          },
          {
            id: 'faq-item-2',
            question: 'How do I download the files?',
            answer: 'Immediately upon checkout completion, you will see a secure one-click download button. A permanent backup link is also sent to your email.'
          },
          {
            id: 'faq-item-3',
            question: 'Is there a money-back guarantee?',
            answer: 'Yes! We offer a full 30-day money-back guarantee. If you are not happy for any reason, email us for an instant refund.'
          }
        ],
        styles: {
          bgColor: '#f8fafc',
          textColor: '#0f172a',
          paddingTop: 60,
          paddingBottom: 60,
          maxWidth: 'lg',
          alignment: 'center'
        }
      },
      {
        id: 'sec-footer',
        type: 'footer',
        name: 'Page Footer',
        isVisible: true,
        isLocked: false,
        title: 'CreatorVault Inc.',
        description: 'Empowering independent filmmakers and digital storytellers with world-class production tools.',
        styles: {
          bgColor: '#0f172a',
          textColor: '#94a3b8',
          paddingTop: 40,
          paddingBottom: 40,
          maxWidth: 'xl',
          alignment: 'center'
        }
      }
    ],
    versions: []
  },
  {
    id: 'page-ebook-sales',
    title: 'The 7-Figure Solopreneur Playbook',
    slug: 'solopreneur-playbook',
    category: 'ebook',
    status: 'published',
    createdAt: '2026-10-11T10:00:00Z',
    updatedAt: '2026-10-14T16:00:00Z',
    publishedAt: '2026-10-11T12:00:00Z',
    associatedProductId: 'prod-ebook-solopreneur',
    viewCount: 890,
    conversionCount: 78,
    seo: {
      metaTitle: 'The 7-Figure Solopreneur Playbook (Instant PDF + Notion)',
      metaDescription: 'Scale your one-person knowledge business to $100k/mo using automated funnels and AI systems. Read the proven playbook.',
      urlSlug: 'solopreneur-playbook',
      indexable: true,
      structuredDataType: 'Book',
      socialShareImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&auto=format&fit=crop&q=80'
    },
    sections: [
      {
        id: 'sec-ebk-hero',
        type: 'hero',
        name: 'Ebook Hero Cover',
        isVisible: true,
        isLocked: false,
        layoutVariant: 'split',
        eyebrow: '📚 BESTSELLING DIGITAL PLAYBOOK',
        title: 'Build a $10,000/Month One-Person Business Without Burnout',
        subtitle: 'Stop trading hours for pennies. Learn the exact 5-pillar operating system used by top solopreneurs to productize expertise, automate sales funnels, and generate recurring cashflow.',
        supportingLine1: '✓ 180-page step-by-step tactical PDF + Kindle format',
        supportingLine2: '✓ Includes 14 plug-and-play Notion workflows and templates',
        supportingLine3: '✓ 30-day 100% money-back satisfaction guarantee',
        priceText: 'Only $27 (Was $97)',
        primaryImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
        primaryImageAlt: 'Solopreneur reading playbook on digital tablet',
        primaryButton: {
          id: 'btn-ebk-buy',
          text: 'Get Instant Access — Only $27',
          actionType: 'checkout',
          productId: 'prod-ebook-solopreneur',
          bgColor: '#059669',
          textColor: '#ffffff',
          borderRadius: 'lg',
          fontSize: 'lg',
          fontWeight: 'bold',
          paddingX: '8',
          paddingY: '4',
          icon: 'Download',
          shadow: 'glow'
        },
        styles: {
          bgColor: '#ffffff',
          textColor: '#0f172a',
          paddingTop: 60,
          paddingBottom: 60,
          maxWidth: 'xl',
          alignment: 'left'
        }
      },
      {
        id: 'sec-ebk-problem',
        type: 'problem_solution',
        name: 'Problem vs Solution',
        isVisible: true,
        isLocked: false,
        title: 'Why Most Freelancers Never Escape the Income Rollercoaster',
        subtitle: 'The fundamental difference between hourly billing and scalable asset leverage.',
        items: [
          {
            id: 'ps-prob',
            title: 'The Old Freelance Trap',
            description: 'Feast or famine cycles, scope creep, constant client chasing, and income caps strictly limited by your 24 hours in a day.'
          },
          {
            id: 'ps-sol',
            title: 'The Solopreneur Flywheel',
            description: 'Productized digital offers, automated discovery funnels, high-margin asynchronous delivery, and automated email nurturing.'
          }
        ],
        styles: {
          bgColor: '#f8fafc',
          textColor: '#0f172a',
          paddingTop: 60,
          paddingBottom: 60,
          maxWidth: 'lg',
          alignment: 'center'
        }
      },
      {
        id: 'sec-ebk-testimonials',
        type: 'testimonials',
        name: 'Reader Endorsements',
        isVisible: true,
        isLocked: false,
        title: 'What Readers Are Saying',
        items: [
          {
            id: 't-ebk-1',
            authorName: 'Sarah Jenkins',
            authorRole: 'SaaS Bootstrapper',
            rating: 5,
            description: 'Straight to the point without fluff. The pricing psychology and funnel frameworks helped us double our sales conversion rate.',
            isSample: true
          }
        ],
        styles: {
          bgColor: '#ffffff',
          textColor: '#0f172a',
          paddingTop: 50,
          paddingBottom: 50,
          maxWidth: 'lg',
          alignment: 'center'
        }
      },
      {
        id: 'sec-ebk-footer',
        type: 'footer',
        name: 'Footer',
        isVisible: true,
        isLocked: false,
        title: 'Solopreneur Publishing',
        styles: {
          bgColor: '#0f172a',
          textColor: '#94a3b8',
          paddingTop: 30,
          paddingBottom: 30,
          maxWidth: 'xl',
          alignment: 'center'
        }
      }
    ],
    versions: []
  },
  {
    id: 'page-physical-product',
    title: 'AeroSound Pro ANC Wireless Headphones',
    slug: 'aerosound-pro-headphones',
    category: 'physical',
    status: 'published',
    createdAt: '2026-10-12T08:00:00Z',
    updatedAt: '2026-10-15T09:00:00Z',
    publishedAt: '2026-10-12T10:00:00Z',
    associatedProductId: 'prod-aerosound-headphones',
    viewCount: 2150,
    conversionCount: 162,
    seo: {
      metaTitle: 'AeroSound Pro — Studio-Grade ANC Wireless Headphones',
      metaDescription: 'Engineered with titanium drivers, 45-hour playback, and hybrid active noise cancellation. Free worldwide priority shipping.',
      urlSlug: 'aerosound-pro-headphones',
      indexable: true,
      structuredDataType: 'Product',
      socialShareImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop&q=80'
    },
    sections: [
      {
        id: 'sec-phys-hero',
        type: 'hero',
        name: 'Hardware Showcase Hero',
        isVisible: true,
        isLocked: false,
        layoutVariant: 'split',
        eyebrow: '🎧 NEXT-GENERATION ACOUSTIC ENGINEERING',
        title: 'Silence the Chaos. Hear Every Subtle Frequency.',
        subtitle: 'Crafted with aerospace-grade aluminum, custom 40mm titanium acoustic drivers, and adaptive hybrid noise cancellation that blocks 98.4% of ambient chatter.',
        priceText: '$149 (MSRP $229)',
        discountText: 'Special $80 Launch Savings',
        primaryImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&auto=format&fit=crop&q=80',
        primaryImageAlt: 'AeroSound Pro matte black headphones',
        primaryButton: {
          id: 'btn-phys-order',
          text: 'Order AeroSound Pro — $149',
          actionType: 'checkout',
          productId: 'prod-aerosound-headphones',
          bgColor: '#0f172a',
          textColor: '#ffffff',
          borderRadius: 'full',
          fontSize: 'lg',
          fontWeight: 'bold',
          paddingX: '8',
          paddingY: '4',
          icon: 'ShoppingBag',
          shadow: 'md'
        },
        styles: {
          bgColor: '#f1f5f9',
          textColor: '#0f172a',
          paddingTop: 60,
          paddingBottom: 60,
          maxWidth: 'xl',
          alignment: 'left'
        }
      },
      {
        id: 'sec-phys-features',
        type: 'features',
        name: 'Hardware Specs',
        isVisible: true,
        isLocked: false,
        title: 'Precision Engineered for Pure Sonic Fidelity',
        items: [
          {
            id: 'feat-1',
            title: '45-Hour Battery Life',
            description: 'Fast-charging gives 5 hours of music playback from a mere 10-minute USB-C charge.',
            icon: 'BatteryCharging'
          },
          {
            id: 'feat-2',
            title: 'Lossless LDAC & aptX HD',
            description: 'Stream 24-bit/96kHz high-resolution audio wirelessly over ultra-stable Bluetooth 5.3.',
            icon: 'Radio'
          },
          {
            id: 'feat-3',
            title: 'Ultra-Plush Memory Foam',
            description: 'Wrapped in breathable protein leather for zero-pressure listening even during 12-hour flights.',
            icon: 'Smile'
          }
        ],
        styles: {
          bgColor: '#ffffff',
          textColor: '#0f172a',
          paddingTop: 50,
          paddingBottom: 50,
          maxWidth: 'xl',
          alignment: 'center'
        }
      },
      {
        id: 'sec-phys-footer',
        type: 'footer',
        name: 'Footer',
        isVisible: true,
        isLocked: false,
        title: 'AeroSound Acoustics Corp.',
        styles: {
          bgColor: '#0f172a',
          textColor: '#94a3b8',
          paddingTop: 30,
          paddingBottom: 30,
          maxWidth: 'xl',
          alignment: 'center'
        }
      }
    ],
    versions: []
  },
  {
    id: 'page-cro-agency',
    title: 'GrowthScale Agency - Full-Funnel CRO Audit',
    slug: 'growthscale-cro-sprint',
    category: 'agency',
    status: 'published',
    createdAt: '2026-10-09T09:00:00Z',
    updatedAt: '2026-10-15T08:00:00Z',
    publishedAt: '2026-10-09T11:00:00Z',
    associatedProductId: 'prod-cro-consultation',
    viewCount: 640,
    conversionCount: 32,
    seo: {
      metaTitle: 'GrowthScale CRO Audit — Double Your Landing Page Conversions',
      metaDescription: '14-day conversion rate optimization sprint for high-growth SaaS and ecommerce brands. Done-for-you copy, UI redesign, and test roadmaps.',
      urlSlug: 'growthscale-cro-sprint',
      indexable: true,
      structuredDataType: 'Service',
      socialShareImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&auto=format&fit=crop&q=80'
    },
    sections: [
      {
        id: 'sec-cro-hero',
        type: 'hero',
        name: 'Agency Hero',
        isVisible: true,
        isLocked: false,
        layoutVariant: 'centered',
        eyebrow: '🚀 HIGH-IMPACT REVENUE ENGINEERING',
        title: 'We Optimize Your Funnel to Turn Lost Traffic Into Paying Customers',
        subtitle: 'Our 14-day CRO sprint pinpoints leakages in your acquisition funnel, rebuilds your value proposition, and deploys high-converting page variations.',
        primaryButton: {
          id: 'btn-cro-book',
          text: 'Book A 14-Day Growth Sprint ($1,499)',
          actionType: 'checkout',
          productId: 'prod-cro-consultation',
          bgColor: '#2563eb',
          textColor: '#ffffff',
          borderRadius: 'lg',
          fontSize: 'lg',
          fontWeight: 'bold',
          paddingX: '8',
          paddingY: '4',
          icon: 'Zap'
        },
        styles: {
          bgColor: '#0f172a',
          textColor: '#f8fafc',
          paddingTop: 80,
          paddingBottom: 80,
          maxWidth: 'lg',
          alignment: 'center'
        }
      },
      {
        id: 'sec-cro-stats',
        type: 'statistics',
        name: 'Client Results Stats',
        isVisible: true,
        isLocked: false,
        title: 'Measurable Outcomes Across 120+ Brand Engagements',
        items: [
          { id: 'stat-1', title: '+43.2%', description: 'Average Conversion Lift' },
          { id: 'stat-2', title: '$18.4M', description: 'Incremental Client Revenue' },
          { id: 'stat-3', title: '14 Days', description: 'Average Delivery Turnaround' }
        ],
        styles: {
          bgColor: '#1e293b',
          textColor: '#f8fafc',
          paddingTop: 50,
          paddingBottom: 50,
          maxWidth: 'xl',
          alignment: 'center'
        }
      },
      {
        id: 'sec-cro-footer',
        type: 'footer',
        name: 'Footer',
        isVisible: true,
        isLocked: false,
        title: 'GrowthScale Agency Ltd.',
        styles: {
          bgColor: '#020617',
          textColor: '#94a3b8',
          paddingTop: 30,
          paddingBottom: 30,
          maxWidth: 'xl',
          alignment: 'center'
        }
      }
    ],
    versions: []
  }
];

export const defaultTemplates: Template[] = [
  {
    id: 'tmpl-digital-product',
    name: 'Digital Asset & Software Suite',
    category: 'Digital Products',
    description: 'High-converting sales funnel with instant digital delivery, countdown timer, feature cards, and software mockups.',
    thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&auto=format&fit=crop&q=80',
    idealFor: 'Software, Plugins, Presets, Icon Packs, Notion Systems',
    colorScheme: ['#2563eb', '#0f172a', '#f8fafc'],
    sections: defaultPages[0].sections
  },
  {
    id: 'tmpl-ebook-sales',
    name: 'Bestselling Ebook & Guide',
    category: 'Ebooks & Publications',
    description: 'Focuses on author credibility, chapter breakdowns, excerpt previews, and instant multi-format downloads.',
    thumbnail: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    idealFor: 'Authors, Solopreneurs, Technical Guides, Playbooks',
    colorScheme: ['#059669', '#1e293b', '#ffffff'],
    sections: defaultPages[1].sections
  },
  {
    id: 'tmpl-video-bundle',
    name: 'Cinematic Video Editing Vault',
    category: 'Video Bundles',
    description: 'Showcases video reels, sound wave previews, technical compatibility badges, and dual licensing tiers.',
    thumbnail: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=600&auto=format&fit=crop&q=80',
    idealFor: 'Videographers, LUT creators, SFX sound libraries',
    colorScheme: ['#dc2626', '#0f172a', '#ffffff'],
    sections: defaultPages[0].sections
  },
  {
    id: 'tmpl-design-bundle',
    name: 'Figma UI Kit & Design System',
    category: 'Design Bundles',
    description: 'Minimalist clean aesthetic highlighting component counts, responsive layouts, and auto-layout features.',
    thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80',
    idealFor: 'UI/UX Designers, Framer Templates, 3D Asset Creators',
    colorScheme: ['#8b5cf6', '#1e1b4b', '#f5f3ff'],
    sections: defaultPages[0].sections
  },
  {
    id: 'tmpl-online-course',
    name: 'Masterclass & Academy Hub',
    category: 'Online Courses',
    description: 'Curriculum breakdown accordions, instructor bio, student project showcases, and enrollment countdowns.',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
    idealFor: 'Bootcamps, Cohort Courses, Video Academies',
    colorScheme: ['#3b82f6', '#0f172a', '#f8fafc'],
    sections: defaultPages[1].sections
  },
  {
    id: 'tmpl-coaching',
    name: 'Executive Coaching & Mentorship',
    category: 'Coaching',
    description: 'High-touch personal brand presentation with client interview videos, transformation timelines, and application CTAs.',
    thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=80',
    idealFor: 'Life Coaches, Business Mentors, Fitness Advisors',
    colorScheme: ['#d97706', '#1c1917', '#fffbeb'],
    sections: defaultPages[3].sections
  },
  {
    id: 'tmpl-agency',
    name: 'Growth Agency & Performance Sprints',
    category: 'Agencies',
    description: 'B2B oriented layout with verifiable ROI stats, client logos, case studies, and transparent sprint pricing.',
    thumbnail: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=80',
    idealFor: 'SEO Agencies, Paid Media Firms, CRO Specialists',
    colorScheme: ['#2563eb', '#0f172a', '#ffffff'],
    sections: defaultPages[3].sections
  },
  {
    id: 'tmpl-lead-gen',
    name: 'High-Converting B2B Lead Magnet',
    category: 'Lead Generation',
    description: 'Frictionless above-the-fold opt-in form, privacy reassurance, and compelling incentive highlights.',
    thumbnail: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&auto=format&fit=crop&q=80',
    idealFor: 'Consultants, Whitepapers, Industry Benchmark Reports',
    colorScheme: ['#0284c7', '#082f49', '#f0f9ff'],
    sections: defaultPages[1].sections
  },
  {
    id: 'tmpl-physical-product',
    name: 'D2C Hardware & Lifestyle E-Commerce',
    category: 'Physical Products',
    description: 'Interactive product gallery, variant selector, specs comparison, unboxing expectations, and shipping policies.',
    thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    idealFor: 'Consumer Electronics, Apparel, Ergonomics, Home Goods',
    colorScheme: ['#18181b', '#ffffff', '#71717a'],
    sections: defaultPages[2].sections
  },
  {
    id: 'tmpl-product-launch',
    name: 'VIP Product Launch & Waitlist',
    category: 'Product Launches',
    description: 'High-anticipation dark mode page with countdown timer, sneak peek videos, and early-bird reservation rewards.',
    thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&auto=format&fit=crop&q=80',
    idealFor: 'Kickstarter launches, SaaS Beta Releases, New Brands',
    colorScheme: ['#6366f1', '#09090b', '#27272a'],
    sections: defaultPages[0].sections
  },
  {
    id: 'tmpl-webinar',
    name: 'Live Virtual Masterclass & Webinar',
    category: 'Webinars',
    description: 'Clear event schedule, guest speakers, key takeaways, and one-click Google Calendar reservation button.',
    thumbnail: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&auto=format&fit=crop&q=80',
    idealFor: 'Free Workshops, Product Demos, Investor Summits',
    colorScheme: ['#ea580c', '#0c0a09', '#fafaf9'],
    sections: defaultPages[1].sections
  },
  {
    id: 'tmpl-appointment',
    name: 'Strategy Session & Consultation Call',
    category: 'Appointments',
    description: 'Integrated booking form, qualification questions, timezone selectors, and client expectation guidelines.',
    thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
    idealFor: 'Financial Planners, Legal Advisors, Technical Consultants',
    colorScheme: ['#0f766e', '#042f2e', '#f0fdfa'],
    sections: defaultPages[3].sections
  }
];
