import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://tkqqxkonbjgniznhipuj.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrcXF4a29uYmpnbml6bmhpcHVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4MzM3NjIsImV4cCI6MjA5MTQwOTc2Mn0.ETgpcb0hYmgzUZLmzgxOSDQX2AJJHp3y3rNyH016BFg";

export const supabase = createClient(supabaseUrl, supabaseKey);