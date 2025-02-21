import Link from "next/link";
import { NavbarRight } from "@/components/navbar-right";

export function Navbar() {
  return (
    <nav className="border-b bg-background">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <Link href="/">
          <h1 className="text-xl font-bold">Kanban Board</h1>
        </Link>
        <NavbarRight />
      </div>
    </nav>
  );
}
