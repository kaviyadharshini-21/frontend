"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Clock, Calendar, CheckCircle, XCircle } from "lucide-react"
import { useReminderStore } from "@/stores/reminderStore"
import type { Reminder } from "@/types"

export function RemindersView() {
  const { reminders, loading, error, fetchReminders } = useReminderStore()

  useEffect(() => {
    fetchReminders()
  }, [fetchReminders])

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

  if (loading) {
    return (
      <div className="flex-1 p-6">
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 p-6">
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchReminders}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Proactive Reminders</h2>
          <p className="text-muted-foreground">Stay on top of important conversations and commitments</p>
        </div>

        <div className="space-y-4">
          {reminders.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">All Caught Up!</h3>
              <p className="text-muted-foreground mb-4">
                You have no pending reminders. Great job staying on top of your commitments!
              </p>
              <Button variant="outline">
                <Clock className="w-4 h-4 mr-2" />
                Set New Reminder
              </Button>
            </Card>
          ) : (
            reminders.map((reminder) => {
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

                      <p className="text-sm text-muted-foreground mb-3">{reminder.context}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {reminder.timestamp}
                          </span>
                          {reminder.sender && (
                            <span className="flex items-center gap-1">
                              <span>From: {reminder.sender}</span>
                            </span>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Mark Complete
                          </Button>
                          <Button size="sm" variant="outline">
                            <Clock className="w-3 h-3 mr-1" />
                            Snooze
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
