import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { useAuthStore } from "@/stores/auth-store";
import { userKeys } from "@/hooks/queries/use-user";
import { LoginCredentials, AuthResponse } from "@/types/auth";

async function loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>(
    API_ENDPOINTS.AUTH.LOGIN,
    credentials
  );
  return data;
}

export function useLogin() {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setAuth(data.accessToken, data.user);
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
}
