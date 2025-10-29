import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Heart, Users, MessageCircle, Activity } from "lucide-react";

const metrics = [
  {
    title: "Overall Empathy Score",
    value: "8.4",
    change: "+12%",
    trend: "up",
    icon: Heart,
    description: "Average across all interactions",
  },
  {
    title: "Active Users",
    value: "2,847",
    change: "+23%",
    trend: "up",
    icon: Users,
    description: "Last 30 days",
  },
  {
    title: "Interactions Tracked",
    value: "15,234",
    change: "+8%",
    trend: "up",
    icon: MessageCircle,
    description: "This month",
  },
  {
    title: "Response Quality",
    value: "7.8",
    change: "-2%",
    trend: "down",
    icon: Activity,
    description: "Needs attention",
  },
];

const recentActivity = [
  {
    user: "Sarah Johnson",
    action: "High empathy score recorded",
    score: 9.2,
    time: "2 minutes ago",
  },
  {
    user: "Michael Chen",
    action: "Completed empathy training",
    score: 8.5,
    time: "15 minutes ago",
  },
  {
    user: "Emma Williams",
    action: "Customer interaction analyzed",
    score: 7.9,
    time: "1 hour ago",
  },
  {
    user: "David Brown",
    action: "Sentiment improved",
    score: 8.8,
    time: "2 hours ago",
  },
];

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your empathy metrics.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <Card key={metric.title} className="metric-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {metric.title}
                  </CardTitle>
                  <div className="rounded-lg bg-accent p-2">
                    <Icon className="h-4 w-4 text-accent-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{metric.value}</div>
                  <div className="flex items-center gap-2 mt-2">
                    {metric.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 stat-positive" />
                    ) : (
                      <TrendingDown className="h-4 w-4 stat-negative" />
                    )}
                    <span
                      className={
                        metric.trend === "up"
                          ? "text-sm stat-positive font-medium"
                          : "text-sm stat-negative font-medium"
                      }
                    >
                      {metric.change}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      vs last month
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {metric.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest empathy tracking events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{activity.user}</p>
                      <p className="text-sm text-muted-foreground">
                        {activity.action}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.time}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`rounded-full px-3 py-1 text-sm font-medium ${
                          activity.score >= 8.5
                            ? "bg-success/10 text-success"
                            : activity.score >= 7.5
                            ? "bg-warning/10 text-warning"
                            : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {activity.score}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Empathy Trends</CardTitle>
              <CardDescription>
                Weekly performance overview
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Communication</span>
                    <span className="font-medium">8.7</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-primary-hover rounded-full"
                      style={{ width: "87%" }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Understanding</span>
                    <span className="font-medium">8.2</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-primary-hover rounded-full"
                      style={{ width: "82%" }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Response Time</span>
                    <span className="font-medium">7.9</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-secondary to-secondary-hover rounded-full"
                      style={{ width: "79%" }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Emotional Tone</span>
                    <span className="font-medium">8.5</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-primary-hover rounded-full"
                      style={{ width: "85%" }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
