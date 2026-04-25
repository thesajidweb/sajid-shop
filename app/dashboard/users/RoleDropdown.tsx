"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ROLES } from "@/lib/auth/validRole";

interface RoleDropdownProps {
  value: string;
  onChange: (role: string) => void;
}

export const RoleDropdown = ({ value, onChange }: RoleDropdownProps) => {
  const roleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "text-chart-1 px-1 py-0 ";
      case "manager":
        return "text-chart-2 ";
      case "order-manager":
        return "text-chart-3 ";
      default:
        return "text-muted-foreground ";
    }
  };
  return (
    <Select value={value} onValueChange={onChange}>
      <div>
        <SelectTrigger size="sm" className={roleBadgeVariant(value)}>
          <SelectValue placeholder="Select a role" />
        </SelectTrigger>
      </div>

      <SelectContent>
        {ROLES.map((role) => (
          <SelectItem key={role} value={role}>
            {role.replace("-", " ")}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
