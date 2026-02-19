import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import http from "@/hooks/api/api";
import { usersEndpoint } from "@/hooks/api/endpoints";
import { getErrorMessage } from "@/utils/error";
import type { User } from "@/hooks/queries/useUsers";

export const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  role: z.string().min(1, "Role is required"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation<User, Error, CreateUserInput>({
    mutationFn: async (payload: CreateUserInput) => {
      try {
        const res = await http.post<User>(usersEndpoint, payload);
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


