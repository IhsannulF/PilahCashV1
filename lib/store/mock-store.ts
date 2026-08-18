import {
  Profile,
  WasteCategory,
  Transaction,
  Wallet,
  WalletTransaction,
  WithdrawalRequest,
  Badge,
  UserBadge,
  UserRole,
} from '@/types/database.types';
import { calculateTransactionPricing } from '../utils/pricing';
import { generateTransactionCode } from '../utils/transaction-code';

export const INITIAL_CATEGORIES: WasteCategory[] = [
  {
    id: 'cat-1',
    name: 'Plastik (Kaleng UHT, Botol Syrup, Cup)',
    price_per_kg: 4500,
    icon: 'Recycle',
    is_active: true,
    updated_at: new Date().toISOString(),
  },
  {
    id: 'cat-2',
    name: 'Kertas / Kardus Supplier',
    price_per_kg: 2500,
    icon: 'Box',
    is_active: true,
    updated_at: new Date().toISOString(),
  },
  {
    id: 'cat-3',
    name: 'Logam (Kaleng Susu Kental Manis)',
    price_per_kg: 7500,
    icon: 'Disc',
    is_active: true,
    updated_at: new Date().toISOString(),
  },
  {
    id: 'cat-4',
    name: 'Kaca (Botol Sirup Kaca)',
    price_per_kg: 1500,
    icon: 'Glass',
    is_active: true,
    updated_at: new Date().toISOString(),
  },
  {
    id: 'cat-5',
    name: 'Organik (Ampas Kopi)',
    price_per_kg: 1000,
    icon: 'Leaf',
    is_active: true,
    updated_at: new Date().toISOString(),
  },
  {
    id: 'cat-6',
    name: 'Residu',
    price_per_kg: 500,
    icon: 'Trash2',
    is_active: true,
    updated_at: new Date().toISOString(),
  },
];

export const INITIAL_PROFILES: Profile[] = [
  {
    id: 'cs-demo',
    role: 'coffee_shop',
    business_name: 'Kopi Senja Senopati',
    phone: '081298765432',
    address: 'Jl. Senopati No. 45, Kebayoran Baru, Jakarta Selatan',
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: 'pg-demo',
    role: 'pengepul',
    business_name: 'Mitra Daur Ulang Berkah (Pak Joko)',
    phone: '085711223344',
    address: 'Jl. Radio Dalam No. 12, Jakarta Selatan',
    created_at: new Date(Date.now() - 60 * 86400000).toISOString(),
  },
  {
    id: 'adm-demo',
    role: 'admin',
    business_name: 'Admin Operational PilahCash',
    phone: '081100998877',
    address: 'HQ Telkomsel Tower, Jakarta',
    created_at: new Date(Date.now() - 90 * 86400000).toISOString(),
  },
];

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'bg-1',
    name: 'Pahlawan Hijau',
    description: 'Menyetor lebih dari 50kg sampah dalam 1 bulan',
    rule_type: 'monthly_weight',
    rule_threshold: 50,
  },
  {
    id: 'bg-2',
    name: 'Penyetor Setia',
    description: 'Melakukan minimal 5x transaksi setoran dalam 1 bulan',
    rule_type: 'monthly_transactions',
    rule_threshold: 5,
  },
  {
    id: 'bg-3',
    name: 'Master Zero-Waste',
    description: 'Menyetor lebih dari 200kg sampah dalam 1 bulan',
    rule_type: 'monthly_weight',
    rule_threshold: 200,
  },
];

