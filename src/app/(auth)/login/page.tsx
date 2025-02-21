// src/app/(auth)/login/page.tsx
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { ArrowRight } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* Sol Taraf - Form Alanı */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-[400px] space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </div>

          <LoginForm />

          <div className="text-center text-sm">
            <p className="text-muted-foreground">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-primary underline-offset-4 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Sağ Taraf - Hero/Banner Alanı */}
      <div className="hidden lg:flex lg:flex-1 bg-primary">
        <div className="flex flex-col justify-between p-12 w-full text-primary-foreground">
          <div>
            <h1 className="text-4xl font-bold mb-4">Welcome to Kanban Board</h1>
            <p className="text-lg opacity-90">Your projects, your way.</p>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <div className="max-w-md space-y-8">
              {[
                "Drag & Drop Tasks",
                "Team Collaboration",
                "Real-time Updates",
              ].map((feature) => (
                <div
                  key={feature}
                  className="flex items-center space-x-3 text-lg font-medium"
                >
                  <ArrowRight className="h-6 w-6" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto">
            <blockquote className="border-l-2 pl-6 italic">
              <p className="text-lg opacity-90">
                "The best way to organize your work and boost team
                productivity."
              </p>
              <footer className="mt-2 text-sm font-medium">
                — Alex Turner, Engineering Lead
              </footer>
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  );
}
