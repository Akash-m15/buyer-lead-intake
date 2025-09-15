"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase/supabaseClient"   // your wrapper
import {useRouter} from "next/navigation"

export default function SignUpForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter();
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
       options: {
    emailRedirectTo: `${window.location.origin}/auth/callback`, 
  },
    })

    console.log(data,error)
  if (error) {
      setError(error.message)
    } else if (data.user && data.user.identities?.length === 0) {
      // Email already exists
      setError("Email already registered. Redirecting to sign-in...")
      router.push("/signin")
    } else {
      console.log("User Created", data.user?.email)
      alert("Check your email for confirmation link")
      router.push("/signin")
    }
  }

  return (
    <form onSubmit={handleSignUp}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Sign Up</button>
      {error && <p>{error}</p>}
    </form>
  )
}
