import { useQuery } from "@tanstack/react-query";
import http from "@/hooks/api/api";
import { rolesEndpoint } from "@/hooks/api/endpoints";
import { getErrorMessage } from "@/utils/error";

export interface Role {
  id: string | number;
  name: string;
}

export function useRoles() {
  return useQuery<Role[], Error>({
    queryKey: ["roles"],
    queryFn: async () => {
      try {
        const res = await http.get<Role[]>(rolesEndpoint);
        return res.data;
      } catch (error: unknown) {
        const message = getErrorMessage(error);
        throw new Error(message || "Unable to fetch roles");
      }
    },
  });
}


