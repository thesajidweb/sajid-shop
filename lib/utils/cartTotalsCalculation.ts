/* =====================================================
   HELPERS
===================================================== */

const round = (n: number) => Number(n.toFixed(2));

const toSafeNumber = (n: unknown) =>
  typeof n === "number" && !isNaN(n) ? n : 0;

/* =====================================================
   TYPES
===================================================== */

export type CartCalculationItem = {
  price: number;
  quantity: number;
};

export type ShippingMethod = "standard" | "express" | "premium";

export type TaxConfig = {
  rate: number;
  enabled?: boolean;
  taxOnShipping?: boolean; // ✅ optional
};

export type CartTotalsConfig = {
  shipping?: {
    threshold: number;
    methods: Record<ShippingMethod, number>;
    defaultMethod?: ShippingMethod;
  };
  tax?: TaxConfig;
};

export type CartTotals = {
  subtotal: number;
  totalItems: number;

  shipping: number;
  tax: number;

  total: number;

  shippingProgress: number;
  remainingForFreeShipping: number;
  freeShippingThreshold: number;
};

/* =====================================================
   DEFAULT CONFIG
===================================================== */

export const defaultConfig: CartTotalsConfig = {
  shipping: {
    threshold: 100,
    defaultMethod: "standard",
    methods: {
      standard: 10,
      express: 20,
      premium: 35,
    },
  },
  tax: {
    rate: 0.1,
    enabled: true,
    taxOnShipping: false,
  },
};

/* =====================================================
   CALCULATOR
===================================================== */

export function calculateCartTotals(
  items: CartCalculationItem[] = [],
  selectedShipping: ShippingMethod = "standard",
  config: CartTotalsConfig = defaultConfig,
): CartTotals {
  /* -------------------- Safety -------------------- */

  const safeItems = Array.isArray(items) ? items : [];

  const shippingConfig = config.shipping ?? defaultConfig.shipping!;
  const taxConfig = config.tax ?? defaultConfig.tax!;

  const freeShippingThreshold = Math.max(0, shippingConfig.threshold ?? 0);

  /* -------------------- Subtotal -------------------- */

  const subtotalRaw = safeItems.reduce((acc, item) => {
    const price = Math.max(0, toSafeNumber(item.price));
    const quantity = Math.max(0, Math.floor(toSafeNumber(item.quantity)));

    return acc + price * quantity;
  }, 0);

  const subtotal = round(subtotalRaw);

  const totalItems = safeItems.reduce(
    (acc, item) => acc + Math.max(0, Math.floor(toSafeNumber(item.quantity))),
    0,
  );

  /* -------------------- Shipping -------------------- */

  let shippingCost = 0;
  let shippingProgress = 0;
  let remainingForFreeShipping = 0;

  const validMethod = shippingConfig.methods[selectedShipping]
    ? selectedShipping
    : shippingConfig.defaultMethod || "standard";

  const baseRate = toSafeNumber(shippingConfig.methods[validMethod]);

  const qualifiesForFreeShipping = subtotal >= freeShippingThreshold;

  if (qualifiesForFreeShipping) {
    if (validMethod === "standard") {
      shippingCost = 0;
    } else if (validMethod === "express") {
      shippingCost = baseRate * 0.7;
    } else if (validMethod === "premium") {
      shippingCost = baseRate * 0.8;
    }
  } else {
    shippingCost = baseRate;
  }

  shippingCost = round(shippingCost);

  shippingProgress =
    freeShippingThreshold > 0
      ? Math.min(round((subtotal / freeShippingThreshold) * 100), 100)
      : 100;

  remainingForFreeShipping = round(
    Math.max(freeShippingThreshold - subtotal, 0),
  );

  /* -------------------- Tax -------------------- */

  let taxAmount = 0;

  if (taxConfig?.enabled) {
    const rate = Math.max(0, toSafeNumber(taxConfig.rate));

    const taxBase = taxConfig.taxOnShipping
      ? subtotal + shippingCost
      : subtotal;

    taxAmount = round(taxBase * rate);
  }

  /* -------------------- Total -------------------- */

  const total = round(subtotal + shippingCost + taxAmount);

  /* -------------------- Return -------------------- */

  return {
    subtotal,
    totalItems,
    shipping: shippingCost,
    tax: taxAmount,
    total,
    shippingProgress,
    remainingForFreeShipping,
    freeShippingThreshold,
  };
}
