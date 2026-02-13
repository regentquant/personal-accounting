export type Account = {
  id: string;
  name: string;
  icon: string;
  color: string;
  balance: number;
  exclude_from_equity: boolean;
  created_at: string;
  updated_at: string;
};

export type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: "income" | "expense";
  is_default: boolean;
  user_id: string | null;
  created_at: string;
};

export type Transaction = {
  id: string;
  account_id: string;
  category_id: string;
  amount: number;
  type: "income" | "expense";
  date: string;
  note: string | null;
  created_at: string;
  updated_at: string;
  timezone_id?: string;
  local_date: string;
  local_time?: string | null;
  currency: string;
};

export type Profile = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  currency: string;
  language: string;
  timezone?: string;
  created_at: string;
  updated_at: string;
};

export type CurrencyRate = {
  id: string;
  from_currency: string;
  to_currency: string;
  rate: number;
  date: string;
  created_at: string;
};

export type Subscription = {
  id: string;
  service_name: string;
  cost: number;
  currency: string;
  billing_cycle: "monthly" | "annual";
  next_payment_date: string;
  icon: string;
  color: string;
  note: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

// Types for creating new records (id and timestamps auto-generated)
export type NewAccount = {
  name: string;
  icon?: string;
  color?: string;
  balance?: number;
  exclude_from_equity?: boolean;
};

export type NewTransaction = {
  account_id: string;
  category_id: string;
  amount: number;
  type: "income" | "expense";
  date?: string;
  note?: string | null;
  local_date: string;
  currency: string;
};

export type NewSubscription = {
  service_name: string;
  cost: number;
  currency?: string;
  billing_cycle: "monthly" | "annual";
  next_payment_date: string;
  icon?: string;
  color?: string;
  note?: string | null;
  is_active?: boolean;
};
