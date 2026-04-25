"use client";
import { AlertTriangle } from "lucide-react"; // or any icon library
import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition } from "react";

interface UnauthorizedProps {
  message?: string;
  description?: string;
  showLoginLink?: boolean;
  showGoBackLink?: boolean;
}

const Unauthorized = ({
  message = "Access Denied",
  description = "You don't have permission to view this page.",
  showLoginLink = true,
  showGoBackLink = true,
}: UnauthorizedProps) => {
  const router = useRouter();
  const handleBack = () => {
    startTransition(() => {
      router.back();
    });
  };
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center px-4 py-16">
      <div className="rounded-full bg-red-100 p-4 dark:bg-red-900/20">
        <AlertTriangle className="h-12 w-12 text-red-600 dark:text-red-400" />
      </div>

      <h1 className="mt-6 text-2xl font-semibold text-gray-900 dark:text-gray-100">
        {message}
      </h1>

      <p className="mt-2 text-center text-gray-600 dark:text-gray-400">
        {description}
      </p>

      <div className="mt-8 flex gap-4">
        {showLoginLink && (
          <Link
            href="/sign-in"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Sign In
          </Link>
        )}

        {showGoBackLink && (
          <button
            onClick={handleBack}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Go Home
          </button>
        )}
      </div>
    </div>
  );
};

export default Unauthorized;
