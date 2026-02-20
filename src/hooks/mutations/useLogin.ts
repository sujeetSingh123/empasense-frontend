import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import http from "@/hooks/api/api";
import { login } from "@/hooks/api/endpoints";
import { setRefreshToken, setToken } from "@/utils/localStorage";
import { getErrorMessage } from "@/utils/error";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// Adjust this type to match your backend response shape if needed
interface LoginResponse {
  message: string;
  status: string;
  payload: {
    access_token: string;
    token_type: string;
  };
}

export function useLogin() {
  return useMutation<LoginResponse, Error, LoginInput>({
    mutationFn: async (payload: LoginInput) => {
      try {
        // Prepare body as application/x-www-form-urlencoded
        const params = new URLSearchParams();
        params.append('username', payload.email);
        params.append('password', payload.password);
        params.append('grant_type', 'password');

        const res = await http.post<LoginResponse>(
          login,
          params,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        );

        // Persist tokens for subsequent requests
        if (res.data?.payload?.access_token) {
          setToken(res.data?.payload?.access_token);
        }
        // if (res.data?.refreshToken) {
        //   setRefreshToken(res.data.refreshToken);
        // }

        return res.data;
      } catch (error: unknown) {
        const message = getErrorMessage(error);
        throw new Error(message || "Unable to login");
      }
    },
  });
}

