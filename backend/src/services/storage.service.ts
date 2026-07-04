import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import { env } from "../config/env.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOCAL_UPLOAD_DIR = path.join(__dirname, "../../uploads");

function getClient() {
  if (!env.supabaseUrl || !env.supabaseServiceRoleKey) return null;
  return createClient(env.supabaseUrl, env.supabaseServiceRoleKey);
}

// Falls back to local disk when Supabase Storage isn't configured (plain
// local dev). Serverless deployments (e.g. Vercel) have no persistent
// filesystem, so SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY must be set there.
export async function uploadFile(storageKey: string, buffer: Buffer, contentType: string): Promise<void> {
  const client = getClient();
  if (!client) {
    const localPath = path.join(LOCAL_UPLOAD_DIR, storageKey);
    await fs.mkdir(path.dirname(localPath), { recursive: true });
    await fs.writeFile(localPath, buffer);
    return;
  }
  const { error } = await client.storage.from(env.supabaseStorageBucket).upload(storageKey, buffer, {
    contentType,
    upsert: true,
  });
  if (error) throw new Error(`Gagal upload ke Supabase Storage: ${error.message}`);
}

export async function downloadFile(storageKey: string): Promise<Buffer> {
  const client = getClient();
  if (!client) {
    const localPath = path.join(LOCAL_UPLOAD_DIR, storageKey);
    return fs.readFile(localPath);
  }
  const { data, error } = await client.storage.from(env.supabaseStorageBucket).download(storageKey);
  if (error || !data) throw new Error(`Gagal download dari Supabase Storage: ${error?.message ?? "unknown error"}`);
  return Buffer.from(await data.arrayBuffer());
}
