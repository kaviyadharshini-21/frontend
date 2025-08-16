"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  Plus,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  Mail,
  Video,
  Phone,
  RefreshCw,
} from "lucide-react"
import { useCalendarStore } from "@/stores"

interface CalendarEvent {
  id: string
  title: string
  startTime: string
  endTime: string
  date: string
  type: "meeting" | "reminder" | "deadline"
  participants?: string[]
  location?: string
  description?: string
  status: "confirmed" | "pending" | "conflict"
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

  // Import Zustand store
  const { 
    events, 
    todayEvents, 
    upcomingEvents, 
    freeTimeSlots, 
    isLoading, 
    error, 
    listEvents, 
    getTodayEvents, 
    getUpcomingEvents 
  } = useCalendarStore()

  // Fetch data on component mount
  useEffect(() => {
    listEvents()
    getTodayEvents()
    getUpcomingEvents()
  }, [listEvents, getTodayEvents, getUpcomingEvents])

  // Transform API data to match component interface
  const calendarEvents: CalendarEvent[] = (events || []).map((event, index) => ({
    id: event.id || `event-${index}`,
    title: event.summary || "Untitled Event",
    startTime: event.start_time ? new Date(event.start_time).toLocaleTimeString() : "Unknown",
    endTime: event.end_time ? new Date(event.end_time).toLocaleTimeString() : "Unknown",
    date: event.start_time ? new Date(event.start_time).toLocaleDateString() : "Unknown",
    type: "meeting" as const,
    participants: event.attendees || [],
    location: event.location || undefined,
    description: event.description || undefined,
    status: event.status === "confirmed" ? "confirmed" : "pending",
    linkedEmailId: undefined, // Not available in API response
    isAIGenerated: false, // Not available in API response
  }))

  // Error handling with fallback UI
  if (error) {
    return (
      <div className="flex-1 p-6">
        <div className="flex items-center justify-center h-full">
          <Card className="p-8 text-center max-w-md">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Failed to Load Calendar</h3>
            <p className="text-gray-600 mb-4">
              {typeof error === 'string' ? error : "Unable to fetch calendar events from the server. Please check your connection and try again."}
            </p>
            <Button onClick={() => listEvents()} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </Card>
        </div>
      </div>
    )
  }

  // Loading state
  if (isLoading && (!events || events.length === 0)) {
    return (
      <div className="flex-1 p-6">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading calendar events...</p>
          </div>
        </div>
      </div>
    )
  }

  // Empty state
  if (!isLoading && (!events || events.length === 0)) {
    return (
      <div className="flex-1 p-6">
        <div className="flex items-center justify-center h-full">
          <Card className="p-8 text-center max-w-md">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Calendar Events</h3>
            <p className="text-gray-600 mb-4">
              Your calendar appears to be empty. New events will appear here once they're created.
            </p>
            <Button onClick={() => listEvents()} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </Card>
        </div>
      </div>
    )
  }

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

