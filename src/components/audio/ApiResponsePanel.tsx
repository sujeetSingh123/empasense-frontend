import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { AnalyzeEmotionsResponse } from "@/hooks/mutations/useAnalyzeEmotions";

interface ApiResponsePanelProps {
  response: AnalyzeEmotionsResponse | null;
  isLoading: boolean;
}

export function ApiResponsePanel({ response, isLoading }: ApiResponsePanelProps) {
  if (isLoading) {
    return (
      <Card className="border-primary/30">
        <CardContent className="flex flex-col items-center justify-center py-12 gap-4">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
          <p className="text-muted-foreground font-medium">Submitting audio to API...</p>
        </CardContent>
      </Card>
    );
  }

  if (!response) return null;

  const isSuccess = response.status === "success";
  const prediction = response.payload?.prediction;

  return (
    <Card className={isSuccess ? "border-success/30" : "border-destructive/30"}>
      <CardHeader className="flex flex-row items-center gap-3 pb-3">
        {isSuccess ? (
          <CheckCircle2 className="h-5 w-5 text-success" />
        ) : (
          <XCircle className="h-5 w-5 text-destructive" />
        )}
        <CardTitle className="text-lg">API Response</CardTitle>
        <Badge variant={isSuccess ? "default" : "destructive"} className="ml-auto">
          {isSuccess ? "Success" : "Error"}
        </Badge>
      </CardHeader>
      <CardContent>
        {isSuccess && prediction ? (
          <div>
            <p className="text-base font-medium mb-2">Detected Emotion:</p>
            <div className="flex items-center gap-4 mb-2">
              <span className="text-lg font-semibold capitalize">{prediction.detected_emotion}</span>
              <Badge variant="secondary" className="text-sm">{(prediction.emotion_score * 100).toFixed(1)}%</Badge>
            </div>
          </div>
        ) : (
          <p className="text-destructive text-sm">{response.message || "An error occurred while analyzing audio."}</p>
        )}
      </CardContent>
    </Card>
  );
}
