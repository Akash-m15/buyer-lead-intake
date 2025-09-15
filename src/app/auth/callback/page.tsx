"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/supabaseClient"

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    async function loadSession() {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        
        router.push("/buyers")  
      } else {
        router.push("/signin")
      }
    }
    loadSession()
  }, [router])

  return <p>Finishing sign in...</p>
}