  const CalendarGrid = () => {
    const days = getDaysInMonth(currentDate)
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    return (
      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {days.map((day, index) => {
          if (!day) {
            return <div key={`empty-${index}`} className="p-2 h-24"></div>
          }

          const dateString = formatDate(year, month, day)
          const events = getEventsForDate(dateString)
          const isToday = dateString === new Date().toISOString().split("T")[0]
          const isSelected = dateString === selectedDate

          return (
            <div
              key={dateString}
              className={`p-2 h-24 border border-border cursor-pointer hover:bg-accent/50 ${
                isToday ? "bg-primary/10 border-primary" : ""
              } ${isSelected ? "bg-accent" : ""}`}
              onClick={() => setSelectedDate(dateString)}
            >
              <div className={`text-sm font-medium mb-1 ${isToday ? "text-primary" : ""}`}>{day}</div>
              <div className="space-y-1">
                {events.slice(0, 2).map((event) => (
                  <div
                    key={event.id}
                    className={`text-xs p-1 rounded truncate ${
                      event.status === "conflict"
                        ? "bg-red-100 text-red-800"
                        : event.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {event.startTime} {event.title}
                  </div>
                ))}
                {events.length > 2 && <div className="text-xs text-muted-foreground">+{events.length - 2} more</div>}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const MeetingRequestCard = ({ request }: { request: MeetingRequest }) => (
    <Card className="p-4 border-orange-200 bg-orange-50">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-orange-100 rounded-full">
          <Mail className="w-4 h-4 text-orange-600" />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
              Meeting Request Detected
            </Badge>
          </div>

          <h3 className="font-semibold mb-1">{request.subject}</h3>
          <p className="text-sm text-muted-foreground mb-3">From: {request.sender}</p>

          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium mb-1">AI Extracted Details:</h4>
              <div className="text-sm space-y-1">
                <div className="flex items-center gap-2">
                  <Users className="w-3 h-3" />
                  <span>{request.detectedInfo.participants.join(", ")}</span>
                </div>
                {request.detectedInfo.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3" />
                    <span>{request.detectedInfo.location}</span>
                  </div>
                )}
                {request.detectedInfo.agenda && (
                  <div className="flex items-start gap-2">
                    <Calendar className="w-3 h-3 mt-0.5" />
                    <span>{request.detectedInfo.agenda}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Suggested Time Slots:</h4>
              <div className="space-y-2">
                {request.detectedInfo.suggestedTimes.map((time, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-background rounded border">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      <span className="text-sm">{time}</span>
                      {request.conflicts.length > 0 && index === 0 && (
                        <Badge variant="destructive" className="text-xs">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Conflict
                        </Badge>
                      )}
                      {index > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Available
                        </Badge>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant={index === 0 && request.conflicts.length > 0 ? "outline" : "default"}
                      onClick={() => handleScheduleMeeting(request.id, time)}
                    >
                      Schedule
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {request.conflicts.length > 0 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium text-red-800">Scheduling Conflicts Detected</span>
                </div>
                <ul className="text-sm text-red-700">
                  {request.conflicts.map((conflict, index) => (
                    <li key={index}>• {conflict}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )

  return (
    <div className="flex-1 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">AI-Powered Calendar</h2>
        <p className="text-muted-foreground">Intelligent scheduling with automatic meeting detection</p>
      </div>

      <Tabs defaultValue="calendar" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calendar">
            <Calendar className="w-4 h-4 mr-2" />
            Calendar View
          </TabsTrigger>
          <TabsTrigger value="requests">
            <Mail className="w-4 h-4 mr-2" />
            Meeting Requests
            <Badge variant="secondary" className="ml-2">
              {/* This badge will need to be updated to reflect actual meeting requests */}
              {/* For now, it's a placeholder based on mock data */}
              {calendarEvents.filter(event => event.type === "meeting").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="upcoming">
            <Clock className="w-4 h-4 mr-2" />
            Upcoming Events
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="mt-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <h3 className="text-lg font-semibold">
                  {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Event
              </Button>
            </div>

            <CalendarGrid />
          </Card>

          {selectedDate && (
            <Card className="p-6 mt-6">
              <h3 className="font-semibold mb-4">
                Events for{" "}
                {new Date(selectedDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h3>

              <div className="space-y-3">
                {getEventsForDate(selectedDate).map((event) => (
                  <div key={event.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        event.status === "conflict"
                          ? "bg-red-500"
                          : event.status === "pending"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                      }`}
                    />

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{event.title}</span>
                        {/* This badge will need to be updated to reflect actual AI generation */}
                        {/* For now, it's a placeholder based on mock data */}
                        {calendarEvents.find(e => e.id === event.id)?.isAIGenerated && (
                          <Badge variant="secondary" className="text-xs">
                            AI Generated
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {event.startTime} - {event.endTime}
                        {event.location && ` • ${event.location}`}
                        {event.participants && ` • ${event.participants.length} participants`}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {event.type === "meeting" && (
                        <>
                          <Button size="sm" variant="outline">
                            <Video className="w-3 h-3 mr-1" />
                            Join
                          </Button>
                          <Button size="sm" variant="outline">
                            <Phone className="w-3 h-3 mr-1" />
                            Call
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}

                {getEventsForDate(selectedDate).length === 0 && (
                  <p className="text-muted-foreground text-center py-4">No events scheduled for this day</p>
                )}
              </div>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="requests" className="mt-6 space-y-4">
          {/* This section will need to be updated to use actual meeting requests */}
          {/* For now, it's a placeholder based on mock data */}
          {calendarEvents.filter(event => event.type === "meeting").map((event) => (
            <MeetingRequestCard key={event.id} request={{
              id: event.id,
              emailId: "email-placeholder",
              sender: "AI Assistant",
              subject: event.title,
              detectedInfo: {
                participants: event.participants || [],
                suggestedTimes: ["10:00 AM", "11:00 AM", "12:00 PM"],
                location: event.location,
                agenda: "Meeting agenda placeholder",
              },
              conflicts: ["Conflicts with existing meeting"],
              status: "pending",
            }} />
          ))}

          {calendarEvents.filter(event => event.type === "meeting").length === 0 && (
            <Card className="p-8 text-center">
              <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No pending meeting requests</h3>
              <p className="text-muted-foreground">AI will automatically detect meeting requests in your emails</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="mt-6">
                      <div className="space-y-4">
              {Object.entries(upcomingEvents?.events_by_day || {})
                .flatMap(([date, events]) => events)
                .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
                .map((event) => (
                <Card key={event.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Calendar className="w-4 h-4 text-primary" />
                    </div>

                    <div className="flex-1">
                                              <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{event.summary}</h3>
                          {/* This badge will need to be updated to reflect actual AI generation */}
                          {/* For now, it's a placeholder based on mock data */}
                          {calendarEvents.find(e => e.id === event.id)?.isAIGenerated && <Badge variant="secondary">AI Generated</Badge>}
                        </div>

                        <div className="text-sm text-muted-foreground mb-2">
                          {new Date(event.start_time).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "short",
                            day: "numeric",
                          })}{" "}
                          • {new Date(event.start_time).toLocaleTimeString()} - {new Date(event.end_time).toLocaleTimeString()}
                        </div>

                        {event.description && <p className="text-sm mb-2">{event.description}</p>}

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {event.attendees && (
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              <span>{event.attendees.length} participants</span>
                            </div>
                          )}
                          {event.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span>{event.location}</span>
                            </div>
                          )}
                          {event.link && (
                            <div className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              <span>View Event</span>
                            </div>
                          )}
                        </div>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
