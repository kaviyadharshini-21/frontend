export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  settings: Record<string, any>;
  createdAt: string;
  updatedAt: string;
};

export type Email = {
  id: string;
  from: string;
  to_users: string[];
  subject: string;
  body: string;
  threadId: string;
  isRead: boolean;
  isDeleted: boolean;
  sentAt: string;
  attachments: string[];
};

export type Thread = {
  id: string;
  participants: string[];
  emails: Email[];
  lastUpdated: string;
};

export type Reminder = {
  id: string;
  userId: string;
  emailId: string;
  remindAt: string;
  createdAt: string;
};

export type Meeting = {
  id: string;
  organizerId: string;
  participants: string[];
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  status: "scheduled" | "completed" | "cancelled";
  location?: string;
};

export type Settings = {
  id: string;
  userId: string;
  emailNotifications: boolean;
  calendarSync: boolean;
  theme: "light" | "dark" | "auto";
  language: string;
  timezone: string;
  updatedAt: string;
};
