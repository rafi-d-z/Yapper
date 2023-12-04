import { createClient  } from "@supabase/supabase-js";

const supabaseUrl = process.env.supabaseUrl;
const supabaseKey = process.env.supabaseKey;

export const supabase = createClient(supabaseUrl, supabaseKey);
