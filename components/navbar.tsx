import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { ModeToggle } from "./theme-toggle";

export function Navbar() {
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

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link className="hover:text-foreground transition-colors" href="/">Home</Link>
          <Link className="hover:text-foreground transition-colors" href="/about">About</Link>
          <Link className="hover:text-foreground transition-colors" href="/services">Services</Link>
          <Link className="hover:text-foreground transition-colors" href="/pricing">Pricing</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
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
          <ModeToggle />
        </div>

      </header>
    </div>
  );
}
