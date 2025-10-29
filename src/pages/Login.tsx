import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Heart } from "lucide-react";
import authBg from "@/assets/auth-bg.jpg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login
    setTimeout(() => {
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
      });
      navigate("/dashboard");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 lg:block">
        <div className="relative h-full">
          <img
            src={authBg}
            alt="Dashboard background"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary/70" />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-white">
            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <Heart className="h-6 w-6" />
              </div>
              <span className="text-3xl font-bold">EmpathyTrack</span>
            </div>
            <h2 className="mb-4 text-4xl font-bold text-center">Track Empathy, Build Connections</h2>
            <p className="max-w-md text-center text-lg text-white/90">
              Monitor emotional intelligence metrics and foster meaningful interactions across your organization.
            </p>
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-hover">
                <Heart className="h-5 w-5 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Sign in</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@EmpathyTrack.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
