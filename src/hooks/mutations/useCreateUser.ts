import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import http from "@/hooks/api/api";
import { usersEndpoint } from "@/hooks/api/endpoints";
import { getErrorMessage } from "@/utils/error";
import type { User } from "@/hooks/queries/useUsers";

export const createUserSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  role_id: z.string().uuid("Role is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export interface IUserCreateInput{
  email: string;
  full_name: string;
  role_id: string;
  password: string;
}

export type CreateUserInput = z.infer<typeof createUserSchema>;

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation<IUserCreateInput, Error, CreateUserInput>({
    mutationFn: async (payload: CreateUserInput) => {
      try {
        const res = await http.post<IUserCreateInput>(usersEndpoint, payload);
        return res.data;
      } catch (error: unknown) {
        const message = getErrorMessage(error);
        throw new Error(message || "Unable to create user");
      }
    },
    onSuccess: () => {
      // Refresh users list
      void queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}


