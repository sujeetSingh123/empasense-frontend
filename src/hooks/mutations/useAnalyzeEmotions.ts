import { useMutation } from "@tanstack/react-query";
import http from "@/hooks/api/api";
import { analyzeEmotionsEndpoint } from "@/hooks/api/endpoints";
import { getErrorMessage } from "@/utils/error";

export interface AnalyzeEmotionsResponse {
  // Define fields according to your backend; these are generic placeholders
  success: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  error?: string;
}

export function useAnalyzeEmotions() {
  return useMutation<AnalyzeEmotionsResponse, Error, Blob>({
    mutationFn: async (audioBlob: Blob) => {
      try {
        const formData = new FormData();
        formData.append("file", audioBlob, "audio.webm");

        const res = await http.post<AnalyzeEmotionsResponse>(analyzeEmotionsEndpoint, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        return res.data;
      } catch (error: unknown) {
        const message = getErrorMessage(error);
        throw new Error(message || "Unable to analyze emotions");
      }
    },
  });
}


