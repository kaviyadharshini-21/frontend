"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Reply,
  Forward,
  Archive,
  Trash2,
  Clock,
  CheckSquare,
  AlertTriangle,
  Calendar,
  User,
} from "lucide-react"

interface ThreadViewProps {
  threadId: string | null
  onBack: () => void
}

export function ThreadView({ threadId, onBack }: ThreadViewProps) {
  const mockThread = {
    id: threadId,
    subject: "Q4 Budget Review Meeting",
    participants: ["Sarah Johnson", "You", "Mike Davis"],
    hasMeetingRequest: true,
    messages: [
      {
        id: "1",
        sender: "Sarah Johnson",
        timestamp: "2 hours ago",
        content:
          "Hi team, I hope this email finds you well. I wanted to reach out regarding our upcoming Q4 budget review meeting. We need to discuss the allocated resources for the next quarter and review our current spending patterns.\n\nCould we schedule this for next Tuesday at 2 PM? Please let me know if this works for everyone.",
        isFromUser: false,
      },
      {
        id: "2",
        sender: "You",
        timestamp: "1 hour ago",
        content:
          "Hi Sarah, Tuesday at 2 PM works perfectly for me. I'll prepare the current budget analysis and spending reports for our review.",
        isFromUser: true,
      },
    ],
  }

  const aiSummary = {
    keyPoints: [
      "Q4 budget review meeting requested",
      "Discussion of resource allocation needed",
      "Review of current spending patterns",
      "Proposed time: Tuesday at 2 PM",
    ],
    decisions: ["Meeting scheduled for Tuesday at 2 PM"],
    actionItems: ["Prepare budget analysis (assigned to you)", "Prepare spending reports (assigned to you)"],
    questions: ["Are all participants available for Tuesday 2 PM?"],
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="border-b border-border p-4">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Inbox
          </Button>

          <div className="flex gap-2 ml-auto">
            <Button variant="outline" size="sm">
              <Reply className="w-4 h-4 mr-2" />
              Reply
            </Button>
            <Button variant="outline" size="sm">
              <Forward className="w-4 h-4 mr-2" />
              Forward
            </Button>
            <Button variant="outline" size="sm">
              <Archive className="w-4 h-4 mr-2" />
              Archive
            </Button>
            <Button variant="outline" size="sm">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <h1 className="text-xl font-semibold mb-2">{mockThread.subject}</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="w-4 h-4" />
          <span>{mockThread.participants.join(", ")}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {mockThread.hasMeetingRequest && (
          <Card className="p-4 mb-6 border-orange-200 bg-orange-50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-full">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-orange-800">Meeting Request Detected</span>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                    AI Detected
                  </Badge>
                </div>
                <p className="text-sm text-orange-700 mb-3">
                  AI found a meeting request for "Q4 Budget Review" on Tuesday at 2 PM with 3 participants.
                </p>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                    <Calendar className="w-3 h-3 mr-1" />
                    Schedule Meeting
                  </Button>
                  <Button size="sm" variant="outline">
                    <Clock className="w-3 h-3 mr-1" />
                    Check Availability
                  </Button>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* AI Summary Section */}
        <Card className="p-6 mb-6 bg-accent/20">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
              <span className="text-xs text-primary-foreground font-bold">AI</span>
            </div>
            <h3 className="font-semibold">Thread Summary</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-green-500" />
                Key Points
              </h4>
              <ul className="space-y-1 text-sm">
                {aiSummary.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                Action Items
              </h4>
              <ul className="space-y-1 text-sm">
                {aiSummary.actionItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button size="sm" variant="outline">
              <Clock className="w-3 h-3 mr-1" />
              Set Reminder
            </Button>
            <Button size="sm" variant="outline">
              <CheckSquare className="w-3 h-3 mr-1" />
              Mark Complete
            </Button>
            <Button size="sm" variant="outline">
              <Calendar className="w-3 h-3 mr-1" />
              Schedule Meeting
            </Button>
          </div>
        </Card>

        {/* Messages */}
        <div className="space-y-6">
          {mockThread.messages.map((message, index) => (
            <div key={message.id}>
              <Card className={`p-4 ${message.isFromUser ? "ml-12 bg-primary/5" : "mr-12"}`}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{message.sender}</div>
                    <div className="text-xs text-muted-foreground">{message.timestamp}</div>
                  </div>
                </div>

                <div className="prose prose-sm max-w-none">
                  {message.content.split("\n").map((paragraph, pIndex) => (
                    <p key={pIndex} className="mb-2 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </Card>

              {index < mockThread.messages.length - 1 && <Separator className="my-4" />}
            </div>
          ))}
        </div>

        {/* Quick Reply Section */}
        <Card className="p-4 mt-6 bg-accent/10">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
              <span className="text-xs text-primary-foreground font-bold">AI</span>
            </div>
            <span className="font-medium">Suggested Reply</span>
            <Badge variant="secondary" className="ml-auto">
              95% confidence
            </Badge>
          </div>

          <div className="bg-background p-3 rounded-md border mb-3">
            <p className="text-sm">
              Thanks Sarah! I'll have the budget analysis and spending reports ready for Tuesday. Looking forward to our
              discussion about Q4 resource allocation.
            </p>
          </div>

          <div className="flex gap-2">
            <Button size="sm">Use This Reply</Button>
            <Button size="sm" variant="outline">
              Edit & Send
            </Button>
            <Button size="sm" variant="ghost">
              Write My Own
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
