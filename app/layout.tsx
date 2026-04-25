import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";

import { Toaster } from "sonner";

import { Suspense } from "react";
import StoreProvider from "@/redux/StoreProvider";
import Navbar from "@/components/layout/navbar/Navbar";
import Footer from "@/components/layout/StoreFooter";
import DemoRole from "../components/DemoRole";
import LoadingState from "./loading";

interface RootLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: {
    default: "SajidShop | Modern E-commerce Platform",
    template: "%s | SajidShop",
  },
  description:
    "SajidShop is a modern e-commerce platform built with Next.js, TypeScript, ShadCN UI, Redux Toolkit, MongoDB, and ImageKit.",

  metadataBase: new URL(`${process.env.NEXT_PUBLIC_URL}`),

  openGraph: {
    title: "SajidShop",
    description: "Shop the latest products with SajidShop.",
    url: `${process.env.NEXT_PUBLIC_URL}`,
    siteName: "SajidShop",
    images: [
      {
        url: "/icons/og-image.jpg", // ✅ fixed path
        width: 1200,
        height: 630,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    images: ["/icons/twitter-image.jpg"], // ✅ fixed path
  },

  icons: {
    icon: [
      { url: "/icons/favicon.ico" },
      { url: "/icons/favicon-16x16.png", sizes: "16x16" },
      { url: "/icons/favicon-32x32.png", sizes: "32x32" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
    other: [
      {
        rel: "mask-icon",
        url: "/icons/safari-pinned-tab.svg",
      },
    ],
  },

  manifest: "/icons/site.webmanifest", // ✅ IMPORTANT FIX
};
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,

  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],

  colorScheme: "light dark",
};
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="min-h-screen font-sans antialiased overflow-x-hidden">
        <Suspense fallback={<LoadingState />}>
          <StoreProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Toaster
                theme="system"
                richColors
                closeButton
                position="top-right"
                expand
                visibleToasts={4}
                duration={4000}
                gap={12}
                toastOptions={{
                  className: `
                    rounded-xl !border !shadow-xl
                    bg-white/90 dark:bg-zinc-900/90
                    border-zinc-200/50 dark:border-zinc-800/50
                    text-sm font-medium
                  `,
                  style: {
                    transition:
                      "transform 0.15s ease-out, opacity 0.2s ease-in",
                  },
                  classNames: {
                    title: "font-semibold text-base",
                    description: "text-sm opacity-90",
                  },
                }}
              />
              <DemoRole />
              <header className="sticky top-0 z-50 w-full mb-2">
                <Navbar />
              </header>
              <main className="ml-0 flex-1 transition-all w-full min-w-0">
                {children}
                <SpeedInsights />
                <Analytics />
              </main>
              <Footer />
            </ThemeProvider>
          </StoreProvider>
        </Suspense>
      </body>
    </html>
  );
}
