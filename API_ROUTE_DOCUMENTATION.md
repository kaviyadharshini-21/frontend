# Complete API Route Documentation

## Overview
This document provides a complete reference for all API endpoints in the Email & Calendar AI Processing Backend.

## Base URL
`http://localhost:8000/api/v1`

---

## Health & Status Endpoints

### 1. Health Check
- **Path:** `/health/status`
- **Method:** GET
- **Purpose:** Basic health check endpoint
- **Request Parameters:** None
- **Query Parameters:** None
- **Request Body:** None
- **Responses:**
  - **200:** `{"status": "healthy", "timestamp": "2025-08-15T21:58:21.152705", "service": "Email AI Processing Backend", "version": "1.0.0"}`

### 2. Detailed Health Check
- **Path:** `/health/detailed`
- **Method:** GET
- **Purpose:** Detailed health check with service status
- **Request Parameters:** None
- **Query Parameters:** None
- **Request Body:** None
- **Responses:**
  - **200:** `{"status": "healthy", "timestamp": "...", "services": {"database": "healthy", "learning_engine": "healthy", "email_processor": "healthy"}, "uptime": "N/A", "version": "1.0.0"}`

### 3. System Metrics
- **Path:** `/health/metrics`
- **Method:** GET
- **Purpose:** Get system metrics
- **Request Parameters:** None
- **Query Parameters:** None
- **Request Body:** None
- **Responses:**
  - **200:** `{"timestamp": "...", "metrics": {"email_processing": {...}, "system": {"memory_usage": "N/A", "cpu_usage": "N/A", "disk_usage": "N/A"}}}`

---

## Email Processing Endpoints

### 4. Process Single Email
- **Path:** `/emails/process`
- **Method:** POST
- **Purpose:** Process a single email with AI capabilities
- **Request Parameters:** None
- **Query Parameters:** None
- **Request Body:**
  ```json
  {
    "email_id": "string (required)",
    "sender": "email (required)",
    "recipients": ["email"] (optional),
    "subject": "string (required, max 500 chars)",
    "body": "string (required)",
    "html_body": "string (optional)",
    "include_draft": "boolean (default: true)",
    "user_preferences": "object (optional)"
  }
  ```
- **Responses:**
  - **200:** `{"email_id": "string", "processing_status": "completed", "classification": {...}, "summary": {...}, "intent": {...}, "generated_response": "string", "response_confidence": 0.85, "requires_human_review": false, "processing_time": 2.3, "recommendations": [...], "error_message": null}`
  - **500:** `{"detail": "Email processing failed: ..."}`

### 5. Batch Process Emails
- **Path:** `/emails/batch-process`
- **Method:** POST
- **Purpose:** Process multiple emails in batch with AI capabilities
- **Request Parameters:** None
- **Query Parameters:** None
- **Request Body:**
  ```json
  {
    "emails": [
      {
        "email_id": "string (required)",
        "sender": "email (required)",
        "recipients": ["email"] (optional),
        "subject": "string (required)",
        "body": "string (required)",
        "html_body": "string (optional)",
        "include_draft": "boolean (default: true)",
        "user_preferences": "object (optional)"
      }
    ],
    "parallel_processing": "boolean (default: true)"
  }
  ```
- **Responses:**
  - **200:** `{"total_emails": 5, "successful": 4, "failed": 1, "results": [...], "processing_time": 12.5}`
  - **500:** `{"detail": "Batch processing failed: ..."}`

### 6. Fetch Emails
- **Path:** `/emails/fetch`
- **Method:** GET
- **Purpose:** Fetch emails from IMAP server with optional AI processing
- **Request Parameters:** None
- **Query Parameters:**
  - `count`: integer (1-100, default: 20) - Number of emails to fetch
  - `enable_ai`: boolean (default: true) - Enable AI processing
- **Request Body:** None
- **Responses:**
  - **200:** `{"message": "Successfully fetched 20 emails", "ai_processing_enabled": true, "status": "completed"}`
  - **500:** `{"detail": "Email fetching failed: ..."}`

