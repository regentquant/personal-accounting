"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { readData, writeData, readProfile } from "@/lib/storage";
import type {
  Account,
  Category,
  Transaction,
  NewTransaction,
  NewAccount,
  Subscription,
  NewSubscription,
  Profile,
} from "@/types/database";
import { getMonthYearFromLocalDate, getDeviceTimezone, getLocalDateInTimezone } from "@/lib/timezone";
import { useI18n } from "@/context/I18nContext";

type TransactionType = "income" | "expense";
type EquityViewMode = "all-time" | "monthly";

interface FikaContextType {
  // Profile
  profile: Profile | null;
  loading: boolean;

  // Accounts
  accounts: Account[];
  activeAccountId: string | null;
  setActiveAccountId: (id: string | null) => void;
  addAccount: (account: NewAccount) => Promise<void>;
  updateAccount: (id: string, updates: Partial<NewAccount>) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;
  resetAccounts: () => Promise<void>;
  refreshAccounts: () => Promise<void>;

  // Account Modal
  isAccountModalOpen: boolean;
  setIsAccountModalOpen: (open: boolean) => void;
  editingAccount: Account | null;
  setEditingAccount: (account: Account | null) => void;

  // Settings Modal
  isSettingsModalOpen: boolean;
  setIsSettingsModalOpen: (open: boolean) => void;

  // Help Modal
  isHelpModalOpen: boolean;
  setIsHelpModalOpen: (open: boolean) => void;

  // Categories
  categories: Category[];

  // Transactions
  transactions: Transaction[];
  addTransaction: (
    transaction: NewTransaction
  ) => Promise<void>;
  addTransactionsBatch: (
    transactions: NewTransaction[]
  ) => Promise<{ successCount: number; errorCount: number }>;
  updateTransaction: (
    id: string,
    updates: Partial<NewTransaction>
  ) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  deleteTransactionsBatch: (ids: string[]) => Promise<void>;
  refreshTransactions: () => Promise<void>;

  // Modal state
  isTransactionModalOpen: boolean;
  setIsTransactionModalOpen: (open: boolean) => void;
  editingTransaction: Transaction | null;
  setEditingTransaction: (transaction: Transaction | null) => void;

  // Computed values
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  filteredTransactions: Transaction[];

  // Personal Equity (True Net Worth)
  personalEquity: number;
  totalAssets: number;
  personalAccounts: Account[];
  excludedAccounts: Account[];
  hasExcludedAccounts: boolean;
  equityMonthlyIncome: number;
  equityMonthlyExpenses: number;
  equityMonthlyNet: number;
  equityViewMode: EquityViewMode;
  setEquityViewMode: (mode: EquityViewMode) => void;
  displayedPersonalEquity: number;
  isExcludedAccount: (accountId: string) => boolean;
  getAccountBalance: (accountId: string) => number;

  // Filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  typeFilter: TransactionType | "all";
  setTypeFilter: (type: TransactionType | "all") => void;

  // Subscriptions
  subscriptions: Subscription[];
  addSubscription: (subscription: NewSubscription) => Promise<void>;
  updateSubscription: (id: string, updates: Partial<NewSubscription>) => Promise<void>;
  deleteSubscription: (id: string) => Promise<void>;
  refreshSubscriptions: () => Promise<void>;

  // Subscription Modal state
  isSubscriptionModalOpen: boolean;
  setIsSubscriptionModalOpen: (open: boolean) => void;
  editingSubscription: Subscription | null;
  setEditingSubscription: (subscription: Subscription | null) => void;

  // Subscription computed values
  activeSubscriptions: Subscription[];
  totalAnnualSubscriptionCost: number;
  totalMonthlySubscriptionCost: number;
  upcomingSubscription: Subscription | null;
}

const FikaContext = createContext<FikaContextType | undefined>(undefined);

