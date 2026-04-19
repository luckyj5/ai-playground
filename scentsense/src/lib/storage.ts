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

const memoryStore: Store = { subscribers: [] };

function getStorePath(): string | null {
  const custom = process.env.SUBSCRIBERS_FILE;
  if (custom && custom.trim().length > 0) return custom;
  // On Vercel / serverless the filesystem is read-only (except /tmp) and
  // ephemeral, so persisting a long-lived JSON is pointless there. Skip disk
  // entirely and fall through to in-memory + logger + optional webhook.
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) return null;
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

async function postToWebhook(sub: Subscriber): Promise<void> {
  const url = process.env.SUBSCRIBE_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sub),
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("[scentsense] subscribe webhook failed", err);
  }
}

export async function addSubscriber(
  email: string,
  source = "waitlist",
): Promise<{ alreadyExisted: boolean; count: number }> {
  const normalized = email.trim().toLowerCase();
  const filePath = getStorePath();

  if (filePath) {
    try {
      const store = await readStore(filePath);
      const alreadyExisted = store.subscribers.some(
        (s) => s.email === normalized,
      );
      if (!alreadyExisted) {
        const sub: Subscriber = {
          email: normalized,
          source,
          createdAt: new Date().toISOString(),
        };
        store.subscribers.push(sub);
        await writeStore(filePath, store);
        await postToWebhook(sub);
      }
      return { alreadyExisted, count: store.subscribers.length };
    } catch (err) {
      const code = (err as NodeJS.ErrnoException).code;
      // Fall through to in-memory path if the filesystem is read-only
      // (e.g. someone set SUBSCRIBERS_FILE to a bad path on Vercel).
      if (code !== "EROFS" && code !== "EACCES" && code !== "EPERM") {
        throw err;
      }
      // eslint-disable-next-line no-console
      console.warn(
        "[scentsense] filesystem write failed, falling back to in-memory + webhook",
        err,
      );
    }
  }

  // Serverless / read-only FS path: in-memory + console log + optional webhook.
  const alreadyExisted = memoryStore.subscribers.some(
    (s) => s.email === normalized,
  );
  if (!alreadyExisted) {
    const sub: Subscriber = {
      email: normalized,
      source,
      createdAt: new Date().toISOString(),
    };
    memoryStore.subscribers.push(sub);
    // eslint-disable-next-line no-console
    console.log("[scentsense] subscriber:", JSON.stringify(sub));
    await postToWebhook(sub);
  }
  return { alreadyExisted, count: memoryStore.subscribers.length };
}

export function isValidEmail(email: string): boolean {
  if (typeof email !== "string") return false;
  const trimmed = email.trim();
  if (trimmed.length < 3 || trimmed.length > 254) return false;
  // Lightweight check – deliberately not full RFC 5322
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}
