import React, { useState, useEffect } from 'react';
import { Product, PaymentGatewayConfig, Order } from '../../types/schema';
import { api } from '../../services/api';
import * as Icons from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId?: string;
  pageId?: string;
  pageTitle?: string;
  onOrderSuccess?: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  productId,
  pageId,
  pageTitle,
  onOrderSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [gateways, setGateways] = useState<PaymentGatewayConfig[]>([]);
  const [selectedGateway, setSelectedGateway] = useState<string>('stripe');

  // Customer Form
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
  });

  // Flow State
  const [step, setStep] = useState<'checkout' | 'processing' | 'success'>('checkout');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setStep('checkout');
      setCompletedOrder(null);
      setErrorMessage('');
      return;
    }

    const initCheckout = async () => {
      setLoading(true);
      try {
        const [prods, gwList] = await Promise.all([api.getProducts(), api.getGateways()]);
        setGateways(gwList.filter((g) => g.isEnabled));

        const target = prods.find((p) => p.id === productId) || prods[0];
        if (target) {
          setProduct(target);
          if (target.variants && target.variants.length > 0) {
            setSelectedVariantId(target.variants[0].id);
          }
        }

        if (gwList.length > 0) {
          const firstEnabled = gwList.find((g) => g.isEnabled) || gwList[0];
          setSelectedGateway(firstEnabled.id);
        }
      } catch (err: any) {
        setErrorMessage('Failed to initialize checkout');
      } finally {
        setLoading(false);
      }
    };

    initCheckout();
  }, [isOpen, productId]);

  if (!isOpen) return null;

  // Price calculations
  const currentVariant = product?.variants?.find((v) => v.id === selectedVariantId);
  const unitPrice = currentVariant ? currentVariant.price : product?.price || 0;
  const subtotal = unitPrice * quantity;
  const total = Math.max(0, subtotal - couponDiscount);

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === 'LAUNCH20' || code === 'SAVE20') {
      const disc = Math.round(subtotal * 0.2);
      setCouponDiscount(disc);
      setAppliedCoupon(code);
      setErrorMessage('');
    } else if (code === 'VIP10') {
      const disc = Math.round(subtotal * 0.1);
      setCouponDiscount(disc);
      setAppliedCoupon(code);
      setErrorMessage('');
    } else {
      setErrorMessage('Invalid discount code. Try "LAUNCH20" for 20% off!');
    }
  };

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerEmail || !customerName) {
      setErrorMessage('Please fill in your name and email address.');
      return;
    }

    setStep('processing');
    setErrorMessage('');

    try {
      // 1. Send to server for real/simulated checkout verification
      const res = await api.processOrder({
        pageId,
        productId: product?.id || 'prod-default',
        variantTitle: currentVariant?.title,
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress: product?.isDigital ? undefined : shippingAddress,
        quantity,
        gateway: selectedGateway,
        couponCode: appliedCoupon,
      });

      if (res.success && res.order) {
        setCompletedOrder(res.order);
        setStep('success');
        if (onOrderSuccess) onOrderSuccess(res.order);
      } else {
        throw new Error('Order verification failed.');
      }
    } catch (err: any) {
      setStep('checkout');
      setErrorMessage(err.message || 'Payment processing failed. Please check payment details.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
              OF
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Secure Checkout</h3>
              <p className="text-xs text-slate-500">256-Bit SSL Encrypted Transaction</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <Icons.X className="w-5 h-5" />
          </button>
        </div>

        {/* Body content */}
        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-500">
              <Icons.Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-3" />
              <p className="text-sm font-medium">Securing checkout session...</p>
            </div>
          ) : step === 'processing' ? (
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Icons.Loader2 className="w-8 h-8 animate-spin" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">
                Processing via {gateways.find((g) => g.id === selectedGateway)?.name || 'Gateway'}...
              </h4>
              <p className="text-slate-500 text-sm max-w-sm">
                Validating transaction signature, authorizing credentials, and preparing your order.
              </p>
            </div>
          ) : step === 'success' && completedOrder ? (
            <div className="py-8 text-center animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <Icons.CheckCircle2 className="w-10 h-10" />
              </div>
              <span className="text-xs font-bold tracking-wider uppercase bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                Payment Verified & Confirmed
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-3 mb-1">
                Order #{completedOrder.orderNumber}
              </h3>
              <p className="text-slate-500 text-sm mb-6">
                A verified receipt and credentials have been dispatched to <strong>{completedOrder.customerEmail}</strong>.
              </p>

              {/* Digital download access card */}
              {completedOrder.downloadUrl && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 mb-6 text-left">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                      <Icons.DownloadCloud className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 text-base mb-1">Instant Digital Access</h4>
                      <p className="text-slate-600 text-xs mb-3">
                        Your commercial license and uncompressed assets are unlocked.
                      </p>
                      <a
                        href={completedOrder.downloadUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-98"
                      >
                        <Icons.Download className="w-4 h-4" />
                        <span>Download Files (ZIP Archive)</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Order breakdown summary */}
              <div className="bg-slate-50 rounded-2xl p-5 text-left border border-slate-200/80 mb-6 text-sm">
                <div className="flex justify-between py-1 text-slate-600">
                  <span>Product</span>
                  <span className="font-semibold text-slate-900">{completedOrder.productTitle}</span>
                </div>
                {completedOrder.variantTitle && (
                  <div className="flex justify-between py-1 text-slate-600">
                    <span>Variant</span>
                    <span>{completedOrder.variantTitle}</span>
                  </div>
                )}
                <div className="flex justify-between py-1 text-slate-600">
                  <span>Amount Paid</span>
                  <span className="font-bold text-slate-900">
                    {completedOrder.currency} ${completedOrder.total.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between py-1 text-slate-600">
                  <span>Payment Gateway</span>
                  <span className="capitalize">{completedOrder.gateway}</span>
                </div>
                <div className="flex justify-between py-1 text-slate-600">
                  <span>Transaction ID</span>
                  <span className="font-mono text-xs">{completedOrder.transactionId}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm"
              >
                Close & Return
              </button>
            </div>
          ) : (
            <form onSubmit={handleProcessPayment} className="space-y-6">
              {errorMessage && (
                <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-200 flex items-center gap-2">
                  <Icons.AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Product summary card */}
              {product && (
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 text-sm truncate">{product.title}</h4>
                    <span className="text-xs text-slate-500 block truncate">{product.description}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-extrabold text-slate-900 text-base">${unitPrice}</span>
                      {product.originalPrice && (
                        <span className="text-xs text-slate-400 line-through">${product.originalPrice}</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Variant selector */}
              {product?.variants && product.variants.length > 0 && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Select Edition / Option
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariantId(v.id)}
                        className={`text-left p-3 rounded-xl border text-xs font-medium transition-all ${
                          selectedVariantId === v.id
                            ? 'border-blue-600 bg-blue-50/50 text-blue-900 ring-1 ring-blue-600'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <div className="font-bold">{v.title}</div>
                        <div className="text-slate-500 mt-0.5">${v.price}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Customer Contact Details */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Icons.User className="w-4 h-4 text-blue-600" />
                  <span>Customer Information</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Your Full Name *"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      required
                      placeholder="Email Address (for instant receipt) *"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Gateway Selector */}
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Icons.CreditCard className="w-4 h-4 text-blue-600" />
                    <span>Payment Gateway</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    Verified Sandbox Ready
                  </span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {gateways.slice(0, 6).map((gw) => (
                    <button
                      key={gw.id}
                      type="button"
                      onClick={() => setSelectedGateway(gw.id)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                        selectedGateway === gw.id
                          ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-600'
                          : 'border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span className="truncate">{gw.name}</span>
                      {selectedGateway === gw.id && <Icons.Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Coupon code input */}
              <div className="pt-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Discount code (e.g. LAUNCH20)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs uppercase font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl"
                  >
                    Apply
                  </button>
                </div>
                {appliedCoupon && (
                  <p className="text-xs text-emerald-600 font-semibold mt-1">
                    ✓ Code {appliedCoupon} applied! Saved ${couponDiscount}.
                  </p>
                )}
              </div>

              {/* Price summary */}
              <div className="border-t border-slate-200 pt-3 space-y-1 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount</span>
                    <span>-${couponDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-black text-slate-900 text-base pt-1">
                  <span>Total Due</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-base rounded-2xl shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Icons.Lock className="w-4 h-4" />
                <span>Complete Purchase (${total.toFixed(2)})</span>
              </button>

              <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Icons.ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  30-Day Guarantee
                </span>
                <span className="flex items-center gap-1">
                  <Icons.Zap className="w-3.5 h-3.5 text-blue-600" />
                  Instant Delivery
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
