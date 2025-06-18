import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"

export function useUser() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    fetchUser()
  }, [])

  return user
}
