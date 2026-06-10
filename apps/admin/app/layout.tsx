import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Maddy BGMI Store - Admin Dashboard",
  description: "Management portal for Maddy BGMI Store catalog, reviews, payment links, and transactions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body suppressHydrationWarning>
          {children}
          <Toaster richColors theme="dark" position="top-right" />
        </body>
      </html>
    </ClerkProvider>
  );
}

