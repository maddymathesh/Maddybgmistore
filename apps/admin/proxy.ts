import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest, NextFetchEvent } from "next/server";

const isPublicRoute = createRouteMatcher(["/login(.*)", "/api/webhook/clerk(.*)"]);

const handler = clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    const session = await auth();
    const userId = session.userId;
    
    if (!userId) {
      // Redirect to login page if not authenticated
      const signInUrl = new URL("/login", req.url);
      signInUrl.searchParams.set("redirect_url", req.url);
      return NextResponse.redirect(signInUrl);
    }

    // Resolve user role from Clerk session public metadata
    type Claims = { publicMetadata?: { role?: string }; metadata?: { role?: string } };
    const claims = session.sessionClaims as Claims | undefined;
    const userRole = claims?.publicMetadata?.role || claims?.metadata?.role || "USER";
    
    const validAdminRoles = ["SUPER_ADMIN", "ADMIN", "TRANSACTION_MANAGER", "CONTENT_MANAGER"];
    
    // Check if the user is the permanent admin via clerkClient or session claims if available
    let isPermanentAdmin = false;
    try {
      const { clerkClient } = await import("@clerk/nextjs/server");
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      const email = user.primaryEmailAddressId 
        ? user.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress 
        : user.emailAddresses[0]?.emailAddress;
      if (
        email === "contact@maddybgmistore.in" ||
        email === "maddybgmistoreog@gmail.com" ||
        email === "r.mateshwaran.io@gmail.com"
      ) {
        isPermanentAdmin = true;
      }
    } catch(e) {
      console.error("Could not fetch user email in middleware", e);
    }

    if (!isPermanentAdmin && !validAdminRoles.includes(userRole)) {
      // Access denied if the user role is not administrative
      return new NextResponse("Access Denied: Administrative privileges are required.", { status: 403 });
    }
  }
  return NextResponse.next();
});

export function proxy(request: NextRequest, event: NextFetchEvent) {
  return handler(request, event);
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:html|css|js|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)$).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
    // Always run for Clerk proxy path
    '/__clerk/:path*',
  ],
};
