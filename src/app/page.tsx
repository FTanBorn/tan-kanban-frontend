// src/app/page.tsx
import { Navbar } from "@/components/navbar";
import LandingPage from "@/components/landing-page";

export default function Home() {
  return (
    <div>
      <Navbar />
      <LandingPage />
    </div>
  );
}
