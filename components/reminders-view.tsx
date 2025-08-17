"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bell, Plus, Clock, AlertTriangle, X, CheckCircle } from "lucide-react";
import { useReminderStore } from "@/stores/reminderStore";
import type { Reminder } from "@/types";

export function RemindersView() {
  const {
    reminders,
    loading,
    error,
    fetchReminders,
    addReminder,
    deleteReminder,
    clearError,
  } = useReminderStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    context: "",
    type: "follow-up",
    urgency: "medium",
    remindAt: "",
    emailId: "",
    sender: "",
  });

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) clearError();
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addReminder({
        title: formData.title,
        context: formData.context,
        type: formData.type as "overdue" | "follow-up" | "meeting",
        urgency: formData.urgency as "high" | "medium" | "low",
        remindAt: formData.remindAt,
        emailId: formData.emailId,
        sender: formData.sender,
      });

      // Reset form and close
      setFormData({
        title: "",
        context: "",
        type: "follow-up",
        urgency: "medium",
        remindAt: "",
        emailId: "",
        sender: "",
      });
      setShowAddForm(false);
    } catch (err) {
      console.error("Failed to add reminder:", err);
    }
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString();
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "overdue":
        return AlertTriangle;
      case "meeting":
        return Clock;
      default:
        return Bell;
    }
  };

  const isOverdue = (remindAt: string) => {
    return new Date(remindAt) < new Date();
  };

  return (
    <div className="flex-1 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Bell className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold">Reminders</h1>
          </div>
          <Button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Reminder
          </Button>
        </div>

        {/* Add Reminder Form */}
        {showAddForm && (
          <Card className="mb-6 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Add New Reminder</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddForm(false)}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Reminder Title *
                  </label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter reminder title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="type" className="text-sm font-medium">
                    Type *
                  </label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleSelectChange("type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="follow-up">Follow-up</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                      <SelectItem value="meeting">Meeting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="context" className="text-sm font-medium">
                  Context
                </label>
                <Textarea
                  id="context"
                  name="context"
                  value={formData.context}
                  onChange={handleInputChange}
                  placeholder="Enter reminder context"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="urgency" className="text-sm font-medium">
                    Urgency *
                  </label>
                  <Select
                    value={formData.urgency}
                    onValueChange={(value) =>
                      handleSelectChange("urgency", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="remindAt" className="text-sm font-medium">
                    Remind At *
                  </label>
                  <Input
                    id="remindAt"
                    name="remindAt"
                    type="datetime-local"
                    value={formData.remindAt}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="sender" className="text-sm font-medium">
                    Sender
                  </label>
                  <Input
                    id="sender"
                    name="sender"
                    value={formData.sender}
                    onChange={handleInputChange}
                    placeholder="Enter sender name/email"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="emailId" className="text-sm font-medium">
                    Email ID
                  </label>
                  <Input
                    id="emailId"
                    name="emailId"
                    value={formData.emailId}
                    onChange={handleInputChange}
                    placeholder="Enter email ID (optional)"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Reminder"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Reminders List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Your Reminders</h2>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : error ? (
            <Card className="p-6 text-center">
              <p className="text-red-600">Error loading reminders: {error}</p>
            </Card>
          ) : reminders.length === 0 ? (
            <Card className="p-6 text-center">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No reminders set yet</p>
              <Button
                onClick={() => setShowAddForm(true)}
                className="mt-3"
                variant="outline"
              >
                Add Your First Reminder
              </Button>
            </Card>
          ) : (
            <div className="grid gap-4">
              {reminders.map((reminder) => {
                const TypeIcon = getTypeIcon(reminder.type);
                const overdue = isOverdue(reminder.remindAt);

                return (
                  <Card key={reminder.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <TypeIcon className="w-4 h-4" />
                          <h3 className="font-semibold text-lg">
                            {reminder.title}
                          </h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(
                              reminder.urgency
                            )}`}
                          >
                            {reminder.urgency}
                          </span>
                          {overdue && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                              Overdue
                            </span>
                          )}
                        </div>

                        {reminder.context && (
                          <p className="text-gray-600 mb-3">
                            {reminder.context}
                          </p>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>
                              {overdue ? "Was due: " : "Due: "}
                              {formatDateTime(reminder.remindAt)}
                            </span>
                          </div>

                          {reminder.sender && (
                            <div className="flex items-center gap-2">
                              <span>From: {reminder.sender}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteReminder(reminder.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
