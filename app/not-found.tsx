"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-full border border-border bg-muted shadow-sm">
        <AlertCircle className="h-12 w-12 text-destructive" strokeWidth={1.5} />
      </div>

      <h1 className="mt-8 text-6xl font-bold tracking-tight text-foreground">
        404
      </h1>

      <h2 className="mt-3 text-2xl font-semibold text-foreground">
        Page not found
      </h2>

      <p className="mt-4 max-w-md text-base text-muted-foreground">
        Sorry, the page you’re looking for doesn’t exist or may have been moved.
      </p>

      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-primary/90 hover:px-8"
      >
        Back to homepage
      </Link>
    </main>
  );
}
