import { useQuery } from "@tanstack/react-query";
import http from "@/hooks/api/api";
import { usersEndpoint } from "@/hooks/api/endpoints";
import { getErrorMessage } from "@/utils/error";

export interface User {
  id: string;
  email: string;
  full_name: string;
  role_id: string;
  is_active: boolean;
}

export interface IUserResponse{
  message: string;
  status: string;
  payload: User[]
}

export function useUsers() {
  return useQuery<User[], Error>({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        const res = await http.get<IUserResponse>(usersEndpoint);
        return res.data.payload || [];
      } catch (error: unknown) {
        const message = getErrorMessage(error);
        throw new Error(message || "Unable to fetch users");
      }
    },
  });
}


