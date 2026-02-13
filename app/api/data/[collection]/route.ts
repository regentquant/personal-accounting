import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";

const DATA_DIR = path.join(process.cwd(), "data");

const VALID_COLLECTIONS = new Set([
  "accounts",
  "categories",
  "transactions",
  "subscriptions",
  "profile",
  "currency_rates",
]);

function getFilePath(collection: string): string {
  return path.join(DATA_DIR, `${collection}.json`);
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { collection: string } }
) {
  const { collection } = params;

  if (!VALID_COLLECTIONS.has(collection)) {
    return NextResponse.json({ error: "Invalid collection" }, { status: 400 });
  }

  const filePath = getFilePath(collection);

  try {
    if (!fs.existsSync(filePath)) {
      // Return default empty data
      if (collection === "profile") {
        return NextResponse.json({
          id: "local",
          display_name: null,
          avatar_url: null,
          currency: "CNY",
          language: "en",
          timezone: "Asia/Shanghai",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
      return NextResponse.json([]);
    }

    const content = fs.readFileSync(filePath, "utf-8");
    return NextResponse.json(JSON.parse(content));
  } catch {
    return NextResponse.json({ error: "Failed to read data" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { collection: string } }
) {
  const { collection } = params;

  if (!VALID_COLLECTIONS.has(collection)) {
    return NextResponse.json({ error: "Invalid collection" }, { status: 400 });
  }

  try {
    const data = await request.json();

    // Ensure data directory exists
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    const filePath = getFilePath(collection);

    // Atomic write: write to temp file then rename
    const tmpPath = path.join(os.tmpdir(), `fika-${collection}-${Date.now()}.json`);
    fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), "utf-8");
    fs.renameSync(tmpPath, filePath);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to write data" }, { status: 500 });
  }
}
