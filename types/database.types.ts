export type UserRole = 'coffee_shop' | 'pengepul' | 'admin';

export type DepositMethod = 'setor_langsung' | 'dijemput';

export type TransactionStatus =
  | 'pending'
  | 'matched'
  | 'weighed'
  | 'completed'
  | 'cancelled'
  | 'disputed';

export type WithdrawalStatus = 'pending' | 'approved' | 'rejected' | 'paid';

export interface Profile {
  id: string;
  role: UserRole;
  business_name: string;
  phone: string | null;
  address: string | null;
  latitude?: number | null;
  longitude?: number | null;
  created_at: string;
}

export interface WasteCategory {
  id: string;
  name: string;
  price_per_kg: number;
  icon?: string | null;
  is_active: boolean;
  updated_at: string;
}

export interface TransactionItem {
  id: string;
  transaction_id: string;
  category_id: string;
  weight_kg: number;
  subtotal: number;
  category?: WasteCategory;
}

export interface Transaction {
  id: string;
  transaction_code: string;
  coffee_shop_id: string;
  pengepul_id: string | null;
  method: DepositMethod;
  status: TransactionStatus;
  estimated_weight_kg: number | null;
  actual_weight_kg: number | null;
  gross_amount: number | null;
  commission_amount: number | null;
  net_amount: number | null;
  scheduled_at: string | null;
  weighed_at: string | null;
  confirmed_at: string | null;
  cancelled_reason: string | null;
  created_at: string;
  coffee_shop?: Profile;
  pengepul?: Profile;
  items?: TransactionItem[];
}

export interface Wallet {
  coffee_shop_id: string;
  balance: number;
  updated_at: string;
}

export interface WalletTransaction {
  id: string;
  coffee_shop_id: string;
  transaction_id: string | null;
  type: 'credit' | 'withdrawal';
  amount: number;
  status: 'pending' | 'success' | 'failed';
  created_at: string;
  transaction?: Transaction;
}

export interface WithdrawalRequest {
  id: string;
  coffee_shop_id: string;
  amount: number;
  bank_account: string;
  bank_name: string;
  account_holder: string;
  status: WithdrawalStatus;
  created_at: string;
  processed_at: string | null;
  coffee_shop?: Profile;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  rule_type: 'monthly_weight' | 'monthly_transactions';
  rule_threshold: number;
}

export interface UserBadge {
  id: string;
  coffee_shop_id: string;
  badge_id: string;
  period: string;
  earned_at: string;
  badge?: Badge;
}
