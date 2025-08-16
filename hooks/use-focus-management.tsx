"use client"

import { useRef, useCallback, useEffect } from "react"

/**
 * Custom hook for managing focus in lists and grids
 * Provides utilities for focus management and keyboard navigation
 */
export function useFocusManagement<T extends HTMLElement = HTMLElement>(itemCount: number) {
  const itemRefs = useRef<(T | null)[]>([])
  const focusedIndex = useRef<number>(-1)

  // Initialize refs array
  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, itemCount)
  }, [itemCount])

  const setItemRef = useCallback(
    (index: number) => (el: T | null) => {
      itemRefs.current[index] = el
    },
    [],
  )

  const focusItem = useCallback(
    (index: number) => {
      if (index >= 0 && index < itemCount && itemRefs.current[index]) {
        focusedIndex.current = index
        itemRefs.current[index]?.focus()
      }
    },
    [itemCount],
  )

  const focusNext = useCallback(() => {
    const nextIndex = Math.min(focusedIndex.current + 1, itemCount - 1)
    focusItem(nextIndex)
  }, [focusItem, itemCount])

  const focusPrevious = useCallback(() => {
    const prevIndex = Math.max(focusedIndex.current - 1, 0)
    focusItem(prevIndex)
  }, [focusItem])

  const focusFirst = useCallback(() => {
    focusItem(0)
  }, [focusItem])

  const focusLast = useCallback(() => {
    focusItem(itemCount - 1)
  }, [focusItem, itemCount])

  const getCurrentFocusedIndex = useCallback(() => focusedIndex.current, [])

  const getCurrentFocusedElement = useCallback(() => {
    const index = focusedIndex.current
    return index >= 0 ? itemRefs.current[index] : null
  }, [])

  return {
    setItemRef,
    focusItem,
    focusNext,
    focusPrevious,
    focusFirst,
    focusLast,
    getCurrentFocusedIndex,
    getCurrentFocusedElement,
  }
}
