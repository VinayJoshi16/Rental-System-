import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Bike, LogOut, User, LayoutDashboard, History, Sparkles } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ApiUser } from "@/lib/api";

function getInitials(user: ApiUser): string {
  const name = user.user_metadata?.full_name?.trim();
  if (name) {
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  }
  if (user.email) {
    return user.email[0].toUpperCase();
  }
  return "?";
}

export const Navbar = () => {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 border-b border-border/80 bg-background/80 backdrop-blur-xl shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 font-bold text-xl group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all">
            <Bike className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            PedalSync
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={() => navigate("/plans")}
            className="hidden sm:flex rounded-lg"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Plans
          </Button>
          {user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-xl h-10 w-10 font-semibold text-primary">
                    {getInitials(user)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl border shadow-lg">
                  <DropdownMenuLabel className="flex flex-col gap-1">
                    <span className="font-medium truncate">{user.user_metadata?.full_name || "Account"}</span>
                    <span className="text-xs text-muted-foreground font-normal truncate">{user.email}</span>
                    {user.plan && (
                      <span className="inline-flex w-fit mt-1 px-2 py-0.5 rounded-md text-xs font-medium bg-primary/15 text-primary capitalize">
                        {user.plan}
                      </span>
                    )}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/my-rentals")} className="rounded-lg cursor-pointer">
                    <History className="mr-2 h-4 w-4" />
                    My Rentals
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => navigate("/admin")} className="rounded-lg cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Admin Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="rounded-lg cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate("/auth")} className="rounded-lg">
                Sign In
              </Button>
              <Button variant="hero" onClick={() => navigate("/plans")} className="rounded-xl shadow-md">
                Get Started
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
