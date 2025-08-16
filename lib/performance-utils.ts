export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      if (!immediate) func(...args)
    }

    const callNow = immediate && !timeout

    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)

    if (callNow) func(...args)
  }
}

/**
 * Throttle function to limit function calls to once per interval
 */
export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle = false

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Simple memoization for expensive computations
 */
export function memoize<T extends (...args: any[]) => any>(func: T, getKey?: (...args: Parameters<T>) => string): T {
  const cache = new Map<string, ReturnType<T>>()

  return ((...args: Parameters<T>) => {
    const key = getKey ? getKey(...args) : JSON.stringify(args)

    if (cache.has(key)) {
      return cache.get(key)!
    }

    const result = func(...args)
    cache.set(key, result)
    return result
  }) as T
}

/**
 * Intersection Observer hook for lazy loading and infinite scroll
 */
export function createIntersectionObserver(
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit,
): IntersectionObserver {
  return new IntersectionObserver(callback, {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
    ...options,
  })
}

/**
 * Request animation frame wrapper for smooth animations
 */
export function requestAnimationFramePromise(): Promise<number> {
  return new Promise((resolve) => {
    requestAnimationFrame(resolve)
  })
}

/**
 * Batch DOM updates for better performance
 */
export async function batchDOMUpdates(updates: (() => void)[]): Promise<void> {
  await requestAnimationFramePromise()

  // Use document fragment for multiple DOM manipulations
  updates.forEach((update) => update())
}

/**
 * Preload critical resources
 */
export function preloadResource(href: string, as: string, type?: string): void {
  const link = document.createElement("link")
  link.rel = "preload"
  link.href = href
  link.as = as
  if (type) link.type = type

  document.head.appendChild(link)
}

/**
 * Measure performance of functions
 */
export function measurePerformance<T extends (...args: any[]) => any>(func: T, label?: string): T {
  return ((...args: Parameters<T>) => {
    const startTime = performance.now()
    const result = func(...args)
    const endTime = performance.now()

    console.log(`${label || func.name} took ${endTime - startTime} milliseconds`)
    return result
  }) as T
}