export function FikaProvider({ children }: { children: React.ReactNode }) {
  const { convertAmount } = useI18n();

  // Profile state
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Data state
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeAccountId, setActiveAccountId] = useState<string | null>(null);

  // UI state
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<TransactionType | "all">("all");
  const [equityViewMode, setEquityViewMode] = useState<EquityViewMode>("all-time");

  // Subscriptions state
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);

  // Initialize: call /api/init then fetch data
  useEffect(() => {
    const init = async () => {
      try {
        await fetch("/api/init", { method: "POST" });
        await fetchData();
      } catch (error) {
        console.error("Initialization error:", error);
      } finally {
        setLoading(false);
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    await Promise.all([fetchAccounts(), fetchCategories(), fetchTransactions(), fetchSubscriptions(), fetchProfile()]);
  };

  // Fetch profile
  const fetchProfile = useCallback(async () => {
    try {
      const data = await readProfile();
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  }, []);

  // Fetch accounts
  const fetchAccounts = useCallback(async () => {
    try {
      const data = await readData<Account>("accounts");
      // Sort by created_at ascending
      data.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      setAccounts(data);
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  }, []);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const data = await readData<Category>("categories");
      data.sort((a, b) => a.name.localeCompare(b.name));
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, []);

  // Fetch transactions
  const fetchTransactions = useCallback(async () => {
    try {
      const data = await readData<Transaction>("transactions");
      // Sort by date desc, then created_at desc
      data.sort((a, b) => {
        const dateCompare = b.date.localeCompare(a.date);
        if (dateCompare !== 0) return dateCompare;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }, []);

  // Fetch subscriptions
  const fetchSubscriptions = useCallback(async () => {
    try {
      const data = await readData<Subscription>("subscriptions");
      data.sort((a, b) => a.next_payment_date.localeCompare(b.next_payment_date));
      setSubscriptions(data);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
    }
  }, []);

  // Recalculate account balances from transactions
  const recalculateBalances = useCallback(async () => {
    const txns = await readData<Transaction>("transactions");
    const accts = await readData<Account>("accounts");
    const updated = accts.map((a) => ({
      ...a,
      balance: txns
        .filter((t) => t.account_id === a.id)
        .reduce((sum, t) => sum + (t.type === "income" ? Number(t.amount) : -Number(t.amount)), 0),
    }));
    await writeData("accounts", updated);
    setAccounts(updated);
  }, []);

  // Add account
  const addAccount = useCallback(
    async (account: NewAccount) => {
      const now = new Date().toISOString();
      const newAccount: Account = {
        ...account,
        id: crypto.randomUUID(),
        balance: account.balance ?? 0,
        icon: account.icon ?? "CreditCard",
        color: account.color ?? "#888888",
        exclude_from_equity: account.exclude_from_equity ?? false,
        created_at: now,
        updated_at: now,
      };

      const current = await readData<Account>("accounts");
      current.push(newAccount);
      await writeData("accounts", current);
      await fetchAccounts();
    },
    [fetchAccounts]
  );

  // Update account
  const updateAccount = useCallback(
    async (id: string, updates: Partial<NewAccount>) => {
      const current = await readData<Account>("accounts");
      const updated = current.map((a) =>
        a.id === id ? { ...a, ...updates, updated_at: new Date().toISOString() } : a
      );
      await writeData("accounts", updated);
      await fetchAccounts();
    },
    [fetchAccounts]
  );

  // Delete account
  const deleteAccount = useCallback(
    async (id: string) => {
      // Check if account has transactions
      const txns = await readData<Transaction>("transactions");
      const hasTransactions = txns.some((t) => t.account_id === id);

      if (hasTransactions) {
        throw new Error("Cannot delete account with existing transactions");
      }

      const current = await readData<Account>("accounts");
      const filtered = current.filter((a) => a.id !== id);
      await writeData("accounts", filtered);

      if (activeAccountId === id) {
        setActiveAccountId(null);
      }
      await fetchAccounts();
    },
    [activeAccountId, fetchAccounts]
  );

  // Reset accounts (delete all and restore defaults)
  const resetAccounts = useCallback(async () => {
    const now = new Date().toISOString();
    const defaultAccounts: Account[] = [
      { id: crypto.randomUUID(), name: "WeChat", icon: "MessageCircle", color: "#07C160", balance: 0, exclude_from_equity: false, created_at: now, updated_at: now },
      { id: crypto.randomUUID(), name: "Alipay", icon: "Wallet", color: "#1677FF", balance: 0, exclude_from_equity: false, created_at: now, updated_at: now },
      { id: crypto.randomUUID(), name: "PayPal", icon: "CreditCard", color: "#003087", balance: 0, exclude_from_equity: false, created_at: now, updated_at: now },
      { id: crypto.randomUUID(), name: "Venmo", icon: "Smartphone", color: "#3D95CE", balance: 0, exclude_from_equity: false, created_at: now, updated_at: now },
      { id: crypto.randomUUID(), name: "Apple Pay", icon: "Smartphone", color: "#000000", balance: 0, exclude_from_equity: false, created_at: now, updated_at: now },
      { id: crypto.randomUUID(), name: "Google Pay", icon: "Smartphone", color: "#4285F4", balance: 0, exclude_from_equity: false, created_at: now, updated_at: now },
      { id: crypto.randomUUID(), name: "Bank Card", icon: "CreditCard", color: "#E6A756", balance: 0, exclude_from_equity: false, created_at: now, updated_at: now },
      { id: crypto.randomUUID(), name: "Cash", icon: "Banknote", color: "#8BA888", balance: 0, exclude_from_equity: false, created_at: now, updated_at: now },
    ];

    await writeData("accounts", defaultAccounts);
    setActiveAccountId(null);
    await fetchAccounts();
  }, [fetchAccounts]);

  // Add transaction
  const addTransaction = useCallback(
    async (transaction: NewTransaction) => {
      const now = new Date().toISOString();
      const newTransaction: Transaction = {
        account_id: transaction.account_id,
        category_id: transaction.category_id,
        amount: transaction.amount,
        type: transaction.type,
        timezone_id: transaction.timezone_id,
        local_date: transaction.local_date,
        currency: transaction.currency,
        id: crypto.randomUUID(),
        date: transaction.date ?? now,
        note: transaction.note ?? null,
        local_time: transaction.local_time ?? null,
        created_at: now,
        updated_at: now,
      };

      const current = await readData<Transaction>("transactions");
      current.push(newTransaction);
      await writeData("transactions", current);
      await recalculateBalances();
      await fetchTransactions();
    },
    [recalculateBalances, fetchTransactions]
  );

  const addTransactionsBatch = useCallback(
    async (batch: NewTransaction[]) => {
      if (batch.length === 0) return { successCount: 0, errorCount: 0 };

      const now = new Date().toISOString();
      const current = await readData<Transaction>("transactions");

      const newTransactions: Transaction[] = batch.map((t) => ({
        account_id: t.account_id,
        category_id: t.category_id,
        amount: t.amount,
        type: t.type,
        timezone_id: t.timezone_id,
        local_date: t.local_date,
        currency: t.currency,
        id: crypto.randomUUID(),
        date: t.date ?? now,
        note: t.note ?? null,
        local_time: t.local_time ?? null,
        created_at: now,
        updated_at: now,
      }));

      current.push(...newTransactions);
      await writeData("transactions", current);
      await recalculateBalances();
      await fetchTransactions();

      return { successCount: batch.length, errorCount: 0 };
    },
    [recalculateBalances, fetchTransactions]
  );

  // Update transaction
  const updateTransaction = useCallback(
    async (id: string, updates: Partial<NewTransaction>) => {
      const current = await readData<Transaction>("transactions");
      const updated = current.map((t) =>
        t.id === id ? { ...t, ...updates, updated_at: new Date().toISOString() } : t
      );
      await writeData("transactions", updated);

      // Optimistic state update
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
      );

      await recalculateBalances();
      await fetchTransactions();
    },
    [recalculateBalances, fetchTransactions]
  );

  // Delete transaction
  const deleteTransaction = useCallback(
    async (id: string) => {
      const current = await readData<Transaction>("transactions");
      const filtered = current.filter((t) => t.id !== id);
      await writeData("transactions", filtered);

      setTransactions((prev) => prev.filter((t) => t.id !== id));
      await recalculateBalances();
      await fetchTransactions();
    },
    [recalculateBalances, fetchTransactions]
  );

  // Batch delete transactions
  const deleteTransactionsBatch = useCallback(
    async (ids: string[]) => {
      if (ids.length === 0) return;

      const current = await readData<Transaction>("transactions");
      const idSet = new Set(ids);
      const filtered = current.filter((t) => !idSet.has(t.id));
      await writeData("transactions", filtered);

      setTransactions((prev) => prev.filter((t) => !idSet.has(t.id)));
      await recalculateBalances();
      await fetchTransactions();
    },
    [recalculateBalances, fetchTransactions]
  );

  // Add subscription
  const addSubscription = useCallback(
    async (subscription: NewSubscription) => {
      const now = new Date().toISOString();
      const newSubscription: Subscription = {
        service_name: subscription.service_name,
        cost: subscription.cost,
        billing_cycle: subscription.billing_cycle,
        next_payment_date: subscription.next_payment_date,
        id: crypto.randomUUID(),
        currency: subscription.currency ?? "CNY",
        icon: subscription.icon ?? "CreditCard",
        color: subscription.color ?? "#888888",
        note: subscription.note ?? null,
        is_active: subscription.is_active ?? true,
        created_at: now,
        updated_at: now,
      };

      const current = await readData<Subscription>("subscriptions");
      current.push(newSubscription);
      await writeData("subscriptions", current);
      await fetchSubscriptions();
    },
    [fetchSubscriptions]
  );

  // Update subscription
  const updateSubscription = useCallback(
    async (id: string, updates: Partial<NewSubscription>) => {
      const current = await readData<Subscription>("subscriptions");
      const updated = current.map((s) =>
        s.id === id ? { ...s, ...updates, updated_at: new Date().toISOString() } : s
      );
      await writeData("subscriptions", updated);
      await fetchSubscriptions();
    },
    [fetchSubscriptions]
  );

  // Delete subscription
  const deleteSubscription = useCallback(
    async (id: string) => {
      const current = await readData<Subscription>("subscriptions");
      const filtered = current.filter((s) => s.id !== id);
      await writeData("subscriptions", filtered);
      setSubscriptions((prev) => prev.filter((s) => s.id !== id));
    },
    []
  );

  // Personal Equity computed values
  const personalAccounts = useMemo(() => {
    return accounts.filter((a) => !a.exclude_from_equity);
  }, [accounts]);

  const excludedAccounts = useMemo(() => {
    return accounts.filter((a) => a.exclude_from_equity);
  }, [accounts]);

  const hasExcludedAccounts = excludedAccounts.length > 0;

  // Get account balance converted to preferred currency
  const getAccountBalance = useCallback((accountId: string): number => {
    return transactions
      .filter((t) => t.account_id === accountId)
      .reduce((sum, t) => {
        const amount = Number(t.amount);
        const convertedAmount = convertAmount(amount, t.currency || "CNY", t.local_date || t.date);
        return sum + (t.type === "income" ? convertedAmount : -convertedAmount);
      }, 0);
  }, [transactions, convertAmount]);

  // Computed values - totalBalance uses converted balances
  const totalBalance = useMemo(() => {
    if (activeAccountId) {
      return getAccountBalance(activeAccountId);
    }
    return accounts.reduce((sum, account) => sum + getAccountBalance(account.id), 0);
  }, [accounts, activeAccountId, getAccountBalance]);

  // Calculate Personal Equity from transactions (converted to preferred currency)
  const personalEquity = useMemo(() => {
    const personalAccountIds = new Set(personalAccounts.map((a) => a.id));

    let relevantTransactions = transactions;
    if (activeAccountId) {
      const account = accounts.find((a) => a.id === activeAccountId);
      if (account?.exclude_from_equity) return 0;
      relevantTransactions = transactions.filter((t) => t.account_id === activeAccountId);
    } else {
      relevantTransactions = transactions.filter((t) => personalAccountIds.has(t.account_id));
    }

    return relevantTransactions.reduce((sum, t) => {
      const amount = Number(t.amount);
      const convertedAmount = convertAmount(amount, t.currency || "CNY", t.local_date || t.date);
      return sum + (t.type === "income" ? convertedAmount : -convertedAmount);
    }, 0);
  }, [transactions, personalAccounts, activeAccountId, accounts, convertAmount]);

  // Calculate Total Assets from all transactions
  const totalAssets = useMemo(() => {
    return transactions.reduce((sum, t) => {
      const amount = Number(t.amount);
      const convertedAmount = convertAmount(amount, t.currency || "CNY", t.local_date || t.date);
      return sum + (t.type === "income" ? convertedAmount : -convertedAmount);
    }, 0);
  }, [transactions, convertAmount]);

  const isExcludedAccount = useCallback((accountId: string): boolean => {
    const account = accounts.find((a) => a.id === accountId);
    return account?.exclude_from_equity ?? false;
  }, [accounts]);

  // Use device timezone to determine current month/year
  const deviceTz = getDeviceTimezone();
  const todayLocal = getLocalDateInTimezone(deviceTz);
  const { month: currentMonth, year: currentYear } = getMonthYearFromLocalDate(todayLocal);

  const monthlyTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const transactionDate = t.local_date || t.date;
      const { month, year } = getMonthYearFromLocalDate(transactionDate);
      const matchesMonth = month === currentMonth && year === currentYear;
      const matchesAccount = activeAccountId
        ? t.account_id === activeAccountId
        : true;
      return matchesMonth && matchesAccount;
    });
  }, [transactions, currentMonth, currentYear, activeAccountId]);

  const monthlyIncome = useMemo(() => {
    return monthlyTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + convertAmount(Number(t.amount), t.currency || "CNY", t.local_date || t.date), 0);
  }, [monthlyTransactions, convertAmount]);

  const monthlyExpenses = useMemo(() => {
    return monthlyTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + convertAmount(Number(t.amount), t.currency || "CNY", t.local_date || t.date), 0);
  }, [monthlyTransactions, convertAmount]);

  // Equity monthly transactions (from personal accounts only)
  const equityMonthlyTransactions = useMemo(() => {
    const personalAccountIds = new Set(personalAccounts.map((a) => a.id));
    return monthlyTransactions.filter((t) => personalAccountIds.has(t.account_id));
  }, [monthlyTransactions, personalAccounts]);

  const equityMonthlyIncome = useMemo(() => {
    return equityMonthlyTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);
  }, [equityMonthlyTransactions]);

  const equityMonthlyExpenses = useMemo(() => {
    return equityMonthlyTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);
  }, [equityMonthlyTransactions]);

  // Calculate monthly net equity (with currency conversion)
  const equityMonthlyNet = useMemo(() => {
    return equityMonthlyTransactions.reduce((sum, t) => {
      const amount = Number(t.amount);
      const convertedAmount = convertAmount(amount, t.currency || "CNY", t.local_date || t.date);
      return sum + (t.type === "income" ? convertedAmount : -convertedAmount);
    }, 0);
  }, [equityMonthlyTransactions, convertAmount]);

  // Display equity based on selected view mode
  const displayedPersonalEquity = useMemo(() => {
    return equityViewMode === "monthly" ? equityMonthlyNet : personalEquity;
  }, [equityViewMode, equityMonthlyNet, personalEquity]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesAccount = activeAccountId
        ? t.account_id === activeAccountId
        : true;
      const matchesType = typeFilter === "all" ? true : t.type === typeFilter;

      let matchesSearch = true;
      if (searchQuery) {
        const query = searchQuery.toLowerCase().trim();
        const category = categories.find((c) => c.id === t.category_id);
        const account = accounts.find((a) => a.id === t.account_id);

        matchesSearch =
          t.note?.toLowerCase().includes(query) ||
          t.amount.toString().includes(query) ||
          category?.name.toLowerCase().includes(query) ||
          account?.name.toLowerCase().includes(query) ||
          false;
      }

      return matchesAccount && matchesType && matchesSearch;
    });
  }, [transactions, activeAccountId, typeFilter, searchQuery, categories, accounts]);

  // Sort accounts by number of transactions (descending)
  const sortedAccounts = useMemo(() => {
    const transactionCounts = transactions.reduce((acc, transaction) => {
      acc[transaction.account_id] = (acc[transaction.account_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [...accounts].sort((a, b) => {
      const countA = transactionCounts[a.id] || 0;
      const countB = transactionCounts[b.id] || 0;

      if (countB !== countA) {
        return countB - countA;
      }

      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });
  }, [accounts, transactions]);

  // Subscription computed values
  const activeSubscriptions = useMemo(() => {
    return subscriptions.filter((s) => s.is_active);
  }, [subscriptions]);

  const totalAnnualSubscriptionCost = useMemo(() => {
    return activeSubscriptions.reduce((total, sub) => {
      const convertedCost = convertAmount(sub.cost, sub.currency);
      const annualCost = sub.billing_cycle === "monthly" ? convertedCost * 12 : convertedCost;
      return total + annualCost;
    }, 0);
  }, [activeSubscriptions, convertAmount]);

  const totalMonthlySubscriptionCost = useMemo(() => {
    return activeSubscriptions.reduce((total, sub) => {
      const convertedCost = convertAmount(sub.cost, sub.currency);
      const monthlyCost = sub.billing_cycle === "annual" ? convertedCost / 12 : convertedCost;
      return total + monthlyCost;
    }, 0);
  }, [activeSubscriptions, convertAmount]);

  const upcomingSubscription = useMemo(() => {
    if (activeSubscriptions.length === 0) return null;
    return activeSubscriptions[0];
  }, [activeSubscriptions]);

  const value: FikaContextType = {
    profile,
    loading,
    accounts: sortedAccounts,
    activeAccountId,
    setActiveAccountId,
    addAccount,
    updateAccount,
    deleteAccount,
    resetAccounts,
    refreshAccounts: fetchAccounts,
    isAccountModalOpen,
    setIsAccountModalOpen,
    editingAccount,
    setEditingAccount,
    isSettingsModalOpen,
    setIsSettingsModalOpen,
    isHelpModalOpen,
    setIsHelpModalOpen,
    categories,
    transactions,
    addTransaction,
    addTransactionsBatch,
    updateTransaction,
    deleteTransaction,
    deleteTransactionsBatch,
    refreshTransactions: fetchTransactions,
    isTransactionModalOpen,
    setIsTransactionModalOpen,
    editingTransaction,
    setEditingTransaction,
    totalBalance,
    monthlyIncome,
    monthlyExpenses,
    filteredTransactions,
    // Personal Equity
    personalEquity,
    totalAssets,
    personalAccounts,
    excludedAccounts,
    hasExcludedAccounts,
    equityMonthlyIncome,
    equityMonthlyExpenses,
    equityMonthlyNet,
    equityViewMode,
    setEquityViewMode,
    displayedPersonalEquity,
    isExcludedAccount,
    getAccountBalance,
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    // Subscriptions
    subscriptions,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    refreshSubscriptions: fetchSubscriptions,
    isSubscriptionModalOpen,
    setIsSubscriptionModalOpen,
    editingSubscription,
    setEditingSubscription,
    activeSubscriptions,
    totalAnnualSubscriptionCost,
    totalMonthlySubscriptionCost,
    upcomingSubscription,
  };

  return <FikaContext.Provider value={value}>{children}</FikaContext.Provider>;
}

export function useFika() {
  const context = useContext(FikaContext);
  if (context === undefined) {
    throw new Error("useFika must be used within a FikaProvider");
  }
  return context;
}
