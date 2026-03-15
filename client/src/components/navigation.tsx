import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export default function Navigation() {
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
    </nav>
  );
}
