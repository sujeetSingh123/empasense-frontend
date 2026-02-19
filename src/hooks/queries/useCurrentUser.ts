import { useQuery } from "@tanstack/react-query";
import http from "@/hooks/api/api";
import { currentUserEndpoint } from "@/hooks/api/endpoints";
import { getErrorMessage } from "@/utils/error";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CurrentUser = any;

export function useCurrentUser(enabled = true) {
  return useQuery<CurrentUser, Error>({
    queryKey: ["currentUser"],
    enabled,
    queryFn: async () => {
      try {
        const res = await http.get<CurrentUser>(currentUserEndpoint);
        return res.data;
      } catch (error: unknown) {
        const message = getErrorMessage(error);
        throw new Error(message || "Unable to fetch current user");
      }
    },
  });
}


