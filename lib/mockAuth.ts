// Mock authentication utility for development
// This simulates the backend auth endpoints

export const mockCredentials = {
  email: "harish11ndsh@gmail.com",
  password: "Harihk@1106",
};

export const mockUser = {
  id: "mock-user-1",
  name: "Harish Kumar",
  email: "harish11ndsh@gmail.com",
  avatar: undefined,
  settings: {
    emailNotifications: true,
    calendarSync: true,
    theme: "light" as const,
    language: "en",
    timezone: "UTC",
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const mockToken = "mock-jwt-token-12345";

export const validateMockCredentials = (
  email: string,
  password: string
): boolean => {
  return (
    email === mockCredentials.email && password === mockCredentials.password
  );
};

export const mockLogin = async (email: string, password: string) => {
  // Simulate API delay
  console.log("hii");
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (validateMockCredentials(email, password)) {
    return {
      success: true,
      access_token: mockToken,
      user: mockUser,
    };
  } else {
    throw new Error("Invalid credentials");
  }
};

export const mockSignup = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // In mock mode, always succeed
  return {
    success: true,
    message: "Account created successfully",
  };
};

export const mockGetProfile = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return mockUser;
};
