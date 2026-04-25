import { ProductType } from "@/lib/types/ProductType";

type Warranty = ProductType["warranty"];

export const useWarrantyInfo = (warranty?: Warranty) => {
  const isValid = Boolean(warranty && warranty.type !== "none");

  const warrantyText =
    warranty?.period && warranty?.unit
      ? `${warranty.period} ${warranty.unit}${
          warranty.period > 1 ? "s" : ""
        } ${warranty.type === "manufacturer" ? "Manufacturer" : "Seller"}`
      : "Warranty";

  const coverageText =
    warranty?.period && warranty?.unit
      ? `${warranty.period} ${warranty.unit}${warranty.period > 1 ? "s" : ""}`
      : null;

  return {
    isValid,
    warrantyText,
    coverageText,
  };
};
