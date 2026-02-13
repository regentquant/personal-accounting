import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

function writeJsonFile(name: string, data: unknown) {
  const filePath = path.join(DATA_DIR, `${name}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export async function POST() {
  try {
    // Check if already initialized
    const profilePath = path.join(DATA_DIR, "profile.json");
    if (fs.existsSync(profilePath)) {
      return NextResponse.json({ initialized: false, message: "Already initialized" });
    }

    // Ensure data directory exists
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    const now = new Date().toISOString();

    // Default profile
    writeJsonFile("profile", {
      id: "local",
      display_name: null,
      avatar_url: null,
      currency: "CNY",
      language: "en",
      timezone: "Asia/Shanghai",
      created_at: now,
      updated_at: now,
    });

    // Default accounts
    const defaultAccounts = [
      { id: crypto.randomUUID(), name: "WeChat", icon: "MessageCircle", color: "#07C160", balance: 0, exclude_from_equity: false, created_at: now, updated_at: now },
      { id: crypto.randomUUID(), name: "Alipay", icon: "Wallet", color: "#1677FF", balance: 0, exclude_from_equity: false, created_at: now, updated_at: now },
      { id: crypto.randomUUID(), name: "PayPal", icon: "CreditCard", color: "#003087", balance: 0, exclude_from_equity: false, created_at: now, updated_at: now },
      { id: crypto.randomUUID(), name: "Venmo", icon: "Smartphone", color: "#3D95CE", balance: 0, exclude_from_equity: false, created_at: now, updated_at: now },
      { id: crypto.randomUUID(), name: "Apple Pay", icon: "Smartphone", color: "#000000", balance: 0, exclude_from_equity: false, created_at: now, updated_at: now },
      { id: crypto.randomUUID(), name: "Google Pay", icon: "Smartphone", color: "#4285F4", balance: 0, exclude_from_equity: false, created_at: now, updated_at: now },
      { id: crypto.randomUUID(), name: "Bank Card", icon: "CreditCard", color: "#E6A756", balance: 0, exclude_from_equity: false, created_at: now, updated_at: now },
      { id: crypto.randomUUID(), name: "Cash", icon: "Banknote", color: "#8BA888", balance: 0, exclude_from_equity: false, created_at: now, updated_at: now },
    ];
    writeJsonFile("accounts", defaultAccounts);

    // Default categories
    const defaultCategories = [
      { id: "food", name: "Food & Dining", icon: "UtensilsCrossed", color: "#E6A756", type: "expense", is_default: true, user_id: null, created_at: now },
      { id: "transport", name: "Transport", icon: "Car", color: "#7BA3C4", type: "expense", is_default: true, user_id: null, created_at: now },
      { id: "shopping", name: "Shopping", icon: "ShoppingBag", color: "#A85D5D", type: "expense", is_default: true, user_id: null, created_at: now },
      { id: "entertainment", name: "Entertainment", icon: "Gamepad2", color: "#9B7ED9", type: "expense", is_default: true, user_id: null, created_at: now },
      { id: "utilities", name: "Utilities", icon: "Zap", color: "#5CB8A8", type: "expense", is_default: true, user_id: null, created_at: now },
      { id: "health", name: "Health", icon: "Heart", color: "#E88B8B", type: "expense", is_default: true, user_id: null, created_at: now },
      { id: "education", name: "Education", icon: "GraduationCap", color: "#6B9BD1", type: "expense", is_default: true, user_id: null, created_at: now },
      { id: "productivity", name: "Productivity", icon: "Laptop", color: "#66BB6A", type: "expense", is_default: true, user_id: null, created_at: now },
      { id: "travel", name: "Travel", icon: "Plane", color: "#4A90E2", type: "expense", is_default: true, user_id: null, created_at: now },
      { id: "other-expense", name: "Other", icon: "MoreHorizontal", color: "#C4A484", type: "expense", is_default: true, user_id: null, created_at: now },
      { id: "salary", name: "Salary", icon: "Briefcase", color: "#8BA888", type: "income", is_default: true, user_id: null, created_at: now },
      { id: "freelance", name: "Freelance", icon: "Laptop", color: "#7BA3C4", type: "income", is_default: true, user_id: null, created_at: now },
      { id: "investment", name: "Investment", icon: "TrendingUp", color: "#E6A756", type: "income", is_default: true, user_id: null, created_at: now },
      { id: "gift", name: "Gift", icon: "Gift", color: "#D4A5A5", type: "income", is_default: true, user_id: null, created_at: now },
      { id: "other-income", name: "Other", icon: "MoreHorizontal", color: "#C4A484", type: "income", is_default: true, user_id: null, created_at: now },
    ];
    writeJsonFile("categories", defaultCategories);

    // Empty transactions and subscriptions
    writeJsonFile("transactions", []);
    writeJsonFile("subscriptions", []);

    // Parse currency rates from CSV
    const csvPath = path.join(DATA_DIR, "currency-rates", "FX_IDC_USDCNY, 1D.csv");
    let currencyRates: Array<{ id: string; from_currency: string; to_currency: string; rate: number; date: string; created_at: string }> = [];

    if (fs.existsSync(csvPath)) {
      const csvContent = fs.readFileSync(csvPath, "utf-8");
      const lines = csvContent.trim().split("\n");
      // Skip header line
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const parts = line.split(",");
        const date = parts[0];
        const close = parseFloat(parts[4]);
        if (date && !isNaN(close)) {
          currencyRates.push({
            id: crypto.randomUUID(),
            from_currency: "USD",
            to_currency: "CNY",
            rate: close,
            date,
            created_at: now,
          });
        }
      }
    }
    writeJsonFile("currency_rates", currencyRates);

    return NextResponse.json({ initialized: true, message: "Data initialized successfully" });
  } catch (error) {
    console.error("Init error:", error);
    return NextResponse.json({ error: "Failed to initialize data" }, { status: 500 });
  }
}
