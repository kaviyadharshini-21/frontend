'use client';

import React, { useState, useEffect } from 'react';
import { useAnalyticsStore } from '../stores';

const AnalyticsDashboard: React.FC = () => {
  const {
    emailStats,
    calendarAnalytics,
    learningAnalytics,
    userBehaviorAnalytics,
    performanceMetrics,
    isLoading,
    error,
    getEmailAnalytics,
    getCalendarAnalytics,
    getLearningAnalytics,
    getUserBehaviorAnalytics,
    getPerformanceMetrics,
    clearError,
  } = useAnalyticsStore();

  const [selectedPeriod, setSelectedPeriod] = useState(7);

  useEffect(() => {
    // Load all analytics data on component mount
    getEmailAnalytics(selectedPeriod);
    getCalendarAnalytics(selectedPeriod);
    getLearningAnalytics(selectedPeriod);
    getUserBehaviorAnalytics(selectedPeriod);
    getPerformanceMetrics(selectedPeriod);
  }, [selectedPeriod, getEmailAnalytics, getCalendarAnalytics, getLearningAnalytics, getUserBehaviorAnalytics, getPerformanceMetrics]);

  const handlePeriodChange = (period: number) => {
    setSelectedPeriod(period);
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
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <div className="flex gap-2">
          {[7, 30, 90].map((period) => (
            <button
              key={period}
              onClick={() => handlePeriodChange(period)}
              className={`px-4 py-2 rounded-md ${
                selectedPeriod === period
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {period} days
            </button>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading analytics...</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Email Analytics */}
        {emailStats && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Email Analytics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{emailStats.total_emails_processed}</p>
                <p className="text-sm text-gray-600">Total Processed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{emailStats.average_processing_time.toFixed(2)}s</p>
                <p className="text-sm text-gray-600">Avg Processing Time</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">{(emailStats.human_review_rate * 100).toFixed(1)}%</p>
                <p className="text-sm text-gray-600">Human Review Rate</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{(emailStats.error_rate * 100).toFixed(1)}%</p>
                <p className="text-sm text-gray-600">Error Rate</p>
              </div>
            </div>
            
            {/* Category Distribution */}
            <div className="mt-6">
              <h4 className="font-medium mb-3">Category Distribution</h4>
              <div className="space-y-2">
                {Object.entries(emailStats.category_distribution).map(([category, count]) => (
                  <div key={category} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{category}</span>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Calendar Analytics */}
        {calendarAnalytics && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Calendar Analytics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{calendarAnalytics.total_events}</p>
                <p className="text-sm text-gray-600">Total Events</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-indigo-600">{calendarAnalytics.total_duration_hours.toFixed(1)}h</p>
                <p className="text-sm text-gray-600">Total Duration</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-pink-600">{calendarAnalytics.average_duration_hours.toFixed(1)}h</p>
                <p className="text-sm text-gray-600">Avg Duration</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-teal-600">{calendarAnalytics.average_attendees.toFixed(1)}</p>
                <p className="text-sm text-gray-600">Avg Attendees</p>
              </div>
            </div>
            
            {/* Event Types */}
            <div className="mt-6">
              <h4 className="font-medium mb-3">Event Types</h4>
              <div className="space-y-2">
                {Object.entries(calendarAnalytics.event_types).map(([type, count]) => (
                  <div key={type} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{type}</span>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Learning Analytics */}
        {learningAnalytics && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Learning Analytics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">{learningAnalytics.feedback_count}</p>
                <p className="text-sm text-gray-600">Feedback Count</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-cyan-600">{learningAnalytics.model_updates}</p>
                <p className="text-sm text-gray-600">Model Updates</p>
              </div>
            </div>
            
            {/* Learning Progress */}
            {learningAnalytics.improvement_metrics && (
              <div className="mt-6">
                <h4 className="font-medium mb-3">Improvement Metrics</h4>
                <div className="space-y-2">
                  {Object.entries(learningAnalytics.improvement_metrics).map(([metric, value]) => (
                    <div key={metric} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{metric}</span>
                      <span className="text-sm font-medium">{typeof value === 'number' ? value.toFixed(2) : value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* User Behavior Analytics */}
        {userBehaviorAnalytics && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">User Behavior Analytics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-600">{userBehaviorAnalytics.total_emails_analyzed}</p>
                <p className="text-sm text-gray-600">Emails Analyzed</p>
              </div>
            </div>
            
            {/* Processing Patterns */}
            {userBehaviorAnalytics.processing_patterns && (
              <div className="mt-6">
                <h4 className="font-medium mb-3">Processing Patterns</h4>
                <div className="space-y-2">
                  {Object.entries(userBehaviorAnalytics.processing_patterns).map(([pattern, value]) => (
                    <div key={pattern} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{pattern}</span>
                      <span className="text-sm font-medium">{typeof value === 'number' ? value.toFixed(2) : value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Performance Metrics */}
      {performanceMetrics && (
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Email Metrics */}
            {performanceMetrics.email_metrics && (
              <div>
                <h4 className="font-medium mb-3">Email Performance</h4>
                <div className="space-y-2">
                  {Object.entries(performanceMetrics.email_metrics).map(([metric, value]) => (
                    <div key={metric} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{metric}</span>
                      <span className="text-sm font-medium">{typeof value === 'number' ? value.toFixed(2) : value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Calendar Metrics */}
            {performanceMetrics.calendar_metrics && (
              <div>
                <h4 className="font-medium mb-3">Calendar Performance</h4>
                <div className="space-y-2">
                  {Object.entries(performanceMetrics.calendar_metrics).map(([metric, value]) => (
                    <div key={metric} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{metric}</span>
                      <span className="text-sm font-medium">{typeof value === 'number' ? value.toFixed(2) : value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* System Performance */}
            {performanceMetrics.performance_metrics && (
              <div>
                <h4 className="font-medium mb-3">System Performance</h4>
                <div className="space-y-2">
                  {Object.entries(performanceMetrics.performance_metrics).map(([metric, value]) => (
                    <div key={metric} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{metric}</span>
                      <span className="text-sm font-medium">{typeof value === 'number' ? value.toFixed(2) : value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Trends */}
      {performanceMetrics?.trends && (
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Performance Trends</h3>
          <div className="space-y-4">
            {Object.entries(performanceMetrics.trends).map(([trend, data]) => (
              <div key={trend}>
                <h4 className="font-medium mb-2">{trend}</h4>
                <div className="bg-gray-50 p-3 rounded">
                  <pre className="text-xs text-gray-600 overflow-x-auto">
                    {JSON.stringify(data, null, 2)}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;


