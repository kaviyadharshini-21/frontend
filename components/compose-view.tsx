"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Send,
  Paperclip,
  Smile,
  Bold,
  Italic,
  Link,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Loader2,
} from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";

interface ComposeViewProps {
  onBack: () => void;
}

export function ComposeView({ onBack }: ComposeViewProps) {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [context, setContext] = useState("");
  const [tone, setTone] = useState("professional");
  const [length, setLength] = useState("medium");
  const [showAISuggestion, setShowAISuggestion] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiGeneratedMessage, setAiGeneratedMessage] = useState("");
  const [aiError, setAiError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [sendError, setSendError] = useState("");

  const handleAIAssist = async () => {
    if (!context.trim()) {
      setAiError("Please provide context for the email");
      return;
    }

    setIsGenerating(true);
    setAiError("");
    setShowAISuggestion(false);

    try {
      const response = await axiosInstance.post("/emails/compose", {
        context: context.trim(),
        tone,
        length,
        recipient: to,
        subject:
          subject || "Email regarding " + context.substring(0, 50) + "...",
      });

      if (response.data.success && response.data.email?.content) {
        setAiGeneratedMessage(response.data.email.content);
        setShowAISuggestion(true);
      } else {
        throw new Error("No email content received from API");
      }
    } catch (error) {
      console.error("AI email generation failed:", error);
      setAiError(
        error instanceof Error ? error.message : "Failed to generate email"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseSuggestion = () => {
    setMessage(aiGeneratedMessage);
    setShowAISuggestion(false);
  };

  const handleGenerateAnother = () => {
    setShowAISuggestion(false);
    setAiGeneratedMessage("");
  };

  const handleSendEmail = async () => {
    if (!to.trim() || !subject.trim() || !message.trim()) {
      setSendError(
        "Please fill in all required fields (To, Subject, and Message)"
      );
      setSendStatus("error");
      return;
    }

    // Parse multiple email addresses
    const emailAddresses = to
      .split(/[,;]/)
      .map((email) => email.trim())
      .filter((email) => email.length > 0);

    if (emailAddresses.length === 0) {
      setSendError("Please enter at least one valid email address");
      setSendStatus("error");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = emailAddresses.filter(
      (email) => !emailRegex.test(email)
    );

    if (invalidEmails.length > 0) {
      setSendError(`Invalid email format: ${invalidEmails.join(", ")}`);
      setSendStatus("error");
      return;
    }

    setIsSending(true);
    setSendError("");
    setSendStatus("idle");

    try {
      const response = await axiosInstance.post("/emails/send-smtp", {
        to_users: Array.isArray(emailAddresses)
          ? emailAddresses
          : [emailAddresses],
        subject: subject.trim(),
        body: message.trim(),
      });

      if (response.data.success) {
        setSendStatus("success");
        // Reset form after successful send
        setTo("");
        setSubject("");
        setMessage("");
        setContext("");
        setShowAISuggestion(false);
        setAiGeneratedMessage("");

        // Show success message for 3 seconds
        setTimeout(() => {
          setSendStatus("idle");
        }, 3000);
      } else {
        throw new Error("Failed to send email");
      }
    } catch (error: any) {
      console.error("Send email failed:", error);

      // Handle different types of API errors
      let errorMessage = "Failed to send email";

      if (error.response?.status === 422) {
        // Unprocessable Entity - validation error
        const validationErrors = error.response.data?.detail;
        if (Array.isArray(validationErrors)) {
          errorMessage = validationErrors
            .map((err: any) => err.msg || err.message)
            .join(", ");
        } else if (typeof validationErrors === "string") {
          errorMessage = validationErrors;
        } else {
          errorMessage = "Invalid email data. Please check your input.";
        }
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setSendError(errorMessage);
      setSendStatus("error");
    } finally {
      setIsSending(false);
    }
  };

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
            <Button
              size="sm"
              onClick={handleSendEmail}
              disabled={
                isSending || !to.trim() || !subject.trim() || !message.trim()
              }
              className="min-w-[80px]"
            >
              {isSending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Send Status Messages */}
      {sendStatus === "success" && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg mx-4 mb-4">
          <p className="text-sm text-green-700 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Email sent successfully!
          </p>
        </div>
      )}

      {sendStatus === "error" && sendError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg mx-4 mb-4">
          <p className="text-sm text-red-700 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            {sendError}
          </p>
        </div>
      )}

      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Recipient and Subject */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">To</label>
              <Input
                placeholder="Enter email addresses (separate multiple with commas)..."
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                You can enter multiple email addresses separated by commas or
                semicolons
              </p>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Subject</label>
              <Input
                placeholder="Enter subject..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
          </div>

          {/* AI Controls */}
          <Card className="p-4 bg-accent/10">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="font-medium">AI Writing Assistant</span>
              </div>

              {/* Context Input */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Email Context *
                </label>
                <Textarea
                  placeholder="Describe what you want to communicate, the purpose of the email, key points to include, etc..."
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Provide clear context to help AI generate a relevant email
                  draft
                </p>
              </div>

              {/* Tone and Length Controls */}
              <div className="flex gap-4">
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
                      <SelectItem value="persuasive">Persuasive</SelectItem>
                      <SelectItem value="empathetic">Empathetic</SelectItem>
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

              {/* Generate Button */}
              <Button
                onClick={handleAIAssist}
                variant="outline"
                size="sm"
                disabled={isGenerating || !context.trim()}
                className="w-full sm:w-auto"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate AI Draft
                  </>
                )}
              </Button>

              {/* Error Display */}
              {aiError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{aiError}</p>
                </div>
              )}
            </div>
          </Card>

          {/* AI Suggestion */}
          {showAISuggestion && aiGeneratedMessage && (
            <Card className="p-4 border-primary/20 bg-primary/5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-xs text-primary-foreground font-bold">
                    AI
                  </span>
                </div>
                <span className="font-medium">AI Generated Draft</span>
                <Badge variant="secondary" className="ml-auto">
                  AI Generated
                </Badge>
              </div>

              <div className="bg-background p-4 rounded-md border mb-4">
                <div
                  className="prose prose-sm max-w-none text-sm font-sans"
                  dangerouslySetInnerHTML={{ __html: aiGeneratedMessage }}
                />
              </div>

              <div className="flex items-center gap-2">
                <Button size="sm" onClick={handleUseSuggestion}>
                  Use This Draft
                </Button>
                <Button size="sm" variant="outline">
                  Edit & Use
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleGenerateAnother}
                >
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
                Based on your recent conversations with {to}, AI suggests a
                professional tone with focus on project updates and meeting
                coordination.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
