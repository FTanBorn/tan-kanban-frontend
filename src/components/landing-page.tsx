"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  Users,
  Bell,
  Layout,
  PanelLeft,
} from "lucide-react";
import { useSession } from "next-auth/react";

// Hero Section Component
const HeroSection = () => {
  const { data: session } = useSession();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-background pt-32 pb-16">
      <div className="container px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col justify-center space-y-4 transition-all duration-200 ease-in-out">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Your Tasks, Your Way with Our Kanban Board
            </h1>
            <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Streamline your workflow, enhance team collaboration, and boost
              productivity with our intuitive Kanban board solution.
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              {session ? (
                <Button size="lg" className="w-full min-[400px]:w-auto" asChild>
                  <Link href="/dashboard">
                    Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button
                    size="lg"
                    className="w-full min-[400px]:w-auto"
                    asChild
                  >
                    <Link href="/register">
                      Get Started <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full min-[400px]:w-auto"
                    asChild
                  >
                    <Link href="/login">Sign In</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center justify-center transform transition-all duration-200 ease-in-out hover:scale-105">
            <div className="relative w-full max-w-2xl">
              <div className="rounded-2xl border bg-background p-4 shadow-2xl">
                <div className="flex gap-4">
                  {["To Do", "In Progress", "Done"].map((column) => (
                    <div key={column} className="flex-1">
                      <div className="rounded-lg border bg-muted/50 p-3">
                        <h3 className="font-semibold mb-2">{column}</h3>
                        {[1, 2].map((task) => (
                          <div
                            key={task}
                            className="mb-2 rounded-md border bg-background p-3 shadow-sm"
                          >
                            <div className="h-2 w-12 bg-primary/10 rounded mb-2" />
                            <div className="h-2 w-16 bg-muted rounded" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Features Section Component
const FeaturesSection = () => {
  const features = [
    {
      icon: <PanelLeft className="h-10 w-10" />,
      title: "Drag & Drop Tasks",
      description:
        "Effortlessly move tasks between columns with intuitive drag and drop functionality.",
    },
    {
      icon: <Users className="h-10 w-10" />,
      title: "Team Collaboration",
      description:
        "Work together seamlessly with real-time updates and team member assignments.",
    },
    {
      icon: <Bell className="h-10 w-10" />,
      title: "Real-time Notifications",
      description:
        "Stay updated with instant notifications about task changes and team activities.",
    },
    {
      icon: <Layout className="h-10 w-10" />,
      title: "Custom Columns",
      description:
        "Create and customize columns to match your unique workflow requirements.",
    },
  ];

  return (
    <section className="py-16 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Features that Empower Your Workflow
          </h2>
          <p className="mx-auto mt-4 max-w-[700px] text-gray-500 md:text-xl/relaxed dark:text-gray-400">
            Everything you need to manage projects efficiently and collaborate
            effectively with your team.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col items-center text-center transform transition-all duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg rounded-lg p-6"
            >
              <div className="mb-4 rounded-lg bg-primary/10 p-3 text-primary">
                {feature.icon}
              </div>
              <h3 className="mb-2 font-semibold">{feature.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Team Section Component
const TeamSection = () => {
  const benefits = [
    "Real-time collaboration with team members",
    "Role-based access control",
    "Easy member invitations",
    "Activity tracking and history",
    "Shared workspaces",
    "Team analytics and insights",
  ];

  return (
    <section className="py-16">
      <div className="container px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col justify-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Built for Teams of All Sizes
            </h2>
            <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Enhance team productivity with powerful collaboration features
              designed to bring your team together.
            </p>
            <ul className="grid gap-4">
              {benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-center gap-2 transform transition-all duration-200 ease-in-out hover:translate-x-2"
                >
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-xl">
              <div className="rounded-2xl border bg-background p-6 shadow-2xl transform transition-all duration-200 ease-in-out hover:shadow-2xl hover:scale-105">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex -space-x-2">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="h-10 w-10 rounded-full border-2 border-background bg-primary/10 flex items-center justify-center"
                      >
                        <span className="text-xs font-medium">U{i + 1}</span>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    Invite Team
                  </Button>
                </div>
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 rounded-lg border p-4 hover:bg-muted/50 transition-colors duration-200"
                    >
                      <div className="h-8 w-8 rounded-full bg-primary/10" />
                      <div className="flex-1 space-y-1">
                        <div className="h-2 w-24 bg-muted rounded" />
                        <div className="h-2 w-16 bg-muted rounded" />
                      </div>
                      <div className="h-6 w-16 rounded-full bg-muted" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// CTA Section Component
const CTASection = () => {
  return (
    <section className="py-16 bg-primary">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center text-primary-foreground">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Ready to Get Started?
          </h2>
          <p className="mx-auto max-w-[600px] text-primary-foreground/90 md:text-xl/relaxed">
            Join thousands of teams already using our Kanban board to improve
            their workflow.
          </p>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Link href="/register">
              <Button
                size="lg"
                variant="secondary"
                className="w-full min-[400px]:w-auto"
              >
                Start for Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="w-full min-[400px]:w-auto border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

// Main Landing Page Component
export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <TeamSection />
        <CTASection />
      </main>
    </div>
  );
}
