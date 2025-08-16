# Environment Setup

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# FastAPI Backend Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1

# Optional: Override for production
# NEXT_PUBLIC_API_BASE_URL=https://your-production-api.com/api/v1
```

## Backend Connection

The frontend is now configured to automatically fetch and display dynamic data from the FastAPI backend using:

1. **Zustand Stores**: All API calls are handled through centralized stores
2. **Axios Instance**: Configured in `utils/api.ts` with proper error handling
3. **TypeScript Types**: Full type safety for all API interactions
4. **Error Handling**: Graceful fallback UI for failed API calls
5. **Loading States**: Proper loading indicators during data fetching

## Components Updated

The following components now use dynamic data from the backend:

- **InboxView**: Fetches and displays processed emails with AI categorization
- **CalendarView**: Shows calendar events and meeting requests
- **RemindersView**: Displays proactive reminders based on email and calendar data
- **SettingsView**: Shows AI processing stats and decision history

## API Endpoints Used

The frontend integrates with these backend endpoints:

- Email processing and classification
- Calendar event management
- AI processing statistics
- User preferences
- System health monitoring

## Getting Started

1. Ensure your FastAPI backend is running on `http://localhost:8000`
2. Set up the environment variables as shown above
3. Start the frontend development server: `npm run dev`
4. The UI will automatically fetch and display data from the backend

## Troubleshooting

If you see loading states or error messages:

1. Check that the backend is running and accessible
2. Verify the `NEXT_PUBLIC_API_BASE_URL` is correct
3. Check browser console for any API errors
4. Ensure CORS is properly configured on the backend


