"use client"

import type React from "react"
import { useState } from "react"

import { useSwipeNavigation } from "@/hooks/use-swipe-navigation"
import { SwipeGuidance } from "@/components/swipe-guidance"

const STORAGE_KEY = "heirlooms_swipe_guidance_dismissed_collection"

interface CollectionSwipeWrapperProps {
  previousUrl: string | null
  nextUrl: string | null
  children: React.ReactNode
}

export function CollectionSwipeWrapper({ previousUrl, nextUrl, children }: CollectionSwipeWrapperProps) {
  const [showGuidance, setShowGuidance] = useState(() => {
    if (typeof window === "undefined") return false
    return !localStorage.getItem(STORAGE_KEY) && (previousUrl !== null || nextUrl !== null)
  })

  const handleDismiss = () => {
    console.log("[v0] Dismissing collection guidance")
    setShowGuidance(false)
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, "true")
    }
  }

  useSwipeNavigation({
    previousUrl,
    nextUrl,
    onNavigate: handleDismiss,
  })

  console.log("[v0] CollectionSwipeWrapper", { showGuidance, previousUrl, nextUrl })

  return (
    <>
      {children}
      {showGuidance && <SwipeGuidance onDismiss={handleDismiss} />}
    </>
  )
}
