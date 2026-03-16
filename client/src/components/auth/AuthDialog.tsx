import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const {
    signInWithGoogle,
    signInWithApple,
    signInWithEmail,
    signUp,
    isConfigured,
  } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: authError } =
      mode === "signin"
        ? await signInWithEmail(email, password)
        : await signUp(email, password);

    setLoading(false);

    if (authError) {
      setError(authError.message);
    } else {
      if (mode === "signup") {
        setError(null);
        setMode("signin");
        // Show a success-like message for signup
        setError("Check your email to confirm your account, then sign in.");
      } else {
        onOpenChange(false);
        resetForm();
      }
    }
  };

  const handleOAuth = async (
    provider: "google" | "apple",
    signIn: () => Promise<{ error: unknown }>
  ) => {
    setError(null);
    const { error: authError } = await signIn();
    if (authError) {
      setError(
        `Failed to sign in with ${provider}. Please try again.`
      );
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setError(null);
    setMode("signin");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) resetForm();
      }}
    >
      <DialogContent className="sm:max-w-[400px] bg-[#1a1a2e] border-gray-700 text-gray-100">
        <DialogHeader>
          <DialogTitle className="text-center text-lg text-gray-100">
            {mode === "signin" ? "Sign in to save your data" : "Create account"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* OAuth buttons */}
          <Button
            variant="outline"
            className="w-full border-gray-600 bg-transparent hover:bg-gray-800 text-gray-100"
            disabled={!isConfigured}
            onClick={() => handleOAuth("google", signInWithGoogle)}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          <Button
            variant="outline"
            className="w-full border-gray-600 bg-transparent hover:bg-gray-800 text-gray-100"
            disabled={!isConfigured}
            onClick={() => handleOAuth("apple", signInWithApple)}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
            </svg>
            Continue with Apple
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#1a1a2e] px-2 text-gray-400">
                or continue with email
              </span>
            </div>
          </div>

          {/* Email form */}
          <form onSubmit={handleEmailSubmit} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-gray-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={!isConfigured}
                className="bg-gray-800 border-gray-600 text-gray-100 placeholder:text-gray-500"
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-gray-300">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                disabled={!isConfigured}
                className="bg-gray-800 border-gray-600 text-gray-100 placeholder:text-gray-500"
                placeholder="••••••••"
              />
            </div>

            {!isConfigured && (
              <p className="text-sm text-amber-300">
                This Cloudflare deployment is missing the public Supabase
                `VITE_*` variables required for sign-in.
              </p>
            )}

            {error && (
              <p className="text-sm text-red-400">{error}</p>
            )}

            <Button
              type="submit"
              disabled={loading || !isConfigured}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {loading
                ? "..."
                : mode === "signin"
                  ? "Sign In"
                  : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-400">
            {mode === "signin" ? (
              <>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setError(null);
                  }}
                  className="text-indigo-400 hover:underline"
                >
                  Create one
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("signin");
                    setError(null);
                  }}
                  className="text-indigo-400 hover:underline"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
