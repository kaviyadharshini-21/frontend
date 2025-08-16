"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Brain, Shield, Bell, Zap, ThumbsUp, ThumbsDown, History, HelpCircle, LogOut, RefreshCw, AlertTriangle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useEmailStore, useAIStore } from "@/stores"

export function SettingsView() {
  const { logout } = useAuth()
  const [aiEnabled, setAiEnabled] = useState(true)
  const [smartSummaries, setSmartSummaries] = useState(true)
  const [autoCategories, setAutoCategories] = useState(true)
  const [proactiveReminders, setProactiveReminders] = useState(true)

  // Import Zustand stores
  const { 
    userPreferences, 
    isLoading: emailLoading, 
    error: emailError, 
    updateUserPreferences 
  } = useEmailStore()

  const { 
    processingStats, 
    isLoading: aiLoading, 
    error: aiError, 
    getProcessingStats 
  } = useAIStore()

  // Fetch data on component mount
  useEffect(() => {
    getProcessingStats()
  }, [getProcessingStats])

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await logout()
    }
  }

  // Transform API data to create decision history
  const aiDecisionHistory = (processingStats?.recent_decisions || []).map((decision, index) => ({
    id: decision.email_id || `decision-${index}`,
    action: decision.action || "AI Decision",
    email: decision.email_subject || "Email",
    reasoning: decision.reasoning || "AI analysis",
    timestamp: decision.timestamp || "Recently",
    feedback: decision.feedback as "positive" | "negative" | null,
  }))

  const isLoading = emailLoading || aiLoading
  const error = emailError || aiError

  // Error handling with fallback UI
  if (error) {
    return (
      <div className="flex-1 p-6">
        <div className="flex items-center justify-center h-full">
          <Card className="p-8 text-center max-w-md">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Failed to Load Settings</h3>
            <p className="text-gray-600 mb-4">
              {typeof error === 'string' ? error : "Unable to fetch settings data from the server. Please check your connection and try again."}
            </p>
            <Button onClick={() => getProcessingStats()} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </Card>
        </div>
      </div>
    )
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex-1 p-6">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading settings...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Settings & Learning Hub</h2>
          <p className="text-muted-foreground">Customize your AI assistant and review its decision-making process</p>
        </div>

        <Tabs defaultValue="ai-settings" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="ai-settings">
              <Brain className="w-4 h-4 mr-2" />
              AI Settings
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="w-4 h-4 mr-2" />
              Decision History
            </TabsTrigger>
            <TabsTrigger value="feedback">
              <ThumbsUp className="w-4 h-4 mr-2" />
              Feedback Center
            </TabsTrigger>
            <TabsTrigger value="privacy">
              <Shield className="w-4 h-4 mr-2" />
              Privacy & Data
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ai-settings" className="space-y-6 mt-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                AI Features
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">AI-Powered Email Processing</div>
                    <div className="text-sm text-muted-foreground">
                      Enable intelligent categorization and priority detection
                    </div>
                  </div>
                  <Switch checked={aiEnabled} onCheckedChange={setAiEnabled} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Smart Thread Summaries</div>
                    <div className="text-sm text-muted-foreground">Generate AI summaries for email conversations</div>
                  </div>
                  <Switch checked={smartSummaries} onCheckedChange={setSmartSummaries} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Automatic Categorization</div>
                    <div className="text-sm text-muted-foreground">
                      Sort emails into Urgent, To Respond, FYI, and Meeting tabs
                    </div>
                  </div>
                  <Switch checked={autoCategories} onCheckedChange={setAutoCategories} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Proactive Reminders</div>
                    <div className="text-sm text-muted-foreground">
                      Get notified about overdue conversations and follow-ups
                    </div>
                  </div>
                  <Switch checked={proactiveReminders} onCheckedChange={setProactiveReminders} />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">High Priority Alerts</div>
                    <div className="text-sm text-muted-foreground">Immediate notifications for urgent emails</div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Daily Summary</div>
                    <div className="text-sm text-muted-foreground">Receive a daily digest of important emails</div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Focus Hours</div>
                    <div className="text-sm text-muted-foreground">
                      Batch notifications during designated focus time
                    </div>
                  </div>
                  <Switch />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4 mt-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">AI Decision History</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Review all automated actions taken by your AI assistant with full reasoning transparency.
              </p>

              <div className="space-y-4">
                {aiDecisionHistory.map((decision) => (
                  <div key={decision.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-medium">{decision.action}</div>
                        <div className="text-sm text-muted-foreground">{decision.email}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {decision.feedback === "positive" && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            <ThumbsUp className="w-3 h-3 mr-1" />
                            Helpful
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">{decision.timestamp}</span>
                      </div>
                    </div>

                    <div className="bg-muted/50 p-3 rounded text-sm mb-3">
                      <strong>AI Reasoning:</strong> {decision.reasoning}
                    </div>

                    {!decision.feedback && (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <ThumbsUp className="w-3 h-3 mr-1" />
                          Helpful
                        </Button>
                        <Button size="sm" variant="outline">
                          <ThumbsDown className="w-3 h-3 mr-1" />
                          Not Helpful
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="feedback" className="space-y-6 mt-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Help Improve Your AI Assistant</h3>
              <p className="text-muted-foreground mb-6">
                Your feedback helps the AI learn your preferences and improve its suggestions.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Recent Feedback</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <ThumbsUp className="w-4 h-4 text-green-500" />
                      <span>Email categorization accuracy</span>
                      <Badge variant="secondary">+1</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <ThumbsUp className="w-4 h-4 text-green-500" />
                      <span>Reply suggestion quality</span>
                      <Badge variant="secondary">+1</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <ThumbsDown className="w-4 h-4 text-red-500" />
                      <span>Meeting detection</span>
                      <Badge variant="secondary">-1</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Learning Progress</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Email prioritization</span>
                      <span className="text-green-600">92% accuracy</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tone matching</span>
                      <span className="text-green-600">88% accuracy</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Context understanding</span>
                      <span className="text-yellow-600">76% accuracy</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6 mt-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Privacy & Data Controls
              </h3>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Data Processing</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Control how your email data is processed and stored by the AI system.
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Process email content for AI features</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Store conversation history for learning</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Share anonymized data for improvements</span>
                      <Switch />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Data Retention</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Your email data is processed locally and encrypted. AI learning data is stored for 90 days.
                  </p>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <HelpCircle className="w-4 h-4 mr-2" />
                      Learn More
                    </Button>
                    <Button variant="outline" size="sm">
                      Export My Data
                    </Button>
                    <Button variant="outline" size="sm">
                      Delete AI Data
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <LogOut className="w-5 h-5" />
                Account Actions
              </h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Sign Out</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Sign out of your account on this device. You'll need to sign in again to access your emails.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={handleLogout}
                    className="gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
