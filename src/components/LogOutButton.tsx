"use client"

import { supabase } from "@/lib/supabase/supabaseClient"

export default function LogoutButton() {
  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = "/login"
  }

  return <button onClick={handleLogout} className="rounded-md px-4 py-2 text-sm font-medium hover:bg-red-600 bg-red-500   text-white">Logout</button>
}