export const INITIAL_USER_BADGES: UserBadge[] = [
  {
    id: 'ub-1',
    coffee_shop_id: 'cs-demo',
    badge_id: 'bg-1',
    period: '2026-08',
    earned_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    badge: INITIAL_BADGES[0],
  },
  {
    id: 'ub-2',
    coffee_shop_id: 'cs-demo',
    badge_id: 'bg-2',
    period: '2026-08',
    earned_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    badge: INITIAL_BADGES[1],
  },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-101',
    transaction_code: 'PLC-20260818-8A3F',
    coffee_shop_id: 'cs-demo',
    pengepul_id: 'pg-demo',
    method: 'dijemput',
    status: 'completed',
    estimated_weight_kg: 12,
    actual_weight_kg: 14.5,
    gross_amount: 72500,
    commission_amount: 10875,
    net_amount: 61625,
    scheduled_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    weighed_at: new Date(Date.now() - 2 * 86400000 + 3600000).toISOString(),
    confirmed_at: new Date(Date.now() - 2 * 86400000 + 7200000).toISOString(),
    cancelled_reason: null,
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    coffee_shop: INITIAL_PROFILES[0],
    pengepul: INITIAL_PROFILES[1],
    items: [
      {
        id: 'txi-1',
        transaction_id: 'tx-101',
        category_id: 'cat-1',
        weight_kg: 8.5,
        subtotal: 38250,
        category: INITIAL_CATEGORIES[0],
      },
      {
        id: 'txi-2',
        transaction_id: 'tx-101',
        category_id: 'cat-3',
        weight_kg: 6.0,
        subtotal: 45000,
        category: INITIAL_CATEGORIES[2],
      },
    ],
  },
  {
    id: 'tx-102',
    transaction_code: 'PLC-20260818-7B2E',
    coffee_shop_id: 'cs-demo',
    pengepul_id: 'pg-demo',
    method: 'setor_langsung',
    status: 'weighed',
    estimated_weight_kg: 5,
    actual_weight_kg: 6.0,
    gross_amount: 27000,
    commission_amount: 0,
    net_amount: 27000,
    scheduled_at: null,
    weighed_at: new Date(Date.now() - 3600000).toISOString(),
    confirmed_at: null,
    cancelled_reason: null,
    created_at: new Date(Date.now() - 7200000).toISOString(),
    coffee_shop: INITIAL_PROFILES[0],
    pengepul: INITIAL_PROFILES[1],
    items: [
      {
        id: 'txi-3',
        transaction_id: 'tx-102',
        category_id: 'cat-1',
        weight_kg: 6.0,
        subtotal: 27000,
        category: INITIAL_CATEGORIES[0],
      },
    ],
  },
  {
    id: 'tx-103',
    transaction_code: 'PLC-20260818-9C4D',
    coffee_shop_id: 'cs-demo',
    pengepul_id: null,
    method: 'dijemput',
    status: 'pending',
    estimated_weight_kg: 8,
    actual_weight_kg: null,
    gross_amount: null,
    commission_amount: null,
    net_amount: null,
    scheduled_at: new Date(Date.now() + 86400000).toISOString(),
    weighed_at: null,
    confirmed_at: null,
    cancelled_reason: null,
    created_at: new Date(Date.now() - 1800000).toISOString(),
    coffee_shop: INITIAL_PROFILES[0],
    items: [],
  },
];

export const INITIAL_WALLET: Wallet = {
  coffee_shop_id: 'cs-demo',
  balance: 146625, // includes baseline balance + previous deposits
  updated_at: new Date().toISOString(),
};

