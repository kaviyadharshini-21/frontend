"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  Plus,
  Clock,
  MapPin,
  Users,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useMeetingStore } from "@/stores/meetingStore";
import type { Meeting } from "@/types";

export function CalendarView() {
  const { meetings, loading, error, fetchMeetings, createMeeting, clearError } =
    useMeetingStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    location: "",
    participants: "",
  });

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (error) clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const participants = formData.participants
        .split(",")
        .map((email) => email.trim())
        .filter((email) => email);

      await createMeeting({
        title: formData.title,
        description: formData.description,
        startTime: formData.startTime,
        endTime: formData.endTime,
        location: formData.location,
        participants,
        status: "scheduled" as const,
      });

      // Reset form and close
      setFormData({
        title: "",
        description: "",
        startTime: "",
        endTime: "",
        location: "",
        participants: "",
      });
      setShowAddForm(false);
    } catch (err) {
      console.error("Failed to create meeting:", err);
    }
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Calendar navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Generate calendar days
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  // Get meetings for a specific date
  const getMeetingsForDate = (date: Date) => {
    if (!Array.isArray(meetings)) return [];

    const dateStr = date.toDateString();
    return meetings.filter((meeting) => {
      const meetingDate = new Date(meeting.startTime);
      return meetingDate.toDateString() === dateStr;
    });
  };

  // Get upcoming meetings (today and future)
  const getUpcomingMeetings = () => {
    if (!Array.isArray(meetings)) return [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return meetings
      .filter((meeting) => {
        const meetingDate = new Date(meeting.startTime);
        return meetingDate >= today;
      })
      .sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );
  };

  // Check if a meeting is upcoming (today or future)
  const isUpcomingMeeting = (meeting: Meeting) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const meetingDate = new Date(meeting.startTime);
    return meetingDate >= today;
  };

  // Ensure meetings is always an array
  const safeMeetings = Array.isArray(meetings) ? meetings : [];
  const upcomingMeetings = getUpcomingMeetings();
  const calendarDays = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Debug logging
  useEffect(() => {
    console.log("Calendar View - Store State:", {
      meetings,
      safeMeetings: safeMeetings.length,
      upcomingMeetings: upcomingMeetings.length,
      loading,
      error,
    });
  }, [meetings, safeMeetings.length, upcomingMeetings.length, loading, error]);

  return (
    <div className="flex-1 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold">Calendar & Meetings</h1>
          </div>
          <Button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Event
          </Button>
        </div>

        {/* Add Event Form */}
        {showAddForm && (
          <Card className="mb-6 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Add New Event</h2>
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
                    Event Title *
                  </label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter event title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="location" className="text-sm font-medium">
                    Location
                  </label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Enter location"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter event description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="startTime" className="text-sm font-medium">
                    Start Time *
                  </label>
                  <Input
                    id="startTime"
                    name="startTime"
                    type="datetime-local"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="endTime" className="text-sm font-medium">
                    End Time *
                  </label>
                  <Input
                    id="endTime"
                    name="endTime"
                    type="datetime-local"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="participants" className="text-sm font-medium">
                  Participants (comma-separated emails)
                </label>
                <Input
                  id="participants"
                  name="participants"
                  value={formData.participants}
                  onChange={handleInputChange}
                  placeholder="email1@example.com, email2@example.com"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Event"}
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

        {/* Calendar Navigation */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={goToPreviousMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" onClick={goToNextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
            <h2 className="text-xl font-semibold">{monthName}</h2>
          </div>
          <Button variant="outline" onClick={goToToday}>
            Today
          </Button>
        </div>

        {/* Calendar Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <Card className="p-6 text-center">
            <p className="text-red-600">Error loading events: {error}</p>
          </Card>
        ) : (
          <div className="bg-white rounded-lg border">
            {/* Calendar Header */}
            <div className="grid grid-cols-7 gap-px bg-gray-200">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="bg-gray-50 p-3 text-center text-sm font-medium text-gray-700"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-px bg-gray-200">
              {calendarDays.map((day, index) => {
                const isToday =
                  day && day.toDateString() === new Date().toDateString();
                const isCurrentMonth =
                  day && day.getMonth() === currentDate.getMonth();
                const dayMeetings = day ? getMeetingsForDate(day) : [];

                return (
                  <div
                    key={index}
                    className={`min-h-[120px] bg-white p-2 ${
                      !day ? "bg-gray-50" : ""
                    } ${isToday ? "bg-blue-50" : ""}`}
                  >
                    {day && (
                      <>
                        <div
                          className={`text-sm font-medium mb-2 ${
                            isToday
                              ? "text-blue-600"
                              : isCurrentMonth
                              ? "text-gray-900"
                              : "text-gray-400"
                          }`}
                        >
                          {day.getDate()}
                        </div>

                        {/* Display meetings for this day */}
                        <div className="space-y-1">
                          {dayMeetings.slice(0, 3).map((meeting) => (
                            <div
                              key={meeting.id}
                              className={`text-xs p-1 rounded truncate cursor-pointer hover:bg-gray-100 ${
                                isUpcomingMeeting(meeting)
                                  ? "bg-green-100 text-green-800 border border-green-200 font-medium"
                                  : getStatusColor(meeting.status)
                              }`}
                              title={`${meeting.title} - ${formatDateTime(
                                meeting.startTime
                              )}${
                                isUpcomingMeeting(meeting) ? " (Upcoming)" : ""
                              }`}
                            >
                              {meeting.title}
                            </div>
                          ))}
                          {dayMeetings.length > 3 && (
                            <div className="text-xs text-gray-500 text-center">
                              +{dayMeetings.length - 3} more
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Upcoming Events Summary */}
        {!loading && upcomingMeetings.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Upcoming Events</h3>
            <div className="grid gap-4">
              {upcomingMeetings.map((meeting) => (
                <Card
                  key={meeting.id}
                  className="p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {meeting.title}
                        </h4>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            meeting.status
                          )}`}
                        >
                          {meeting.status}
                        </span>
                        {isUpcomingMeeting(meeting) && (
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                            Upcoming
                          </span>
                        )}
                      </div>

                      {meeting.description && (
                        <p className="text-gray-600 mb-4 leading-relaxed">
                          {meeting.description}
                        </p>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <div>
                            <div className="font-medium">Start Time</div>
                            <div>{formatDateTime(meeting.startTime)}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <div>
                            <div className="font-medium">End Time</div>
                            <div>{formatDateTime(meeting.endTime)}</div>
                          </div>
                        </div>

                        {meeting.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <div>
                              <div className="font-medium">Location</div>
                              <div>{meeting.location}</div>
                            </div>
                          </div>
                        )}

                        {meeting.participants &&
                          meeting.participants.length > 0 && (
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-gray-500" />
                              <div>
                                <div className="font-medium">Participants</div>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {meeting.participants.map(
                                    (participant, index) => (
                                      <span
                                        key={index}
                                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                                      >
                                        {participant}
                                      </span>
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                          )}

                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <div>
                            <div className="font-medium">Date</div>
                            <div>
                              {new Date(meeting.startTime).toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 text-gray-500" />
                          <div>
                            <div className="font-medium">Duration</div>
                            <div>
                              {(() => {
                                const start = new Date(meeting.startTime);
                                const end = new Date(meeting.endTime);
                                const diffMs = end.getTime() - start.getTime();
                                const diffMins = Math.round(diffMs / 60000);
                                if (diffMins < 60) {
                                  return `${diffMins} minutes`;
                                } else {
                                  const hours = Math.floor(diffMins / 60);
                                  const mins = diffMins % 60;
                                  return mins > 0
                                    ? `${hours}h ${mins}m`
                                    : `${hours}h`;
                                }
                              })()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* No Events Message */}
        {!loading &&
          upcomingMeetings.length === 0 &&
          safeMeetings.length > 0 && (
            <div className="mt-8">
              <Card className="p-8 text-center">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Upcoming Events
                </h3>
                <p className="text-gray-600 mb-4">
                  All your scheduled events are in the past. Add new events to
                  see them here.
                </p>
                <Button
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center gap-2 mx-auto"
                >
                  <Plus className="w-4 h-4" />
                  Add New Event
                </Button>
              </Card>
            </div>
          )}

        {/* No Events at All */}
        {!loading && safeMeetings.length === 0 && !error && (
          <div className="mt-8">
            <Card className="p-8 text-center">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Events Scheduled
              </h3>
              <p className="text-gray-600 mb-4">
                Get started by adding your first event to the calendar.
              </p>
              <Button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 mx-auto"
              >
                <Plus className="w-4 h-4" />
                Add Your First Event
              </Button>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
