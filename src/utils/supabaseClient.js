import { createClient  } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_API_KEY;
const supabaseKey = process.env.SUPABASE_URL;

export const supabase = createClient(supabaseUrl, supabaseKey);
