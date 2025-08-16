"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Reply, Calendar, CheckSquare, Clock, Archive, HelpCircle, Star, AlertCircle, User, RefreshCw, AlertTriangle, Mail } from "lucide-react"
import { MeetingRequestBanner } from "./meeting-request-banner"
import { useEmailStore } from "@/stores"

interface Email {
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

interface InboxViewProps {
  onThreadSelect: (id: string) => void
}

export function InboxView({ onThreadSelect }: InboxViewProps) {
  const [selectedEmails, setSelectedEmails] = useState<string[]>([])
  const [dismissedBanners, setDismissedBanners] = useState<string[]>([])
  const [focusedEmailIndex, setFocusedEmailIndex] = useState<number>(-1)
  const [isMobile, setIsMobile] = useState(false)
  const emailRefs = useRef<(HTMLDivElement | null)[]>([])

  // Import Zustand store
  const { 
    processedEmails, 
    emailStats, 
    isLoading, 
    error, 
    fetchEmails, 
    getEmailStats 
  } = useEmailStore()

  // Fetch data on component mount
  useEffect(() => {
    fetchEmails()
    getEmailStats()
  }, [fetchEmails, getEmailStats])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return
      }

      const currentEmails = emails // Use transformed emails

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault()
          setFocusedEmailIndex((prev) => (prev < currentEmails.length - 1 ? prev + 1 : prev))
          break
        case "ArrowUp":
          event.preventDefault()
          setFocusedEmailIndex((prev) => (prev > 0 ? prev - 1 : prev))
          break
        case "Enter":
          if (focusedEmailIndex >= 0 && focusedEmailIndex < currentEmails.length) {
            event.preventDefault()
            onThreadSelect(currentEmails[focusedEmailIndex].id)
          }
          break
        case " ":
          if (focusedEmailIndex >= 0 && focusedEmailIndex < currentEmails.length) {
            event.preventDefault()
            toggleEmailSelection(currentEmails[focusedEmailIndex].id)
          }
          break
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [focusedEmailIndex, onThreadSelect, processedEmails])

  useEffect(() => {
    if (focusedEmailIndex >= 0 && emailRefs.current[focusedEmailIndex]) {
      emailRefs.current[focusedEmailIndex]?.focus()
    }
  }, [focusedEmailIndex])

  // Transform API data to match component interface
  const emails: Email[] = (processedEmails || []).map((email, index) => ({
    id: email.email_id || `email-${index}`,
    sender: email.classification?.sender_importance === "high" ? "VIP Contact" : "Unknown Sender",
    subject: email.summary?.brief_summary || "No Subject",
    summary: email.summary?.brief_summary || "No content available",
    isVip: email.classification?.sender_importance === "high",
    urgency: (email.classification?.urgency as "high" | "medium" | "low") || "medium",
    hasAttachment: false, // Not available in API response
    timestamp: new Date().toLocaleString(), // Not available in API response
    category: (email.classification?.category as "urgent" | "respond" | "fyi" | "meeting") || "fyi",
    hasMeetingRequest: email.intent?.primary_intent === "meeting_request",
  }))

  // Error handling with fallback UI
  if (error) {
    return (
      <div className="flex-1 p-6">
        <div className="flex items-center justify-center h-full">
          <Card className="p-8 text-center max-w-md">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Failed to Load Emails</h3>
            <p className="text-gray-600 mb-4">
              {typeof error === 'string' ? error : "Unable to fetch emails from the server. Please check your connection and try again."}
            </p>
            <Button onClick={() => fetchEmails()} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </Card>
        </div>
      </div>
    )
  }

  // Loading state
  if (isLoading && (!processedEmails || processedEmails.length === 0)) {
    return (
      <div className="flex-1 p-6">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading emails...</p>
          </div>
        </div>
      </div>
    )
  }

  // Empty state
  if (!isLoading && (!processedEmails || processedEmails.length === 0)) {
    return (
      <div className="flex-1 p-6">
        <div className="flex items-center justify-center h-full">
          <Card className="p-8 text-center max-w-md">
            <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Emails Found</h3>
            <p className="text-gray-600 mb-4">
              Your inbox appears to be empty. New emails will appear here once they're processed.
            </p>
            <Button onClick={() => fetchEmails()} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </Card>
        </div>
      </div>
    )
  }

  const getMeetingDetails = (emailId: string) => {
    const meetingDetailsMap: Record<string, any> = {
      "1": {
        agenda: "Discuss Q4 marketing budget and resource allocation",
        location: "Conference Room B",
        locationType: "room",
        participants: [
          { id: "1", name: "Sarah Johnson", email: "sarah@company.com", isVip: true, isContact: true },
          { id: "2", name: "Mike Davis", email: "mike@company.com", isVip: false, isContact: true },
          { id: "3", name: "External Consultant", email: "consultant@external.com", isVip: false, isContact: false },
        ],
        suggestedTimes: [
          { id: "1", time: "2:30 PM", date: "Aug 21", availability: "available" },
          {
            id: "2",
            time: "10:00 AM",
            date: "Aug 22",
            availability: "minor-conflict",
            conflictDetails: "Mike has a brief overlap",
          },
          { id: "3", time: "3:00 PM", date: "Aug 22", availability: "available" },
          {
            id: "4",
            time: "9:00 AM",
            date: "Aug 23",
            availability: "major-conflict",
            conflictDetails: "Sarah unavailable",
          },
        ],
      },
      "4": {
        agenda: "Weekly team standup and sprint planning discussion",
        location: "Google Meet",
        locationType: "video",
        participants: [
          { id: "1", name: "David Wilson", email: "david@company.com", isVip: false, isContact: true },
          { id: "2", name: "Team Lead", email: "lead@company.com", isVip: true, isContact: true },
          { id: "3", name: "Developer 1", email: "dev1@company.com", isVip: false, isContact: true },
          { id: "4", name: "Developer 2", email: "dev2@company.com", isVip: false, isContact: true },
        ],
        suggestedTimes: [
          { id: "1", time: "9:00 AM", date: "Aug 23", availability: "available" },
          { id: "2", time: "2:00 PM", date: "Aug 23", availability: "available" },
          {
            id: "3",
            time: "10:00 AM",
            date: "Aug 24",
            availability: "minor-conflict",
            conflictDetails: "One team member has overlap",
          },
        ],
      },
    }
    return meetingDetailsMap[emailId]
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "text-red-500"
      case "medium":
        return "text-yellow-500"
      case "low":
        return "text-green-500"
      default:
        return "text-muted-foreground"
    }
  }

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case "high":
        return AlertCircle
      case "medium":
        return Clock
      case "low":
        return CheckSquare
      default:
        return Clock
    }
  }

  const toggleEmailSelection = (emailId: string) => {
    setSelectedEmails((prev) => (prev.includes(emailId) ? prev.filter((id) => id !== emailId) : [...prev, emailId]))
  }

  const handleDismissBanner = (emailId: string) => {
    setDismissedBanners((prev) => [...prev, emailId])
  }

  const handleScheduleMeeting = (emailId: string, timeSlotId: string) => {
    console.log(`Scheduling meeting for email ${emailId} at time slot ${timeSlotId}`)
    // Here you would typically make an API call to schedule the meeting
  }

  const EmailCard = ({ email, index }: { email: Email; index: number }) => {
    const UrgencyIcon = getUrgencyIcon(email.urgency)
    const showMeetingBanner = email.hasMeetingRequest && !dismissedBanners.includes(email.id)
    const meetingDetails = getMeetingDetails(email.id)
    const isSelected = selectedEmails.includes(email.id)
    const isFocused = focusedEmailIndex === index

    return (
      <Card
                        ref={(el) => {
                  emailRefs.current[index] = el
                }}
        className={`
          ${isMobile ? "p-3" : "p-4"} 
          transition-all duration-200 cursor-pointer focus-ring
          ${isFocused ? "ring-2 ring-ring ring-offset-2" : ""}
          ${isSelected ? "bg-accent/70" : "hover:bg-accent/50"}
          ${isMobile ? "touch-manipulation" : ""}
        `}
        tabIndex={0}
        role="article"
        aria-label={`Email from ${email.sender}: ${email.subject}`}
        aria-selected={isSelected}
        aria-describedby={`email-${email.id}-details`}
        onFocus={() => setFocusedEmailIndex(index)}
        onClick={() => onThreadSelect(email.id)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            if (e.key === "Enter") {
              onThreadSelect(email.id)
            } else {
              toggleEmailSelection(email.id)
            }
          }
        }}
      >
        {showMeetingBanner && meetingDetails && (
          <div role="region" aria-label="Meeting request detected" className="mb-3">
            <MeetingRequestBanner
              meetingDetails={meetingDetails}
              onDismiss={() => handleDismissBanner(email.id)}
              onSchedule={(timeSlotId) => handleScheduleMeeting(email.id, timeSlotId)}
            />
          </div>
        )}

        <div className={`flex items-start gap-3 ${isMobile ? "gap-2" : "gap-3"}`}>
          <div className={`${isMobile ? "mt-0.5" : "mt-1"}`}>
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => toggleEmailSelection(email.id)}
              className={`${isMobile ? "w-5 h-5" : ""} focus-ring`}
              aria-label={`Select email from ${email.sender}`}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className={`flex items-center gap-2 mb-2 ${isMobile ? "flex-wrap" : ""}`}>
              <div className="flex items-center gap-2 min-w-0 flex-1">
                {email.isVip && (
                  <Star className="w-4 h-4 text-yellow-500 fill-current flex-shrink-0" aria-label="VIP sender" />
                )}
                <User className="w-4 h-4 text-muted-foreground flex-shrink-0" aria-hidden="true" />
                <span className="font-medium text-foreground truncate">{email.sender}</span>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <UrgencyIcon
                  className={`w-4 h-4 ${getUrgencyColor(email.urgency)}`}
                  aria-label={`${email.urgency} priority`}
                />
                <time
                  className={`text-sm text-muted-foreground ${isMobile ? "text-xs" : ""}`}
                  dateTime={email.timestamp}
                >
                  {email.timestamp}
                </time>
              </div>
            </div>

            <h3
              className={`font-semibold text-foreground mb-2 cursor-pointer hover:text-primary ${isMobile ? "text-base" : ""}`}
            >
              {email.subject}
            </h3>

            <p
              id={`email-${email.id}-details`}
              className={`text-sm text-muted-foreground mb-3 line-clamp-2 ${isMobile ? "text-sm" : ""}`}
            >
              {email.summary}
            </p>

            <div className={`flex items-center justify-between ${isMobile ? "flex-col gap-3" : ""}`}>
              <div
                className={`flex gap-2 ${isMobile ? "w-full grid grid-cols-2 gap-2" : ""}`}
                role="group"
                aria-label="Email actions"
              >
                <Button
                  size="sm"
                  variant="outline"
                  className={`${isMobile ? "h-9 px-4 text-sm" : "h-8 px-3"} bg-transparent focus-ring`}
                  aria-label={`Reply to ${email.sender}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    console.log(`Replying to email ${email.id}`)
                    // Handle reply functionality
                  }}
                >
                  <Reply className={`${isMobile ? "w-4 h-4 mr-2" : "w-3 h-3 mr-1"}`} aria-hidden="true" />
                  Reply
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  className={`${isMobile ? "h-9 px-4 text-sm" : "h-8 px-3"} bg-transparent focus-ring`}
                  aria-label="Schedule meeting"
                  onClick={(e) => {
                    e.stopPropagation()
                    console.log(`Scheduling meeting for email ${email.id}`)
                    // Handle schedule functionality
                  }}
                >
                  <Calendar className={`${isMobile ? "w-4 h-4 mr-2" : "w-3 h-3 mr-1"}`} aria-hidden="true" />
                  Schedule
                </Button>

                {isMobile && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-9 px-4 text-sm bg-transparent focus-ring"
                      aria-label="Create task"
                      onClick={(e) => {
                        e.stopPropagation()
                        console.log(`Creating task for email ${email.id}`)
                        // Handle task creation
                      }}
                    >
                      <CheckSquare className="w-4 h-4 mr-2" aria-hidden="true" />
                      Task
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-9 px-4 text-sm bg-transparent focus-ring"
                      aria-label="Snooze email"
                      onClick={(e) => {
                        e.stopPropagation()
                        console.log(`Snoozing email ${email.id}`)
                        // Handle snooze functionality
                      }}
                    >
                      <Clock className="w-4 h-4 mr-2" aria-hidden="true" />
                      Snooze
                    </Button>
                  </>
                )}

                {!isMobile && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 px-3 bg-transparent focus-ring"
                      aria-label="Create task"
                      onClick={(e) => {
                        e.stopPropagation()
                        console.log(`Creating task for email ${email.id}`)
                        // Handle task creation
                      }}
                    >
                      <CheckSquare className="w-3 h-3 mr-1" aria-hidden="true" />
                      Task
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 px-3 bg-transparent focus-ring"
                      aria-label="Snooze email"
                      onClick={(e) => {
                        e.stopPropagation()
                        console.log(`Snoozing email ${email.id}`)
                        // Handle snooze functionality
                      }}
                    >
                      <Clock className="w-3 h-3 mr-1" aria-hidden="true" />
                      Snooze
                    </Button>
                  </>
                )}
              </div>

              {!isMobile && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 focus-ring flex-shrink-0"
                  aria-label="More options"
                  onClick={(e) => {
                    e.stopPropagation()
                    console.log(`More options for email ${email.id}`)
                    // Handle more options
                  }}
                >
                  <HelpCircle className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    )
  }

  const filterEmailsByCategory = (category: string) => {
    return emails.filter((email) => email.category === category)
  }

  return (
    <div className={`flex-1 ${isMobile ? "p-3" : "p-6"} flex flex-col h-full`}>
      <div className="mb-4 md:mb-6 flex-shrink-0">
        <div className={`flex items-center justify-between mb-4 ${isMobile ? "flex-col gap-3" : ""}`}>
          <h2 className={`${isMobile ? "text-lg" : "text-xl"} font-semibold`}>Intelligent Inbox</h2>
          {selectedEmails.length > 0 && (
            <div
              className={`flex gap-2 ${isMobile ? "w-full justify-center" : ""}`}
              role="group"
              aria-label="Bulk actions"
            >
              <Button
                variant="outline"
                size="sm"
                className={`focus-ring bg-transparent ${isMobile ? "flex-1" : ""}`}
                aria-label={`Archive ${selectedEmails.length} selected emails`}
                onClick={() => {
                  console.log(`Archiving ${selectedEmails.length} emails`)
                  // Handle bulk archive
                }}
              >
                <Archive className="w-4 h-4 mr-2" aria-hidden="true" />
                Archive ({selectedEmails.length})
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={`focus-ring bg-transparent ${isMobile ? "flex-1" : ""}`}
                aria-label={`Mark ${selectedEmails.length} emails as read`}
                onClick={() => {
                  console.log(`Marking ${selectedEmails.length} emails as read`)
                  // Handle mark as read
                }}
              >
                Mark as Read
              </Button>
            </div>
          )}
        </div>

        <Tabs defaultValue="urgent" className="w-full h-full flex flex-col">
          <TabsList
            className={`grid w-full grid-cols-4 flex-shrink-0 ${isMobile ? "h-12" : ""}`}
            role="tablist"
            aria-label="Email categories"
          >
            <TabsTrigger
              value="urgent"
              className={`flex items-center gap-2 focus-ring ${isMobile ? "flex-col gap-1 text-xs px-2" : ""}`}
              role="tab"
              aria-controls="urgent-panel"
            >
              <AlertCircle className={`${isMobile ? "w-4 h-4" : "w-4 h-4"}`} aria-hidden="true" />
              <span className={isMobile ? "hidden sm:inline" : ""}>Urgent</span>
              <Badge
                variant="destructive"
                className={`${isMobile ? "text-xs px-1 py-0" : "ml-1"}`}
                aria-label={`${filterEmailsByCategory("urgent").length} urgent emails`}
              >
                {filterEmailsByCategory("urgent").length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="respond"
              className={`flex items-center gap-2 focus-ring ${isMobile ? "flex-col gap-1 text-xs px-2" : ""}`}
              role="tab"
              aria-controls="respond-panel"
            >
              <Reply className={`${isMobile ? "w-4 h-4" : "w-4 h-4"}`} aria-hidden="true" />
              <span className={isMobile ? "hidden sm:inline" : ""}>Respond</span>
              <Badge
                variant="secondary"
                className={`${isMobile ? "text-xs px-1 py-0" : "ml-1"}`}
                aria-label={`${filterEmailsByCategory("respond").length} emails to respond to`}
              >
                {filterEmailsByCategory("respond").length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="fyi"
              className={`flex items-center gap-2 focus-ring ${isMobile ? "flex-col gap-1 text-xs px-2" : ""}`}
              role="tab"
              aria-controls="fyi-panel"
            >
              <CheckSquare className={`${isMobile ? "w-4 h-4" : "w-4 h-4"}`} aria-hidden="true" />
              <span className={isMobile ? "hidden sm:inline" : ""}>FYI</span>
              <Badge
                variant="secondary"
                className={`${isMobile ? "text-xs px-1 py-0" : "ml-1"}`}
                aria-label={`${filterEmailsByCategory("fyi").length} FYI emails`}
              >
                {filterEmailsByCategory("fyi").length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="meeting"
              className={`flex items-center gap-2 focus-ring ${isMobile ? "flex-col gap-1 text-xs px-2" : ""}`}
              role="tab"
              aria-controls="meeting-panel"
            >
              <Calendar className={`${isMobile ? "w-4 h-4" : "w-4 h-4"}`} aria-hidden="true" />
              <span className={isMobile ? "hidden sm:inline" : ""}>Meeting</span>
              <Badge
                variant="secondary"
                className={`${isMobile ? "text-xs px-1 py-0" : "ml-1"}`}
                aria-label={`${filterEmailsByCategory("meeting").length} meeting requests`}
              >
                {filterEmailsByCategory("meeting").length}
              </Badge>
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="urgent"
            className={`${isMobile ? "space-y-3" : "space-y-4"} overflow-y-auto h-full pb-4`}
            role="tabpanel"
            id="urgent-panel"
            aria-labelledby="urgent-tab"
          >
            <div role="list" aria-label="Urgent emails">
              {filterEmailsByCategory("urgent").map((email, index) => (
                <div key={email.id} role="listitem">
                  <EmailCard email={email} index={index} />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent
            value="respond"
            className={`${isMobile ? "space-y-3" : "space-y-4"} overflow-y-auto h-full pb-4`}
            role="tabpanel"
            id="respond-panel"
            aria-labelledby="respond-tab"
          >
            <div role="list" aria-label="Emails to respond to">
              {filterEmailsByCategory("respond").map((email, index) => (
                <div key={email.id} role="listitem">
                  <EmailCard email={email} index={index} />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent
            value="fyi"
            className={`${isMobile ? "space-y-3" : "space-y-4"} overflow-y-auto h-full pb-4`}
            role="tabpanel"
            id="fyi-panel"
            aria-labelledby="fyi-tab"
          >
            <div role="list" aria-label="FYI emails">
              {filterEmailsByCategory("fyi").map((email, index) => (
                <div key={email.id} role="listitem">
                  <EmailCard email={email} index={index} />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent
            value="meeting"
            className={`${isMobile ? "space-y-3" : "space-y-4"} overflow-y-auto h-full pb-4`}
            role="tabpanel"
            id="meeting-panel"
            aria-labelledby="meeting-tab"
          >
            <div role="list" aria-label="Meeting requests">
              {filterEmailsByCategory("meeting").map((email, index) => (
                <div key={email.id} role="listitem">
                  <EmailCard email={email} index={index} />
                </div>
              ))}
              {filterEmailsByCategory("meeting").length === 0 && (
                <div
                  className={`text-center ${isMobile ? "py-6" : "py-8"} text-muted-foreground`}
                  role="status"
                  aria-live="polite"
                >
                  No meeting requests at the moment
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}