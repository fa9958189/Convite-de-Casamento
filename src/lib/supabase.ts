import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
let client: SupabaseClient | undefined;
export function getSupabase() {
  if (client) return client;
  const url = import.meta.env.VITE_SUPABASE_URL?.trim();
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();
  if (!url || !key || !key.startsWith("sb_publishable_")) throw new Error("Configuração de confirmação indisponível.");
  client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
  return client;
}
