import { promises as fs } from "fs";
import path from "path";

interface Subscriber {
  email: string;
  source: string;
  createdAt: string;
}

interface Store {
  subscribers: Subscriber[];
}

function getStorePath(): string {
  const custom = process.env.SUBSCRIBERS_FILE;
  if (custom && custom.trim().length > 0) return custom;
  return path.join(process.cwd(), "data", "local", "subscribers.json");
}

async function readStore(filePath: string): Promise<Store> {
  try {
    const buf = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(buf) as Store;
    if (!parsed.subscribers) return { subscribers: [] };
    return parsed;
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === "ENOENT") return { subscribers: [] };
    throw err;
  }
}

async function writeStore(filePath: string, store: Store): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(store, null, 2));
}

export async function addSubscriber(
  email: string,
  source = "waitlist",
): Promise<{ alreadyExisted: boolean; count: number }> {
  const filePath = getStorePath();
  const store = await readStore(filePath);
  const normalized = email.trim().toLowerCase();
  const alreadyExisted = store.subscribers.some(
    (s) => s.email === normalized,
  );
  if (!alreadyExisted) {
    store.subscribers.push({
      email: normalized,
      source,
      createdAt: new Date().toISOString(),
    });
    await writeStore(filePath, store);
  }
  return { alreadyExisted, count: store.subscribers.length };
}

export function isValidEmail(email: string): boolean {
  if (typeof email !== "string") return false;
  const trimmed = email.trim();
  if (trimmed.length < 3 || trimmed.length > 254) return false;
  // Lightweight check – deliberately not full RFC 5322
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}
