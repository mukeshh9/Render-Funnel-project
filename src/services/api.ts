import {
  LandingPage,
  Template,
  Product,
  PaymentGatewayConfig,
  BrandSettings,
  PolicyDocument,
  Testimonial,
  FaqItem,
  Order,
  LeadSubmission,
  AnalyticsSummary,
} from '../types/schema';

export const api = {
  // Health
  async getHealth() {
    const res = await fetch('/api/health');
    return res.json();
  },

  // Pages
  async getPages(): Promise<LandingPage[]> {
    const res = await fetch('/api/pages');
    if (!res.ok) throw new Error('Failed to fetch pages');
    return res.json();
  },

  async getPage(idOrSlug: string): Promise<LandingPage> {
    const res = await fetch(`/api/pages/${idOrSlug}`);
    if (!res.ok) throw new Error('Page not found');
    return res.json();
  },

  async createPage(pageData: Partial<LandingPage>): Promise<LandingPage> {
    const res = await fetch('/api/pages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pageData),
    });
    if (!res.ok) throw new Error('Failed to create page');
    return res.json();
  },

  async updatePage(id: string, pageData: Partial<LandingPage>, versionDescription?: string): Promise<LandingPage> {
    const res = await fetch(`/api/pages/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...pageData, versionDescription }),
    });
    if (!res.ok) throw new Error('Failed to update page');
    return res.json();
  },

  async publishPage(id: string): Promise<{ message: string; page: LandingPage }> {
    const res = await fetch(`/api/pages/${id}/publish`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to publish page');
    return res.json();
  },

  async unpublishPage(id: string): Promise<{ message: string; page: LandingPage }> {
    const res = await fetch(`/api/pages/${id}/unpublish`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to unpublish page');
    return res.json();
  },

  async duplicatePage(id: string): Promise<LandingPage> {
    const res = await fetch(`/api/pages/${id}/duplicate`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to duplicate page');
    return res.json();
  },

  async deletePage(id: string): Promise<{ message: string }> {
    const res = await fetch(`/api/pages/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete page');
    return res.json();
  },

  async rollbackPage(id: string, versionId: string): Promise<{ message: string; page: LandingPage }> {
    const res = await fetch(`/api/pages/${id}/rollback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ versionId }),
    });
    if (!res.ok) throw new Error('Failed to rollback page');
    return res.json();
  },

  // Templates
  async getTemplates(): Promise<Template[]> {
    const res = await fetch('/api/templates');
    if (!res.ok) throw new Error('Failed to fetch templates');
    return res.json();
  },

  // Products
  async getProducts(): Promise<Product[]> {
    const res = await fetch('/api/products');
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },

  async createProduct(product: Partial<Product>): Promise<Product> {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error('Failed to create product');
    return res.json();
  },

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error('Failed to update product');
    return res.json();
  },

  // Brand
  async getBrand(): Promise<BrandSettings> {
    const res = await fetch('/api/brand');
    if (!res.ok) throw new Error('Failed to fetch brand settings');
    return res.json();
  },

  async updateBrand(brand: Partial<BrandSettings>): Promise<BrandSettings> {
    const res = await fetch('/api/brand', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(brand),
    });
    if (!res.ok) throw new Error('Failed to update brand settings');
    return res.json();
  },

  // Gateways
  async getGateways(): Promise<PaymentGatewayConfig[]> {
    const res = await fetch('/api/gateways');
    if (!res.ok) throw new Error('Failed to fetch gateways');
    return res.json();
  },

  async updateGateway(id: string, data: Partial<PaymentGatewayConfig>): Promise<PaymentGatewayConfig> {
    const res = await fetch(`/api/gateways/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update gateway');
    return res.json();
  },

  // Policies
  async getPolicies(): Promise<PolicyDocument[]> {
    const res = await fetch('/api/policies');
    if (!res.ok) throw new Error('Failed to fetch policies');
    return res.json();
  },

  async updatePolicy(id: string, data: Partial<PolicyDocument>): Promise<PolicyDocument> {
    const res = await fetch(`/api/policies/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update policy');
    return res.json();
  },

  // Testimonials
  async getTestimonials(): Promise<Testimonial[]> {
    const res = await fetch('/api/testimonials');
    if (!res.ok) throw new Error('Failed to fetch testimonials');
    return res.json();
  },

  async addTestimonial(data: Partial<Testimonial>): Promise<Testimonial> {
    const res = await fetch('/api/testimonials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create testimonial');
    return res.json();
  },

  // FAQs
  async getFaqs(): Promise<FaqItem[]> {
    const res = await fetch('/api/faqs');
    if (!res.ok) throw new Error('Failed to fetch FAQs');
    return res.json();
  },

  async addFaq(data: Partial<FaqItem>): Promise<FaqItem> {
    const res = await fetch('/api/faqs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create FAQ');
    return res.json();
  },

  // Orders & Checkout
  async getOrders(): Promise<Order[]> {
    const res = await fetch('/api/orders');
    if (!res.ok) throw new Error('Failed to fetch orders');
    return res.json();
  },

  async createCheckoutSession(payload: {
    productId: string;
    variantId?: string;
    couponCode?: string;
    quantity?: number;
    pageId?: string;
  }) {
    const res = await fetch('/api/checkout/create-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to create checkout session');
    return res.json();
  },

  async processOrder(payload: {
    pageId?: string;
    productId: string;
    variantTitle?: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    shippingAddress?: any;
    quantity?: number;
    gateway: string;
    couponCode?: string;
  }): Promise<{ success: boolean; message: string; order: Order }> {
    const res = await fetch('/api/checkout/process-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Checkout failed');
    }
    return res.json();
  },

  // Leads
  async getLeads(): Promise<LeadSubmission[]> {
    const res = await fetch('/api/leads');
    if (!res.ok) throw new Error('Failed to fetch leads');
    return res.json();
  },

  async submitLead(payload: {
    pageId?: string;
    formType: 'lead' | 'contact' | 'newsletter' | 'appointment';
    name?: string;
    email: string;
    phone?: string;
    message?: string;
    customData?: Record<string, string>;
  }): Promise<{ success: boolean; message: string; lead: LeadSubmission }> {
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Submission failed');
    return res.json();
  },

  // Analytics
  async getAnalytics(): Promise<AnalyticsSummary> {
    const res = await fetch('/api/analytics');
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return res.json();
  },

  async trackEvent(payload: { type: string; pageSlug: string; details?: string; scrollDepth?: number }) {
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch {
      // ignore tracking errors silently
    }
  },

  // AI
  async generateAiPage(payload: {
    productName: string;
    audience?: string;
    niche?: string;
    tone?: string;
    keyFeatures?: string;
    price?: string;
    offerType?: string;
  }) {
    const res = await fetch('/api/ai/generate-page', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('AI generation failed');
    return res.json();
  },

  async rewriteText(text: string, goal?: string, tone?: string): Promise<{ variations: string[] }> {
    const res = await fetch('/api/ai/rewrite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, goal, tone }),
    });
    if (!res.ok) throw new Error('AI rewrite failed');
    return res.json();
  },
};
