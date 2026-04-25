"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

import { User, LogIn, UserPlus, Settings, LogOut } from "lucide-react";
import getClientAuth from "@/lib/auth/getClientAuth";

const UserDropdown = () => {
  const { session, user, isLoading, role } = getClientAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const userNameFirstLetter = user?.name.charAt(0).toUpperCase();

  const handleLogout = async () => {
    try {
      setLoading(true);

      await authClient.signOut();

      toast.success("Logged out successfully");
      router.refresh();
    } catch (err) {
      if (err instanceof Error) toast.error("Logout failed");
    } finally {
      setLoading(false);
    }
  };

  // loading state
  if (isLoading) {
    return (
      <Button variant="ghost" size="icon" className="h-8 w-8 animate-pulse">
        <User className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          className={`h-8 w-8 rounded-full  bg-pink-600 hover:bg-chart-2/80 hover:text-white ${userNameFirstLetter && "border bg-chart-1 text-white rounded-full "} `}
        >
          {userNameFirstLetter || <User className="h-4 w-4" />}
        </Button>
      </DropdownMenuTrigger>

      {/* smaller width */}
      <DropdownMenuContent align="end" className="w-40">
        {!session && (
          <>
            <DropdownMenuItem asChild>
              <Link href="/sign-in" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                Sign In
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link href="/sign-up" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Sign Up
              </Link>
            </DropdownMenuItem>
          </>
        )}

        {session && (
          <>
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>

            {role !== "customer" && (
              <DropdownMenuItem asChild>
                <Link href="/dashboard" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Dashboard
                </Link>
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleLogout}
              disabled={loading}
              className="text-chart-2 flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              {loading ? "Signing out..." : "Sign Out"}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