### 7. Get Emails for Review
- **Path:** `/emails/review`
- **Method:** GET
- **Purpose:** Get emails that require human review
- **Request Parameters:** None
- **Query Parameters:**
  - `limit`: integer (1-50, default: 10) - Number of emails to retrieve
- **Request Body:** None
- **Responses:**
  - **200:** `{"emails": [...], "total_count": 5}`
  - **500:** `{"detail": "Failed to get review emails: ..."}`

### 8. Provide Feedback
- **Path:** `/emails/feedback`
- **Method:** POST
- **Purpose:** Provide feedback for AI improvement
- **Request Parameters:** None
- **Query Parameters:** None
- **Request Body:**
  ```json
  {
    "email_id": "string (required)",
    "feedback_type": "string (required)",
    "original_result": "string (required)",
    "corrected_result": "string (required)",
    "rating": "integer (1-5, required)"
  }
  ```
- **Responses:**
  - **200:** `{"message": "Feedback recorded successfully", "email_id": "string", "feedback_type": "string", "status": "success"}`
  - **400:** `{"detail": "Failed to record feedback"}`
  - **500:** `{"detail": "Feedback recording failed: ..."}`

### 9. Get Processing Statistics
- **Path:** `/emails/stats`
- **Method:** GET
- **Purpose:** Get email processing statistics
- **Request Parameters:** None
- **Query Parameters:**
  - `days`: integer (1-365, default: 7) - Number of days for statistics
- **Request Body:** None
- **Responses:**
  - **200:** `{"period_days": 7, "total_emails_processed": 150, "average_processing_time": 2.3, "confidence_scores": {...}, "human_review_rate": 0.15, "error_rate": 0.02, "category_distribution": {...}, "urgency_distribution": {...}}`
  - **500:** `{"detail": "Failed to get statistics: ..."}`

### 10. Get Quick Responses
- **Path:** `/emails/quick-responses`
- **Method:** GET
- **Purpose:** Get quick response suggestions for an email
- **Request Parameters:** None
- **Query Parameters:**
  - `email_id`: string (required) - Email ID for context
- **Request Body:** None
- **Responses:**
  - **200:** `{"email_id": "string", "quick_responses": [...], "context": {...}}`
  - **404:** `{"detail": "Email not found"}`
  - **500:** `{"detail": "Failed to get quick responses: ..."}`

### 11. Update User Preferences
- **Path:** `/emails/preferences`
- **Method:** PUT
- **Purpose:** Update user preferences for email processing
- **Request Parameters:** None
- **Query Parameters:** None
- **Request Body:**
  ```json
  {
    "preferred_response_tone": "string (required)",
    "auto_categorization": "boolean (required)",
    "urgency_threshold": "number (required)",
    "requires_confirmation": "boolean (required)",
    "signature": "string (required)"
  }
  ```
- **Responses:**
  - **200:** `{"message": "User preferences updated successfully", "preferences": {...}, "status": "success"}`
  - **500:** `{"detail": "Failed to update preferences: ..."}`

### 12. Search Emails
- **Path:** `/emails/search`
- **Method:** GET
- **Purpose:** Search processed emails
- **Request Parameters:** None
- **Query Parameters:**
  - `query`: string (required) - Search query
  - `category`: string (optional) - Filter by category
  - `urgency`: string (optional) - Filter by urgency
  - `limit`: integer (1-100, default: 20) - Maximum number of results
- **Request Body:** None
- **Responses:**
  - **200:** `{"query": "string", "filters": {...}, "results": [...], "total_count": 25, "limit": 20}`
  - **500:** `{"detail": "Search failed: ..."}`

---

## Calendar Management Endpoints

### 13. List Calendars
- **Path:** `/calendar/calendars`
- **Method:** GET
- **Purpose:** Get list of available Google Calendars
- **Request Parameters:** None
- **Query Parameters:** None
- **Request Body:** None
- **Responses:**
  - **200:** `{"calendars": [...]}`
  - **401:** `{"detail": "Google Calendar authentication failed"}`
  - **500:** `{"detail": "Failed to list calendars: ..."}`

