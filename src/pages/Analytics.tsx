import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, Users, Heart, MessageSquare, Clock } from "lucide-react";

const mockData = {
  overview: [
    { label: "Total Interactions", value: "12,483", change: "+12.3%", trend: "up" },
    { label: "Average Empathy Score", value: "87.5%", change: "+3.2%", trend: "up" },
    { label: "Active Users", value: "1,247", change: "-2.1%", trend: "down" },
    { label: "Response Time", value: "2.3s", change: "+0.3s", trend: "down" },
  ],
  topKeywords: ["compassion", "understanding", "support", "care", "listening", "patience"],
  sentimentDistribution: { positive: 68, neutral: 24, negative: 8 },
};

export default function Analytics() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">Detailed insights and trends</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {mockData.overview.map((metric, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
                {index === 0 && <MessageSquare className="h-4 w-4 text-muted-foreground" />}
                {index === 1 && <Heart className="h-4 w-4 text-muted-foreground" />}
                {index === 2 && <Users className="h-4 w-4 text-muted-foreground" />}
                {index === 3 && <Clock className="h-4 w-4 text-muted-foreground" />}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className={`text-xs flex items-center gap-1 mt-1 ${
                  metric.trend === "up" ? "text-success" : "text-destructive"
                }`}>
                  {metric.trend === "up" ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {metric.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sentiment">Sentiment Analysis</TabsTrigger>
            <TabsTrigger value="keywords">Top Keywords</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Empathy Trends</CardTitle>
                <CardDescription>Weekly empathy score progression</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
                Chart visualization would go here
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sentiment" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-success">Positive</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{mockData.sentimentDistribution.positive}%</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Neutral</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{mockData.sentimentDistribution.neutral}%</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-destructive">Negative</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{mockData.sentimentDistribution.negative}%</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="keywords" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Most Common Keywords</CardTitle>
                <CardDescription>Keywords detected in empathy interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {mockData.topKeywords.map((keyword, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 rounded-full bg-primary/10 text-primary font-medium"
                    >
                      {keyword}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
