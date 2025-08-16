'use client';

import React, { useState, useEffect } from 'react';
import { useEmailStore } from '../stores';
import { EmailData, EmailProcessingResult } from '../types/api';

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

  const [emailData, setEmailData] = useState<EmailData>({
    email_id: '',
    sender: '',
    subject: '',
    body: '',
  });

  useEffect(() => {
    // Load email statistics on component mount
    getEmailStats(7);
  }, [getEmailStats]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emailData.email_id || !emailData.sender || !emailData.subject || !emailData.body) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await processSingleEmail(emailData);
      // Reset form
      setEmailData({
        email_id: '',
        sender: '',
        subject: '',
        body: '',
      });
    } catch (error) {
      console.error('Failed to process email:', error);
    }
  };

  const handleInputChange = (field: keyof EmailData, value: string) => {
    setEmailData(prev => ({
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
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Email Processing</h2>
      
      {/* Email Statistics */}
      {emailStats && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Email Statistics (Last 7 days)</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total Processed</p>
              <p className="text-xl font-bold">{emailStats.total_emails_processed}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Processing Time</p>
              <p className="text-xl font-bold">{emailStats.average_processing_time.toFixed(2)}s</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Human Review Rate</p>
              <p className="text-xl font-bold">{(emailStats.human_review_rate * 100).toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Error Rate</p>
              <p className="text-xl font-bold">{(emailStats.error_rate * 100).toFixed(1)}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Email Processing Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Process New Email</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email ID *
            </label>
            <input
              type="text"
              value={emailData.email_id}
              onChange={(e) => handleInputChange('email_id', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email ID"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sender *
            </label>
            <input
              type="email"
              value={emailData.sender}
              onChange={(e) => handleInputChange('sender', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="sender@example.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject *
            </label>
            <input
              type="text"
              value={emailData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email subject"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Body *
            </label>
            <textarea
              value={emailData.body}
              onChange={(e) => handleInputChange('body', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email body"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : 'Process Email'}
          </button>
        </form>
      </div>

      {/* Processed Emails List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Recently Processed Emails</h3>
        {processedEmails.length === 0 ? (
          <p className="text-gray-500">No emails processed yet.</p>
        ) : (
          <div className="space-y-4">
            {processedEmails.slice(0, 5).map((email: EmailProcessingResult) => (
              <div key={email.email_id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{email.classification.category}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    email.classification.urgency === 'high' ? 'bg-red-100 text-red-800' :
                    email.classification.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {email.classification.urgency}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{email.classification.reasoning}</p>
                <div className="text-xs text-gray-500">
                  Confidence: {(email.classification.confidence_score * 100).toFixed(1)}% | 
                  Processing Time: {email.processing_time.toFixed(2)}s
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailProcessor;


