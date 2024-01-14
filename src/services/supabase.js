import { createClient } from "@supabase/supabase-js";
export const supabaseUrl = "https://gtxwqnejtygikykilnhs.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0eHdxbmVqdHlnaWt5a2lsbmhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ3OTg3OTgsImV4cCI6MjAyMDM3NDc5OH0.6fnzDuqUC1VPQK9QoAEN7v9tcMQFzU_VhZv10u9QkOc";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