export const INITIAL_WALLET_MUTATIONS: WalletTransaction[] = [
  {
    id: 'wtx-1',
    coffee_shop_id: 'cs-demo',
    transaction_id: 'tx-101',
    type: 'credit',
    amount: 61625,
    status: 'success',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    transaction: INITIAL_TRANSACTIONS[0],
  },
  {
    id: 'wtx-2',
    coffee_shop_id: 'cs-demo',
    transaction_id: null,
    type: 'credit',
    amount: 85000,
    status: 'success',
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
];

export const INITIAL_WITHDRAWALS: WithdrawalRequest[] = [
  {
    id: 'wd-1',
    coffee_shop_id: 'cs-demo',
    amount: 50000,
    bank_name: 'BCA',
    bank_account: '8820192841',
    account_holder: 'PT Kopi Senja Indonesia',
    status: 'paid',
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    processed_at: new Date(Date.now() - 6 * 86400000).toISOString(),
    coffee_shop: INITIAL_PROFILES[0],
  },
];

// In-memory persistent state helper for browser session
class PilahCashStore {
  private currentRole: UserRole = 'coffee_shop';
  private categories: WasteCategory[] = [...INITIAL_CATEGORIES];
  private transactions: Transaction[] = [...INITIAL_TRANSACTIONS];
  private wallet: Wallet = { ...INITIAL_WALLET };
  private walletMutations: WalletTransaction[] = [...INITIAL_WALLET_MUTATIONS];
  private withdrawals: WithdrawalRequest[] = [...INITIAL_WITHDRAWALS];
  private userBadges: UserBadge[] = [...INITIAL_USER_BADGES];

  public getRole(): UserRole {
    return this.currentRole;
  }

  public setRole(role: UserRole) {
    this.currentRole = role;
  }

  public getCategories(): WasteCategory[] {
    return this.categories;
  }

  public updateCategoryPrice(id: string, pricePerKg: number) {
    const cat = this.categories.find((c) => c.id === id);
    if (cat) {
      cat.price_per_kg = pricePerKg;
      cat.updated_at = new Date().toISOString();
    }
  }

  public addCategory(name: string, pricePerKg: number, icon = 'Recycle') {
    const newCat: WasteCategory = {
      id: `cat-${Date.now()}`,
      name,
      price_per_kg: pricePerKg,
      icon,
      is_active: true,
      updated_at: new Date().toISOString(),
    };
    this.categories.push(newCat);
    return newCat;
  }

  public getTransactions(role?: UserRole): Transaction[] {
    if (role === 'coffee_shop') {
      return this.transactions.filter((t) => t.coffee_shop_id === 'cs-demo');
    }
    if (role === 'pengepul') {
      return this.transactions.filter(
        (t) => t.pengepul_id === 'pg-demo' || (t.status === 'pending' && t.method === 'dijemput')
      );
    }
    return this.transactions;
  }

  public getTransactionById(id: string): Transaction | undefined {
    return this.transactions.find((t) => t.id === id || t.transaction_code === id);
  }

  public createSubmission(data: {
    method: 'setor_langsung' | 'dijemput';
    estimatedWeightKg: number;
    scheduledAt?: string;
    categoryIds: string[];
  }): Transaction {
    const code = generateTransactionCode();
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      transaction_code: code,
      coffee_shop_id: 'cs-demo',
      pengepul_id: data.method === 'setor_langsung' ? 'pg-demo' : null,
      method: data.method,
      status: 'pending',
      estimated_weight_kg: data.estimatedWeightKg,
      actual_weight_kg: null,
      gross_amount: null,
      commission_amount: null,
      net_amount: null,
      scheduled_at: data.scheduledAt || null,
      weighed_at: null,
      confirmed_at: null,
      cancelled_reason: null,
      created_at: new Date().toISOString(),
      coffee_shop: INITIAL_PROFILES[0],
      pengepul: data.method === 'setor_langsung' ? INITIAL_PROFILES[1] : undefined,
      items: [],
    };

    this.transactions.unshift(newTx);
    return newTx;
  }

  public assignPengepul(transactionId: string, pengepulId = 'pg-demo'): Transaction {
    const tx = this.getTransactionById(transactionId);
    if (tx) {
      tx.pengepul_id = pengepulId;
      tx.pengepul = INITIAL_PROFILES[1];
      tx.status = 'matched';
    }
    return tx!;
  }

  public submitWeighing(
    transactionId: string,
    items: { categoryId: string; weightKg: number }[]
  ): Transaction {
    const tx = this.getTransactionById(transactionId);
    if (!tx) throw new Error('Transaksi tidak ditemukan');

    const pricingItems = items.map((item) => {
      const cat = this.categories.find((c) => c.id === item.categoryId);
      return {
        weight_kg: item.weightKg,
        price_per_kg: cat ? cat.price_per_kg : 0,
      };
    });

    const { grossAmount, commissionAmount, netAmount } = calculateTransactionPricing(
      pricingItems,
      tx.method
    );

    const actualTotalWeight = items.reduce((sum, i) => sum + i.weightKg, 0);

    tx.items = items.map((item, idx) => {
      const cat = this.categories.find((c) => c.id === item.categoryId);
      const subtotal = item.weightKg * (cat ? cat.price_per_kg : 0);
      return {
        id: `txi-${Date.now()}-${idx}`,
        transaction_id: tx.id,
        category_id: item.categoryId,
        weight_kg: item.weightKg,
        subtotal,
        category: cat,
      };
    });

    tx.actual_weight_kg = actualTotalWeight;
    tx.gross_amount = grossAmount;
    tx.commission_amount = commissionAmount;
    tx.net_amount = netAmount;
    tx.status = 'weighed';
    tx.weighed_at = new Date().toISOString();

    return tx;
  }

  public confirmTransaction(transactionId: string): Transaction {
    const tx = this.getTransactionById(transactionId);
    if (!tx) throw new Error('Transaksi tidak ditemukan');
    if (tx.status !== 'weighed') throw new Error('Transaksi belum ditimbang');

    tx.status = 'completed';
    tx.confirmed_at = new Date().toISOString();

    // Atomic credit balance addition
    const creditAmount = tx.net_amount || 0;
    this.wallet.balance += creditAmount;
    this.wallet.updated_at = new Date().toISOString();

    const mutation: WalletTransaction = {
      id: `wtx-${Date.now()}`,
      coffee_shop_id: tx.coffee_shop_id,
      transaction_id: tx.id,
      type: 'credit',
      amount: creditAmount,
      status: 'success',
      created_at: new Date().toISOString(),
      transaction: tx,
    };
    this.walletMutations.unshift(mutation);

    return tx;
  }

  public requestWithdrawal(data: {
    amount: number;
    bankName: string;
    bankAccount: string;
    accountHolder: string;
  }): WithdrawalRequest {
    if (data.amount > this.wallet.balance) {
      throw new Error(`Saldo tidak mencukupi. Saldo Anda: Rp ${this.wallet.balance.toLocaleString('id-ID')}`);
    }

    this.wallet.balance -= data.amount;
    this.wallet.updated_at = new Date().toISOString();

    const newReq: WithdrawalRequest = {
      id: `wd-${Date.now()}`,
      coffee_shop_id: 'cs-demo',
      amount: data.amount,
      bank_name: data.bankName,
      bank_account: data.bankAccount,
      account_holder: data.accountHolder,
      status: 'pending',
      created_at: new Date().toISOString(),
      processed_at: null,
      coffee_shop: INITIAL_PROFILES[0],
    };

    this.withdrawals.unshift(newReq);

    this.walletMutations.unshift({
      id: `wtx-${Date.now()}`,
      coffee_shop_id: 'cs-demo',
      transaction_id: null,
      type: 'withdrawal',
      amount: data.amount,
      status: 'success',
      created_at: new Date().toISOString(),
    });

    return newReq;
  }

  public getWallet(): { wallet: Wallet; mutations: WalletTransaction[] } {
    return {
      wallet: this.wallet,
      mutations: this.walletMutations,
    };
  }

  public getWithdrawals(): WithdrawalRequest[] {
    return this.withdrawals;
  }

  public getUserBadges(): UserBadge[] {
    return this.userBadges;
  }

  public updateWithdrawalStatus(id: string, status: 'approved' | 'rejected' | 'paid') {
    const req = this.withdrawals.find((w) => w.id === id);
    if (req) {
      req.status = status;
      req.processed_at = new Date().toISOString();
    }
  }
}

export const mockStore = new PilahCashStore();
