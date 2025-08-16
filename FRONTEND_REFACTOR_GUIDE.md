# Frontend Refactor Guide

## Overview

This document outlines the refactored frontend architecture that integrates with the FastAPI backend using Axios for API calls and Zustand for state management.

## Architecture Overview

```
frontend/
├── utils/
│   └── api.ts                 # Centralized Axios instance
├── types/
│   └── api.ts                 # TypeScript types for all API endpoints
├── stores/
│   ├── index.ts               # Store exports
│   ├── emailStore.ts          # Email processing store
│   ├── calendarStore.ts       # Calendar management store
│   ├── analyticsStore.ts      # Analytics store
│   ├── healthStore.ts         # System health store
│   └── aiStore.ts             # AI processing store
├── components/
│   ├── EmailProcessor.tsx     # Email processing component
│   ├── CalendarManager.tsx    # Calendar management component
│   ├── AnalyticsDashboard.tsx # Analytics dashboard
│   └── SystemHealth.tsx       # System health monitoring
└── app/
    └── page.tsx               # Main application page
```

## Key Principles

1. **Centralized API Management**: All API calls go through a single Axios instance
2. **Store-First Architecture**: All API calls are handled in Zustand stores
3. **Type Safety**: Comprehensive TypeScript types for all API endpoints
4. **Separation of Concerns**: Each feature has its own dedicated store
5. **Error Handling**: Consistent error handling across all stores
6. **Caching**: Built-in caching mechanisms for improved performance

## API Configuration

### Centralized Axios Instance (`utils/api.ts`)

```typescript
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## Store Architecture

### Store Structure

Each store follows this pattern:

```typescript
interface StoreState extends LoadingState {
  // Data properties
  data: DataType[];
  
  // Actions
  fetchData: () => Promise<void>;
  createItem: (item: CreateItemRequest) => Promise<Item>;
  updateItem: (id: string, item: UpdateItemRequest) => Promise<Item>;
  deleteItem: (id: string) => Promise<void>;
  
  // Utility methods
  clearError: () => void;
  clearCache: () => void;
}
```

### Store Features

1. **Loading States**: Each store tracks loading state for operations
2. **Error Handling**: Centralized error handling with user-friendly messages
3. **Caching**: Built-in caching for frequently accessed data
4. **Pagination**: Support for paginated data loading
5. **Optimistic Updates**: Immediate UI updates with rollback on error

## Available Stores

### 1. Email Store (`stores/emailStore.ts`)

**Purpose**: Handles all email processing operations

**Key Features**:
- Process single emails with AI
- Batch process multiple emails
- Fetch emails from IMAP
- Get emails for human review
- Provide feedback for AI learning
- Search and filter emails
- Email statistics and analytics

**Usage Example**:
```typescript
import { useEmailStore } from '../stores';

const { processSingleEmail, processedEmails, isLoading, error } = useEmailStore();

// Process an email
await processSingleEmail({
  email_id: '123',
  sender: 'sender@example.com',
  subject: 'Test Email',
  body: 'Email content...'
});
```

### 2. Calendar Store (`stores/calendarStore.ts`)

**Purpose**: Manages calendar events and scheduling

**Key Features**:
- Create, read, update, delete calendar events
- Find free time slots
- Detect scheduling conflicts
- AI-powered scheduling
- Meeting summarization
- Today's and upcoming events

**Usage Example**:
```typescript
import { useCalendarStore } from '../stores';

const { createEvent, events, findFreeTime, aiSchedule } = useCalendarStore();

// Create an event
await createEvent({
  summary: 'Team Meeting',
  start_time: '2024-01-15T10:00:00Z',
  end_time: '2024-01-15T11:00:00Z',
  description: 'Weekly team sync'
});
```

### 3. Analytics Store (`stores/analyticsStore.ts`)

**Purpose**: Provides comprehensive analytics and reporting

**Key Features**:
- Email processing analytics
- Calendar usage analytics
- Learning and improvement metrics
- User behavior analysis
- Performance metrics
- Comparative analysis
- Report export functionality

**Usage Example**:
```typescript
import { useAnalyticsStore } from '../stores';

const { getEmailAnalytics, emailStats, getPerformanceMetrics } = useAnalyticsStore();

// Get email analytics for last 7 days
await getEmailAnalytics(7);
```

### 4. Health Store (`stores/healthStore.ts`)

**Purpose**: Monitors system health and status

**Key Features**:
- Basic health status checks
- Detailed health information
- System metrics monitoring
- Service status tracking
- Auto-refresh capabilities

**Usage Example**:
```typescript
import { useHealthStore } from '../stores';

const { checkHealth, healthStatus, getSystemMetrics } = useHealthStore();

