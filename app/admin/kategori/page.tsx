'use client';

import { useState } from 'react';
import { Navbar } from '@/components/shared/navbar';
import { mockStore } from '@/lib/store/mock-store';
import { UserRole, WasteCategory } from '@/types/database.types';
import { formatRupiah } from '@/lib/utils/pricing';
import { Leaf, Plus, Edit2, Check, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminKategoriPage() {
  const [role, setRole] = useState<UserRole>('admin');
  const [categories, setCategories] = useState<WasteCategory[]>(mockStore.getCategories());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);

  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState<number>(3000);
  const { wallet } = mockStore.getWallet();

  const handleStartEdit = (cat: WasteCategory) => {
    setEditingId(cat.id);
    setEditPrice(cat.price_per_kg);
  };

  const handleSaveEdit = (id: string) => {
    mockStore.updateCategoryPrice(id, editPrice);
    setCategories([...mockStore.getCategories()]);
    setEditingId(null);
    toast.success('Tarif kategori berhasil diperbarui!');
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      toast.error('Nama kategori tidak boleh kosong');
      return;
    }

    mockStore.addCategory(newName.trim(), newPrice);
    setCategories([...mockStore.getCategories()]);
    setNewName('');
    setNewPrice(3000);
    toast.success('Kategori baru berhasil ditambahkan!');
  };

  return (
    <div className="min-h-screen flex flex-col bg-kraft-50 text-ink-900">
      <Navbar currentRole={role} onRoleChange={setRole} balance={wallet.balance} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-forest-900 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-forest-900" />
            Kelola Kategori & Tarif Sampah (Admin)
          </h1>
          <p className="text-xs text-gray-600 font-sans mt-1">
            Atur harga patokan per kg untuk tiap jenis sampah kemasan daur ulang di platform
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Categories List */}
          <div className="lg:col-span-8 card-kraft p-6 space-y-4">
            <h2 className="text-base font-display font-extrabold text-forest-900">
              Daftar Kategori Aktif
            </h2>

            <div className="space-y-3">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="p-4 bg-kraft-50 rounded-2xl border border-paper-200 flex items-center justify-between gap-4"
                >
                  <div>
                    <span className="font-display font-bold text-sm text-forest-900 block">
                      {cat.name}
                    </span>
                    <span className="text-xs text-gray-500 font-sans">
                      Terakhir di-update: {new Date(cat.updated_at).toLocaleDateString('id-ID')}
                    </span>
                  </div>

                  {editingId === cat.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="100"
                        value={editPrice}
                        onChange={(e) => setEditPrice(parseFloat(e.target.value) || 0)}
                        className="w-28 px-3 py-1.5 bg-kraft-card border border-forest-900 rounded-xl text-xs font-mono font-bold outline-none"
                      />
                      <button
                        onClick={() => handleSaveEdit(cat.id)}
                        className="p-2 bg-forest-900 text-lime-400 rounded-xl hover:bg-forest-700 transition-colors"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-extrabold text-forest-900 text-sm">
                        {formatRupiah(cat.price_per_kg)} / kg
                      </span>
                      <button
                        onClick={() => handleStartEdit(cat)}
                        className="p-2 text-gray-400 hover:text-forest-900 rounded-lg transition-colors"
                        title="Edit Tarif"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Add Category Form */}
          <div className="lg:col-span-4 card-kraft p-6 space-y-4">
            <h2 className="text-base font-display font-extrabold text-forest-900">
              Tambah Kategori Baru
            </h2>

            <form onSubmit={handleAddCategory} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-forest-900 uppercase tracking-wider block">
                  Nama Kategori Sampah
                </label>
                <input
                  type="text"
                  placeholder="Kemasan Aluminium Foil"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-kraft-50 border border-paper-200 rounded-2xl text-xs font-bold text-ink-900 outline-none focus:border-forest-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-forest-900 uppercase tracking-wider block">
                  Tarif Beli per Kg (Rp)
                </label>
                <input
                  type="number"
                  step="500"
                  value={newPrice}
                  onChange={(e) => setNewPrice(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 bg-kraft-50 border border-paper-200 rounded-2xl text-xs font-mono font-bold text-ink-900 outline-none focus:border-forest-900"
                />
              </div>

              <button
                type="submit"
                className="btn-lime w-full py-3 text-xs uppercase tracking-wider shadow flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Simpan Kategori Baru</span>
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
