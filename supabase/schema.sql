-- ========================================================
-- PilahCash - Database Schema (Supabase / PostgreSQL)
-- Competiton: 10th IndonesiaNEXT Hackathon (Telkomsel)
-- ========================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES (Extends auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('coffee_shop', 'pengepul', 'admin')),
  business_name text not null,
  phone text,
  address text,
  latitude double precision,
  longitude double precision,
  created_at timestamptz not null default now()
);

-- 2. WASTE CATEGORIES
create table if not exists waste_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,                 -- Plastik, Kertas, Logam, Organik, Kaca, Residu
  price_per_kg numeric(12,2) not null,
  icon text,
  is_active boolean not null default true,
  updated_at timestamptz not null default now()
);

-- 3. TRANSACTIONS (Setoran)
create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  transaction_code text not null unique,
  coffee_shop_id uuid not null references profiles(id),
  pengepul_id uuid references profiles(id),
  method text not null check (method in ('setor_langsung', 'dijemput')),
  status text not null default 'pending'
    check (status in ('pending', 'matched', 'weighed', 'completed', 'cancelled', 'disputed')),
  estimated_weight_kg numeric(10,2),
  actual_weight_kg numeric(10,2),
  gross_amount numeric(12,2),
  commission_amount numeric(12,2),
  net_amount numeric(12,2),
  scheduled_at timestamptz,
  weighed_at timestamptz,
  confirmed_at timestamptz,
  cancelled_reason text,
  created_at timestamptz not null default now()
);

-- 4. TRANSACTION ITEMS (Breakdown per kategori)
create table if not exists transaction_items (
  id uuid primary key default gen_random_uuid(),
  transaction_id uuid not null references transactions(id) on delete cascade,
  category_id uuid not null references waste_categories(id),
  weight_kg numeric(10,2) not null check (weight_kg > 0),
  subtotal numeric(12,2) not null
);

-- 5. WALLETS
create table if not exists wallets (
  coffee_shop_id uuid primary key references profiles(id),
  balance numeric(12,2) not null default 0,
  updated_at timestamptz not null default now()
);

-- 6. WALLET TRANSACTIONS (Mutasi Saldo)
create table if not exists wallet_transactions (
  id uuid primary key default gen_random_uuid(),
  coffee_shop_id uuid not null references profiles(id),
  transaction_id uuid references transactions(id),
  type text not null check (type in ('credit', 'withdrawal')),
  amount numeric(12,2) not null,
  status text not null default 'success'
    check (status in ('pending', 'success', 'failed')),
  created_at timestamptz not null default now()
);

-- 7. WITHDRAWAL REQUESTS
create table if not exists withdrawal_requests (
  id uuid primary key default gen_random_uuid(),
  coffee_shop_id uuid not null references profiles(id),
  amount numeric(12,2) not null check (amount > 0),
  bank_account text not null,
  bank_name text not null default 'BCA',
  account_holder text not null,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected', 'paid')),
  created_at timestamptz not null default now(),
  processed_at timestamptz
);

-- 8. BADGES & USER BADGES (Gamifikasi)
create table if not exists badges (
  id uuid primary key default gen_random_uuid(),
  name text not null,                 -- "Pahlawan Hijau", "Juara Setor", dsb.
  description text,
  rule_type text not null,            -- 'monthly_weight' | 'monthly_transactions'
  rule_threshold numeric(12,2) not null
);

create table if not exists user_badges (
  id uuid primary key default gen_random_uuid(),
  coffee_shop_id uuid not null references profiles(id),
  badge_id uuid not null references badges(id),
  period text not null,               -- '2026-08'
  earned_at timestamptz not null default now(),
  unique (coffee_shop_id, badge_id, period)
);

-- RLS POLICIES (Row Level Security)
alter table profiles enable row level security;
alter table waste_categories enable row level security;
alter table transactions enable row level security;
alter table transaction_items enable row level security;
alter table wallets enable row level security;
alter table wallet_transactions enable row level security;
alter table withdrawal_requests enable row level security;
alter table badges enable row level security;
alter table user_badges enable row level security;

-- Profiles: user read own, admin read all
create policy "Allow read profiles" on profiles for select using (true);
create policy "Allow update own profile" on profiles for update using (auth.uid() = id);

-- Waste Categories: readable by everyone, manageable by admin
create policy "Allow public read categories" on waste_categories for select using (true);

-- Transactions: Coffee shop sees own, Pengepul sees assigned/pending matched, Admin sees all
create policy "Coffee shop transactions access" on transactions for all using (
  auth.uid() = coffee_shop_id or auth.uid() = pengepul_id or exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  )
);

-- SEED DATA (Default Waste Categories)
insert into waste_categories (name, price_per_kg, icon) values
  ('Plastik (Kaleng UHT, Botol Syrup, Cup)', 4500.00, 'Recycle'),
  ('Kertas / Kardus Supplier', 2500.00, 'Box'),
  ('Logam (Kaleng Susu Kental Manis)', 7500.00, 'Disc'),
  ('Kaca (Botol Sirup Kaca)', 1500.00, 'Glass'),
  ('Organik (Ampas Kopi)', 1000.00, 'Leaf'),
  ('Residu', 500.00, 'Trash2')
on conflict do nothing;

-- SEED DATA (Default Badges)
insert into badges (name, description, rule_type, rule_threshold) values
  ('Pahlawan Hijau', 'Menyetor lebih dari 50kg sampah dalam 1 bulan', 'monthly_weight', 50.00),
  ('Penyetor Setia', 'Melakukan minimal 5x transaksi setoran dalam 1 bulan', 'monthly_transactions', 5.00),
  ('Master Zero-Waste', 'Menyetor lebih dari 200kg sampah dalam 1 bulan', 'monthly_weight', 200.00)
on conflict do nothing;
