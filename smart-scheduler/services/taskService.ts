import { supabase } from "../lib/supabase"

export async function addTask({ title, description, dueDate }) {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) throw new Error("User not authenticated")

  const { error } = await supabase.from("tasks").insert([
    {
      title: title.trim(),
      description: description.trim(),
      due_date: dueDate.toISOString(),
      user_id: user.id,
      completed: false,
    },
  ])

  if (error) throw error
}
