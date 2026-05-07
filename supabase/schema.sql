-- DROP existing tables to ensure a clean setup
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS investments;
DROP TABLE IF EXISTS savings_goals;
DROP TABLE IF EXISTS subscriptions;

-- 1. Transactions Table
CREATE TABLE transactions (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category TEXT NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'Completed',
  receipt_urls TEXT[]
);

-- 2. Investments Table
CREATE TABLE investments (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  symbol TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  type TEXT NOT NULL,
  growth DECIMAL DEFAULT 0
);

-- 3. Savings Goals Table
CREATE TABLE savings_goals (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  target DECIMAL NOT NULL,
  current DECIMAL DEFAULT 0,
  color TEXT DEFAULT '#f59e0b'
);

-- 4. Subscriptions Table
CREATE TABLE subscriptions (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  cycle TEXT NOT NULL CHECK (cycle IN ('Monthly', 'Yearly')),
  category TEXT NOT NULL,
  next_billing DATE NOT NULL
);

-- Enable Row Level Security (RLS) - Optional but recommended for production
-- For this demo, you can disable RLS or add policies for authenticated users.
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE savings_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- User-specific access policies
CREATE POLICY "Users can view their own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own transactions" ON transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own transactions" ON transactions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own transactions" ON transactions FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own investments" ON investments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own investments" ON investments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own investments" ON investments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own investments" ON investments FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own goals" ON savings_goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own goals" ON savings_goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own goals" ON savings_goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own goals" ON savings_goals FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own subscriptions" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own subscriptions" ON subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own subscriptions" ON subscriptions FOR DELETE USING (auth.uid() = user_id);

-- 5. Storage Bucket for Receipts
-- IMPORTANT: Run these commands or configure via Supabase Dashboard
-- insert into storage.buckets (id, name, public) values ('receipts', 'receipts', true);
-- create policy "Users can view their own receipts" on storage.objects for select using ( bucket_id = 'receipts' and auth.uid()::text = (storage.foldername(name))[1] );
-- create policy "Users can upload their own receipts" on storage.objects for insert with check ( bucket_id = 'receipts' and auth.uid()::text = (storage.foldername(name))[1] );

-- 6. Storage Bucket for Avatars
-- insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);
-- create policy "Anyone can view avatars" on storage.objects for select using ( bucket_id = 'avatars' );
-- create policy "Users can upload their own avatars" on storage.objects for insert with check ( bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1] );
-- create policy "Users can update their own avatars" on storage.objects for update using ( bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1] );
