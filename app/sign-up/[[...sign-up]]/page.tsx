"use client";

import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-6 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-muted/20 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="z-10">
        <SignUp 
          appearance={{
            elements: {
              card: "border border-border shadow-2xl rounded-[2rem] bg-card text-card-foreground",
              headerTitle: "text-foreground font-bold tracking-tighter text-2xl",
              headerSubtitle: "text-muted-foreground",
              socialButtonsBlockButton: "bg-secondary border border-border hover:bg-secondary/80 text-secondary-foreground transition-colors",
              socialButtonsBlockButtonText: "text-foreground font-medium",
              formFieldLabel: "text-muted-foreground font-medium",
              formInput: "bg-input border-border text-foreground rounded-xl focus:ring-1 focus:ring-ring",
              formButtonPrimary: "bg-primary text-primary-foreground hover:opacity-90 transition-all font-bold rounded-xl",
              footerActionLink: "text-foreground hover:underline underline-offset-4",
              dividerText: "text-muted-foreground/50",
            }
          }}
        />
      </div>
    </main>
  );
}