### 14. Create Event
- **Path:** `/calendar/events`
- **Method:** POST
- **Purpose:** Create a new calendar event
- **Request Parameters:** None
- **Query Parameters:** None
- **Request Body:**
  ```json
  {
    "summary": "string (required, max 255 chars)",
    "description": "string (optional)",
    "start_time": "datetime (required)",
    "end_time": "datetime (required)",
    "attendees": ["string"] (optional),
    "location": "string (optional)",
    "timezone": "string (default: UTC)",
    "recurrence": "object (optional)",
    "reminders": ["integer"] (default: [15])
  }
  ```
- **Responses:**
  - **200:** `{"id": "string", "summary": "string", "description": "string", "start_time": "datetime", "end_time": "datetime", "attendees": [...], "location": "string", "timezone": "string", "status": "string", "created": "datetime", "updated": "datetime", "link": "string"}`
  - **401:** `{"detail": "Google Calendar authentication failed"}`
  - **500:** `{"detail": "Failed to create event: ..."}`

### 15. List Events
- **Path:** `/calendar/events`
- **Method:** GET
- **Purpose:** List calendar events
- **Request Parameters:** None
- **Query Parameters:**
  - `start_date`: datetime (optional) - Start date for event search
  - `end_date`: datetime (optional) - End date for event search
  - `calendar_id`: string (default: primary) - Calendar ID to search
  - `max_results`: integer (1-1000, default: 100) - Maximum number of events to return
- **Request Body:** None
- **Responses:**
  - **200:** `[{"id": "string", "summary": "string", "description": "string", "start_time": "datetime", "end_time": "datetime", "attendees": [...], "location": "string", "timezone": "string", "status": "string", "created": "datetime", "updated": "datetime", "link": "string"}]`
  - **401:** `{"detail": "Google Calendar authentication failed"}`
  - **500:** `{"detail": "Failed to list events: ..."}`

### 16. Get Event
- **Path:** `/calendar/events/{event_id}`
- **Method:** GET
- **Purpose:** Get specific calendar event details
- **Request Parameters:**
  - `event_id`: string (required) - Event ID
- **Query Parameters:**
  - `calendar_id`: string (default: primary) - Calendar ID
- **Request Body:** None
- **Responses:**
  - **200:** `{"id": "string", "summary": "string", "description": "string", "start_time": "datetime", "end_time": "datetime", "attendees": [...], "location": "string", "timezone": "string", "status": "string", "created": "datetime", "updated": "datetime", "link": "string"}`
  - **404:** `{"detail": "Event not found"}`
  - **401:** `{"detail": "Google Calendar authentication failed"}`
  - **500:** `{"detail": "Failed to get event: ..."}`

### 17. Update Event
- **Path:** `/calendar/events/{event_id}`
- **Method:** PUT
- **Purpose:** Update an existing calendar event
- **Request Parameters:**
  - `event_id`: string (required) - Event ID
- **Query Parameters:** None
- **Request Body:** Same as Create Event
- **Responses:**
  - **200:** `{"id": "string", "summary": "string", "description": "string", "start_time": "datetime", "end_time": "datetime", "attendees": [...], "location": "string", "timezone": "string", "status": "string", "created": "datetime", "updated": "datetime", "link": "string"}`
  - **401:** `{"detail": "Google Calendar authentication failed"}`
  - **500:** `{"detail": "Failed to update event: ..."}`

### 18. Delete Event
- **Path:** `/calendar/events/{event_id}`
- **Method:** DELETE
- **Purpose:** Delete a calendar event
- **Request Parameters:**
  - `event_id`: string (required) - Event ID
- **Query Parameters:**
  - `calendar_id`: string (default: primary) - Calendar ID
