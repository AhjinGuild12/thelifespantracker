import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import Navigation from "@/components/navigation";
import { AuthDialog } from "@/components/auth/AuthDialog";
import type { SaveStatus } from "@/components/auth/SaveIndicator";

interface AuthGateProps {
  title: string;
  description: string;
  icon: LucideIcon;
  saveStatus?: SaveStatus;
}

export default function AuthGate({
  title,
  description,
  icon: Icon,
  saveStatus,
}: AuthGateProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="exp-container">
      <div className="exp-main">
        <Navigation saveStatus={saveStatus} />

        <div className="auth-gate">
          <Icon className="auth-gate-icon" />
          <h2 className="auth-gate-title">{title}</h2>
          <p className="auth-gate-desc">{description}</p>
          <button
            className="auth-gate-btn"
            onClick={() => setDialogOpen(true)}
          >
            Sign In to Unlock
          </button>
        </div>

        <AuthDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      </div>
    </div>
  );
}
