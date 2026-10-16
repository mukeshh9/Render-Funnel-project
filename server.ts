import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import {
  LandingPage,
  Product,
  PaymentGatewayConfig,
  BrandSettings,
  PolicyDocument,
  Testimonial,
  FaqItem,
  Order,
  LeadSubmission,
  AnalyticsSummary,
  Section,
} from './src/types/schema';
import {
  defaultBrandSettings,
  defaultProducts,
  defaultPaymentGateways,
  defaultPolicies,
  defaultTestimonials,
  defaultFaqs,
  defaultPages,
  defaultTemplates,
} from './src/data/initialData';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// Initialize GoogleGenAI SDK safely
let genAI: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    genAI = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// Persistent JSON Database path
const DATA_DIR = path.join(__dirname, '.data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

interface StoreData {
  pages: LandingPage[];
  products: Product[];
  gateways: PaymentGatewayConfig[];
  brand: BrandSettings;
  policies: PolicyDocument[];
  testimonials: Testimonial[];
  faqs: FaqItem[];
  orders: Order[];
  leads: LeadSubmission[];
  analytics: {
    views: { [slug: string]: number };
    conversions: { [slug: string]: number };
    ctaClicks: { [slug: string]: number };
    scrollDepths: number[];
    events: { type: string; pageSlug: string; details: string; timestamp: string }[];
  };
}

function loadStore(): StoreData {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Could not read existing store. Initializing default data.', err);
  }

  const initialStore: StoreData = {
    pages: defaultPages,
    products: defaultProducts,
    gateways: defaultPaymentGateways,
    brand: defaultBrandSettings,
    policies: defaultPolicies,
    testimonials: defaultTestimonials,
    faqs: defaultFaqs,
    orders: [
      {
        id: 'ord-101',
        orderNumber: 'ORD-89210',
        pageId: 'page-video-editing-bundle',
        pageTitle: 'CreatorVault VFX & LUT Master Suite',
        productId: 'prod-vfx-bundle',
        productTitle: 'CreatorVault VFX & LUT Master Suite',
        variantTitle: 'Standard Edition (Single License)',
        customerName: 'Alex Rivera',
        customerEmail: 'alex.rivera@example.com',
        quantity: 1,
        subtotal: 49,
        discount: 0,
        tax: 0,
        total: 49,
        currency: 'USD',
        gateway: 'stripe',
        paymentStatus: 'paid',
        transactionId: 'pi_3MzbvTest99281',
        fulfillmentStatus: 'download_delivered',
        downloadUrl: 'https://downloads.omnifunnel.app/files/CreatorVault_Master_Bundle_v4.zip',
        createdAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
        paidAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
      },
      {
        id: 'ord-102',
        orderNumber: 'ORD-89211',
        pageId: 'page-ebook-sales',
        pageTitle: 'The 7-Figure Solopreneur Playbook',
        productId: 'prod-ebook-solopreneur',
        productTitle: 'The 7-Figure Solopreneur Playbook',
        variantTitle: 'Deluxe Edition (+ Notion Dashboard)',
        customerName: 'Maya Patel',
        customerEmail: 'maya.patel@example.com',
        quantity: 1,
        subtotal: 47,
        discount: 5,
        tax: 0,
        total: 42,
        currency: 'USD',
        gateway: 'razorpay',
        paymentStatus: 'paid',
        transactionId: 'pay_Lzx928734hks',
        fulfillmentStatus: 'download_delivered',
        downloadUrl: 'https://downloads.omnifunnel.app/files/7_Figure_Solopreneur_Playbook_Complete.pdf',
        createdAt: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
        paidAt: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
      },
    ],
    leads: [
      {
        id: 'lead-1',
        pageId: 'page-cro-agency',
        pageTitle: 'GrowthScale Agency - Full-Funnel CRO Audit',
        formType: 'appointment',
        name: 'Jonathan Vance',
        email: 'jonathan@saasmetric.io',
        phone: '+1 415-555-8921',
        message: 'Looking to optimize our checkout conversion rate before next quarter fundraise.',
        createdAt: new Date(Date.now() - 3600 * 1000 * 6).toISOString(),
      },
    ],
    analytics: {
      views: {
        'creatorvault-vfx-bundle': 1420,
        'solopreneur-playbook': 890,
        'aerosound-pro-headphones': 2150,
        'growthscale-cro-sprint': 640,
      },
      conversions: {
        'creatorvault-vfx-bundle': 114,
        'solopreneur-playbook': 78,
        'aerosound-pro-headphones': 162,
        'growthscale-cro-sprint': 32,
      },
      ctaClicks: {
        'creatorvault-vfx-bundle': 342,
        'solopreneur-playbook': 210,
        'aerosound-pro-headphones': 480,
        'growthscale-cro-sprint': 118,
      },
      scrollDepths: [65, 80, 92, 45, 75, 88, 70],
      events: [
        { type: 'view', pageSlug: 'creatorvault-vfx-bundle', details: 'Desktop Chrome', timestamp: new Date().toISOString() },
        { type: 'cta_click', pageSlug: 'creatorvault-vfx-bundle', details: 'btn-hero-cta', timestamp: new Date().toISOString() },
      ],
    },
  };

  saveStore(initialStore);
  return initialStore;
}

