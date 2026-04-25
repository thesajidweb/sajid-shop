import { Landmark, LucideIcon, Wallet } from "lucide-react";

export type PaymentMethod = {
  id: string;
  name: string;
  icon: LucideIcon;
  description?: string;
  badge?: string;
};
export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "cod",
    name: "Cash on Delivery",
    icon: Landmark,
    badge: "Pay at door",
  },

  {
    id: "easypaisa",
    name: "Easypaisa",
    icon: Wallet,
    badge: "Popular",
  },
];
