import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { User } from "@/types/auth";

export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

async function fetchCurrentUser(): Promise<User> {
  const { data } = await apiClient.get<User>(API_ENDPOINTS.AUTH.ME);
  return data;
}

export function useCurrentUser(
  options?: Omit<UseQueryOptions<User, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: userKeys.detail("me"),
    queryFn: fetchCurrentUser,
    ...options,
  });
}

async function fetchUser(id: string): Promise<User> {
  const { data } = await apiClient.get<User>(API_ENDPOINTS.USERS.DETAIL(id));
  return data;
}

export function useUser(
  id: string,
  options?: Omit<UseQueryOptions<User, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => fetchUser(id),
    enabled: !!id,
    ...options,
  });
}
