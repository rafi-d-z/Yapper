import { createClient  } from "@supabase/supabase-js";

const supabaseUrl = 'https://gopjsvqjoeoawvccsgax.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvcGpzdnFqb2VvYXd2Y2NzZ2F4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk5ODY0MzMsImV4cCI6MjAxNTU2MjQzM30.k-E_0hyP-WtkVshxCRGGkVN7V9IUn9BTtjc-nQU7jeQ'

export const supabase = createClient(supabaseUrl, supabaseKey);
