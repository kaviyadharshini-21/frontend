"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  Mail,
  Clock,
  AlertTriangle,
  Calendar,
  Paperclip,
  Star,
  User,
  ChevronRight,
  Search,
  Filter,
  Archive,
  Trash2,
  Reply,
  Forward,
} from "lucide-react"
import { useEmailStore } from "@/stores/emailStore"
import type { Email } from "@/types"

interface InboxViewProps {
  onThreadSelect: (threadId: string) => void
}

export function InboxView({ onThreadSelect }: InboxViewProps) {
  const { inbox, loading, error, fetchInbox } = useEmailStore()
  const [activeTab, setActiveTab] = useState("all")
  const [focusedEmailIndex, setFocusedEmailIndex] = useState(-1)
  const [searchQuery, setSearchQuery] = useState("")
  const emailRefs = useRef<(HTMLDivElement | null)[]>([])

  // Fetch emails on component mount
  useEffect(() => {
    fetchInbox()
  }, [fetchInbox])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setFocusedEmailIndex((prev) =>
          prev < inbox.length - 1 ? prev + 1 : prev
        )
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setFocusedEmailIndex((prev) => (prev > 0 ? prev - 1 : prev))
      } else if (e.key === "Enter" && focusedEmailIndex >= 0) {
        e.preventDefault()
        const email = inbox[focusedEmailIndex]
        if (email) {
          onThreadSelect(email.threadId)
        }
      }
    },
    [focusedEmailIndex, inbox, onThreadSelect]
  )

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  useEffect(() => {
    if (focusedEmailIndex >= 0 && emailRefs.current[focusedEmailIndex]) {
      emailRefs.current[focusedEmailIndex]?.focus()
    }
  }, [focusedEmailIndex])

  // Helper function to determine email category based on content
  const getEmailCategory = (email: Email) => {
    const subject = email.subject.toLowerCase()
    const body = email.body.toLowerCase()
    
    if (subject.includes("urgent") || subject.includes("asap") || body.includes("urgent")) {
      return "urgent"
    }
    if (subject.includes("meeting") || body.includes("meeting") || body.includes("schedule")) {
      return "meeting"
    }
    if (subject.includes("response") || body.includes("please respond") || body.includes("let me know")) {
      return "respond"
    }
    return "fyi"
  }

  // Helper function to determine urgency
  const getEmailUrgency = (email: Email) => {
    const subject = email.subject.toLowerCase()
    const body = email.body.toLowerCase()
    
    if (subject.includes("urgent") || subject.includes("asap") || body.includes("urgent")) {
      return "high"
    }
    if (subject.includes("important") || body.includes("important")) {
      return "medium"
    }
    return "low"
  }

  // Helper function to check if email has meeting request
  const hasMeetingRequest = (email: Email) => {
    const subject = email.subject.toLowerCase()
    const body = email.body.toLowerCase()
    return subject.includes("meeting") || body.includes("meeting") || body.includes("schedule")
  }

  // Helper function to format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 1) {
      return "Just now"
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`
    } else {
      return `${Math.floor(diffInHours / 24)} days ago`
    }
  }

  // Filter emails based on active tab and search query
  const filteredEmails = inbox.filter((email) => {
    const matchesSearch = searchQuery === "" || 
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.from.toLowerCase().includes(searchQuery.toLowerCase())
    
    const category = getEmailCategory(email)
    
    if (activeTab === "all") return matchesSearch
    if (activeTab === "urgent") return matchesSearch && category === "urgent"
    if (activeTab === "respond") return matchesSearch && category === "respond"
    if (activeTab === "fyi") return matchesSearch && category === "fyi"
    if (activeTab === "meeting") return matchesSearch && category === "meeting"
    
    return matchesSearch
  })

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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "urgent":
        return AlertTriangle
      case "respond":
        return Reply
      case "fyi":
        return Mail
      case "meeting":
        return Calendar
      default:
        return Mail
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "urgent":
        return "text-red-500"
      case "respond":
        return "text-blue-500"
      case "fyi":
        return "text-green-500"
      case "meeting":
        return "text-purple-500"
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
          <Button onClick={fetchInbox}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Inbox</h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search emails..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="urgent">Urgent</TabsTrigger>
            <TabsTrigger value="respond">To Respond</TabsTrigger>
            <TabsTrigger value="fyi">FYI</TabsTrigger>
            <TabsTrigger value="meeting">Meeting</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Email List */}
      <div className="flex-1 overflow-y-auto">
        {filteredEmails.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            {searchQuery ? "No emails found matching your search." : "No emails in this category."}
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredEmails.map((email, index) => {
              const category = getEmailCategory(email)
              const urgency = getEmailUrgency(email)
              const CategoryIcon = getCategoryIcon(category)
              return (
                <div
                  key={email.id}
                  ref={(el) => {
                    emailRefs.current[index] = el;
                  }}
                  tabIndex={0}
                  className={`p-4 hover:bg-muted/50 cursor-pointer focus:outline-none focus:bg-muted/50 ${
                    focusedEmailIndex === index ? "bg-muted/50" : ""
                  }`}
                  onClick={() => onThreadSelect(email.threadId)}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-primary-foreground" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm truncate">
                          {email.from}
                        </span>
                        {!email.isRead && (
                          <Badge variant="secondary" className="text-xs">
                            New
                          </Badge>
                        )}
                        <Badge
                          variant="secondary"
                          className={`text-xs ${getCategoryColor(category)}`}
                        >
                          <CategoryIcon className="w-3 h-3 mr-1" />
                          {category}
                        </Badge>
                      </div>

                      <h3 className="font-semibold text-sm mb-1 truncate">
                        {email.subject}
                      </h3>

                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {email.body.substring(0, 150)}...
                      </p>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTimestamp(email.sentAt)}
                        </span>
                        {email.attachments.length > 0 && (
                          <span className="flex items-center gap-1">
                            <Paperclip className="w-3 h-3" />
                            {email.attachments.length} attachment{email.attachments.length > 1 ? 's' : ''}
                          </span>
                        )}
                        {hasMeetingRequest(email) && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Meeting Request
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
