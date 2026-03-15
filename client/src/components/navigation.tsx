import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { AuthButton } from "@/components/auth/AuthButton";
import type { SaveStatus } from "@/components/auth/SaveIndicator";

interface NavigationProps {
  saveStatus?: SaveStatus;
}

export default function Navigation({ saveStatus }: NavigationProps) {
  const [location] = useLocation();

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
            location === "/experiences" && "active"
          )}
        >
          Remaining Experiences
        </Link>
      </div>
      <div className="absolute right-0 top-0">
        <AuthButton saveStatus={saveStatus} />
      </div>
    </nav>
  );
}
