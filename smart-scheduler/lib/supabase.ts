import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://bqlnowcyqktppkswbtbi.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxbG5vd2N5cWt0cHBrc3didGJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMjQ0NTAsImV4cCI6MjA2NTgwMDQ1MH0.bDHN5DCLGiywRNXgDQjA5491lErHqSVNFqRH9qBZysk"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Task {
  id: string
  title: string
  description: string
  due_date: string
  completed: boolean
  user_id: string
  created_at: string
  updated_at: string
}