- **Request Body:** None
- **Responses:**
  - **200:** `{"message": "Event deleted successfully", "event_id": "string", "status": "deleted"}`
  - **401:** `{"detail": "Google Calendar authentication failed"}`
  - **500:** `{"detail": "Failed to delete event: ..."}`

### 19. Find Free Time
- **Path:** `/calendar/free-time`
- **Method:** POST
- **Purpose:** Find available free time slots
- **Request Parameters:** None
- **Query Parameters:** None
- **Request Body:**
  ```json
  {
    "start_date": "datetime (required)",
    "end_date": "datetime (required)",
    "duration_minutes": "integer (required, > 0)",
    "calendars": ["string"] (optional),
    "working_hours_only": "boolean (default: true)",
    "timezone": "string (default: UTC)"
  }
  ```
- **Responses:**
  - **200:** `{"request_duration": 60, "search_period": {...}, "free_slots": [...], "total_slots": 5}`
  - **500:** `{"detail": "Failed to find free time: ..."}`

### 20. Detect Conflicts
- **Path:** `/calendar/conflicts`
- **Method:** POST
- **Purpose:** Detect scheduling conflicts for an event
- **Request Parameters:** None
- **Query Parameters:** None
- **Request Body:**
  ```json
  {
    "event": {
      "summary": "string (required)",
      "description": "string (optional)",
      "start_time": "datetime (required)",
      "end_time": "datetime (required)",
      "attendees": ["string"] (optional),
      "location": "string (optional)",
      "timezone": "string (default: UTC)",
      "recurrence": "object (optional)",
      "reminders": ["integer"] (default: [15])
    },
    "calendars": ["string"] (optional)
  }
  ```
- **Responses:**
  - **200:** `{"has_conflicts": true, "conflicts": [...], "suggestions": [...]}`
  - **500:** `{"detail": "Failed to detect conflicts: ..."}`

### 21. AI Schedule
- **Path:** `/calendar/ai-schedule`
- **Method:** POST
- **Purpose:** AI-powered scheduling using natural language
- **Request Parameters:** None
- **Query Parameters:** None
- **Request Body:**
  ```json
  {
    "command": "string (required)"
  }
  ```
- **Responses:**
  - **200:** `{"success": true, "message": "string", "created_event": {...}, "suggestions": [...], "confidence": 0.85, "requires_confirmation": false}`
  - **500:** `{"detail": "AI scheduling failed: ..."}`

### 22. Summarize Meeting
- **Path:** `/calendar/summarize-meeting`
- **Method:** POST
- **Purpose:** Summarize meeting notes using AI
- **Request Parameters:** None
- **Query Parameters:** None
- **Request Body:**
  ```json
  {
    "meeting_notes": "string (required)"
  }
  ```
- **Responses:**
  - **200:** `{"summary": "string", "key_points": [...], "action_items": [...], "decisions": [...], "next_steps": [...], "follow_up_date": "string", "confidence": 0.85}`
  - **500:** `{"detail": "Meeting summarization failed: ..."}`

### 23. Get Today's Events
- **Path:** `/calendar/today`
- **Method:** GET
- **Purpose:** Get today's calendar events
- **Request Parameters:** None
- **Query Parameters:**
  - `calendar_id`: string (default: primary) - Calendar ID
- **Request Body:** None
- **Responses:**
  - **200:** `{"date": "2025-08-15", "total_events": 3, "events": [...]}`
  - **401:** `{"detail": "Google Calendar authentication failed"}`
  - **500:** `{"detail": "Failed to get today's events: ..."}`

### 24. Get Upcoming Events
- **Path:** `/calendar/upcoming`
- **Method:** GET
- **Purpose:** Get upcoming calendar events
- **Request Parameters:** None
- **Query Parameters:**
  - `days`: integer (1-30, default: 7) - Number of days to look ahead
  - `calendar_id`: string (default: primary) - Calendar ID
