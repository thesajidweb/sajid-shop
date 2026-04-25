// app/privacy-policy/page.tsx (Compact Version)
import { Metadata } from "next";
import Link from "next/link";
import { Shield, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Sajid Shop Portfolio Project",
  description:
    "Learn how user data is collected and used in Sajid Shop, a demo e-commerce portfolio project. Includes details about Google OAuth authentication, data storage, and security practices.",
  robots: {
    index: true,
    follow: true,
  },
};

const PrivacyPolicyPage = () => {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 p-text">
      {/* Header */}
      <div className="text-center mb-8">
        <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
        <h1 className="h-text font-bold">Privacy Policy</h1>
        <p className="text-muted-foreground mt-2">Last Updated: April 2026</p>
      </div>

      {/* Demo Warning */}
      <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-8 flex gap-3">
        <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0" />
        <div className="text-sm">
          <strong className="text-yellow-800 dark:text-yellow-400">
            Demo Project Only
          </strong>
          <p className="text-yellow-700 dark:text-yellow-500 mt-1">
            This is a portfolio/demo project for educational purposes. Not a
            real commercial service.
          </p>
        </div>
      </div>

      {/* Privacy Policy Content */}
      <div className="space-y-4 text-muted-foreground">
        <div>
          <h2 className="h2-text font-semibold text-foreground mb-3">
            1. Introduction
          </h2>
          <p>
            This Privacy Policy explains how this portfolio e-commerce
            application collects, uses, and protects user information. This
            project is created for educational and demonstration purposes only.
          </p>
        </div>

        <div>
          <h2 className="h2-text font-semibold text-foreground mb-3">
            2. Information Collected
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Basic Profile Info</strong> (Google OAuth): Name, email,
              profile image
            </li>
            <li>
              <strong>Account & Usage Data:</strong> Demo orders, cart items,
              interactions
            </li>
            <li>
              <strong>Technical Data:</strong> Browser type, device info,
              analytics
            </li>
          </ul>
        </div>

        <div>
          <h2 className="h2-text font-semibold text-foreground mb-3">
            3. How We Use Information
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Authenticate users (login functionality)</li>
            <li>Provide demo e-commerce features</li>
            <li>Improve user experience</li>
          </ul>
        </div>

        <div>
          <h2 className="h2-text font-semibold text-foreground mb-3">
            4. Google OAuth Usage
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>We only access basic profile information</li>
            <li>
              We do NOT access sensitive Google data (contacts, Gmail, Drive)
            </li>
            <li>Data is used only for login and identification</li>
          </ul>
        </div>

        <div>
          <h2 className="h2-text font-semibold text-foreground mb-3">
            5. Data Storage
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Stored in databases (MongoDB) for demo functionality</li>
            <li>Some data stored locally (localStorage/cookies)</li>
            <li>Not used for commercial purposes</li>
          </ul>
        </div>

        <div>
          <h2 className="h2-text font-semibold text-foreground mb-3">
            6. Data Sharing
          </h2>
          <p>
            We do NOT sell, trade, or share your personal data with third
            parties. Limited data may be processed by authentication providers,
            hosting platforms, and image delivery services.
          </p>
        </div>

        <div>
          <h2 className="h2-text font-semibold text-foreground mb-3">
            7. Data Security
          </h2>
          <p>
            Basic security practices are implemented including secure
            authentication, input validation, and protected API routes. However,
            this is a demo project and should not be used for real transactions.
          </p>
        </div>

        <div>
          <h2 className="h2-text font-semibold text-foreground mb-3">
            8. User Rights
          </h2>
          <p>
            You may stop using the application at any time or request removal of
            your demo data.
          </p>
        </div>

        <div>
          <h2 className="h2-text font-semibold text-foreground mb-3">
            9. Children&#39;s Privacy
          </h2>
          <p>This application is not intended for children under 13.</p>
        </div>

        <div>
          <h2 className="h2-text font-semibold text-foreground mb-3">
            10. Changes to This Policy
          </h2>
          <p>
            This Privacy Policy may be updated at any time without prior notice.
            Updates will be reflected on this page.
          </p>
        </div>

        <div>
          <h2 className="h2-text font-semibold text-foreground mb-3">
            11. Contact
          </h2>
          <p>
            Email:{" "}
            <a
              href="mailto:thesajid.web@gmail.com"
              className="text-primary hover:underline"
            >
              thesajid.web@gmail.com
            </a>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t mt-4 pt-2 text-center text-sm">
        <Link href="/" className="text-muted-foreground hover:text-primary">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
