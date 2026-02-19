import { useQuery } from "@tanstack/react-query";
import http from "@/hooks/api/api";
import { usersEndpoint } from "@/hooks/api/endpoints";
import { getErrorMessage } from "@/utils/error";

export interface User {
  id: number | string;
  name: string;
  email: string;
  role: string;
  status: string;
  empathyScore: number;
  interactions: number;
}

export function useUsers() {
  return useQuery<User[], Error>({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        const res = await http.get<User[]>(usersEndpoint);
        return res.data;
      } catch (error: unknown) {
        const message = getErrorMessage(error);
        throw new Error(message || "Unable to fetch users");
      }
    },
  });
}


