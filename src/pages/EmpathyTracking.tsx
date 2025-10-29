import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Calendar, Filter } from "lucide-react";

const interactions = [
  {
    id: 1,
    user: "Sarah Johnson",
    type: "Customer Support",
    date: "2024-01-15",
    time: "14:30",
    empathyScore: 9.2,
    sentiment: "Positive",
    keywords: ["Understanding", "Patient", "Helpful"],
    summary: "Excellent customer interaction with high emotional intelligence.",
  },
  {
    id: 2,
    user: "Michael Chen",
    type: "Team Meeting",
    date: "2024-01-15",
    time: "11:00",
    empathyScore: 8.5,
    sentiment: "Neutral",
    keywords: ["Collaborative", "Active Listening", "Clear"],
    summary: "Good team communication with constructive feedback.",
  },
  {
    id: 3,
    user: "Emma Williams",
    type: "Client Call",
    date: "2024-01-14",
    time: "16:45",
    empathyScore: 7.8,
    sentiment: "Mixed",
    keywords: ["Professional", "Direct", "Informative"],
    summary: "Professional interaction with room for more empathetic responses.",
  },
  {
    id: 4,
    user: "David Brown",
    type: "Customer Support",
    date: "2024-01-14",
    time: "13:20",
    empathyScore: 8.9,
    sentiment: "Positive",
    keywords: ["Empathetic", "Solution-Oriented", "Calm"],
    summary: "Great problem resolution with empathetic approach.",
  },
];

export default function EmpathyTracking() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Empathy Tracking</h1>
            <p className="text-muted-foreground">
              Monitor and analyze empathy metrics across all interactions
            </p>
          </div>
          <Button>
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="metric-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Today's Interactions
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">127</div>
              <p className="text-xs text-muted-foreground mt-2">
                +18 from yesterday
              </p>
            </CardContent>
          </Card>

          <Card className="metric-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Score Today
              </CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">8.6</div>
              <p className="text-xs text-muted-foreground mt-2">
                +0.3 improvement
              </p>
            </CardContent>
          </Card>

          <Card className="metric-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                This Week
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">892</div>
              <p className="text-xs text-muted-foreground mt-2">
                Total interactions
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Interactions</CardTitle>
            <CardDescription>
              Detailed view of tracked empathy interactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {interactions.map((interaction) => (
                <div
                  key={interaction.id}
                  className="border-b border-border pb-6 last:border-0 last:pb-0"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{interaction.user}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-muted-foreground">
                          {interaction.type}
                        </span>
                        <span className="text-sm text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">
                          {interaction.date} at {interaction.time}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-2xl font-bold ${
                          interaction.empathyScore >= 8.5
                            ? "stat-positive"
                            : interaction.empathyScore >= 7.5
                            ? "text-warning"
                            : "stat-negative"
                        }`}
                      >
                        {interaction.empathyScore}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Empathy Score
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">
                    {interaction.summary}
                  </p>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      variant={
                        interaction.sentiment === "Positive"
                          ? "default"
                          : interaction.sentiment === "Neutral"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {interaction.sentiment}
                    </Badge>
                    {interaction.keywords.map((keyword) => (
                      <Badge key={keyword} variant="outline">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
