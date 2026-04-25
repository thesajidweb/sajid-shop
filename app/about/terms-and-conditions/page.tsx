// app/terms/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import { FileText, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms & Conditions | Sajid Shop Portfolio Project",
  description:
    "Terms and conditions for Sajid Shop, a demo e-commerce portfolio project using Google OAuth and Better Auth for authentication.",
  robots: {
    index: true,
    follow: true,
  },
};

const TermsAndConditionsPage = () => {
  return (
    <main className="container max-w-4xl mx-auto px-4 py-4 md:py-6">
      {/* Header */}
      <header className="text-center mb-6">
        <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
        <h1 className="h-text font-bold tracking-tight">Terms & Conditions</h1>
        <p className="text-muted-foreground mt-2 p-text">
          Last Updated: April 2026
        </p>
      </header>

      {/* Demo Warning */}
      <section
        aria-label="Demo Disclaimer"
        className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-10 flex gap-3"
      >
        <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
        <div className="p-text leading-relaxed">
          <strong className="text-yellow-800 dark:text-yellow-400">
            Educational Demo Only
          </strong>
          <p className="text-yellow-700 dark:text-yellow-500 mt-1">
            This application is a portfolio/demo project built for learning
            purposes. No real transactions, payments, or commercial services are
            provided.
          </p>
        </div>
      </section>

      {/* Terms Content */}
      <section className="space-y-4 md:space-y-6 text-muted-foreground leading-relaxed">
        {/* 1 */}
        <article>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            1. Introduction
          </h2>
          <p className="p-text">
            These Terms & Conditions govern your use of this portfolio
            e-commerce application (`the App`). By accessing or using the App,
            you agree to comply with these Terms.
          </p>
        </article>

        {/* 2 */}
        <article>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            2. Acceptable Use
          </h2>
          <p className="p-text">
            You agree to use this App responsibly and lawfully.
          </p>
          <ul className="p-text list-disc pl-6 mt-2 space-y-1">
            <li>No illegal or fraudulent activity</li>
            <li>No unauthorized access attempts</li>
            <li>No interference with system security</li>
            <li>No abuse of authentication systems</li>
          </ul>
        </article>

        {/* 3 */}
        <article>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            3. Demo Nature of the Platform
          </h2>
          <ul className="p-text list-disc pl-6 space-y-1">
            <li>This is NOT a real e-commerce platform</li>
            <li>All products and orders are simulated</li>
            <li>No real payments are processed</li>
          </ul>
        </article>

        {/* 4 */}
        <article>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            4. Authentication & Accounts
          </h2>
          <p className="p-text">
            This App uses Google OAuth and Better Auth for authentication and
            session management.
          </p>
          <ul className="p-text list-disc pl-6 mt-2 space-y-1">
            <li>Only basic profile data (name, email) is accessed</li>
            <li>No sensitive Google data is accessed</li>
            <li>You are responsible for your session security</li>
          </ul>
        </article>

        {/* 5 */}
        <article>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            5. Data Usage
          </h2>
          <p className="p-text">
            Data is used only to provide demo features such as authentication,
            cart, and orders. No sensitive personal or financial data is
            collected.
          </p>
          <p className="mt-2">
            For more details, see our{" "}
            <Link
              href="/privacy-policy"
              className="text-primary hover:underline"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </article>

        {/* 6 */}
        <article>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            6. Intellectual Property
          </h2>
          <p className="p-text">
            All content including source code, UI design, and system
            architecture belongs to the developer.
          </p>
          <p className="mt-2 text-red-600 dark:text-red-400 font-medium">
            Unauthorized copying or reuse is strictly prohibited.
          </p>
        </article>

        {/* 7 */}
        <article>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            7. Third-Party Services
          </h2>
          <p className="p-text">
            This App may use third-party services such as:
          </p>
          <ul className="p-text list-disc pl-6 mt-2 space-y-1">
            <li>Google (authentication)</li>
            <li>Better Auth (session management)</li>
            <li>Hosting platforms (e.g., Vercel)</li>
            <li>Image services (e.g., ImageKit)</li>
          </ul>
          <p className="mt-2">
            We are not responsible for third-party service behavior or policies.
          </p>
        </article>

        {/* 8 */}
        <article>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            8. Limitation of Liability
          </h2>
          <p className="p-text">
            This App is provided `as is` without warranties. We are not
            responsible for errors, downtime, data loss, or misuse.
          </p>
        </article>

        {/* 9 */}
        <article>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            9. Termination
          </h2>
          <p className="p-text">
            Access may be suspended or terminated if Terms are violated or
            suspicious activity is detected.
          </p>
        </article>

        {/* 10 */}
        <article>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            10. Changes to Terms
          </h2>
          <p className="p-text">
            These Terms may be updated at any time. Continued use of the App
            means you accept the updated Terms.
          </p>
        </article>

        {/* 11 */}
        <article>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            11. Contact
          </h2>
          <p className="p-text">
            Email:{" "}
            <a
              href="mailto:thesajid.web@gmail.com"
              className="text-primary hover:underline"
            >
              thesajid.web@gmail.com
            </a>
          </p>
        </article>
      </section>

      {/* Final Disclaimer */}
      <section className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mt-10 text-center">
        <p className="p-text text-red-800 dark:text-red-300">
          ⚠️ This is a portfolio/demo project. No real transactions or
          commercial services are provided.
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t mt-10 pt-6 text-center p-text">
        <div className="flex justify-center gap-4">
          <Link href="/" className="text-muted-foreground hover:text-primary">
            ← Back to Home
          </Link>
          <span>•</span>
          <Link
            href="/about//privacy-policy"
            className="text-muted-foreground hover:text-primary"
          >
            Privacy Policy
          </Link>
        </div>
      </footer>
    </main>
  );
};

export default TermsAndConditionsPage;
