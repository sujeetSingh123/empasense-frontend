import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Heart, TrendingUp, MessageSquare, Clock, Download, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const mockAnalysis = {
  overallScore: 89,
  sentiment: "Positive",
  emotionalTone: "Compassionate",
  duration: "3:45",
  keywords: ["understanding", "supportive", "caring", "patient", "empathetic"],
  breakdown: {
    tonalQuality: 92,
    emotionalResonance: 87,
    activeListening: 88,
    verbalEmpathy: 91,
  },
  transcript: "Thank you for sharing that with me. I understand how difficult this situation must be for you. Your feelings are completely valid, and I want you to know that I'm here to support you through this...",
  recommendations: [
    "Excellent use of validating language",
    "Strong emotional connection established",
    "Consider allowing more pauses for reflection",
    "Maintain this level of active listening",
  ],
};

export default function EmpathyScoreBoard() {
  const navigate = useNavigate();

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-success";
    if (score >= 70) return "text-warning";
    return "text-destructive";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 85) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 50) return "Fair";
    return "Needs Improvement";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Empathy Analysis Results</h1>
            <p className="text-muted-foreground mt-1">Detailed breakdown of your audio analysis</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button onClick={() => navigate("/audio-recording")}>
              Record New Audio
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${getScoreColor(mockAnalysis.overallScore)}`}>
                {mockAnalysis.overallScore}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {getScoreLabel(mockAnalysis.overallScore)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Sentiment</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockAnalysis.sentiment}</div>
              <Badge variant="default" className="mt-2">{mockAnalysis.emotionalTone}</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Duration</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockAnalysis.duration}</div>
              <p className="text-xs text-muted-foreground mt-1">Recording length</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Keywords</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockAnalysis.keywords.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Empathy markers</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Score Breakdown</CardTitle>
              <CardDescription>Detailed analysis of empathy components</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(mockAnalysis.breakdown).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                    <span className={`text-sm font-bold ${getScoreColor(value)}`}>
                      {value}%
                    </span>
                  </div>
                  <Progress value={value} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detected Keywords</CardTitle>
              <CardDescription>Empathy-related terms identified in the audio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {mockAnalysis.keywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Transcript</CardTitle>
            <CardDescription>Audio transcription with context</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{mockAnalysis.transcript}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
            <CardDescription>AI-generated insights for improvement</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {mockAnalysis.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />
                  <span className="text-sm">{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
