import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Heart, ArrowLeft } from "lucide-react";
import authBg from "@/assets/auth-bg.jpg";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate password reset
    setTimeout(() => {
      setEmailSent(true);
      toast({
        title: "Reset link sent!",
        description: "Check your email for password reset instructions.",
      });
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
          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-secondary/70" />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-white">
            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <Heart className="h-6 w-6" />
              </div>
              <span className="text-3xl font-bold">EmpathyHub</span>
            </div>
            <h2 className="mb-4 text-4xl font-bold text-center">Reset Your Password</h2>
            <p className="max-w-md text-center text-lg text-white/90">
              We'll send you instructions to reset your password and get back to tracking empathy.
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
            <CardTitle className="text-2xl text-center">Forgot Password</CardTitle>
            <CardDescription className="text-center">
              {emailSent
                ? "Check your email for reset instructions"
                : "Enter your email to receive reset instructions"}
            </CardDescription>
          </CardHeader>
          {!emailSent ? (
            <>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@empathyhub.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Link
                  to="/login"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to login
                </Link>
              </CardFooter>
            </>
          ) : (
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-accent p-4 text-center">
                <p className="text-sm text-accent-foreground">
                  Password reset instructions have been sent to <strong>{email}</strong>
                </p>
              </div>
              <Button asChild className="w-full">
                <Link to="/login">Return to Login</Link>
              </Button>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
