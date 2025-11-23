import { createClient as createBrowserClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@supabase/supabase-js';

// Browser client (frontend)
export const supabaseBrowser = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Server client (backend only)
export function getSupabaseServiceRoleClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
