export interface Email {
  id: string
  sender: string
  subject: string
  summary: string
  isVip: boolean
  urgency: "high" | "medium" | "low"
  hasAttachment: boolean
  timestamp: string
  category: "urgent" | "respond" | "fyi" | "meeting"
  hasMeetingRequest?: boolean
}

export type EmailCategory = "urgent" | "respond" | "fyi" | "meeting"

/**
 * Get urgency color class for consistent styling
 */
export function getUrgencyColor(urgency: Email["urgency"]): string {
  const colors = {
    high: "text-red-500",
    medium: "text-yellow-500",
    low: "text-green-500",
  } as const

  return colors[urgency] || "text-muted-foreground"
}

/**
 * Get urgency icon component for consistent iconography
 */
export function getUrgencyIconName(urgency: Email["urgency"]): string {
  const icons = {
    high: "AlertCircle",
    medium: "Clock",
    low: "CheckSquare",
  } as const

  return icons[urgency] || "Clock"
}

/**
 * Filter emails by category with memoization support
 */
export function filterEmailsByCategory(emails: Email[], category: EmailCategory): Email[] {
  return emails.filter((email) => email.category === category)
}

/**
 * Get category counts for badge display
 */
export function getCategoryCounts(emails: Email[]): Record<EmailCategory, number> {
  return emails.reduce(
    (counts, email) => {
      counts[email.category] = (counts[email.category] || 0) + 1
      return counts
    },
    { urgent: 0, respond: 0, fyi: 0, meeting: 0 } as Record<EmailCategory, number>,
  )
}

/**
 * Sort emails by priority and timestamp
 */
export function sortEmailsByPriority(emails: Email[]): Email[] {
  const urgencyOrder = { high: 3, medium: 2, low: 1 }

  return [...emails].sort((a, b) => {
    // First sort by urgency
    const urgencyDiff = urgencyOrder[b.urgency] - urgencyOrder[a.urgency]
    if (urgencyDiff !== 0) return urgencyDiff

    // Then by VIP status
    if (a.isVip !== b.isVip) return a.isVip ? -1 : 1

    // Finally by timestamp (assuming newer is better)
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  })
}

/**
 * Format timestamp for display
 */
export function formatTimestamp(timestamp: string): string {
  const now = new Date()
  const emailDate = new Date(timestamp)
  const diffInHours = Math.floor((now.getTime() - emailDate.getTime()) / (1000 * 60 * 60))

  if (diffInHours < 1) return "Just now"
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`

  return emailDate.toLocaleDateString()
}

/**
 * Validate email selection for bulk operations
 */
export function validateEmailSelection(
  selectedIds: string[],
  emails: Email[],
): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (selectedIds.length === 0) {
    errors.push("No emails selected")
  }

  const invalidIds = selectedIds.filter((id) => !emails.some((email) => email.id === id))
  if (invalidIds.length > 0) {
    errors.push(`Invalid email IDs: ${invalidIds.join(", ")}`)
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Generate accessible label for email card
 */
export function generateEmailAriaLabel(email: Email): string {
  const parts = [
    `Email from ${email.sender}`,
    email.subject,
    `${email.urgency} priority`,
    email.isVip ? "VIP sender" : null,
    email.hasAttachment ? "Has attachment" : null,
    email.hasMeetingRequest ? "Contains meeting request" : null,
  ].filter(Boolean)

  return parts.join(", ")
}
