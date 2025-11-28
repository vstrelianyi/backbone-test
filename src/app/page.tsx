"use client";

import Link from "next/link";
import { redirect } from "next/navigation";

export default function PageHome() {


	redirect("/debug");

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-16">
      <nav className="rounded-lg border bg-card px-6 py-4 shadow-sm flex flex-col items-center">
        <p className="text-sm text-muted-foreground">
          Need to inspect payloads? Head to the debug page.
        </p>
        <Link
          href="/debug"
          className="mt-3 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          Debug
        </Link>
      </nav>
    </main>
  );
}
