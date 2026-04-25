// lib/constants/shipping.ts

import { Truck } from "lucide-react";

// Shipping method display names and icons
export const SHIPPING_DISPLAY = {
  standard: { name: "Standard", icon: Truck, description: "5-7 business days" },
  express: { name: "Express", icon: Truck, description: "2-3 business days" },
  premium: { name: "Premium", icon: Truck, description: "Next day delivery" },
};

export const PAKISTAN_PROVINCES = [
  { value: "punjab", label: "Punjab" },
  { value: "sindh", label: "Sindh" },
  { value: "kpk", label: "Khyber Pakhtunkhwa" },
  { value: "balochistan", label: "Balochistan" },
  { value: "gilgit", label: "Gilgit-Baltistan" },
  { value: "kashmir", label: "Azad Kashmir" },
  { value: "islamabad", label: "Islamabad Capital Territory" },
] as const;

export const PAKISTAN_CITIES = {
  punjab: [
    "Lahore",
    "Faisalabad",
    "Rawalpindi",
    "Multan",
    "Gujranwala",
    "Sialkot",
    "Bahawalpur",
    "Sargodha",
    "Sheikhupura",
  ],
  sindh: [
    "Karachi",
    "Hyderabad",
    "Sukkur",
    "Larkana",
    "Nawabshah",
    "Mirpur Khas",
    "Jacobabad",
  ],
  kpk: [
    "Peshawar",
    "Abbottabad",
    "Mardan",
    "Swat",
    "Kohat",
    "Dera Ismail Khan",
    "Charsadda",
  ],
  balochistan: ["Quetta", "Gwadar", "Turbat", "Khuzdar", "Chaman", "Sibi"],
  gilgit: ["Gilgit", "Skardu", "Hunza", "Ghizer"],
  kashmir: ["Muzaffarabad", "Mirpur", "Kotli", "Rawalakot"],
  islamabad: ["Islamabad", "Rawalpindi"],
} as const;
