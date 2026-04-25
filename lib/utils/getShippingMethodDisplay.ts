export const getShippingMethodDisplay = (method: string) => {
  const methods: Record<string, string> = {
    standard: "Standard Shipping",
    express: "Express Shipping",
    premium: "Premium Shipping",
  };
  return methods[method] || method;
};
