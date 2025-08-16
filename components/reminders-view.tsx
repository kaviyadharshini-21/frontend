"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, AlertTriangle, CheckSquare, Reply, Calendar, User, RefreshCw, Mail } from "lucide-react"
import { useEmailStore, useCalendarStore } from "@/stores"

interface Reminder {
  id: string
  type: "overdue" | "follow-up" | "meeting"
  title: string
  context: string
  sender: string
  urgency: "high" | "medium" | "low"
  daysOverdue?: number
  timestamp: string
}

export function RemindersView() {
  // Import Zustand stores
  const { 
    processedEmails, 
    isLoading: emailLoading, 
    error: emailError, 
    fetchEmails 
  } = useEmailStore()

  const { 
    todayEvents, 
    isLoading: calendarLoading, 
    error: calendarError, 
    getTodayEvents 
  } = useCalendarStore()

  // Fetch data on component mount
  useEffect(() => {
    fetchEmails()
    getTodayEvents()
  }, [fetchEmails, getTodayEvents])

  // Transform API data to create reminders
  const reminders: Reminder[] = []

  // Add email-based reminders
  if (processedEmails) {
    processedEmails.forEach((email, index) => {
      // Create overdue response reminders for high urgency emails
      if (email.classification?.urgency === "high" && email.intent?.requires_response) {
        reminders.push({
          id: `email-${email.email_id || index}`,
          type: "overdue" as const,
          title: `Response needed: ${email.summary?.brief_summary || "Email"}`,
          context: email.summary?.brief_summary || "No context available",
          sender: email.classification?.sender_importance === "high" ? "VIP Contact" : "Unknown Sender",
          urgency: email.classification?.urgency as "high" | "medium" | "low" || "medium",
          daysOverdue: 1, // Placeholder
          timestamp: "1 day overdue",
        })
      }

      // Create follow-up reminders for medium urgency emails
      if (email.classification?.urgency === "medium" && email.intent?.requires_response) {
        reminders.push({
          id: `followup-${email.email_id || index}`,
          type: "follow-up" as const,
          title: `Follow up: ${email.summary?.brief_summary || "Email"}`,
          context: email.summary?.brief_summary || "No context available",
          sender: email.classification?.sender_importance === "high" ? "VIP Contact" : "Unknown Sender",
          urgency: email.classification?.urgency as "high" | "medium" | "low" || "medium",
          timestamp: "5 days ago",
        })
      }
    })
  }

  // Add calendar-based reminders
  if (todayEvents?.events) {
    todayEvents.events.forEach((event, index) => {
      reminders.push({
        id: `meeting-${event.id || index}`,
        type: "meeting" as const,
        title: `Meeting reminder: ${event.summary}`,
        context: `Meeting scheduled for ${new Date(event.start_time).toLocaleTimeString()}`,
        sender: "Calendar",
        urgency: "high" as const,
        timestamp: `Today at ${new Date(event.start_time).toLocaleTimeString()}`,
      })
    })
  }

  const isLoading = emailLoading || calendarLoading
  const error = emailError || calendarError

  // Error handling with fallback UI
  if (error) {
    return (
      <div className="flex-1 p-6">
        <div className="flex items-center justify-center h-full">
          <Card className="p-8 text-center max-w-md">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Failed to Load Reminders</h3>
            <p className="text-gray-600 mb-4">
              {typeof error === 'string' ? error : "Unable to fetch reminders from the server. Please check your connection and try again."}
            </p>
            <Button onClick={() => { fetchEmails(); getTodayEvents(); }} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </Card>
        </div>
      </div>
    )
  }

  // Loading state
  if (isLoading && reminders.length === 0) {
    return (
      <div className="flex-1 p-6">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading reminders...</p>
          </div>
        </div>
      </div>
    )
  }

  // Empty state
  if (!isLoading && reminders.length === 0) {
    return (
      <div className="flex-1 p-6">
        <div className="flex items-center justify-center h-full">
          <Card className="p-8 text-center max-w-md">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Reminders</h3>
            <p className="text-gray-600 mb-4">
              You're all caught up! No overdue responses or upcoming meetings that need attention.
            </p>
            <Button onClick={() => { fetchEmails(); getTodayEvents(); }} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </Card>
        </div>
      </div>
    )
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "border-red-200 bg-red-50"
      case "medium":
        return "border-yellow-200 bg-yellow-50"
      case "low":
        return "border-green-200 bg-green-50"
      default:
        return "border-border bg-card"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "overdue":
        return AlertTriangle
      case "follow-up":
        return Clock
      case "meeting":
        return Calendar
      default:
        return Clock
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "overdue":
        return "text-red-500"
      case "follow-up":
        return "text-yellow-500"
      case "meeting":
        return "text-blue-500"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <div className="flex-1 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Proactive Reminders</h2>
          <p className="text-muted-foreground">Stay on top of important conversations and commitments</p>
        </div>

        <div className="space-y-4">
          {reminders.map((reminder) => {
            const TypeIcon = getTypeIcon(reminder.type)

            return (
              <Card key={reminder.id} className={`p-6 ${getUrgencyColor(reminder.urgency)}`}>
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-full bg-background ${getTypeColor(reminder.type)}`}>
                    <TypeIcon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-foreground">{reminder.title}</h3>
                      <Badge variant={reminder.urgency === "high" ? "destructive" : "secondary"}>
                        {reminder.urgency} priority
                      </Badge>
                      {reminder.daysOverdue && <Badge variant="destructive">{reminder.daysOverdue} days overdue</Badge>}
                    </div>

                    <p className="text-muted-foreground mb-3">{reminder.context}</p>

                    <div className="flex items-center gap-2 mb-4">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{reminder.sender}</span>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{reminder.timestamp}</span>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm">
                        <Reply className="w-4 h-4 mr-2" />
                        Respond Now
                      </Button>
                      <Button size="sm" variant="outline">
                        <Clock className="w-4 h-4 mr-2" />
                        Snooze
                      </Button>
                      <Button size="sm" variant="outline">
                        <CheckSquare className="w-4 h-4 mr-2" />
                        Mark Complete
                      </Button>
                      {reminder.type === "follow-up" && (
                        <Button size="sm" variant="outline">
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          Escalate
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {reminders.length === 0 && (
          <Card className="p-8 text-center">
            <CheckSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">All caught up!</h3>
            <p className="text-muted-foreground">No pending reminders or overdue conversations at the moment.</p>
          </Card>
        )}
      </div>
    </div>
  )
}
