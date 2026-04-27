"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth, UserButton } from "@clerk/nextjs";
import { buttonVariants } from "./ui/button";
import { ModeToggle } from "./theme-toggle";
import { Menu, X, LayoutDashboard } from "lucide-react";

const NAV_LINKS = [
  { href: "/",         label: "Home"     },
  { href: "/about",    label: "About"    },
  { href: "/services", label: "Services" },
  { href: "/pricing",  label: "Pricing"  },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { isSignedIn } = useAuth();

  return (
    <div className="sticky top-0 z-50 border-b border-zinc-300 dark:border-zinc-800 bg-background/80 backdrop-blur-md">
      <header className="flex items-center justify-between h-16 px-6 lg:px-10 max-w-[1400px] mx-auto">

        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-foreground hover:text-amber-500 transition-colors"
        >
          AI-Trainer
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} className="hover:text-foreground transition-colors" href={l.href}>
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-3">
          {isSignedIn ? (
            <>
              <Link
                href="/dashboard"
                className={buttonVariants({ size: "sm", className: "rounded-full bg-amber-500 hover:bg-amber-400 text-black border-none gap-1.5" })}
              >
                <LayoutDashboard size={14} />
                Dashboard
              </Link>
              <UserButton />
            </>
          ) : (
            <>
              <Link
                href="/sign-up"
                className={buttonVariants({ size: "sm", className: "rounded-full bg-amber-500 hover:bg-amber-400 text-black border-none" })}
              >
                Sign Up
              </Link>
              <Link
                href="/sign-in"
                className={buttonVariants({ variant: "outline", size: "sm", className: "rounded-full border-zinc-400 dark:border-zinc-600 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700" })}
              >
                Login
              </Link>
            </>
          )}
          <ModeToggle />
        </div>

        {/* Mobile: avatar + theme toggle + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          {isSignedIn && <UserButton />}
          <ModeToggle />
          <button
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

      </header>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-background/95 backdrop-blur-md px-6 py-4 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              {l.label}
            </Link>
          ))}

          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex flex-col gap-2">
            {isSignedIn ? (
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className={buttonVariants({ size: "sm", className: "w-full justify-center rounded-full bg-amber-500 hover:bg-amber-400 text-black border-none" })}
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/sign-up"
                  onClick={() => setOpen(false)}
                  className={buttonVariants({ size: "sm", className: "w-full justify-center rounded-full bg-amber-500 hover:bg-amber-400 text-black border-none" })}
                >
                  Sign Up
                </Link>
                <Link
                  href="/sign-in"
                  onClick={() => setOpen(false)}
                  className={buttonVariants({ variant: "outline", size: "sm", className: "w-full justify-center rounded-full border-zinc-400 dark:border-zinc-600 bg-zinc-100 dark:bg-zinc-800" })}
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