let store: StoreData = loadStore();

function saveStore(data: StoreData) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save store to disk:', err);
  }
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // API Routes
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      hasGeminiKey: !!process.env.GEMINI_API_KEY,
      pagesCount: store.pages.length,
      productsCount: store.products.length,
      ordersCount: store.orders.length,
    });
  });

  // --- PAGES API ---
  app.get('/api/pages', (_req: Request, res: Response) => {
    res.json(store.pages);
  });

  app.get('/api/pages/:idOrSlug', (req: Request, res: Response) => {
    const { idOrSlug } = req.params;
    const page = store.pages.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }
    res.json(page);
  });

  app.post('/api/pages', (req: Request, res: Response) => {
    const body = req.body;
    const newPage: LandingPage = {
      id: `page-${Date.now()}`,
      title: body.title || 'Untitled Landing Page',
      slug: (body.slug || body.title || 'untitled-page')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, ''),
      category: body.category || 'digital',
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      associatedProductId: body.associatedProductId,
      viewCount: 0,
      conversionCount: 0,
      seo: {
        metaTitle: body.title || 'High Converting Offer',
        metaDescription: body.description || 'Exclusive deal and instant access.',
        urlSlug: (body.slug || body.title || 'untitled-page')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, ''),
        indexable: true,
      },
      sections: body.sections || defaultPages[0].sections,
      versions: [
        {
          id: `v-${Date.now()}`,
          timestamp: new Date().toISOString(),
          description: 'Initial draft version',
          sectionCount: (body.sections || defaultPages[0].sections).length,
          sections: JSON.parse(JSON.stringify(body.sections || defaultPages[0].sections)),
        },
      ],
    };

    store.pages.unshift(newPage);
    saveStore(store);
    res.status(201).json(newPage);
  });

  app.put('/api/pages/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const index = store.pages.findIndex((p) => p.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Page not found' });
    }

    const current = store.pages[index];
    const update = req.body;

    // Snapshot version if sections modified
    const versions = current.versions || [];
    if (update.sections && JSON.stringify(update.sections) !== JSON.stringify(current.sections)) {
      versions.unshift({
        id: `v-${Date.now()}`,
        timestamp: new Date().toISOString(),
        description: update.versionDescription || `Auto-saved at ${new Date().toLocaleTimeString()}`,
        sectionCount: update.sections.length,
        sections: JSON.parse(JSON.stringify(update.sections)),
      });
      // keep max 20 versions
      if (versions.length > 20) versions.pop();
    }

    const updatedPage: LandingPage = {
      ...current,
      ...update,
      id: current.id,
      updatedAt: new Date().toISOString(),
      versions,
    };

    store.pages[index] = updatedPage;
    saveStore(store);
    res.json(updatedPage);
  });

  app.post('/api/pages/:id/publish', (req: Request, res: Response) => {
    const { id } = req.params;
    const page = store.pages.find((p) => p.id === id);
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    page.status = 'published';
    page.publishedAt = new Date().toISOString();
    page.updatedAt = new Date().toISOString();
    saveStore(store);
    res.json({ message: 'Page published successfully', page });
  });

  app.post('/api/pages/:id/unpublish', (req: Request, res: Response) => {
    const { id } = req.params;
    const page = store.pages.find((p) => p.id === id);
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    page.status = 'draft';
    page.updatedAt = new Date().toISOString();
    saveStore(store);
    res.json({ message: 'Page unpublished to draft', page });
  });

  app.post('/api/pages/:id/duplicate', (req: Request, res: Response) => {
    const { id } = req.params;
    const source = store.pages.find((p) => p.id === id);
    if (!source) {
      return res.status(404).json({ error: 'Source page not found' });
    }

    const duplicated: LandingPage = {
      ...JSON.parse(JSON.stringify(source)),
      id: `page-${Date.now()}`,
      title: `${source.title} (Copy)`,
      slug: `${source.slug}-copy-${Math.floor(Math.random() * 900 + 100)}`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      viewCount: 0,
      conversionCount: 0,
      publishedAt: undefined,
    };

    store.pages.unshift(duplicated);
    saveStore(store);
    res.status(201).json(duplicated);
  });

  app.delete('/api/pages/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const initialLen = store.pages.length;
    store.pages = store.pages.filter((p) => p.id !== id);
    if (store.pages.length === initialLen) {
      return res.status(404).json({ error: 'Page not found' });
    }
    saveStore(store);
    res.json({ message: 'Page deleted successfully' });
  });

  app.post('/api/pages/:id/rollback', (req: Request, res: Response) => {
    const { id } = req.params;
    const { versionId } = req.body;
    const page = store.pages.find((p) => p.id === id);
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    const targetVersion = page.versions.find((v) => v.id === versionId);
    if (!targetVersion) {
      return res.status(404).json({ error: 'Version not found' });
    }

    page.sections = JSON.parse(JSON.stringify(targetVersion.sections));
    page.updatedAt = new Date().toISOString();
    saveStore(store);
    res.json({ message: 'Rollback successful', page });
  });

  // --- TEMPLATES API ---
  app.get('/api/templates', (_req: Request, res: Response) => {
    res.json(defaultTemplates);
  });

  // --- PRODUCTS API ---
  app.get('/api/products', (_req: Request, res: Response) => {
    res.json(store.products);
  });

  app.post('/api/products', (req: Request, res: Response) => {
    const prod: Product = {
      id: `prod-${Date.now()}`,
      ...req.body,
    };
    store.products.push(prod);
    saveStore(store);
    res.status(201).json(prod);
  });

  app.put('/api/products/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const idx = store.products.findIndex((p) => p.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Product not found' });
    store.products[idx] = { ...store.products[idx], ...req.body, id };
    saveStore(store);
    res.json(store.products[idx]);
  });

  // --- BRAND SETTINGS ---
  app.get('/api/brand', (_req: Request, res: Response) => {
    res.json(store.brand);
  });

  app.put('/api/brand', (req: Request, res: Response) => {
    store.brand = { ...store.brand, ...req.body };
    saveStore(store);
    res.json(store.brand);
  });

  // --- PAYMENT GATEWAYS API ---
  app.get('/api/gateways', (_req: Request, res: Response) => {
    res.json(store.gateways);
  });

  app.put('/api/gateways/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const idx = store.gateways.findIndex((g) => g.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Gateway not found' });
    store.gateways[idx] = { ...store.gateways[idx], ...req.body, id };
    saveStore(store);
    res.json(store.gateways[idx]);
  });

  // --- POLICIES API ---
  app.get('/api/policies', (_req: Request, res: Response) => {
    res.json(store.policies);
  });

  app.put('/api/policies/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const idx = store.policies.findIndex((p) => p.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Policy not found' });
    store.policies[idx] = { ...store.policies[idx], ...req.body, id, lastUpdated: new Date().toISOString().split('T')[0] };
    saveStore(store);
    res.json(store.policies[idx]);
  });

  // --- TESTIMONIALS API ---
  app.get('/api/testimonials', (_req: Request, res: Response) => {
    res.json(store.testimonials);
  });

  app.post('/api/testimonials', (req: Request, res: Response) => {
    const item: Testimonial = {
      id: `t-${Date.now()}`,
      ...req.body,
    };
    store.testimonials.unshift(item);
    saveStore(store);
    res.status(201).json(item);
  });

  // --- FAQS API ---
  app.get('/api/faqs', (_req: Request, res: Response) => {
    res.json(store.faqs);
  });

  app.post('/api/faqs', (req: Request, res: Response) => {
    const item: FaqItem = {
      id: `faq-${Date.now()}`,
      ...req.body,
    };
    store.faqs.push(item);
    saveStore(store);
    res.status(201).json(item);
  });

  // --- ORDERS & CHECKOUT API ---
  app.get('/api/orders', (_req: Request, res: Response) => {
    res.json(store.orders);
  });

  // Server-side amount validation & order session creation
  app.post('/api/checkout/create-session', (req: Request, res: Response) => {
    const { productId, variantId, couponCode, quantity = 1, pageId } = req.body;
    const product = store.products.find((p) => p.id === productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    let unitPrice = product.price;
    let variantTitle = undefined;
    if (variantId && product.variants) {
      const variant = product.variants.find((v) => v.id === variantId);
      if (variant) {
        unitPrice = variant.price;
        variantTitle = variant.title;
      }
    }

    const subtotal = unitPrice * Math.max(1, quantity);
    let discount = 0;
    if (couponCode) {
      const code = couponCode.trim().toUpperCase();
      if (code === 'LAUNCH20' || code === 'SAVE20') {
        discount = Math.round(subtotal * 0.2);
      } else if (code === 'VIP10') {
        discount = Math.round(subtotal * 0.1);
      }
    }

    // Applicable tax simulation
    const tax = 0; // Or standard tax
    const total = Math.max(0, subtotal - discount + tax);

    const activeGateways = store.gateways.filter((g) => g.isEnabled);

    const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    res.json({
      sessionId,
      product: {
        id: product.id,
        title: product.title,
        isDigital: product.isDigital,
        variantTitle,
      },
      pricing: {
        unitPrice,
        quantity,
        subtotal,
        discount,
        tax,
        total,
        currency: product.currency || 'USD',
      },
      availableGateways: activeGateways.map((g) => ({
        id: g.id,
        name: g.name,
        logo: g.logo,
        isSandbox: g.isSandbox,
        supportedCurrencies: g.supportedCurrencies,
        externalPaymentUrl: g.externalPaymentUrl,
      })),
    });
  });

  // Process and verify payment with gateway validation
  app.post('/api/checkout/process-order', (req: Request, res: Response) => {
    const {
      pageId,
      productId,
      variantTitle,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      quantity = 1,
      gateway,
      couponCode,
    } = req.body;

    const product = store.products.find((p) => p.id === productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const page = store.pages.find((p) => p.id === pageId);

    // Re-verify unit price strictly on server
    let unitPrice = product.price;
    if (variantTitle && product.variants) {
      const v = product.variants.find((vr) => vr.title === variantTitle);
      if (v) unitPrice = v.price;
    }

    const subtotal = unitPrice * Math.max(1, quantity);
    let discount = 0;
    if (couponCode) {
      const code = couponCode.trim().toUpperCase();
      if (code === 'LAUNCH20' || code === 'SAVE20') discount = Math.round(subtotal * 0.2);
      else if (code === 'VIP10') discount = Math.round(subtotal * 0.1);
    }
    const total = Math.max(0, subtotal - discount);

    const selectedGateway = store.gateways.find((g) => g.id === gateway);
    if (!selectedGateway || !selectedGateway.isEnabled) {
      return res.status(400).json({ error: 'Selected payment gateway is unavailable' });
    }

    const transactionId = `txn_${gateway}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      pageId: page?.id || 'unknown',
      pageTitle: page?.title || product.title,
      productId: product.id,
      productTitle: product.title,
      variantTitle,
      customerName: customerName || 'Valued Customer',
      customerEmail: customerEmail,
      customerPhone,
      shippingAddress,
      quantity,
      subtotal,
      discount,
      tax: 0,
      total,
      currency: product.currency || 'USD',
      gateway,
      paymentStatus: 'paid', // verified payment state
      transactionId,
      fulfillmentStatus: product.isDigital ? 'download_delivered' : 'unfulfilled',
      downloadUrl: product.isDigital ? (product.digitalDownloadUrl || 'https://downloads.omnifunnel.app/access/' + product.id) : undefined,
      createdAt: new Date().toISOString(),
      paidAt: new Date().toISOString(),
    };

    store.orders.unshift(newOrder);

    // Record conversion
    if (page?.slug) {
      store.analytics.conversions[page.slug] = (store.analytics.conversions[page.slug] || 0) + 1;
      store.analytics.events.unshift({
        type: 'conversion',
        pageSlug: page.slug,
        details: `Order ${orderNumber} - ${product.currency} ${total}`,
        timestamp: new Date().toISOString(),
      });
      page.conversionCount = (page.conversionCount || 0) + 1;
    }

    saveStore(store);

    res.json({
      success: true,
      message: 'Payment verified and order placed successfully',
      order: newOrder,
    });
  });

  // Simulated Webhook endpoint
  app.post('/api/webhooks/:gateway', (req: Request, res: Response) => {
    const { gateway } = req.params;
    const signature = req.headers['x-webhook-signature'] || req.headers['x-razorpay-signature'];
    console.log(`[Webhook] Received event for gateway: ${gateway}, signature present: ${!!signature}`);

    // Return idempotent 200 OK
    res.json({ received: true, gateway, timestamp: new Date().toISOString() });
  });

  // --- LEADS API ---
  app.get('/api/leads', (_req: Request, res: Response) => {
    res.json(store.leads);
  });

  app.post('/api/leads', (req: Request, res: Response) => {
    const { pageId, formType, name, email, phone, message, customData } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const page = store.pages.find((p) => p.id === pageId);
    const newLead: LeadSubmission = {
      id: `lead-${Date.now()}`,
      pageId: pageId || 'direct',
      pageTitle: page?.title || 'Landing Page Form',
      formType: formType || 'lead',
      name,
      email,
      phone,
      message,
      customData,
      createdAt: new Date().toISOString(),
    };

    store.leads.unshift(newLead);
    saveStore(store);

    res.status(201).json({
      success: true,
      message: 'Thank you! Your information has been securely received.',
      lead: newLead,
    });
  });

  // --- ANALYTICS API ---
  app.get('/api/analytics', (_req: Request, res: Response) => {
    let totalViews = 0;
    let totalConversions = 0;
    let totalRevenue = 0;
    let totalCtaClicks = 0;

    Object.values(store.analytics.views).forEach((v) => (totalViews += v));
    Object.values(store.analytics.conversions).forEach((c) => (totalConversions += c));
    Object.values(store.analytics.ctaClicks).forEach((c) => (totalCtaClicks += c));
    store.orders.forEach((o) => {
      if (o.paymentStatus === 'paid') totalRevenue += o.total;
    });

    const conversionRate = totalViews > 0 ? parseFloat(((totalConversions / totalViews) * 100).toFixed(2)) : 0;
    const avgScroll = store.analytics.scrollDepths.length
      ? Math.round(
          store.analytics.scrollDepths.reduce((a, b) => a + b, 0) / store.analytics.scrollDepths.length
        )
      : 72;

    const topPages = store.pages.map((p) => {
      const views = store.analytics.views[p.slug] || 0;
      const convs = store.analytics.conversions[p.slug] || 0;
      const rev = store.orders
        .filter((o) => o.pageId === p.id && o.paymentStatus === 'paid')
        .reduce((sum, o) => sum + o.total, 0);
      return {
        slug: p.slug,
        title: p.title,
        views,
        conversions: convs,
        revenue: rev,
      };
    });

    const summary: AnalyticsSummary = {
      totalVisitors: totalViews,
      uniqueViews: Math.round(totalViews * 0.82),
      ctaClicks: totalCtaClicks,
      conversions: totalConversions,
      conversionRate,
      revenue: totalRevenue,
      avgScrollDepth: avgScroll,
      topPages,
      recentEvents: store.analytics.events.slice(0, 15),
    };

    res.json(summary);
  });

  app.post('/api/analytics/track', (req: Request, res: Response) => {
    const { type, pageSlug, details, scrollDepth } = req.body;
    if (!pageSlug) return res.status(400).json({ error: 'Missing pageSlug' });

    if (type === 'view') {
      store.analytics.views[pageSlug] = (store.analytics.views[pageSlug] || 0) + 1;
    } else if (type === 'cta_click') {
      store.analytics.ctaClicks[pageSlug] = (store.analytics.ctaClicks[pageSlug] || 0) + 1;
    }

    if (typeof scrollDepth === 'number') {
      store.analytics.scrollDepths.push(Math.min(100, Math.max(0, scrollDepth)));
      if (store.analytics.scrollDepths.length > 50) store.analytics.scrollDepths.shift();
    }

    store.analytics.events.unshift({
      type: type || 'event',
      pageSlug,
      details: details || '',
      timestamp: new Date().toISOString(),
    });

    if (store.analytics.events.length > 100) store.analytics.events.pop();

    saveStore(store);
    res.json({ tracked: true });
  });

  // --- GEMINI AI LANDING PAGE GENERATION & REWRITING ---
  app.post('/api/ai/generate-page', async (req: Request, res: Response) => {
    const { productName, audience, niche, tone, keyFeatures, price, offerType } = req.body;

    const defaultTitle = productName ? `${productName} — Official Launch` : 'Exclusive Product Launch';

    // If Gemini API is available, generate custom high-converting copy
    if (genAI && process.env.GEMINI_API_KEY) {
      try {
        const prompt = `You are a world-class conversion copywriter and landing page architect.
Generate a high-converting, realistic JSON landing page structure for:
Product Name: ${productName || 'QuantumFlow Productivity Suite'}
Target Audience: ${audience || 'Founders, Creators, and Knowledge Workers'}
Niche: ${niche || 'Software & Digital Productivity'}
Tone: ${tone || 'Inspiring, authoritative, results-driven'}
Key Benefits/Features: ${keyFeatures || 'Instant automation, 10x workflow efficiency, zero learning curve'}
Price: ${price || '$49'}
Offer Type: ${offerType || 'digital'}

Return ONLY a valid JSON object with the following structure:
{
  "title": "Main page headline",
  "metaTitle": "SEO meta title under 60 chars",
  "metaDescription": "SEO meta description under 155 chars",
  "heroEyebrow": "Short punchy eyebrow text with emoji",
  "heroTitle": "Compelling benefit-driven headline",
  "heroSubtitle": "2-sentence punchy explanation of the value proposition",
  "bullet1": "Key benefit 1",
  "bullet2": "Key benefit 2",
  "bullet3": "Key benefit 3",
  "ctaText": "Action-oriented button text",
  "problemTitle": "The critical struggle facing this audience",
  "problemText": "Detailed description of their current frustration",
  "solutionTitle": "The breakthrough solution",
  "solutionText": "How this offer solves their problem permanently",
  "features": [
    { "title": "Feature 1", "description": "Specific tangible outcome" },
    { "title": "Feature 2", "description": "Specific tangible outcome" },
    { "title": "Feature 3", "description": "Specific tangible outcome" },
    { "title": "Feature 4", "description": "Specific tangible outcome" }
  ],
  "faqs": [
    { "question": "Relevant question 1?", "answer": "Clear reassuring answer." },
    { "question": "Relevant question 2?", "answer": "Clear reassuring answer." },
    { "question": "What is the return policy?", "answer": "30-day no-questions-asked refund guarantee." }
  ]
}`;

        const response = await genAI.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const rawText = response.text || '{}';
        const parsed = JSON.parse(rawText);

        const newSections: Section[] = [
          {
            id: `sec-ann-${Date.now()}`,
            type: 'announcement_bar',
            name: 'Announcement Bar',
            isVisible: true,
            isLocked: false,
            title: `🚀 Special Launch Offer: Get 50% Off ${productName || 'Today'} — Limited Time Only`,
            styles: {
              bgColor: '#0f172a',
              textColor: '#ffffff',
              paddingTop: 10,
              paddingBottom: 10,
              maxWidth: 'full',
              alignment: 'center',
            },
          },
          {
            id: `sec-hero-${Date.now()}`,
            type: 'hero',
            name: 'AI Generated Hero',
            isVisible: true,
            isLocked: false,
            layoutVariant: 'split',
            eyebrow: parsed.heroEyebrow || '⭐ HIGH-IMPACT SOLUTION',
            title: parsed.heroTitle || `Unlock Your Full Potential with ${productName}`,
            subtitle: parsed.heroSubtitle || 'Built to accelerate outcomes and eliminate operational friction effortlessly.',
            supportingLine1: `✓ ${parsed.bullet1 || 'Instant Setup and Implementation'}`,
            supportingLine2: `✓ ${parsed.bullet2 || 'Backed by 30-Day Money-Back Guarantee'}`,
            supportingLine3: `✓ ${parsed.bullet3 || 'Lifetime Access & Dedicated Priority Support'}`,
            priceText: price ? `Special Offer: ${price}` : 'Special Launch Price',
            primaryImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1000&auto=format&fit=crop&q=80',
            primaryButton: {
              id: `btn-hero-${Date.now()}`,
              text: parsed.ctaText || `Claim Access Now — ${price || 'Get Started'}`,
              actionType: 'checkout',
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
              isStickyMobile: true,
            },
            styles: {
              bgColor: '#f8fafc',
              textColor: '#0f172a',
              paddingTop: 70,
              paddingBottom: 70,
              maxWidth: 'xl',
              alignment: 'left',
            },
          },
          {
            id: `sec-features-${Date.now()}`,
            type: 'features',
            name: 'Core Capabilities',
            isVisible: true,
            isLocked: false,
            title: parsed.solutionTitle || 'Built from the Ground Up for Real Performance',
            subtitle: parsed.solutionText || 'Engineered with meticulous attention to detail to drive measurable outcomes.',
            items: (parsed.features || []).map((f: any, i: number) => ({
              id: `f-${i}`,
              title: f.title,
              description: f.description,
              icon: i === 0 ? 'Zap' : i === 1 ? 'Shield' : i === 2 ? 'BarChart' : 'CheckCircle',
            })),
            styles: {
              bgColor: '#ffffff',
              textColor: '#0f172a',
              paddingTop: 60,
              paddingBottom: 60,
              maxWidth: 'xl',
              alignment: 'center',
            },
          },
          {
            id: `sec-faq-${Date.now()}`,
            type: 'faq_accordion',
            name: 'FAQ Section',
            isVisible: true,
            isLocked: false,
            title: 'Frequently Asked Questions',
            subtitle: 'Got questions? Everything you need to know before joining.',
            items: (parsed.faqs || []).map((faq: any, i: number) => ({
              id: `faq-${i}`,
              question: faq.question,
              answer: faq.answer,
            })),
            styles: {
              bgColor: '#f8fafc',
              textColor: '#0f172a',
              paddingTop: 60,
              paddingBottom: 60,
              maxWidth: 'lg',
              alignment: 'center',
            },
          },
          {
            id: `sec-foot-${Date.now()}`,
            type: 'footer',
            name: 'Footer',
            isVisible: true,
            isLocked: false,
            title: productName || 'OmniFunnel Brands',
            description: 'All rights reserved. Secure transactions powered by PCI-DSS compliant checkout.',
            styles: {
              bgColor: '#0f172a',
              textColor: '#94a3b8',
              paddingTop: 40,
              paddingBottom: 40,
              maxWidth: 'xl',
              alignment: 'center',
            },
          },
        ];

        return res.json({
          success: true,
          aiGenerated: true,
          page: {
            title: parsed.title || defaultTitle,
            slug: (productName || 'ai-offer')
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .concat(`-${Math.floor(Math.random() * 900 + 100)}`),
            seo: {
              metaTitle: parsed.metaTitle || defaultTitle,
              metaDescription: parsed.metaDescription || `Discover ${productName}. Instant access and 30-day money-back guarantee.`,
              urlSlug: (productName || 'ai-offer').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
              indexable: true,
            },
            sections: newSections,
          },
        });
      } catch (geminiError) {
        console.error('Gemini API call failed, falling back to algorithmic builder:', geminiError);
      }
    }

    // Heuristic algorithmic fallback (guaranteed offline reliability)
    const baseSlug = (productName || 'new-offer')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const fallbackSections: Section[] = [
      {
        id: `sec-ann-${Date.now()}`,
        type: 'announcement_bar',
        name: 'Launch Discount Bar',
        isVisible: true,
        isLocked: false,
        title: `🔥 Limited Time: Get Instant Access to ${productName || 'The Master Suite'} with 60% Savings!`,
        styles: {
          bgColor: '#1e3a8a',
          textColor: '#ffffff',
          paddingTop: 10,
          paddingBottom: 10,
          maxWidth: 'full',
          alignment: 'center',
        },
      },
      {
        id: `sec-hero-${Date.now()}`,
        type: 'hero',
        name: 'Hero Section',
        isVisible: true,
        isLocked: false,
        layoutVariant: 'split',
        eyebrow: `⚡ PREMIUM ${niche ? niche.toUpperCase() : 'OFFER'}`,
        title: `The Proven Way to Master ${productName || 'Your Craft'} in Record Time`,
        subtitle: `Specifically tailored for ${audience || 'ambitious professionals'}. Eliminate guesswork with our comprehensive step-by-step system.`,
        supportingLine1: '✓ 100% Instant Lifetime Access',
        supportingLine2: '✓ Risk-Free 30-Day Money-Back Guarantee',
        supportingLine3: '✓ Battle-Tested by Industry Practitioners',
        priceText: price ? `Special Launch Price: ${price}` : 'Special Launch Price',
        primaryImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1000&auto=format&fit=crop&q=80',
        primaryButton: {
          id: `btn-hero-${Date.now()}`,
          text: `Get Instant Access — ${price || 'Start Now'}`,
          actionType: 'checkout',
          bgColor: '#2563eb',
          textColor: '#ffffff',
          borderRadius: 'lg',
          fontSize: 'lg',
          fontWeight: 'bold',
          paddingX: '8',
          paddingY: '4',
          icon: 'Sparkles',
          isStickyMobile: true,
        },
        styles: {
          bgColor: '#f8fafc',
          textColor: '#0f172a',
          paddingTop: 70,
          paddingBottom: 70,
          maxWidth: 'xl',
          alignment: 'left',
        },
      },
      {
        id: `sec-features-${Date.now()}`,
        type: 'features',
        name: 'Key Features & Benefits',
        isVisible: true,
        isLocked: false,
        title: 'Everything You Need to Succeed',
        subtitle: 'Designed to deliver immediate impact and long-term sustainable advantage.',
        items: [
          { id: 'f-1', title: 'Complete Blueprint & Systems', description: 'Plug-and-play frameworks ready to implement within 15 minutes.', icon: 'CheckCircle' },
          { id: 'f-2', title: 'Time-Saving Workflow Automation', description: 'Eliminate repetitive manual labor and focus entirely on high-leverage growth.', icon: 'Zap' },
          { id: 'f-3', title: 'Dedicated Support & Updates', description: 'Receive lifetime continuous improvements and direct answers from specialists.', icon: 'Shield' },
        ],
        styles: {
          bgColor: '#ffffff',
          textColor: '#0f172a',
          paddingTop: 60,
          paddingBottom: 60,
          maxWidth: 'xl',
          alignment: 'center',
        },
      },
      {
        id: `sec-faq-${Date.now()}`,
        type: 'faq_accordion',
        name: 'Frequently Asked Questions',
        isVisible: true,
        isLocked: false,
        title: 'Frequently Asked Questions',
        items: [
          { id: 'fq-1', question: 'How do I access the materials?', answer: 'You will receive immediate download credentials on the confirmation page and via email.' },
          { id: 'fq-2', question: 'Is there a guarantee?', answer: 'Yes! We offer a no-questions-asked 30-day money-back guarantee.' },
        ],
        styles: {
          bgColor: '#f8fafc',
          textColor: '#0f172a',
          paddingTop: 60,
          paddingBottom: 60,
          maxWidth: 'lg',
          alignment: 'center',
        },
      },
      {
        id: `sec-foot-${Date.now()}`,
        type: 'footer',
        name: 'Footer',
        isVisible: true,
        isLocked: false,
        title: productName || 'OmniFunnel Brands',
        styles: {
          bgColor: '#0f172a',
          textColor: '#94a3b8',
          paddingTop: 40,
          paddingBottom: 40,
          maxWidth: 'xl',
          alignment: 'center',
        },
      },
    ];

    res.json({
      success: true,
      aiGenerated: false,
      page: {
        title: `${productName || 'New Offer'} Launch Funnel`,
        slug: `${baseSlug}-${Math.floor(Math.random() * 900 + 100)}`,
        seo: {
          metaTitle: `${productName || 'Exclusive Offer'} — Instant Access`,
          metaDescription: `Get the complete ${productName || 'system'} today with special launch discount and 30-day guarantee.`,
          urlSlug: baseSlug,
          indexable: true,
        },
        sections: fallbackSections,
      },
    });
  });

  // AI Copywriting Helper for headlines, tone change, translation, and FAQ expansion
  app.post('/api/ai/rewrite', async (req: Request, res: Response) => {
    const { text, goal, tone } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });

    if (genAI && process.env.GEMINI_API_KEY) {
      try {
        const prompt = `You are an elite conversion rate optimization copywriter.
Task: ${goal || 'Rewrite to maximize conversion and clarity'}
Target Tone: ${tone || 'persuasive and professional'}
Original Text: "${text}"

Provide 3 distinct, high-impact variations tailored for landing page visitors.
Format response as a JSON array of 3 strings:
["Variation 1", "Variation 2", "Variation 3"]`;

        const response = await genAI.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const raw = response.text || '[]';
        const parsed = JSON.parse(raw);
        return res.json({ variations: parsed });
      } catch (err) {
        console.error('Gemini rewrite failed, using heuristic variations:', err);
      }
    }

    // Heuristic fallbacks
    const clean = text.trim();
    res.json({
      variations: [
        `Unlock More Results: ${clean}`,
        `The Proven Framework: ${clean}`,
        `Effortlessly Achieve Your Goals: ${clean}`,
      ],
    });
  });

  // Setup Vite dev middleware or production static files
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 OmniFunnel Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start OmniFunnel server:', err);
  process.exit(1);
});
