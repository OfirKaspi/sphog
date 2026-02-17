"use client"

import { useEffect, useMemo, useState } from "react"
import type { Session, SupabaseClient } from "@supabase/supabase-js"

import { getSupabaseBrowserClient, type Database } from "@/lib/supabase"

type BrowserSupabaseClient = SupabaseClient<Database>

export function useAdminSession() {
  const [supabase, setSupabase] = useState<BrowserSupabaseClient | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  useEffect(() => {
    setSupabase(getSupabaseBrowserClient() as BrowserSupabaseClient)
  }, [])

  useEffect(() => {
    if (!supabase) {
      return
    }

    let isMounted = true

    const init = async () => {
      setIsCheckingAuth(true)
      const { data } = await supabase.auth.getSession()
      if (isMounted) {
        setSession(data.session ?? null)
        setIsCheckingAuth(false)
      }
    }

    void init()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!isMounted) {
        return
      }
      setSession(nextSession ?? null)
      setIsCheckingAuth(false)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [supabase])

  const isAuthenticated = useMemo(() => Boolean(session), [session])

  const getAccessToken = async () => {
    if (!supabase) {
      return null
    }
    const { data } = await supabase.auth.getSession()
    return data.session?.access_token ?? null
  }

  const getAuthHeaders = async (isJson = false): Promise<HeadersInit | null> => {
    const accessToken = await getAccessToken()
    if (!accessToken) {
      return null
    }

    const headers: HeadersInit = {
      Authorization: `Bearer ${accessToken}`,
    }

    if (isJson) {
      headers["Content-Type"] = "application/json"
    }

    return headers
  }

  const signOut = async () => {
    if (!supabase) {
      return
    }
    await supabase.auth.signOut()
    setSession(null)
  }

  return {
    supabase,
    session,
    isCheckingAuth,
    isAuthenticated,
    getAccessToken,
    getAuthHeaders,
    signOut,
  }
}
