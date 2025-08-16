"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Send, Paperclip, Smile, Bold, Italic, Link, ThumbsUp, ThumbsDown, Sparkles } from "lucide-react"

interface ComposeViewProps {
  onBack: () => void
}

export function ComposeView({ onBack }: ComposeViewProps) {
  const [to, setTo] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [tone, setTone] = useState("professional")
  const [length, setLength] = useState("medium")
  const [showAISuggestion, setShowAISuggestion] = useState(false)

  const aiSuggestion = `Hi Sarah,

Thank you for reaching out about the Q4 budget review meeting. I appreciate you taking the initiative to organize this important discussion.

Tuesday at 2 PM works perfectly for my schedule. I'll prepare the following materials for our review:
- Current budget analysis with variance reports
- Spending pattern breakdown by department
- Resource allocation recommendations for Q4

I believe this meeting will be crucial for ensuring we stay on track with our financial goals. Please let me know if there are any specific areas you'd like me to focus on in my preparation.

Looking forward to our productive discussion.

Best regards,
[Your name]`

  const handleAIAssist = () => {
    setShowAISuggestion(true)
  }

  const handleUseSuggestion = () => {
    setMessage(aiSuggestion)
    setShowAISuggestion(false)
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="border-b border-border p-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-semibold">Compose Email</h1>

          <div className="flex gap-2 ml-auto">
            <Button variant="outline" size="sm">
              <Paperclip className="w-4 h-4 mr-2" />
              Attach
            </Button>
            <Button size="sm">
              <Send className="w-4 h-4 mr-2" />
              Send
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Recipient and Subject */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">To</label>
              <Input placeholder="Enter email addresses..." value={to} onChange={(e) => setTo(e.target.value)} />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Subject</label>
              <Input placeholder="Enter subject..." value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>
          </div>

          {/* AI Controls */}
          <Card className="p-4 bg-accent/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="font-medium">AI Writing Assistant</span>
              </div>

              <div className="flex gap-4 ml-auto">
                <div className="flex items-center gap-2">
                  <label className="text-sm">Tone:</label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="formal">Formal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-sm">Length:</label>
                  <Select value={length} onValueChange={setLength}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="brief">Brief</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="detailed">Detailed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Button onClick={handleAIAssist} variant="outline" size="sm">
              <Sparkles className="w-4 h-4 mr-2" />
              Generate AI Draft
            </Button>
          </Card>

          {/* AI Suggestion */}
          {showAISuggestion && (
            <Card className="p-4 border-primary/20 bg-primary/5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-xs text-primary-foreground font-bold">AI</span>
                </div>
                <span className="font-medium">AI Generated Draft</span>
                <Badge variant="secondary" className="ml-auto">
                  92% confidence
                </Badge>
              </div>

              <div className="bg-background p-4 rounded-md border mb-4">
                <pre className="whitespace-pre-wrap text-sm font-sans">{aiSuggestion}</pre>
              </div>

              <div className="flex items-center gap-2">
                <Button size="sm" onClick={handleUseSuggestion}>
                  Use This Draft
                </Button>
                <Button size="sm" variant="outline">
                  Edit & Use
                </Button>
                <Button size="sm" variant="ghost">
                  Generate Another
                </Button>

                <div className="flex gap-1 ml-auto">
                  <Button size="sm" variant="ghost" className="w-8 h-8 p-0">
                    <ThumbsUp className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="w-8 h-8 p-0">
                    <ThumbsDown className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Message Composer */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm font-medium">Message</label>
              <div className="flex gap-1 ml-auto">
                <Button size="sm" variant="ghost" className="w-8 h-8 p-0">
                  <Bold className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" className="w-8 h-8 p-0">
                  <Italic className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" className="w-8 h-8 p-0">
                  <Link className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" className="w-8 h-8 p-0">
                  <Smile className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <Textarea
              placeholder="Write your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[300px] resize-none"
            />
          </div>

          {/* Context Information */}
          {to && (
            <Card className="p-4 bg-muted/50">
              <h4 className="font-medium mb-2">Conversation Context</h4>
              <p className="text-sm text-muted-foreground">
                Based on your recent conversations with {to}, AI suggests a professional tone with focus on project
                updates and meeting coordination.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
