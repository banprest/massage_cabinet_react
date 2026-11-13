import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/client";

export function useHealth() {
  return useQuery({
    queryKey: ["health"],
    queryFn: async () => {
      const { data, error, response } = await api.GET("/api/v1/health");
      if (data) return data;
      if (response.status === 503 && error) return error;
      throw new Error(`API недоступен (HTTP ${response.status})`);
    },
  });
}
