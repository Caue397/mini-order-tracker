"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Logo } from "@/components/ui/Logo";

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-background">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <Link href="/">
          <Logo />
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {user && (
            <>
              <span className="text-sm text-muted">{user.name}</span>
              <Button variant="ghost" onClick={logout}>
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
