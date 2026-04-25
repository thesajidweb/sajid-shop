"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { MoreVertical, Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";

type Props = {
  userId: string;
};

export default function UserActionsDropdown({ userId }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [mounted, setMounted] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const router = useRouter();

  // Handle mounting for portal
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        buttonRef.current?.contains(e.target as Node) ||
        dropdownRef.current?.contains(e.target as Node)
      ) {
        return;
      }
      setIsOpen(false);
    };

    // Use mousedown for better responsiveness
    document.addEventListener("mousedown", handleClickOutside);
    // Close on escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  // Reposition on scroll or resize
  useEffect(() => {
    if (!isOpen) return;

    const updatePosition = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setPosition({
          top: rect.bottom + window.scrollY + 4,
          left: rect.left + window.scrollX - 160 + rect.width,
        });
      }
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX - 160 + rect.width,
      });
    }
    setIsOpen(!isOpen);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/users/${userId}`, { method: "DELETE" });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to delete user");
      }

      toast.success("User deleted successfully");
      setShowDeleteDialog(false);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // const handleView = () => {
  //   router.push(`/users/${userId}`);
  //   setIsOpen(false);
  // };

  const actions = [
    // {
    //   label: "View",
    //   icon: Eye,
    //   onClick: handleView,
    //   className: "",
    // },
    {
      label: "Delete",
      icon: Trash2,
      onClick: () => {
        setIsOpen(false);
        setShowDeleteDialog(true);
      },
      className: "text-destructive",
    },
  ];

  // Don't render portal on server
  if (!mounted) {
    return (
      <>
        <Button
          ref={buttonRef}
          variant="ghost"
          size="icon"
          onClick={toggleDropdown}
          className="relative"
          aria-expanded={isOpen}
          aria-label="User actions"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </>
    );
  }

  return (
    <>
      <Button
        ref={buttonRef}
        variant="ghost"
        size="icon"
        onClick={toggleDropdown}
        className="relative"
        aria-expanded={isOpen}
        aria-label="User actions"
      >
        <MoreVertical className="h-4 w-4" />
      </Button>

      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            className="fixed z-999 min-w-40 rounded-md border bg-popover shadow-md animate-in fade-in-0 zoom-in-95"
            style={{
              top: position.top,
              left: position.left,
            }}
          >
            <div className="py-1">
              {actions.map(({ label, icon: Icon, onClick, className }) => (
                <button
                  key={label}
                  onClick={onClick}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors cursor-pointer"
                >
                  <Icon className="h-4 w-4" />
                  <span className={className}>{label}</span>
                </button>
              ))}
            </div>
          </div>,
          document.body,
        )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete user</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              user. Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
