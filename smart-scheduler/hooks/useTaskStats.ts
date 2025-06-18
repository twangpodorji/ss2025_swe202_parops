import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"

export function useTaskStats(userId: string | undefined) {
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 })

  const fetchStats = async () => {
    if (!userId) return
    const { data, error } = await supabase.from("tasks").select("completed").eq("user_id", userId)
    if (error) return

    const total = data.length
    const completed = data.filter((task) => task.completed).length
    const pending = total - completed
    setStats({ total, completed, pending })
  }

  useEffect(() => {
    fetchStats()
  }, [userId])

  return { stats, refreshStats: fetchStats }
}
