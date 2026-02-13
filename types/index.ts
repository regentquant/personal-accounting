export type TransactionType = "income" | "expense";

export type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
};

export type Account = {
  id: string;
  name: string;
  icon: string;
  color: string;
  balance: number;
};

export type Transaction = {
  id: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  accountId: string;
  date: string;
  note?: string;
  createdAt: string;
};

export type DateRange = {
  start: Date;
  end: Date;
};

export const EXPENSE_CATEGORIES: Category[] = [
  { id: "food", name: "Food & Dining", icon: "UtensilsCrossed", color: "#E6A756", type: "expense" },
  { id: "transport", name: "Transport", icon: "Car", color: "#7BA3C4", type: "expense" },
  { id: "shopping", name: "Shopping", icon: "ShoppingBag", color: "#A85D5D", type: "expense" },
  { id: "entertainment", name: "Entertainment", icon: "Gamepad2", color: "#9B7ED9", type: "expense" },
  { id: "utilities", name: "Utilities", icon: "Zap", color: "#5CB8A8", type: "expense" },
  { id: "health", name: "Health", icon: "Heart", color: "#E88B8B", type: "expense" },
  { id: "education", name: "Education", icon: "GraduationCap", color: "#6B9BD1", type: "expense" },
  { id: "productivity", name: "Productivity", icon: "Laptop", color: "#66BB6A", type: "expense" },
  { id: "travel", name: "Travel", icon: "Plane", color: "#4A90E2", type: "expense" },
  { id: "other-expense", name: "Other", icon: "MoreHorizontal", color: "#C4A484", type: "expense" },
];

export const INCOME_CATEGORIES: Category[] = [
  { id: "salary", name: "Salary", icon: "Briefcase", color: "#8BA888", type: "income" },
  { id: "freelance", name: "Freelance", icon: "Laptop", color: "#7BA3C4", type: "income" },
  { id: "investment", name: "Investment", icon: "TrendingUp", color: "#E6A756", type: "income" },
  { id: "gift", name: "Gift", icon: "Gift", color: "#D4A5A5", type: "income" },
  { id: "other-income", name: "Other", icon: "MoreHorizontal", color: "#C4A484", type: "income" },
];

export const DEFAULT_ACCOUNTS: Account[] = [
  { id: "wechat", name: "WeChat Pay", icon: "MessageCircle", color: "#07C160", balance: 2580.50 },
  { id: "alipay", name: "Alipay", icon: "Wallet", color: "#1677FF", balance: 4320.00 },
  { id: "bank", name: "Bank Card", icon: "CreditCard", color: "#E6A756", balance: 15680.75 },
  { id: "cash", name: "Cash", icon: "Banknote", color: "#8BA888", balance: 850.00 },
];

export const DEMO_TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    amount: 42.50,
    type: "expense",
    categoryId: "food",
    accountId: "wechat",
    date: "2025-12-25",
    note: "Christmas dinner ingredients",
    createdAt: "2025-12-25T10:30:00Z",
  },
  {
    id: "2",
    amount: 8500,
    type: "income",
    categoryId: "salary",
    accountId: "bank",
    date: "2025-12-24",
    note: "Monthly salary",
    createdAt: "2025-12-24T09:00:00Z",
  },
  {
    id: "3",
    amount: 156.00,
    type: "expense",
    categoryId: "shopping",
    accountId: "alipay",
    date: "2025-12-23",
    note: "Christmas gifts",
    createdAt: "2025-12-23T14:20:00Z",
  },
  {
    id: "4",
    amount: 28.00,
    type: "expense",
    categoryId: "transport",
    accountId: "wechat",
    date: "2025-12-22",
    note: "Taxi to mall",
    createdAt: "2025-12-22T16:45:00Z",
  },
  {
    id: "5",
    amount: 89.90,
    type: "expense",
    categoryId: "entertainment",
    accountId: "alipay",
    date: "2025-12-21",
    note: "Movie tickets & snacks",
    createdAt: "2025-12-21T19:30:00Z",
  },
  {
    id: "6",
    amount: 500.00,
    type: "income",
    categoryId: "freelance",
    accountId: "alipay",
    date: "2025-12-20",
    note: "Logo design project",
    createdAt: "2025-12-20T11:00:00Z",
  },
  {
    id: "7",
    amount: 320.00,
    type: "expense",
    categoryId: "utilities",
    accountId: "bank",
    date: "2025-12-19",
    note: "Electricity bill",
    createdAt: "2025-12-19T08:15:00Z",
  },
  {
    id: "8",
    amount: 65.00,
    type: "expense",
    categoryId: "food",
    accountId: "cash",
    date: "2025-12-18",
    note: "Coffee shop",
    createdAt: "2025-12-18T15:00:00Z",
  },
  {
    id: "9",
    amount: 200.00,
    type: "income",
    categoryId: "gift",
    accountId: "wechat",
    date: "2025-12-17",
    note: "Birthday red packet from aunt",
    createdAt: "2025-12-17T12:30:00Z",
  },
  {
    id: "10",
    amount: 45.00,
    type: "expense",
    categoryId: "health",
    accountId: "alipay",
    date: "2025-12-16",
    note: "Pharmacy - vitamins",
    createdAt: "2025-12-16T10:45:00Z",
  },
];

