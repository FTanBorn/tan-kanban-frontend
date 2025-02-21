// src/app/(auth)/register/page.tsx
import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen">
      {/* Sol Taraf - Hero/Banner Alanı */}
      <div className="hidden lg:flex lg:flex-1 bg-primary/10">
        <div className="flex flex-col justify-between p-12 w-full">
          {/* Logo ve Başlık */}
          <div>
            <h1 className="text-4xl font-bold text-primary mb-4">
              Welcome to Kanban Board
            </h1>
            <p className="text-lg text-muted-foreground">
              Organize, track, and manage your projects with ease.
            </p>
          </div>

          {/* İllüstrasyon Alanı */}
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-md">
              {/* Örnek Kanban Board Preview */}
              <div className="bg-background rounded-lg shadow-lg p-6">
                <div className="flex gap-4">
                  {["To Do", "In Progress", "Done"].map((column) => (
                    <div key={column} className="flex-1">
                      <div className="bg-muted rounded-md p-3">
                        <h3 className="font-medium text-sm mb-2">{column}</h3>
                        <div className="space-y-2">
                          {[1, 2].map((task) => (
                            <div
                              key={task}
                              className="bg-background rounded border p-2"
                            >
                              <div className="h-2 w-12 bg-primary/10 rounded" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Alt Bilgi */}
          <div className="mt-auto">
            <blockquote className="border-l-2 pl-6 italic">
              <p className="text-lg text-muted-foreground">
                "This tool has transformed how we manage our projects. Simple
                yet powerful."
              </p>
              <footer className="mt-2 text-sm font-medium">
                — Sarah Chen, Product Manager
              </footer>
            </blockquote>
          </div>
        </div>
      </div>

      {/* Sağ Taraf - Form Alanı */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-[400px] space-y-6">
          {/* Form Header */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">
              Create an account
            </h1>
            <p className="text-muted-foreground">
              Enter your information to get started
            </p>
          </div>

          {/* Register Form */}
          <RegisterForm />

          {/* Alt Linkler */}
          <div className="text-center text-sm">
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
