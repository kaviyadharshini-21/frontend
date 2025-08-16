"use client"

import { useEffect, useCallback } from "react"

interface KeyboardNavigationOptions {
  onArrowDown?: () => void
  onArrowUp?: () => void
  onEnter?: () => void
  onSpace?: () => void
  onEscape?: () => void
  shortcuts?: Record<string, () => void>
  enabled?: boolean
  excludeInputs?: boolean
}

/**
 * Custom hook for keyboard navigation and shortcuts
 * Provides consistent keyboard handling across components
 */
export function useKeyboardNavigation({
  onArrowDown,
  onArrowUp,
  onEnter,
  onSpace,
  onEscape,
  shortcuts = {},
  enabled = true,
  excludeInputs = true,
}: KeyboardNavigationOptions) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return

      // Skip if user is typing in input fields
      if (
        excludeInputs &&
        (event.target instanceof HTMLInputElement ||
          event.target instanceof HTMLTextAreaElement ||
          event.target instanceof HTMLSelectElement ||
          (event.target as HTMLElement)?.contentEditable === "true")
      ) {
        return
      }

      // Handle modifier key shortcuts
      if (event.ctrlKey || event.metaKey) {
        const shortcutKey = event.key.toLowerCase()
        if (shortcuts[shortcutKey]) {
          event.preventDefault()
          shortcuts[shortcutKey]()
          return
        }
      }

      // Handle navigation keys
      switch (event.key) {
        case "ArrowDown":
          if (onArrowDown) {
            event.preventDefault()
            onArrowDown()
          }
          break
        case "ArrowUp":
          if (onArrowUp) {
            event.preventDefault()
            onArrowUp()
          }
          break
        case "Enter":
          if (onEnter) {
            event.preventDefault()
            onEnter()
          }
          break
        case " ":
          if (onSpace) {
            event.preventDefault()
            onSpace()
          }
          break
        case "Escape":
          if (onEscape) {
            event.preventDefault()
            onEscape()
          }
          break
      }
    },
    [enabled, excludeInputs, onArrowDown, onArrowUp, onEnter, onSpace, onEscape, shortcuts],
  )

  useEffect(() => {
    if (!enabled) return

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown, enabled])
}
