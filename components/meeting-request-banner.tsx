"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Lightbulb, X, HelpCircle, MapPin, Video, Phone, Check, Plus, Loader2, Star, ExternalLink } from "lucide-react"

interface Participant {
  id: string
  name: string
  email: string
  avatar?: string
  isVip?: boolean
  isContact?: boolean
}

interface TimeSlot {
  id: string
  time: string
  date: string
  availability: "available" | "minor-conflict" | "major-conflict"
  conflictDetails?: string
}

interface MeetingDetails {
  agenda: string
  location: string
  locationType: "room" | "video" | "phone"
  participants: Participant[]
  suggestedTimes: TimeSlot[]
}

interface MeetingRequestBannerProps {
  meetingDetails: MeetingDetails
  onDismiss: () => void
  onSchedule: (timeSlotId: string) => void
}

export function MeetingRequestBanner({ meetingDetails, onDismiss, onSchedule }: MeetingRequestBannerProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)
  const [isScheduling, setIsScheduling] = useState(false)
  const [isScheduled, setIsScheduled] = useState(false)
  const [showTasks, setShowTasks] = useState(false)

  const handleExpand = () => {
    if (!isScheduled) {
      setIsExpanded(true)
    }
  }

  const handleSchedule = async () => {
    if (!selectedTimeSlot) return

    setIsScheduling(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsScheduling(false)
    setIsScheduled(true)
    setShowTasks(true)

    // Collapse after scheduling
    setTimeout(() => {
      setIsExpanded(false)
    }, 2000)

    onSchedule(selectedTimeSlot)
  }

  const getAvailabilityColor = (availability: TimeSlot["availability"]) => {
    switch (availability) {
      case "available":
        return "bg-green-500"
      case "minor-conflict":
        return "bg-yellow-500"
      case "major-conflict":
        return "bg-red-500"
      default:
        return "bg-gray-400"
    }
  }

  const getAvailabilityText = (availability: TimeSlot["availability"]) => {
    switch (availability) {
      case "available":
        return "All participants available"
      case "minor-conflict":
        return "Minor conflict for 1 participant"
      case "major-conflict":
        return "Major conflict detected"
      default:
        return "Unknown availability"
    }
  }

  const getLocationIcon = () => {
    switch (meetingDetails.locationType) {
      case "video":
        return <Video className="w-4 h-4" />
      case "phone":
        return <Phone className="w-4 h-4" />
      default:
        return <MapPin className="w-4 h-4" />
    }
  }

  const selectedTime = meetingDetails.suggestedTimes.find((t) => t.id === selectedTimeSlot)

  if (isScheduled && !isExpanded) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Check className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium text-green-800">
                ✅ Event Scheduled: {meetingDetails.agenda} on {selectedTime?.date} at {selectedTime?.time}
              </p>
              <div className="flex gap-4 mt-2">
                <button className="text-sm text-green-700 hover:text-green-800 underline">View Event</button>
                <button className="text-sm text-green-700 hover:text-green-800 underline">
                  Send Agenda to Participants
                </button>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onDismiss} aria-label="Dismiss confirmation">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {showTasks && (
          <div className="mt-4 pt-4 border-t border-green-200">
            <h4 className="font-medium text-green-800 mb-3">Suggested Next Steps</h4>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="text-green-700 border-green-300 bg-transparent">
                <Plus className="w-3 h-3 mr-1" />
                Create Task: "Prepare Q4 budget slides"
              </Button>
              <Button variant="outline" size="sm" className="text-green-700 border-green-300 bg-transparent">
                <Plus className="w-3 h-3 mr-1" />
                Create Task: "Draft preliminary agenda"
              </Button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg mb-4 overflow-hidden transition-all duration-200 ease-in-out">
      {/* Initial/Collapsed State */}
      <div className="p-4 cursor-pointer hover:bg-blue-100 transition-colors" onClick={handleExpand}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Lightbulb className="w-5 h-5 text-blue-600" />
            <p className="font-medium text-blue-800">
              <strong>AI suggestion:</strong> This email seems to contain a meeting request.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:text-blue-700"
              title="Explains why this was identified as a meeting request"
              onClick={(e) => e.stopPropagation()}
            >
              <HelpCircle className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onDismiss()
              }}
              aria-label="Dismiss suggestion"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Expanded State */}
      {isExpanded && (
        <div className="border-t border-blue-200 p-4 space-y-6">
          {/* Participants Section */}
          <div>
            <h4 className="font-medium text-slate-700 mb-3">Participants</h4>
            <div className="flex items-center gap-2 flex-wrap">
              {meetingDetails.participants.map((participant) => (
                <div key={participant.id} className="relative">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={participant.avatar || "/placeholder.svg"} alt={participant.name} />
                    <AvatarFallback className="text-xs">
                      {participant.isContact ? participant.name.charAt(0) : "+"}
                    </AvatarFallback>
                  </Avatar>
                  {participant.isVip && (
                    <Star className="w-3 h-3 text-yellow-500 absolute -top-1 -right-1 fill-current" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-3">
            <div>
              <span className="font-medium text-slate-700">Agenda: </span>
              <span className="text-slate-600">{meetingDetails.agenda}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-700">Where: </span>
              {getLocationIcon()}
              <span className="text-slate-600">{meetingDetails.location}</span>
            </div>
          </div>

          {/* Suggested Times Section */}
          <div>
            <h4 className="font-medium text-slate-700 mb-3">Suggested Times</h4>
            <div className="space-y-2">
              {meetingDetails.suggestedTimes.map((timeSlot) => (
                <button
                  key={timeSlot.id}
                  onClick={() => setSelectedTimeSlot(timeSlot.id)}
                  className={`w-full p-3 rounded-lg border-2 text-left transition-all hover:bg-slate-50 ${
                    selectedTimeSlot === timeSlot.id ? "border-blue-500 bg-blue-50" : "border-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${getAvailabilityColor(timeSlot.availability)}`}
                        title={getAvailabilityText(timeSlot.availability)}
                      />
                      <div>
                        <p className="font-medium text-slate-800">
                          {timeSlot.date} at {timeSlot.time}
                        </p>
                        <p className="text-sm text-slate-600">{getAvailabilityText(timeSlot.availability)}</p>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm">
                Propose New Time
              </Button>
              <Button variant="ghost" size="sm" className="text-blue-600">
                <ExternalLink className="w-4 h-4 mr-1" />
                View Full Calendar
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-blue-200">
            <Button onClick={handleSchedule} disabled={!selectedTimeSlot || isScheduling} className="flex-1">
              {isScheduling ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Scheduling...
                </>
              ) : (
                "Confirm & Schedule Meeting"
              )}
            </Button>
            <Button variant="ghost">Edit Details</Button>
          </div>
        </div>
      )}
    </div>
  )
}
