'use client';

import React, { useState, useEffect } from 'react';
import { useCalendarStore } from '../stores';
import { CreateEventRequest, CalendarEvent, FreeTimeRequest } from '../types/api';

const CalendarManager: React.FC = () => {
  const {
    events,
    todayEvents,
    upcomingEvents,
    freeTimeSlots,
    isLoading,
    error,
    listEvents,
    createEvent,
    getTodayEvents,
    getUpcomingEvents,
    findFreeTime,
    aiSchedule,
    clearError,
  } = useCalendarStore();

  const [eventData, setEventData] = useState<CreateEventRequest>({
    summary: '',
    description: '',
    start_time: '',
    end_time: '',
    attendees: [],
    location: '',
    timezone: 'UTC',
  });

  const [freeTimeRequest, setFreeTimeRequest] = useState<FreeTimeRequest>({
    start_date: '',
    end_date: '',
    duration_minutes: 60,
    working_hours_only: true,
    timezone: 'UTC',
  });

  const [aiCommand, setAiCommand] = useState('');

  useEffect(() => {
    // Load events on component mount
    listEvents();
    getTodayEvents();
    getUpcomingEvents(7);
  }, [listEvents, getTodayEvents, getUpcomingEvents]);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!eventData.summary || !eventData.start_time || !eventData.end_time) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await createEvent(eventData);
      // Reset form
      setEventData({
        summary: '',
        description: '',
        start_time: '',
        end_time: '',
        attendees: [],
        location: '',
        timezone: 'UTC',
      });
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  const handleFindFreeTime = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!freeTimeRequest.start_date || !freeTimeRequest.end_date) {
      alert('Please fill in start and end dates');
      return;
    }

    try {
      await findFreeTime(freeTimeRequest);
    } catch (error) {
      console.error('Failed to find free time:', error);
    }
  };

  const handleAISchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!aiCommand.trim()) {
      alert('Please enter a command');
      return;
    }

    try {
      const result = await aiSchedule(aiCommand);
      alert(`AI Schedule Result: ${result.message}`);
      setAiCommand('');
    } catch (error) {
      console.error('Failed to schedule with AI:', error);
    }
  };

  const handleInputChange = (field: keyof CreateEventRequest, value: string | string[]) => {
    setEventData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFreeTimeInputChange = (field: keyof FreeTimeRequest, value: string | number | boolean) => {
    setFreeTimeRequest(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <p>Error: {error}</p>
        <button 
          onClick={clearError}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Clear Error
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Calendar Management</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create Event Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Create New Event</h3>
          <form onSubmit={handleCreateEvent} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Summary *
              </label>
              <input
                type="text"
                value={eventData.summary}
                onChange={(e) => handleInputChange('summary', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Event title"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={eventData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Event description"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time *
                </label>
                <input
                  type="datetime-local"
                  value={eventData.start_time}
                  onChange={(e) => handleInputChange('start_time', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Time *
                </label>
                <input
                  type="datetime-local"
                  value={eventData.end_time}
                  onChange={(e) => handleInputChange('end_time', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={eventData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Event location"
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating...' : 'Create Event'}
            </button>
          </form>
        </div>

        {/* Find Free Time Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Find Free Time</h3>
          <form onSubmit={handleFindFreeTime} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date *
                </label>
                <input
                  type="datetime-local"
                  value={freeTimeRequest.start_date}
                  onChange={(e) => handleFreeTimeInputChange('start_date', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date *
                </label>
                <input
                  type="datetime-local"
                  value={freeTimeRequest.end_date}
                  onChange={(e) => handleFreeTimeInputChange('end_date', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes)
              </label>
              <input
                type="number"
                value={freeTimeRequest.duration_minutes}
                onChange={(e) => handleFreeTimeInputChange('duration_minutes', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="15"
                step="15"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={freeTimeRequest.working_hours_only}
                onChange={(e) => handleFreeTimeInputChange('working_hours_only', e.target.checked)}
                className="mr-2"
              />
              <label className="text-sm text-gray-700">Working hours only</label>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Finding...' : 'Find Free Time'}
            </button>
          </form>
        </div>
      </div>

      {/* AI Schedule */}
      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">AI Schedule Assistant</h3>
        <form onSubmit={handleAISchedule} className="flex gap-4">
          <input
            type="text"
            value={aiCommand}
            onChange={(e) => setAiCommand(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Schedule a meeting with John tomorrow at 2pm for 1 hour"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-purple-600 text-white py-2 px-6 rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : 'Schedule'}
          </button>
        </form>
      </div>

      {/* Free Time Slots */}
      {freeTimeSlots && (
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Available Free Time Slots</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {freeTimeSlots.free_slots.map((slot, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <p className="font-medium">{new Date(slot.start).toLocaleString()}</p>
                <p className="text-sm text-gray-600">
                  Duration: {slot.duration_minutes} minutes
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Today's Events */}
      {todayEvents && (
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Today's Events ({todayEvents.date})</h3>
          {todayEvents.events.length === 0 ? (
            <p className="text-gray-500">No events scheduled for today.</p>
          ) : (
            <div className="space-y-3">
              {todayEvents.events.map((event: CalendarEvent) => (
                <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium">{event.summary}</h4>
                  <p className="text-sm text-gray-600">{event.description}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(event.start_time).toLocaleTimeString()} - {new Date(event.end_time).toLocaleTimeString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Upcoming Events */}
      {upcomingEvents && (
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Upcoming Events (Next {upcomingEvents.period_days} days)</h3>
          <div className="space-y-4">
            {Object.entries(upcomingEvents.events_by_day).map(([date, dayEvents]) => (
              <div key={date}>
                <h5 className="font-medium text-gray-700 mb-2">{new Date(date).toLocaleDateString()}</h5>
                <div className="space-y-2">
                  {dayEvents.map((event: CalendarEvent) => (
                    <div key={event.id} className="border border-gray-200 rounded-lg p-3">
                      <h6 className="font-medium">{event.summary}</h6>
                      <p className="text-xs text-gray-500">
                        {new Date(event.start_time).toLocaleTimeString()} - {new Date(event.end_time).toLocaleTimeString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarManager;


