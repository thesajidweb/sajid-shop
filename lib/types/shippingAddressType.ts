import { z } from "zod";
import { ShippingMethod } from "../utils/cartTotalsCalculation";

export const shippingAddressSchema = z.object({
  label: z
    .string()
    .min(3, "Label must be at least 3 characters")
    .max(20, "Label must not exceed 100 characters")
    .regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces"),
  fullName: z
    .string()
    .min(3, "Full name must be at least 3 characters")
    .max(100, "Full name must not exceed 100 characters")
    .regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces"),
  email: z
    .string()
    .email("Invalid email address")
    .min(5, "Email must be at least 5 characters")
    .max(100, "Email must not exceed 100 characters"),
  phone: z
    .string()
    .regex(
      /^03\d{2}-\d{7}$|^03\d{9}$/,
      "Phone number must be in format 03XX-XXXXXXX or 03XXXXXXXXX",
    ),
  address: z
    .string()
    .min(10, "Street address must be at least 10 characters")
    .max(200, "Street address must not exceed 200 characters"),
  landmark: z
    .string()
    .max(100, "Landmark must not exceed 100 characters")
    .optional(),
  city: z
    .string()
    .min(2, "City must be at least 2 characters")
    .max(50, "City must not exceed 50 characters"),
  province: z.string().min(1, "Province is required"),
  zipCode: z
    .string()
    .regex(/^\d{5}$/, "Postal code must be exactly 5 digits")
    .optional()
    .or(z.literal("")),
  country: z.literal("PK"),
});

export type ShippingAddress = z.infer<typeof shippingAddressSchema>;

export type AddressFormProps = {
  initialAddress?: Partial<ShippingAddress>;
  subtotal?: number;
  onAddressChange?: (address: ShippingAddress) => void;
  onShippingMethodChange?: (method: ShippingMethod) => void;
  onSaveAddressChange?: (save: boolean) => void;
  onContinue?: () => void;
};
