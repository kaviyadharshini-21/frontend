"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Plus,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { useMeetingStore } from "@/stores/meetingStore"

interface CalendarEvent {
  id: string
  title: string
  startTime: string
  endTime: string
  date: string
  type: "meeting" | "reminder"
  participants?: string[]
  location?: string
  description?: string
  status: "confirmed" | "pending" | "cancelled"
  linkedEmailId?: string
  isAIGenerated?: boolean
}

interface MeetingRequest {
  id: string
  emailId: string
  sender: string
  subject: string
  detectedInfo: {
    participants: string[]
    suggestedTimes: string[]
    location?: string
    agenda?: string
  }
  conflicts: string[]
  status: "pending" | "scheduled" | "declined"
}

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const { meetings, loading, error, fetchMeetings } = useMeetingStore()

  useEffect(() => {
    fetchMeetings()
  }, [fetchMeetings])

  // Convert meetings to calendar events format
  const calendarEvents: CalendarEvent[] = meetings.map((meeting) => ({
    id: meeting.id,
    title: meeting.title,
    startTime: meeting.startTime,
    endTime: meeting.endTime,
    date: meeting.startTime.split('T')[0], // Extract date from ISO string
    type: "meeting",
    participants: meeting.participants,
    location: meeting.description, // Using description as location for now
    description: meeting.description,
    status: meeting.status === "scheduled" ? "confirmed" : meeting.status === "completed" ? "confirmed" : "cancelled",
  }))

  const mockMeetingRequests: MeetingRequest[] = [
    {
      id: "1",
      emailId: "email-3",
      sender: "Alex Chen",
      subject: "Project Timeline Discussion",
      detectedInfo: {
        participants: ["Alex Chen", "Development Team", "You"],
        suggestedTimes: ["Tomorrow 2:00 PM", "Thursday 10:00 AM", "Friday 3:00 PM"],
        location: "Conference Room B",
        agenda: "Discuss potential delays in mobile app development timeline",
      },
      conflicts: ["Conflicts with Budget Review Meeting"],
      status: "pending",
    },
  ]

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const getEventsForDate = (date: string) => {
    return calendarEvents.filter((event) => event.date === date)
  }

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  }

  const handleScheduleMeeting = (requestId: string, timeSlot: string) => {
    // In a real app, this would create the calendar event
    console.log(`Scheduling meeting ${requestId} for ${timeSlot}`)
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
          <Button onClick={fetchMeetings}>Retry</Button>
        </div>
      </div>
    )
  }

  const CalendarGrid = () => {
    const days = getDaysInMonth(currentDate)

    return (
      <div className="grid grid-cols-7 gap-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
        {days.map((day, index) => {
          if (!day) {
            return <div key={index} className="p-2" />
          }

          const dateString = formatDate(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            day
          )
          const events = getEventsForDate(dateString)
          const isToday = dateString === new Date().toISOString().split("T")[0]
          const isSelected = selectedDate === dateString

          return (
            <div
              key={index}
              className={`p-2 min-h-[80px] border border-border cursor-pointer hover:bg-muted/50 ${
                isToday ? "bg-primary/10 border-primary" : ""
              } ${isSelected ? "bg-muted border-primary" : ""}`}
              onClick={() => setSelectedDate(dateString)}
            >
              <div className="text-sm font-medium mb-1">{day}</div>
              <div className="space-y-1">
                {events.slice(0, 2).map((event) => (
                  <div
                    key={event.id}
                    className="text-xs p-1 rounded bg-blue-100 text-blue-800 truncate"
                  >
                    {event.title}
                  </div>
                ))}
                {events.length > 2 && (
                  <div className="text-xs text-muted-foreground">
                    +{events.length - 2} more
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="flex-1 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Calendar & Meetings</h2>
          <p className="text-muted-foreground">Manage your schedule and meeting requests</p>
        </div>

        <Tabs defaultValue="calendar" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calendar">
              <Calendar className="w-4 h-4 mr-2" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="requests">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Meeting Requests
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-6 mt-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentDate(
                        new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
                      )
                    }
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <h3 className="text-lg font-semibold">
                    {currentDate.toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentDate(
                        new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
                      )
                    }
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Event
                </Button>
              </div>

              <CalendarGrid />
            </Card>

            {selectedDate && (
              <Card className="p-6">
                <h4 className="font-semibold mb-4">
                  Events for {new Date(selectedDate).toLocaleDateString()}
                </h4>
                <div className="space-y-3">
                  {getEventsForDate(selectedDate).map((event) => (
                    <div key={event.id} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div className="w-3 h-3 bg-blue-500 rounded-full" />
                      <div className="flex-1">
                        <div className="font-medium">{event.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {event.startTime} - {event.endTime}
                        </div>
                      </div>
                      <Badge
                        variant={
                          event.status === "confirmed"
                            ? "default"
                            : event.status === "pending"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {event.status}
                      </Badge>
                    </div>
                  ))}
                  {getEventsForDate(selectedDate).length === 0 && (
                    <p className="text-muted-foreground text-center py-4">
                      No events scheduled for this date
                    </p>
                  )}
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="requests" className="space-y-6 mt-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Meeting Requests</h3>
                <Badge variant="secondary">{mockMeetingRequests.length}</Badge>
              </div>

              <div className="space-y-4">
                {mockMeetingRequests.map((request) => (
                  <Card key={request.id} className="p-4 border-l-4 border-l-orange-500">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold mb-1">{request.subject}</h4>
                        <p className="text-sm text-muted-foreground">
                          From: {request.sender}
                        </p>
                      </div>
                      <Badge
                        variant={request.status === "pending" ? "secondary" : "default"}
                      >
                        {request.status}
                      </Badge>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h5 className="font-medium mb-2">Participants</h5>
                        <div className="flex flex-wrap gap-1">
                          {request.detectedInfo.participants.map((participant, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {participant}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium mb-2">Suggested Times</h5>
                        <div className="space-y-1">
                          {request.detectedInfo.suggestedTimes.map((time, index) => (
                            <Button
                              key={index}
                              size="sm"
                              variant="outline"
                              onClick={() => handleScheduleMeeting(request.id, time)}
                            >
                              {time}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {request.detectedInfo.agenda && (
                      <div className="mb-4">
                        <h5 className="font-medium mb-2">Agenda</h5>
                        <p className="text-sm text-muted-foreground">
                          {request.detectedInfo.agenda}
                        </p>
                      </div>
                    )}

                    {request.conflicts.length > 0 && (
                      <div className="mb-4">
                        <h5 className="font-medium mb-2 text-red-600">Conflicts</h5>
                        <ul className="text-sm text-red-600">
                          {request.conflicts.map((conflict, index) => (
                            <li key={index}>• {conflict}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button size="sm">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Accept
                      </Button>
                      <Button size="sm" variant="outline">
                        <XCircle className="w-4 h-4 mr-2" />
                        Decline
                      </Button>
                      <Button size="sm" variant="outline">
                        <Clock className="w-4 h-4 mr-2" />
                        Propose Alternative
                      </Button>
                    </div>
                  </Card>
                ))}

                {mockMeetingRequests.length === 0 && (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h4 className="font-semibold mb-2">No Meeting Requests</h4>
                    <p className="text-muted-foreground">
                      You have no pending meeting requests at the moment.
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
