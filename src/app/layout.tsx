import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Backbone Starter",
  description: "Next.js 16 + Supabase + shadcn/ui + RHF + Zod scaffold",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen bg-background text-foreground">
          <header className="sticky top-0 z-40 border-b bg-card/90 backdrop-blur">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
              <Link href="/" className="text-base font-semibold">
                Backbone Test
              </Link>
              <nav className="flex items-center gap-4 text-sm font-medium">
                <Link
                  href="/debug"
                  className="text-muted-foreground transition hover:text-foreground"
                >
                  Debug
                </Link>
                <Link
                  href="/create"
                  className="text-muted-foreground transition hover:text-foreground"
                >
                  Create
                </Link>
              </nav>
            </div>
          </header>

          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
