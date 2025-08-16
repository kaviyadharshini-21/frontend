'use client';

import React, { useEffect, useState } from 'react';
import { useHealthStore } from '../stores';

const SystemHealth: React.FC = () => {
  const {
    healthStatus,
    detailedHealth,
    systemMetrics,
    isLoading,
    error,
    checkHealth,
    getDetailedHealth,
    getSystemMetrics,
    clearError,
  } = useHealthStore();

  const [autoRefresh, setAutoRefresh] = useState(false);

  useEffect(() => {
    // Load initial health data
    checkHealth();
    getDetailedHealth();
    getSystemMetrics();

    // Set up auto-refresh if enabled
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(() => {
        checkHealth();
        getDetailedHealth();
        getSystemMetrics();
      }, 30000); // Refresh every 30 seconds
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [autoRefresh, checkHealth, getDetailedHealth, getSystemMetrics]);

  const handleRefresh = () => {
    checkHealth();
    getDetailedHealth();
    getSystemMetrics();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'healthy':
        return 'text-green-600 bg-green-100';
      case 'unhealthy':
        return 'text-red-600 bg-red-100';
      case 'degraded':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">System Health Monitor</h2>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-4 py-2 rounded-md ${
              autoRefresh
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading health data...</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Health Status */}
        {healthStatus && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Basic Health Status</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(healthStatus.status)}`}>
                  {healthStatus.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Service:</span>
                <span className="font-medium">{healthStatus.service}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Version:</span>
                <span className="font-medium">{healthStatus.version}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Timestamp:</span>
                <span className="text-sm">{new Date(healthStatus.timestamp).toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Detailed Health Status */}
        {detailedHealth && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Detailed Health Status</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Overall Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(detailedHealth.status)}`}>
                  {detailedHealth.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Uptime:</span>
                <span className="font-medium">{detailedHealth.uptime}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Version:</span>
                <span className="font-medium">{detailedHealth.version}</span>
              </div>
              
              {/* Service Status */}
              <div className="mt-4">
                <h4 className="font-medium mb-3">Service Status</h4>
                <div className="space-y-2">
                  {Object.entries(detailedHealth.services).map(([service, status]) => (
                    <div key={service} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 capitalize">{service.replace('_', ' ')}:</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(status)}`}>
                        {status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* System Metrics */}
      {systemMetrics && (
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">System Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* System Resources */}
            <div>
              <h4 className="font-medium mb-3">System Resources</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Memory Usage:</span>
                  <span className="text-sm font-medium">{systemMetrics.metrics.system.memory_usage}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">CPU Usage:</span>
                  <span className="text-sm font-medium">{systemMetrics.metrics.system.cpu_usage}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Disk Usage:</span>
                  <span className="text-sm font-medium">{systemMetrics.metrics.system.disk_usage}</span>
                </div>
              </div>
            </div>

            {/* Email Processing Metrics */}
            <div>
              <h4 className="font-medium mb-3">Email Processing</h4>
              <div className="space-y-3">
                {systemMetrics.metrics.email_processing && 
                  Object.entries(systemMetrics.metrics.email_processing).map(([metric, value]) => (
                    <div key={metric} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 capitalize">{metric.replace('_', ' ')}:</span>
                      <span className="text-sm font-medium">
                        {typeof value === 'number' ? value.toFixed(2) : value}
                      </span>
                    </div>
                  ))
                }
              </div>
            </div>

            {/* Timestamp */}
            <div>
              <h4 className="font-medium mb-3">Last Updated</h4>
              <div className="text-sm text-gray-600">
                {new Date(systemMetrics.timestamp).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Health Status Summary */}
      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Health Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {healthStatus ? healthStatus.status : 'Unknown'}
            </div>
            <div className="text-sm text-gray-600">Overall Status</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {detailedHealth?.uptime || 'N/A'}
            </div>
            <div className="text-sm text-gray-600">System Uptime</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {healthStatus?.version || 'N/A'}
            </div>
            <div className="text-sm text-gray-600">Service Version</div>
          </div>
        </div>
      </div>

      {/* Auto-refresh indicator */}
      {autoRefresh && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Auto-refresh enabled (30s interval)
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemHealth;


