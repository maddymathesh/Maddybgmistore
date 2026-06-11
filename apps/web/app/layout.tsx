import type { Metadata } from "next";
import localFont from "next/font/local";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SocialFloat from "../components/SocialFloat";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Maddy BGMI Store - Tactical Secure Marketplace",
  description: "South India's most trusted BGMI account marketplace. Safe, verified, and serving players since 2019.",
  keywords: ["bgmi", "bgmi store", "maddy bgmi store", "buy bgmi account", "sell bgmi account", "uc purchase", "xsuit", "supercar"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#080a0f] text-[#eaeaea]`}>
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
          <Navbar />
          <div className="pt-[64px] min-h-[calc(100vh-64px)] flex flex-col justify-between">
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
          <SocialFloat />
        </ClerkProvider>
      </body>
    </html>
  );
}
