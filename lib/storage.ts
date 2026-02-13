import type { Profile } from "@/types/database";

export async function readData<T>(collection: string): Promise<T[]> {
  const res = await fetch(`/api/data/${collection}`);
  if (!res.ok) throw new Error(`Failed to read ${collection}`);
  return res.json();
}

export async function writeData<T>(collection: string, data: T[]): Promise<void> {
  const res = await fetch(`/api/data/${collection}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to write ${collection}`);
}

export async function readProfile(): Promise<Profile> {
  const res = await fetch("/api/data/profile");
  if (!res.ok) throw new Error("Failed to read profile");
  return res.json();
}

export async function writeProfile(data: Profile): Promise<void> {
  const res = await fetch("/api/data/profile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to write profile");
}
