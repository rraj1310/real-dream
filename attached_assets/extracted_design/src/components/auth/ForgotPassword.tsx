import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../common/Button";
import { Input } from "../common/Input";
import { ArrowLeft, Mail } from "lucide-react";

export function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <button
        onClick={() => navigate("/")}
        className="mb-6 p-2 hover:bg-white/50 rounded-lg"
      >
        <ArrowLeft className="w-5 h-5 text-gray-700" />
      </button>

      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
          <p className="text-gray-600">
            {submitted
              ? "Check your email for reset instructions"
              : "Enter your email to reset your password"}
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-lg space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Button type="submit" fullWidth size="lg">
              Send Reset Link
            </Button>

            <div className="text-center pt-4">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="text-blue-600 font-medium hover:underline"
              >
                Back to Sign In
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-white rounded-2xl p-6 shadow-lg space-y-4">
            <div className="text-center space-y-4">
              <p className="text-gray-700">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <Button onClick={() => navigate("/")} fullWidth size="lg">
                Back to Sign In
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
