import React, { useState, useEffect } from 'react';
import { Product } from '../../types/schema';
import { api } from '../../services/api';
import * as Icons from 'lucide-react';

export const ProductsManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch {
      console.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      if (editingProduct.id.startsWith('new-')) {
        const created = await api.createProduct(editingProduct);
        setProducts([created, ...products]);
      } else {
        const updated = await api.updateProduct(editingProduct.id, editingProduct);
        setProducts(products.map((p) => (p.id === updated.id ? updated : p)));
      }
      setEditingProduct(null);
    } catch {
      alert('Failed to save product');
    }
  };

  const handleAddNew = () => {
    setEditingProduct({
      id: `new-${Date.now()}`,
      title: '',
      type: 'digital',
      description: '',
      price: 49,
      originalPrice: 149,
      currency: 'USD',
      sku: 'SKU-NEW-01',
      image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80',
      stock: -1,
      isDigital: true,
      digitalDownloadUrl: 'https://downloads.omnifunnel.app/files/asset_bundle.zip',
      variants: [],
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Products & Offers</h2>
          <p className="text-slate-500 text-xs mt-0.5">
            Manage your digital deliverables, video packages, physical inventory, and consultation packages.
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 cursor-pointer transition-all"
        >
          <Icons.Plus className="w-4 h-4" />
          <span>New Product Offer</span>
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((prod) => (
          <div
            key={prod.id}
            className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="relative h-44 overflow-hidden bg-slate-100">
                <img
                  src={prod.image}
                  alt={prod.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                  {prod.type}
                </span>
                <span className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-black px-2.5 py-1 rounded-md shadow">
                  ${prod.price}
                </span>
              </div>

              <div className="p-5">
                <h3 className="font-bold text-slate-900 text-base mb-1 line-clamp-1">{prod.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
                  {prod.description}
                </p>

                <div className="bg-slate-50 rounded-xl p-3 text-xs space-y-1 border border-slate-100 font-mono">
                  <div className="flex justify-between text-slate-600">
                    <span>SKU:</span>
                    <span className="font-bold text-slate-900">{prod.sku}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Fulfillment:</span>
                    <span className="text-blue-600 font-semibold">
                      {prod.isDigital ? 'Instant Digital Download' : 'Physical Shipping'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">
                {prod.variants?.length ? `${prod.variants.length} Variants` : 'Single Tier'}
              </span>
              <button
                onClick={() => setEditingProduct(prod)}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl flex items-center gap-1 transition-colors"
              >
                <Icons.Edit className="w-3.5 h-3.5" />
                <span>Edit Offer</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-base">
                {editingProduct.id.startsWith('new-') ? 'Create New Product' : 'Edit Product'}
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <Icons.X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.title}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, title: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Product Type
                  </label>
                  <select
                    value={editingProduct.type}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        type: e.target.value as any,
                        isDigital: e.target.value !== 'physical',
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  >
                    <option value="digital">Digital Assets / Software</option>
                    <option value="ebook">Ebook & Publication</option>
                    <option value="physical">Physical Product</option>
                    <option value="course">Online Course</option>
                    <option value="consultation">Consultation Service</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    value={editingProduct.sku}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, sku: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Sale Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-bold text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Original Price ($ strikethrough)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.originalPrice || ''}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        originalPrice: parseFloat(e.target.value) || undefined,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-bold text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editingProduct.description}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, description: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  value={editingProduct.image}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, image: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              {editingProduct.isDigital && (
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Digital Download File URL (Instant Fulfillment)
                  </label>
                  <input
                    type="text"
                    value={editingProduct.digitalDownloadUrl || ''}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        digitalDownloadUrl: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                    placeholder="https://downloads.omnifunnel.app/files/archive.zip"
                  />
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow cursor-pointer"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
