import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { AuthLayout } from "../../layouts/AuthLayout";
import { FormCard } from "../../Components/ui/FormCard";
import { Input } from "../../Components/ui/Input";
import { Button } from "../../Components/ui/Button";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    if (!email) {
      setError("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Invalid email format");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      console.log("Reset link requested for:", email);
      // Simulate API call
      setTimeout(() => {
        setIsSubmitted(true);
      }, 500);
    }
  };

  return (
    <AuthLayout>
      <div className="mb-4">
        <Link
          to="/login"
          className="inline-flex items-center text-xs font-medium text-muted hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-4.5 h-4.5 mr-2" />
          Back to Login
        </Link>
        <h2 className="text-xl lg:text-2xl font-bold text-foreground">Forgot Password</h2>
        <p className="text-xs text-muted mt-1">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <FormCard>
        {isSubmitted ? (
          <div className="text-center py-6 animate-in fade-in zoom-in duration-500">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Check your email</h3>
            <p className="text-muted mb-8">
              We've sent password reset instructions to <br />
              <span className="font-medium text-foreground">{email}</span>
            </p>
            <Button
              variant="outline"
              fullWidth
              onClick={() => setIsSubmitted(false)}
            >
              Try another email
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error}
              rightIcon={<Mail className="w-4 h-4" />}
            />

            <Button type="submit" fullWidth>
              Send Reset Link
            </Button>
          </form>
        )}
      </FormCard>
    </AuthLayout>
  );
}
