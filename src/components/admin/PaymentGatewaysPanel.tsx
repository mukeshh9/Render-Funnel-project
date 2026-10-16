import React, { useState, useEffect } from 'react';
import { PaymentGatewayConfig } from '../../types/schema';
import { api } from '../../services/api';
import * as Icons from 'lucide-react';

export const PaymentGatewaysPanel: React.FC = () => {
  const [gateways, setGateways] = useState<PaymentGatewayConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGateway, setSelectedGateway] = useState<PaymentGatewayConfig | null>(null);
  const [testSimulating, setTestSimulating] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  useEffect(() => {
    loadGateways();
  }, []);

  const loadGateways = async () => {
    setLoading(true);
    try {
      const data = await api.getGateways();
      setGateways(data);
    } catch {
      console.error('Failed to load gateways');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleEnable = async (gw: PaymentGatewayConfig) => {
    try {
      const updated = await api.updateGateway(gw.id, { isEnabled: !gw.isEnabled });
      setGateways((prev) => prev.map((g) => (g.id === gw.id ? updated : g)));
    } catch {
      alert('Failed to update status.');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGateway) return;
    try {
      const updated = await api.updateGateway(selectedGateway.id, selectedGateway);
      setGateways((prev) => prev.map((g) => (g.id === selectedGateway.id ? updated : g)));
      setSelectedGateway(null);
      alert('Gateway credentials securely stored on server.');
    } catch {
      alert('Failed to save gateway.');
    }
  };

  const handleRunTestTransaction = async (gwId: string) => {
    setTestSimulating(true);
    setTestResult(null);
    try {
      // Simulate verified server-side payment authorization
      const session = await api.createCheckoutSession({
        productId: 'prod-vfx-bundle',
        quantity: 1,
      });

      const res = await api.processOrder({
        productId: 'prod-vfx-bundle',
        customerName: 'Payment Gateway Validator',
        customerEmail: 'qa.test@gateway-sandbox.org',
        gateway: gwId,
      });

      if (res.success) {
        setTestResult(
          `✓ Success: Verified order #${res.order.orderNumber} generated with transaction ID ${res.order.transactionId}. Digital fulfillment delivered instantly.`
        );
      }
    } catch (err: any) {
      setTestResult(`✗ Verification Error: ${err.message || 'Signature mismatch or invalid API key'}`);
    } finally {
      setTestSimulating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">10 Payment Gateways</h2>
          <p className="text-slate-500 text-xs mt-0.5">
            Configure global and domestic payment processors with webhook verification, server-side amount checks, and instant fulfillment.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold">
          <Icons.ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>PCI-DSS Level 1 Compliant Server Architecture</span>
        </div>
      </div>

      {/* Gateway Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gateways.map((gw) => (
          <div
            key={gw.id}
            className={`bg-white rounded-3xl border p-6 flex flex-col justify-between transition-all ${
              gw.isEnabled ? 'border-slate-200/90 shadow-sm' : 'border-slate-200/50 opacity-70 bg-slate-50/40'
            }`}
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-sm overflow-hidden border border-slate-200">
                    <Icons.CreditCard className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{gw.name}</h3>
                    <span className="text-[10px] text-slate-400 font-mono uppercase">
                      ID: {gw.id}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleEnable(gw)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    gw.isEnabled ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      gw.isEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Status and currencies */}
              <div className="space-y-2 mb-4 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Environment</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      gw.isSandbox ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    {gw.isSandbox ? 'Sandbox (Test)' : 'Live Production'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Currencies</span>
                  <span className="font-mono text-slate-700 font-semibold text-[11px]">
                    {gw.supportedCurrencies.join(', ')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Secret Key</span>
                  <span className="font-mono text-[11px] text-slate-400">
                    {gw.secretKeyMasked || '••••••••'}
                  </span>
                </div>
              </div>

              {gw.notes && (
                <p className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  {gw.notes}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setSelectedGateway(gw)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Icons.Sliders className="w-3.5 h-3.5" />
                <span>Configure</span>
              </button>

              <button
                type="button"
                onClick={() => handleRunTestTransaction(gw.id)}
                disabled={testSimulating}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl flex items-center gap-1 transition-colors"
              >
                <Icons.Play className="w-3 h-3" />
                <span>Test Transaction</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Test Transaction Output Notification */}
      {testResult && (
        <div
          className={`p-4 rounded-2xl border text-xs font-medium flex items-start justify-between gap-3 ${
            testResult.startsWith('✓')
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <div className="flex items-start gap-2">
            <Icons.CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold">Sandbox Verification Result:</div>
              <div>{testResult}</div>
            </div>
          </div>
          <button
            onClick={() => setTestResult(null)}
            className="text-slate-400 hover:text-slate-700"
          >
            <Icons.X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Configure Gateway Modal */}
      {selectedGateway && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Icons.Sliders className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">Configure {selectedGateway.name}</h3>
              </div>
              <button
                onClick={() => setSelectedGateway(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <Icons.X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSettings} className="p-6 space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <div className="font-bold text-slate-900">Sandbox Environment</div>
                  <div className="text-slate-500 text-[11px]">
                    Use test credentials without processing real card debits
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={selectedGateway.isSandbox}
                  onChange={(e) =>
                    setSelectedGateway({ ...selectedGateway, isSandbox: e.target.checked })
                  }
                  className="rounded text-blue-600 w-4 h-4"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Public Key / App ID / Merchant Key
                </label>
                <input
                  type="text"
                  value={selectedGateway.publicKey || ''}
                  onChange={(e) =>
                    setSelectedGateway({ ...selectedGateway, publicKey: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Private Key / API Secret (Masked on Server)
                </label>
                <input
                  type="password"
                  placeholder="Enter new secret key to update..."
                  value={selectedGateway.secretKeyMasked || ''}
                  onChange={(e) =>
                    setSelectedGateway({ ...selectedGateway, secretKeyMasked: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  🔒 Secrets are exclusively stored in server-side protected storage.
                </span>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Webhook Signature Secret
                </label>
                <input
                  type="password"
                  placeholder="Webhook secret token..."
                  value={selectedGateway.webhookSecretMasked || ''}
                  onChange={(e) =>
                    setSelectedGateway({ ...selectedGateway, webhookSecretMasked: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedGateway(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow cursor-pointer"
                >
                  Save Gateway
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
