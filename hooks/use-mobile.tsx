"use client"

import { useState, useEffect } from "react"

/**
 * Custom hook to detect mobile viewport and handle responsive behavior
 * @param breakpoint - The breakpoint in pixels (default: 768)
 * @returns Object containing mobile state and utilities
 */
export function useMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < breakpoint
      setIsMobile(mobile)
      setIsLoading(false)
    }

    // Initial check
    checkMobile()

    // Debounced resize handler for better performance
    let timeoutId: NodeJS.Timeout
    const debouncedResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(checkMobile, 150)
    }

    window.addEventListener("resize", debouncedResize, { passive: true })

    return () => {
      window.removeEventListener("resize", debouncedResize)
      clearTimeout(timeoutId)
    }
  }, [breakpoint])

  return { isMobile, isLoading }
}
