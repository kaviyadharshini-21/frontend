"use client"

import { useState } from "react"
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
} from "lucide-react"

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

  const mockEvents: CalendarEvent[] = [
    {
      id: "1",
      title: "Q4 Budget Review Meeting",
      startTime: "14:00",
      endTime: "15:30",
      date: "2024-01-16",
      type: "meeting",
      participants: ["Sarah Johnson", "Mike Davis", "You"],
      location: "Conference Room A",
      description: "Quarterly budget review and resource allocation discussion",
      status: "confirmed",
      linkedEmailId: "email-1",
      isAIGenerated: true,
    },
    {
      id: "2",
      title: "Client Presentation - Acme Corp",
      startTime: "15:00",
      endTime: "16:00",
      date: "2024-01-17",
      type: "meeting",
      participants: ["Acme Corp Team", "You"],
      location: "Virtual - Zoom",
      status: "confirmed",
    },
    {
      id: "3",
      title: "Follow up: Marketing Campaign",
      startTime: "10:00",
      endTime: "10:30",
      date: "2024-01-18",
      type: "reminder",
      status: "pending",
      linkedEmailId: "email-2",
    },
  ]

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
    return mockEvents.filter((event) => event.date === date)
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
              {mockMeetingRequests.length}
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
                        {event.isAIGenerated && (
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
          {mockMeetingRequests.map((request) => (
            <MeetingRequestCard key={request.id} request={request} />
          ))}

          {mockMeetingRequests.length === 0 && (
            <Card className="p-8 text-center">
              <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No pending meeting requests</h3>
              <p className="text-muted-foreground">AI will automatically detect meeting requests in your emails</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="mt-6">
          <div className="space-y-4">
            {mockEvents
              .filter((event) => new Date(event.date) >= new Date())
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .map((event) => (
                <Card key={event.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Calendar className="w-4 h-4 text-primary" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{event.title}</h3>
                        {event.isAIGenerated && <Badge variant="secondary">AI Generated</Badge>}
                      </div>

                      <div className="text-sm text-muted-foreground mb-2">
                        {new Date(event.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        • {event.startTime} - {event.endTime}
                      </div>

                      {event.description && <p className="text-sm mb-2">{event.description}</p>}

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {event.participants && (
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{event.participants.length} participants</span>
                          </div>
                        )}
                        {event.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{event.location}</span>
                          </div>
                        )}
                        {event.linkedEmailId && (
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            <span>Linked to email</span>
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
