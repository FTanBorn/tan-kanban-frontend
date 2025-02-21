// src/middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// withAuth kullanarak sadece belirli sayfaları koruyoruz
export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

// Sadece dashboard ve boards altındaki sayfaları koruyoruz
export const config = {
  matcher: ["/dashboard/:path*", "/boards/:path*"],
};
