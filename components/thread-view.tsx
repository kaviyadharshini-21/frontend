"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Reply,
  Forward,
  Archive,
  Trash2,
  User,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useEmailStore } from "@/stores/emailStore";

interface ThreadViewProps {
  threadId: string | null;
  onBack: () => void;
}

export function ThreadView({ threadId, onBack }: ThreadViewProps) {
  const { selectedThread, loading, error, fetchThread } = useEmailStore();

  useEffect(() => {
    if (threadId) {
      fetchThread(threadId);
    }
  }, [threadId, fetchThread]);

  const aiSummary = {
    keyPoints: [
      "Q4 budget review meeting requested",
      "Discussion of resource allocation needed",
      "Review of current spending patterns",
      "Proposed time: Tuesday at 2 PM",
    ],
    decisions: ["Meeting scheduled for Tuesday at 2 PM"],
    actionItems: [
      "Prepare budget analysis (assigned to you)",
      "Prepare spending reports (assigned to you)",
    ],
    questions: ["Are all participants available for Tuesday 2 PM?"],
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => threadId && fetchThread(threadId)}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!selectedThread) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">Select a thread to view</p>
      </div>
    );
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

        <h1 className="text-xl font-semibold mb-2">
          {selectedThread.emails[0].subject || "Thread Subject"}
        </h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="w-4 h-4" />
          <span>
            {selectedThread.participants?.join(", ") || "Participants"}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* AI Summary */}
        <Card className="p-6 mb-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            AI Summary
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Key Points</h4>
              <ul className="space-y-1 text-sm">
                {aiSummary.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Action Items</h4>
              <ul className="space-y-1 text-sm">
                {aiSummary.actionItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>

        {/* Messages */}
        <div className="space-y-6">
          {selectedThread.emails?.map((email, index) => (
            <Card key={email.id || index} className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{email.from}</span>
                    <span className="text-sm text-muted-foreground">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {email.sentAt}
                    </span>
                  </div>
                  <h4 className="font-semibold mb-2">{email.subject}</h4>
                </div>
              </div>

              <div className="prose prose-sm max-w-none">
                <p
                  className="whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: email.body }}
                />
              </div>

              {index < (selectedThread.emails?.length || 0) - 1 && (
                <Separator className="my-4" />
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
