"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Phone,
  Clock,
  Mail,
  Linkedin,
  Facebook,
  Twitter,
  Instagram,
} from "lucide-react";

const Footer = () => {
  const pathname = usePathname();
  const showFooter = !pathname.startsWith("/dashboard");

  const navLinks = {
    explore: [
      { name: "Home", href: "/" },
      { name: "Products", href: "/products" },
      { name: " Terms & Conditions", href: "/about/terms-and-conditions" },
      { name: "Privacy Policy", href: "/about//privacy-policy" },
    ],
    support: [
      { name: "Track Order", href: "/orders" },
      { name: "Shipping & Returns", href: "/about" },
      { name: "FAQ", href: "/about" },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    {
      icon: Linkedin,
      href: "https://linkedin.com/in/muhammad-sajid-shah-2003203a7",
      label: "LinkedIn",
    },
  ];

  return (
    showFooter && (
      <footer className="border-t mt-1 bg-background text-foreground">
        <div className="container mx-auto px-2 py-2 md:py-4 lg:py-6">
          {/* Mobile-first: stacked grid, then side-by-side on tablet/desktop */}
          <div className="grid  gap-2 grid-cols-2 lg:grid-cols-4 lg:gap-12">
            {/* Brand Section */}
            <div className="space-y-1 px-2 sm:text-left">
              <h3 className="text-lg font-bold tracking-tight">SAJIDSHOP</h3>
              <p className="p-text md:text-sm text-muted-foreground max-w-xs mx-auto sm:mx-0">
                Sustainable fashion meets modern technology. We curate premium
                products for the conscious consumer.
              </p>
              {/* Social Icons */}
              <div className="flex  justify-start gap-1 md:gap-2">
                {socialLinks.map((social, idx) => (
                  <Link
                    key={idx}
                    href={social.href}
                    aria-label={social.label}
                    className="w-8 h-8 rounded-md border p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <social.icon />
                  </Link>
                ))}
              </div>
            </div>

            {/* Explore Links */}
            <div className="px-2 sm:text-left">
              <h4 className="mb-1 p-text md:text-sm font-semibold tracking-wide">
                Explore
              </h4>
              <ul className="space-y-1 p-text md:text-sm text-muted-foreground">
                {navLinks.explore.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href={link.href}
                      className="transition-colors hover:text-foreground"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div className="px-2 sm:text-left">
              <h4 className="mb-1 p-text md:text-sm font-semibold tracking-wide">
                Support
              </h4>
              <ul className="space-y-1 p-text md:text-sm text-muted-foreground">
                {navLinks.support.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href={link.href}
                      className="transition-colors hover:text-foreground"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="px-2 sm:text-left">
              <h4 className="mb-1 p-text md:text-sm font-semibold tracking-wide">
                Contact
              </h4>
              <div className="space-y-1 p-text  md:text-sm text-muted-foreground">
                <a
                  href="https://wa.me/923427108728"
                  className="flex items-center  justify-start gap-1 hover:underline hover:text-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Phone className="inline w-4 h-4 mr-2" />
                  WhatsApp
                </a>
                <a
                  href="mailto:thesajid.web@gmail.com"
                  className="flex items-center  justify-start gap-1 hover:underline hover:text-primary"
                >
                  <Mail className="inline w-4 h-4 mr-2" />
                  Email Me
                </a>
                <div className="flex items-center  justify-start gap-2">
                  <Clock className="h-4 w-4 shrink-0" />
                  <span>
                    <span className="hidden md:inline">Available from </span>9
                    AM to 6 PM EST
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright Bar - Mobile First */}
          <div className="mt-4 border-t pt-2 px-2 p2-text text-muted-foreground md:mt-10 text-center">
            <p>
              &copy; {new Date().getFullYear()} SAJIDSHOP. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    )
  );
};

export default Footer;
