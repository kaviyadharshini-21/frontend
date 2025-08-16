"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Eye,
  EyeOff,
  UserPlus,
  Mail,
  Lock,
  User,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";

interface SignupFormProps {
  onSuccess?: () => void;
}

export function SignupForm({ onSuccess }: SignupFormProps) {
  const { signup, loading, error, clearError } = useAuthStore();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  const validatePassword = (password: string) => {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push("At least 8 characters long");
    }

    if (!/(?=.*[a-z])/.test(password)) {
      errors.push("At least one lowercase letter");
    }

    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push("At least one uppercase letter");
    }

    if (!/(?=.*\d)/.test(password)) {
      errors.push("At least one number");
    }

    if (!/(?=.*[@$!%*?&])/.test(password)) {
      errors.push("At least one special character (@$!%*?&)");
    }

    return errors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Real-time password validation
    if (name === "password") {
      setPasswordErrors(validatePassword(value));
    }

    // Clear errors when user starts typing
    if (error) clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");

    try {
      // Client-side validation
      if (!formData.fullName.trim()) {
        throw new Error("Full name is required");
      }

      if (!formData.email.trim()) {
        throw new Error("Email is required");
      }

      if (!formData.password) {
        throw new Error("Password is required");
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const passwordValidationErrors = validatePassword(formData.password);
      if (passwordValidationErrors.length > 0) {
        throw new Error("Password does not meet requirements");
      }

      await signup({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
      });

      setSuccess("Account created successfully! You can now log in.");
      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setPasswordErrors([]);

      if (onSuccess) {
        setTimeout(onSuccess, 2000);
      }
    } catch (err) {
      // Error is handled by the store
      console.error("Signup error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md p-8 shadow-xl">
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
            <UserPlus className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-600 mt-2">
            Join us and start managing your emails better
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-500" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="fullName"
              className="text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={handleInputChange}
                className="pl-10"
                placeholder="Enter your full name"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="pl-10"
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleInputChange}
                className="pl-10 pr-10"
                placeholder="Create a strong password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Password requirements */}
            {formData.password && (
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs font-medium text-gray-700 mb-2">
                  Password requirements:
                </p>
                <div className="space-y-1">
                  {[
                    "At least 8 characters long",
                    "At least one lowercase letter",
                    "At least one uppercase letter",
                    "At least one number",
                    "At least one special character (@$!%*?&)",
                  ].map((requirement, index) => {
                    const isValid = !passwordErrors.includes(requirement);
                    return (
                      <div key={index} className="flex items-center gap-2">
                        {isValid ? (
                          <CheckCircle className="w-3 h-3 text-green-500" />
                        ) : (
                          <XCircle className="w-3 h-3 text-gray-400" />
                        )}
                        <span
                          className={`text-xs ${
                            isValid ? "text-green-700" : "text-gray-600"
                          }`}
                        >
                          {requirement}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="pl-10 pr-10"
                placeholder="Confirm your password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={loading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {formData.confirmPassword &&
              formData.password !== formData.confirmPassword && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <XCircle className="w-3 h-3" />
                  Passwords do not match
                </p>
              )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading || passwordErrors.length > 0}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating Account...
              </div>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Create Account
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:text-primary/80"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