- **Request Body:** None
- **Responses:**
  - **200:** `{"period_days": 7, "total_events": 15, "events_by_day": {...}}`
  - **401:** `{"detail": "Google Calendar authentication failed"}`
  - **500:** `{"detail": "Failed to get upcoming events: ..."}`

---

## AI Processing Endpoints

### 25. Classify Email
- **Path:** `/ai/classify-email`
- **Method:** POST
- **Purpose:** Classify email using AI
- **Request Parameters:** None
- **Query Parameters:** None
- **Request Body:** Same as Process Single Email
- **Responses:**
  - **200:** `{"category": "string", "urgency": "string", "actionability": "string", "sender_importance": "string", "confidence_score": 0.85, "reasoning": "string", "requires_human_review": false}`
  - **500:** `{"detail": "Email classification failed: ..."}`

### 26. Summarize Email
- **Path:** `/ai/summarize-email`
- **Method:** POST
- **Purpose:** Summarize email content using AI
- **Request Parameters:** None
- **Query Parameters:** None
- **Request Body:** Same as Process Single Email
- **Responses:**
  - **200:** `{"brief_summary": "string", "key_points": [...], "action_items": [...], "deadlines": [...], "mentioned_people": [...], "mentioned_dates": [...], "sentiment": "string", "confidence": 0.85}`
  - **500:** `{"detail": "Email summarization failed: ..."}`

### 27. Analyze Intent
- **Path:** `/ai/analyze-intent`
- **Method:** POST
- **Purpose:** Analyze email intent using AI
- **Request Parameters:** None
- **Query Parameters:** None
- **Request Body:** Same as Process Single Email
- **Responses:**
  - **200:** `{"primary_intent": "string", "secondary_intents": [...], "confidence": 0.85, "requires_response": true, "expected_response_time": "string"}`
  - **500:** `{"detail": "Email intent analysis failed: ..."}`

### 28. Generate Draft
- **Path:** `/ai/generate-draft`
- **Method:** POST
- **Purpose:** Generate email response draft using AI
- **Request Parameters:** None
- **Query Parameters:** None
- **Request Body:** Same as Process Single Email
- **Responses:**
  - **200:** `{"email_id": "string", "generated_draft": "string", "confidence": 0.85, "tone_used": "string", "processing_time": 2.3, "recommendations": [...]}`
  - **500:** `{"detail": "Draft generation failed: ..."}`

### 29. AI Schedule Command
- **Path:** `/ai/schedule`
- **Method:** POST
- **Purpose:** AI-powered scheduling using natural language commands
- **Request Parameters:** None
- **Query Parameters:** None
- **Request Body:**
  ```json
  {
    "command": "string (required)"
  }
  ```
- **Responses:**
  - **200:** `{"success": true, "message": "string", "created_event": {...}, "suggestions": [...], "confidence": 0.85, "requires_confirmation": false}`
  - **500:** `{"detail": "AI scheduling failed: ..."}`

### 30. Summarize Meeting Notes
- **Path:** `/ai/summarize-meeting`
- **Method:** POST
- **Purpose:** Summarize meeting notes using AI
- **Request Parameters:** None
- **Query Parameters:** None
- **Request Body:**
  ```json
  {
    "meeting_notes": "string (required)"
  }
  ```
- **Responses:**
  - **200:** `{"summary": "string", "key_points": [...], "action_items": [...], "decisions": [...], "next_steps": [...], "follow_up_date": "string", "confidence": 0.85}`
  - **500:** `{"detail": "Meeting summarization failed: ..."}`

### 31. Parse Command
- **Path:** `/ai/parse-command`
- **Method:** POST
- **Purpose:** Parse natural language command without executing it
- **Request Parameters:** None
- **Query Parameters:**
  - `command`: string (required) - Natural language command to parse
- **Request Body:** None
- **Responses:**
  - **200:** `{"command": "string", "parsed_data": {...}, "confidence": 0.8, "validation": {...}}`
  - **400:** `{"detail": "Could not parse command"}`
  - **500:** `{"detail": "Command parsing failed: ..."}`

