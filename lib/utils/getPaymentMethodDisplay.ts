export const getPaymentMethodDisplay = (method: string) => {
  const methods: Record<string, string> = {
    cod: "Cash on Delivery",
    card: "Credit/Debit Card",
    bank: "Bank Transfer",
  };
  return methods[method] || method;
};
