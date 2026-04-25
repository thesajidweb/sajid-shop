"use client";

import { Share2 } from "lucide-react";
import { useState, useEffect } from "react";

interface ShareButtonProps {
  title: string;
  text?: string;
  url: string;
  className?: string;
}

export const ShareButton = ({
  title,
  text,
  url,
  className = "",
}: ShareButtonProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      const userAgent =
        typeof window.navigator === "undefined" ? "" : navigator.userAgent;
      const mobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          userAgent,
        );
      setIsMobile(mobile);
    };
    checkMobile();
  }, []);

  const copyToClipboard = async (text: string) => {
    // Method 1: Try modern Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        console.error("Clipboard API failed:", err);
      }
    }

    // Method 2: Fallback to execCommand
    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.top = "-9999px";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();

      const success = document.execCommand("copy");
      document.body.removeChild(textarea);

      if (success) return true;
    } catch (err) {
      console.error("execCommand copy failed:", err);
    }

    return false;
  };

  const handleShare = async () => {
    // Ensure URL is absolute
    let absoluteUrl = url;
    if (!url.startsWith("http")) {
      absoluteUrl = `${window.location.origin}${url.startsWith("/") ? url : `/${url}`}`;
    }

    const shareData = {
      title: title,
      text: text || `Check out ${title} on our store!`,
      url: absoluteUrl,
    };

    console.log("Attempting to share with data:", shareData);
    console.log("navigator.share available:", !!navigator.share);

    // Try native share first (mobile)
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        console.log("Successfully shared!");
        return;
      } catch (shareError) {
        console.error("Share error:", shareError);
        if (shareError instanceof Error && shareError.name === "AbortError") {
          console.log("User cancelled sharing");
          return;
        }
        // If share fails, fall through to copy method
      }
    } else {
      console.log("Web Share API not supported");
    }

    // For mobile devices without Web Share API or if it failed, show a custom share dialog
    if (isMobile && !navigator.share) {
      // Create a custom share modal for older mobile browsers
      const shareMessage = encodeURIComponent(
        `${title}\n${text || `Check out ${title} on our store!`}\n${absoluteUrl}`,
      );
      const whatsappUrl = `https://wa.me/?text=${shareMessage}`;
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(absoluteUrl)}`;
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(absoluteUrl)}`;

      // Show a simple prompt with sharing options
      const shareOption = prompt(
        "Share via:\n1 - WhatsApp\n2 - Facebook\n3 - Twitter\n4 - Copy Link\n\nEnter number:",
      );

      if (shareOption === "1") {
        window.open(whatsappUrl, "_blank");
      } else if (shareOption === "2") {
        window.open(facebookUrl, "_blank");
      } else if (shareOption === "3") {
        window.open(twitterUrl, "_blank");
      } else if (shareOption === "4") {
        const copied = await copyToClipboard(absoluteUrl);
        if (copied) {
          setShowTooltip(true);
          setTimeout(() => setShowTooltip(false), 2000);
        }
      }
      return;
    }

    // Fallback to copy to clipboard (desktop)
    const copied = await copyToClipboard(absoluteUrl);
    if (copied) {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
    } else {
      alert(`Copy this link: ${absoluteUrl}`);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleShare}
        className={`flex items-center justify-center h-9 w-9 rounded-full shadow-md border border-transparent hover:border-primary/20 transition-colors group ${className}`}
        aria-label="Share product"
      >
        <Share2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary group-hover:text-chart-2 transition-colors" />
      </button>
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-50">
          Link copied!
        </div>
      )}
    </div>
  );
};
