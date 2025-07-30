import { useAuth } from "@clerk/clerk-react";

export const useApiClient = () => {
  const { getToken } = useAuth();

  const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    const token = await getToken();
    const response = await fetch(`/api/v1${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });
    return response.json();
  };

  return { apiRequest };
};
