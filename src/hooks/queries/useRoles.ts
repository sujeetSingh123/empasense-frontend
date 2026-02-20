import { useQuery } from "@tanstack/react-query";
import http from "@/hooks/api/api";
import { rolesEndpoint } from "@/hooks/api/endpoints";
import { getErrorMessage } from "@/utils/error";

export interface Role {
  id: string;
  name: string;
  description: string;
}

export interface IRoleResponse{
  message: string;
  status: string;
  payload: Role[]
}

export function useRoles() {
  return useQuery<Role[], Error>({
    queryKey: ["roles"],
    queryFn: async () => {
      try {
        const res = await http.get<IRoleResponse>(rolesEndpoint);
        return res.data.payload
      } catch (error: unknown) {
        const message = getErrorMessage(error);
        throw new Error(message || "Unable to fetch roles");
      }
    },
  });
}


