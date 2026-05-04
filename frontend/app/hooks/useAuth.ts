"use client";

import { useMutation, useQuery } from "@tanstack/react-query";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

type SignUpData = {
  user_first_name: string;
  user_email: string;
  user_password: string;
  user_license_plate: string;
};

type LoginData = {
  user_email: string;
  user_password: string;
};

export function useAuth() {
  const signUpMutation = useMutation({
    mutationFn: async (data: SignUpData) => {
      const response = await fetch(`${baseUrl}/api/sign-up`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Signup failed");
      }

      return result;
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await fetch(`${baseUrl}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Login failed");
      }

      localStorage.setItem("token", result.access_token);

      return result;
    },
  });

  const meQuery = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const token = localStorage.getItem("token");

      const response = await fetch(`${baseUrl}/api/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Not logged in");
      }

      return result.user;
    },
    enabled: typeof window !== "undefined" && !!localStorage.getItem("token"),
  });

  return {
    signUp: signUpMutation.mutateAsync,
    login: loginMutation.mutateAsync,
    user: meQuery.data,
    isSigningUp: signUpMutation.isPending,
    isLoggingIn: loginMutation.isPending,
    error: signUpMutation.error?.message || loginMutation.error?.message || meQuery.error?.message || "",
  };
}