### 32. Get Quick Responses
- **Path:** `/ai/quick-responses`
- **Method:** GET
- **Purpose:** Get quick response suggestions for an email
- **Request Parameters:** None
- **Query Parameters:**
  - `email_id`: string (required) - Email ID for context
- **Request Body:** None
- **Responses:**
  - **200:** `{"email_id": "string", "suggestions": [...], "total_suggestions": 4}`
  - **500:** `{"detail": "Failed to get quick responses: ..."}`

### 33. Learn from Feedback
- **Path:** `/ai/learn-from-feedback`
- **Method:** POST
- **Purpose:** Provide feedback for AI learning and improvement
- **Request Parameters:** None
- **Query Parameters:**
  - `email_id`: string (required) - Email ID
  - `feedback_type`: string (required) - Type of feedback
  - `original_result`: string (required) - Original AI result
  - `corrected_result`: string (required) - User-corrected result
  - `rating`: integer (1-5, required) - Rating from 1-5
- **Request Body:** None
- **Responses:**
  - **200:** `{"message": "Feedback recorded successfully", "email_id": "string", "feedback_type": "string", "learning_status": "processed"}`
  - **400:** `{"detail": "Failed to record feedback"}`
  - **500:** `{"detail": "Feedback recording failed: ..."}`

### 34. Get Processing Stats
- **Path:** `/ai/processing-stats`
- **Method:** GET
- **Purpose:** Get AI processing statistics and performance metrics
- **Request Parameters:** None
- **Query Parameters:**
  - `days`: integer (1-365, default: 7) - Number of days for statistics
- **Request Body:** None
- **Responses:**
  - **200:** `{"period_days": 7, "total_emails_processed": 150, "average_processing_time": 2.3, "confidence_scores": {...}, "human_review_rate": 0.15, "error_rate": 0.02, "category_distribution": {...}, "urgency_distribution": {...}, "learning_progress": {...}}`
  - **500:** `{"detail": "Failed to get processing statistics: ..."}`

### 35. Batch AI Processing
- **Path:** `/ai/batch-process`
- **Method:** POST
- **Purpose:** Process multiple emails with AI in batch
- **Request Parameters:** None
- **Query Parameters:**
  - `parallel_processing`: boolean (default: true) - Process emails in parallel
- **Request Body:**
  ```json
  [
    {
      "email_id": "string (required)",
      "sender": "email (required)",
      "recipients": ["email"] (optional),
      "subject": "string (required)",
      "body": "string (required)",
      "html_body": "string (optional)",
      "include_draft": "boolean (default: true)",
      "user_preferences": "object (optional)"
    }
  ]
  ```
- **Responses:**
  - **200:** `{"total_emails": 5, "successful": 4, "failed": 1, "processing_mode": "parallel", "results": [...], "total_processing_time": 12.5}`
  - **500:** `{"detail": "Batch processing failed: ..."}`

---

## Analytics Endpoints

### 36. Email Analytics
- **Path:** `/analytics/email-stats`
- **Method:** GET
- **Purpose:** Get comprehensive email processing analytics
- **Request Parameters:** None
- **Query Parameters:**
  - `days`: integer (1-365, default: 7) - Number of days for analysis
- **Request Body:** None
- **Responses:**
  - **200:** `{"period_days": 7, "total_emails_processed": 150, "average_processing_time": 2.3, "confidence_scores": {...}, "human_review_rate": 0.15, "error_rate": 0.02, "category_distribution": {...}, "urgency_distribution": {...}}`
  - **500:** `{"detail": "Failed to get email analytics: ..."}`

### 37. Calendar Analytics
- **Path:** `/analytics/calendar-stats`
- **Method:** GET
- **Purpose:** Get calendar usage analytics
- **Request Parameters:** None
- **Query Parameters:**
  - `days`: integer (1-365, default: 30) - Number of days for analysis
  - `calendar_id`: string (default: primary) - Calendar ID to analyze
