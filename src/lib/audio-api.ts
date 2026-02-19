// ============================================
// Audio API Configuration
// Update these values with your actual API details
// ============================================

const API_CONFIG = {
  // Replace with your API endpoint URL
  url: "https://your-api-endpoint.com/analyze",
  // HTTP method (POST, PUT, etc.)
  method: "POST" as const,
  // The form field name for the audio file
  audioFieldName: "audio",
  // Additional headers (e.g., Authorization)
  headers: {} as Record<string, string>,
};

export interface AudioApiResponse {
  success: boolean;
  data?: unknown;
  error?: string;
}

export async function submitAudioToApi(audioBlob: Blob, fileName?: string): Promise<AudioApiResponse> {
  const formData = new FormData();
  formData.append(API_CONFIG.audioFieldName, audioBlob, fileName || "recording.webm");

  try {
    const response = await fetch(API_CONFIG.url, {
      method: API_CONFIG.method,
      headers: API_CONFIG.headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error occurred";
    return { success: false, error: message };
  }
}

export { API_CONFIG };
