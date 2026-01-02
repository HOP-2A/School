"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
export function ClientWrapper() {
  const router = useRouter();
  return <Button onClick={() => router.push("/signup")}>sign up</Button>;
}
export default function HomePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();


  useEffect(() => {
    if (isLoaded && user) {
      router.push("/student/dashboard");
    }
  }, [isLoaded, user, router]);

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-3xl text-center space-y-8">
        

        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white">
          Smart Learning.
          <span className="block text-indigo-400">
            Simplified.
          </span>
        </h1>

        <p className="text-slate-400 text-lg md:text-xl">
          Manage classes, assignments, and progress — all in one modern platform.
        </p>

    
        <div className="flex justify-center gap-4 pt-4">
        <SignInButton/>
        <ClientWrapper/>

          
        </div>

      </div>
    </main>
  );
}