- **Request Body:** None
- **Responses:**
  - **200:** `{"period_days": 30, "calendar_id": "string", "total_events": 45, "total_duration_hours": 67.5, "average_duration_hours": 1.5, "average_attendees": 3.2, "event_types": {...}, "busiest_hours": [...], "productivity_metrics": {...}}`
  - **401:** `{"detail": "Google Calendar authentication failed"}`
  - **500:** `{"detail": "Failed to get calendar analytics: ..."}`

### 38. Learning Analytics
- **Path:** `/analytics/learning-insights`
- **Method:** GET
- **Purpose:** Get AI learning and improvement analytics
- **Request Parameters:** None
- **Query Parameters:**
  - `days`: integer (1-365, default: 30) - Number of days for analysis
- **Request Body:** None
- **Responses:**
  - **200:** `{"period_days": 30, "feedback_count": 25, "model_updates": 3, "improvement_metrics": {...}, "learning_patterns": {...}, "performance_trends": {...}}`
  - **500:** `{"detail": "Failed to get learning analytics: ..."}`

### 39. User Behavior Analytics
- **Path:** `/analytics/user-behavior`
- **Method:** GET
- **Purpose:** Analyze user behavior patterns
- **Request Parameters:** None
- **Query Parameters:**
  - `days`: integer (1-365, default: 30) - Number of days for analysis
- **Request Body:** None
- **Responses:**
  - **200:** `{"period_days": 30, "total_emails_analyzed": 150, "processing_patterns": {...}, "response_patterns": {...}, "user_preferences": {...}, "productivity_insights": {...}}`
  - **500:** `{"detail": "Failed to get user behavior analytics: ..."}`

### 40. Performance Metrics
- **Path:** `/analytics/performance-metrics`
- **Method:** GET
- **Purpose:** Get comprehensive performance metrics
- **Request Parameters:** None
- **Query Parameters:**
  - `days`: integer (1-365, default: 7) - Number of days for analysis
- **Request Body:** None
- **Responses:**
  - **200:** `{"period_days": 7, "email_metrics": {...}, "calendar_metrics": {...}, "performance_metrics": {...}, "trends": {...}}`
  - **500:** `{"detail": "Failed to get performance metrics: ..."}`

### 41. Comparative Analysis
- **Path:** `/analytics/comparative-analysis`
- **Method:** GET
- **Purpose:** Compare performance between two time periods
- **Request Parameters:** None
- **Query Parameters:**
  - `period1_days`: integer (1-30, default: 7) - First period in days
  - `period2_days`: integer (1-30, default: 7) - Second period in days
- **Request Body:** None
- **Responses:**
  - **200:** `{"period1": {...}, "period2": {...}, "improvements": {...}, "insights": {...}}`
  - **500:** `{"detail": "Failed to get comparative analysis: ..."}`

### 42. Export Report
- **Path:** `/analytics/export-report`
- **Method:** GET
- **Purpose:** Export analytics report in various formats
- **Request Parameters:** None
- **Query Parameters:**
  - `report_type`: string (required) - Type of report (email, calendar, learning, comprehensive)
  - `format`: string (default: json) - Export format (json, csv)
  - `days`: integer (1-365, default: 30) - Number of days for report
- **Request Body:** None
- **Responses:**
  - **200:** `{"format": "json", "content": {...}}` or `{"format": "csv", "content": "string"}`
  - **400:** `{"detail": "Invalid report type"}`
  - **500:** `{"detail": "Failed to export report: ..."}`

---

## Summary

**Total Endpoints:** 42
- **Health & Status:** 3 endpoints
- **Email Processing:** 9 endpoints
- **Calendar Management:** 12 endpoints
- **AI Processing:** 11 endpoints
- **Analytics:** 7 endpoints

**Authentication:** Google Calendar endpoints require authentication
**Error Handling:** All endpoints return structured error responses
**Response Format:** JSON for all endpoints
**API Version:** v1
**Base URL:** `http://localhost:8000/api/v1`
