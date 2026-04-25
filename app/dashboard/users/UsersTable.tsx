"use client";

import { format } from "date-fns";
import { CheckCircle, XCircle } from "lucide-react";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

import { RoleDropdown } from "./RoleDropdown";
import { User } from "@/lib/types/userType";
import UserActionsDropdown from "./UserActionsDropdown";

import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface UsersTableProps {
  users: User[];
}

export const UsersTable = ({ users }: UsersTableProps) => {
  const router = useRouter();
  const onChangeRole = async (userId: string, newRole: string) => {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        credentials: "include",
        body: JSON.stringify({ role: newRole }),
      });

      // Parse JSON response
      const data = await res.json();

      if (!res.ok) {
        // Show server message if available
        toast.error(data?.message || "Failed to update user role");
      } else {
        toast.success(data?.message || "User role updated successfully");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Unknown error occurred");
      }
    } finally {
      router.refresh();
    }
  };
  return (
    <div className="rounded-md border p-2 overflow-visible">
      <Table className="overflow-visible">
        <TableHeader>
          <TableRow className="overflow-visible">
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Verified</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="overflow-visible">
          {users.length === 0 ? (
            <TableRow className="overflow-visible">
              <TableCell
                colSpan={7}
                className="text-center py-4 overflow-visible"
              >
                No users found.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user._id} className="overflow-visible">
                <TableCell className="overflow-visible">{user.name}</TableCell>

                <TableCell className="overflow-visible">{user.email}</TableCell>

                <TableCell className="overflow-visible">
                  <RoleDropdown
                    value={user.role || "customer"}
                    onChange={(role) => onChangeRole(user._id, role)}
                  />
                </TableCell>

                <TableCell className="overflow-visible">
                  {user.emailVerified ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600">Verified</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-amber-500" />
                      <span className="text-sm text-amber-600">
                        Not verified
                      </span>
                    </div>
                  )}
                </TableCell>

                <TableCell className="overflow-visible">
                  {format(new Date(user.createdAt), "MMM d, yyyy")}
                </TableCell>

                <TableCell className="overflow-visible">
                  {format(new Date(user.updatedAt), "MMM d, yyyy")}
                </TableCell>

                <TableCell className="overflow-visible relative">
                  <UserActionsDropdown userId={user._id} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
