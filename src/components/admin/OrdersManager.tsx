import React, { useState, useEffect } from 'react';
import { Order } from '../../types/schema';
import { api } from '../../services/api';
import * as Icons from 'lucide-react';

export const OrdersManager: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await api.getOrders();
      setOrders(data);
    } catch {
      console.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Verified Orders</h2>
          <p className="text-slate-500 text-xs mt-0.5">
            Real customer transactions, automated digital fulfillments, and gateway settlement records.
          </p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-100 text-slate-500 text-xs uppercase font-bold tracking-wider">
                <th className="py-3 px-6">Order ID & Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Product Offer</th>
                <th className="py-3 px-4">Gateway</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Fulfillment</th>
                <th className="py-3 px-6 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-bold text-slate-900 font-mono text-xs">{ord.orderNumber}</div>
                    <div className="text-[11px] text-slate-400">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-semibold text-slate-800 text-xs">{ord.customerName}</div>
                    <div className="text-[11px] text-slate-500">{ord.customerEmail}</div>
                  </td>
                  <td className="py-4 px-4 text-xs">
                    <div className="font-medium text-slate-800 line-clamp-1">{ord.productTitle}</div>
                    {ord.variantTitle && (
                      <span className="text-[10px] text-slate-400">{ord.variantTitle}</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-block px-2 py-0.5 bg-slate-100 rounded text-[11px] font-mono font-bold uppercase text-slate-700">
                      {ord.gateway}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-extrabold text-slate-900 text-sm">
                    {ord.currency} ${ord.total}
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <Icons.CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Paid
                    </span>
                  </td>
                  <td className="py-4 px-4 text-xs">
                    {ord.downloadUrl ? (
                      <a
                        href={ord.downloadUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 font-bold hover:underline"
                      >
                        <Icons.Download className="w-3 h-3" />
                        <span>Delivered</span>
                      </a>
                    ) : (
                      <span className="text-slate-500">Unfulfilled</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => setSelectedOrder(ord)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-colors"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Order #{selectedOrder.orderNumber}</h3>
                <span className="text-xs text-slate-500 font-mono">Txn: {selectedOrder.transactionId}</span>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-slate-700">
                <Icons.X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Customer</span>
                <span className="font-bold text-slate-900">{selectedOrder.customerName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Email</span>
                <span className="font-mono text-slate-900">{selectedOrder.customerEmail}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Product Item</span>
                <span className="font-medium text-slate-900">{selectedOrder.productTitle}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Gateway Processor</span>
                <span className="uppercase font-bold text-slate-900">{selectedOrder.gateway}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Total Amount Paid</span>
                <span className="font-extrabold text-slate-900 text-sm">
                  {selectedOrder.currency} ${selectedOrder.total}
                </span>
              </div>
              {selectedOrder.downloadUrl && (
                <div className="pt-2">
                  <div className="font-bold text-slate-800 mb-1">Delivered Digital Asset:</div>
                  <a
                    href={selectedOrder.downloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-blue-700 hover:bg-blue-100 transition-colors"
                  >
                    <span className="font-mono truncate">{selectedOrder.downloadUrl}</span>
                    <Icons.ExternalLink className="w-4 h-4 shrink-0 ml-2" />
                  </a>
                </div>
              )}
            </div>

            <div className="pt-3 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
