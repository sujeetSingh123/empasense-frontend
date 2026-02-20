import { useMutation } from "@tanstack/react-query";
import http from "@/hooks/api/api";
import { analyzeEmotionsEndpoint } from "@/hooks/api/endpoints";
import { getErrorMessage } from "@/utils/error";

export interface AnalyzeEmotionsResponse {
  message: string;
  status: "success" | "error";
  payload: {
    conversation: {
      voice_profile: unknown | null;
      metadata: unknown | null;
      id: string;
      user_id: string | null;
      created_at: string;
      updated_at: string;
    };
    message: {
      sender_type: string;
      text: string;
      voice_input_url: string | null;
      voice_output_url: string | null;
      message_timestamp: string | null;
      id: string;
      conversation_id: string;
      created_at: string;
      updated_at: string;
    };
    prediction: {
      detected_emotion: string;
      emotion_score: number;
      id: string;
      conversation_message_id: string;
      emotion_model_id: string;
      created_at: string;
      updated_at: string;
    };
  };
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


