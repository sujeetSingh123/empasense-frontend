import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import type { AudioApiResponse } from "@/lib/audio-api";

interface ApiResponsePanelProps {
  response: AudioApiResponse | null;
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

  return (
    <Card className={response.success ? "border-success/30" : "border-destructive/30"}>
      <CardHeader className="flex flex-row items-center gap-3 pb-3">
        {response.success ? (
          <CheckCircle2 className="h-5 w-5 text-success" />
        ) : (
          <XCircle className="h-5 w-5 text-destructive" />
        )}
        <CardTitle className="text-lg">API Response</CardTitle>
        <Badge variant={response.success ? "default" : "destructive"} className="ml-auto">
          {response.success ? "Success" : "Error"}
        </Badge>
      </CardHeader>
      <CardContent>
        {response.success ? (
          <pre className="bg-muted rounded-lg p-4 text-sm overflow-auto max-h-64 text-foreground">
            {JSON.stringify(response.data, null, 2)}
          </pre>
        ) : (
          <p className="text-destructive text-sm">{response.error}</p>
        )}
      </CardContent>
    </Card>
  );
}
