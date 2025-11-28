import { createClient } from "@supabase/supabase-js";

export const createSupabaseServerClient = () => {
  const supabaseUrl =
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      "Missing Supabase server environment variables. Define SUPABASE_SERVICE_ROLE_KEY and either SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL."
    );
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
    },
  });
};

