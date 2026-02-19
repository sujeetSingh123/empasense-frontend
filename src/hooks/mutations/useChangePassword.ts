import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import http from "@/hooks/api/api";
import { changePasswordEndpoint } from "@/hooks/api/endpoints";
import { getErrorMessage } from "@/utils/error";

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export function useChangePassword() {
  return useMutation<void, Error, ChangePasswordInput>({
    mutationFn: async (payload: ChangePasswordInput) => {
      try {
        await http.post(changePasswordEndpoint, {
          currentPassword: payload.currentPassword,
          newPassword: payload.newPassword,
        });
      } catch (error: unknown) {
        const message = getErrorMessage(error);
        throw new Error(message || "Unable to change password");
      }
    },
  });
}


