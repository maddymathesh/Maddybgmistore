import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Maddy BGMI Store - Admin Portal",
  description: "Management portal for Maddy BGMI Store catalog, reviews, payment links, and transactions.",
};

import { dark } from "@clerk/themes";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#eab308",
          colorBackground: "#0a0c10",
          colorInputBackground: "#111520",
          colorInputText: "#eaeaea",
        },
        elements: {
          card: "border border-white/5 shadow-2xl rounded-2xl",
          formButtonPrimary: "bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold tracking-widest uppercase border-none hover:opacity-90",
          footerActionLink: "text-yellow-500 hover:text-yellow-400 font-bold",
        }
      }}
    >
      <html lang="en" suppressHydrationWarning className="dark">
        <body suppressHydrationWarning>
          {children}
          <Toaster richColors theme="dark" position="top-right" />
        </body>
      </html>
    </ClerkProvider>
  );
}

