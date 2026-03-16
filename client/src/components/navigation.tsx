import { Link, useLocation } from "wouter";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { AuthButton } from "@/components/auth/AuthButton";
import type { SaveStatus } from "@/components/auth/SaveIndicator";

interface NavigationProps {
  saveStatus?: SaveStatus;
}

const IS_CREATOR_BYPASS = import.meta.env.VITE_CREATOR_BYPASS === "true";

export default function Navigation({ saveStatus }: NavigationProps) {
  const [location] = useLocation();
  const { user } = useAuth();
  const hasAccess = !!user || IS_CREATOR_BYPASS;

  return (
    <nav className="exp-nav">
      <div className="exp-nav-tabs">
        <Link
          href="/"
          className={cn("exp-nav-tab", location === "/" && "active")}
        >
          Life in Weeks
        </Link>
        <Link
          href="/experiences"
          className={cn(
            "exp-nav-tab",
            location === "/experiences" && "active",
            !hasAccess && "locked"
          )}
        >
          Remaining Experiences
          {!hasAccess && <Lock size={12} />}
        </Link>
        <Link
          href="/calendar"
          className={cn(
            "exp-nav-tab",
            location === "/calendar" && "active",
            !hasAccess && "locked"
          )}
        >
          Calendar
          {!hasAccess && <Lock size={12} />}
        </Link>
      </div>
      <div className="absolute right-0 top-0">
        <AuthButton saveStatus={saveStatus} />
      </div>
    </nav>
  );
}