// Check system health
await checkHealth();
```

### 5. AI Store (`stores/aiStore.ts`)

**Purpose**: Handles AI-specific processing operations

**Key Features**:
- Email classification
- Email summarization
- Intent analysis
- Draft generation
- Command parsing
- Batch AI processing
- Learning from feedback

**Usage Example**:
```typescript
import { useAIStore } from '../stores';

const { classifyEmail, summarizeEmail, generateDraft } = useAIStore();

// Classify an email
const classification = await classifyEmail(emailData);
```

## Component Usage

### Example: Email Processing Component

```typescript
'use client';

import React, { useState, useEffect } from 'react';
import { useEmailStore } from '../stores';

const EmailProcessor: React.FC = () => {
  const {
    processedEmails,
    isLoading,
    error,
    processSingleEmail,
    getEmailStats,
    emailStats,
    clearError,
  } = useEmailStore();

  const [emailData, setEmailData] = useState({
    email_id: '',
    sender: '',
    subject: '',
    body: '',
  });

  useEffect(() => {
    getEmailStats(7);
  }, [getEmailStats]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await processSingleEmail(emailData);
      // Form will be reset automatically by the store
    } catch (error) {
      console.error('Failed to process email:', error);
    }
  };

  // Component JSX...
};
```

## Environment Configuration

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```

## Best Practices

### 1. Store Usage

- Always use stores for API calls, never call APIs directly in components
- Use the `isLoading` state to show loading indicators
- Handle errors gracefully using the `error` state
- Clear errors when appropriate using `clearError()`

### 2. Type Safety

- Always use the provided TypeScript types
- Don't use `any` types unless absolutely necessary
- Leverage TypeScript for better development experience

### 3. Error Handling

```typescript
const { error, clearError } = useEmailStore();

if (error) {
  return (
    <div className="error-container">
      <p>Error: {error}</p>
      <button onClick={clearError}>Clear Error</button>
    </div>
  );
}
```

### 4. Loading States

```typescript
const { isLoading } = useEmailStore();

if (isLoading) {
  return <div>Loading...</div>;
}
```

### 5. Caching

- Stores automatically cache data for better performance
- Use `clearCache()` when you need fresh data
- Cached data is available immediately while new data loads

## API Endpoint Mapping

All stores are designed to match the FastAPI backend endpoints exactly:

- **Email Store**: `/emails/*` endpoints
- **Calendar Store**: `/calendar/*` endpoints  
- **Analytics Store**: `/analytics/*` endpoints
- **Health Store**: `/health/*` endpoints
- **AI Store**: `/ai/*` endpoints

## Migration Guide

### From Direct API Calls

**Before**:
```typescript
// Direct API call in component
const response = await fetch('/api/emails/process', {
  method: 'POST',
  body: JSON.stringify(emailData)
});
const result = await response.json();
```

**After**:
```typescript
// Using store
const { processSingleEmail } = useEmailStore();
const result = await processSingleEmail(emailData);
```

### From Local State

**Before**:
```typescript
const [emails, setEmails] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

const fetchEmails = async () => {
  setLoading(true);
  try {
    const response = await fetch('/api/emails');
    const data = await response.json();
    setEmails(data);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

**After**:
```typescript
const { processedEmails, isLoading, error, fetchEmails } = useEmailStore();

useEffect(() => {
  fetchEmails();
}, [fetchEmails]);
```

## Testing

### Store Testing

```typescript
import { renderHook, act } from '@testing-library/react';
import { useEmailStore } from '../stores/emailStore';

test('should process email successfully', async () => {
  const { result } = renderHook(() => useEmailStore());
  
  await act(async () => {
    await result.current.processSingleEmail({
      email_id: 'test-123',
      sender: 'test@example.com',
      subject: 'Test',
      body: 'Test content'
    });
  });
  
  expect(result.current.processedEmails).toHaveLength(1);
  expect(result.current.error).toBeNull();
});
```

## Performance Considerations

1. **Caching**: Stores automatically cache data to reduce API calls
2. **Pagination**: Use pagination for large datasets
3. **Optimistic Updates**: Immediate UI updates for better UX
4. **Error Boundaries**: Implement error boundaries for graceful error handling
5. **Lazy Loading**: Load data only when needed

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend allows requests from frontend origin
2. **Authentication Errors**: Check if auth token is properly set
3. **Type Errors**: Verify all API responses match TypeScript types
4. **Store Not Updating**: Ensure you're using the store in a React component

### Debug Tools

- Use Redux DevTools for Zustand store debugging
- Check browser network tab for API calls
- Use console.log for debugging store state

## Conclusion

This refactored architecture provides a clean, maintainable, and scalable foundation for the frontend application. By centralizing API calls in stores and using TypeScript for type safety, the codebase is more robust and easier to maintain.

For questions or issues, refer to the API documentation and store implementations for specific endpoint details.


