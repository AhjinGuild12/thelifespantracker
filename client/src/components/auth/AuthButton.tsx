import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { AuthDialog } from "./AuthDialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User } from "lucide-react";
import type { SaveStatus } from "@/components/auth/SaveIndicator";
import { SaveIndicator } from "@/components/auth/SaveIndicator";

interface AuthButtonProps {
  saveStatus?: SaveStatus;
}

export function AuthButton({ saveStatus }: AuthButtonProps) {
  const { user, signOut, isConfigured } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);

  if (!isConfigured) return null;

  if (!user) {
    return (
      <>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setDialogOpen(true)}
          className="text-gray-300 hover:text-white hover:bg-gray-800"
        >
          Sign In
        </Button>
        <AuthDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      </>
    );
  }

  const initials = user.email
    ? user.email.substring(0, 2).toUpperCase()
    : "U";
  const avatarUrl = user.user_metadata?.avatar_url;

  return (
    <div className="flex items-center gap-2">
      {saveStatus && <SaveIndicator status={saveStatus} />}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="relative h-8 w-8 rounded-full p-0 hover:bg-gray-800"
          >
            <Avatar className="h-7 w-7">
              <AvatarImage src={avatarUrl} alt={user.email ?? "User"} />
              <AvatarFallback className="bg-indigo-600 text-white text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-48 bg-[#1a1a2e] border-gray-700 text-gray-100"
        >
          <DropdownMenuItem disabled className="text-gray-400 text-xs">
            <User className="mr-2 h-3 w-3" />
            {user.email}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => signOut()}
            className="text-gray-100 hover:bg-gray-800 cursor-pointer"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
