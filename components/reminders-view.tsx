import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, AlertTriangle, CheckSquare, Reply, Calendar, User } from "lucide-react"

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
  const mockReminders: Reminder[] = [
    {
      id: "1",
      type: "overdue",
      title: "Response needed: Project Timeline Discussion",
      context: "Alex Chen is waiting for your input on potential delays in mobile app development.",
      sender: "Alex Chen",
      urgency: "high",
      daysOverdue: 2,
      timestamp: "2 days overdue",
    },
    {
      id: "2",
      type: "follow-up",
      title: "Follow up: Budget approval request",
      context: "You requested budget approval for Q4 marketing campaigns. No response yet.",
      sender: "Finance Team",
      urgency: "medium",
      timestamp: "5 days ago",
    },
    {
      id: "3",
      type: "meeting",
      title: "Meeting reminder: Client presentation",
      context: "Presentation scheduled for tomorrow at 3 PM with Acme Corp.",
      sender: "Calendar",
      urgency: "high",
      timestamp: "Tomorrow at 3 PM",
    },
  ]

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
          {mockReminders.map((reminder) => {
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

        {mockReminders.length === 0 && (
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
