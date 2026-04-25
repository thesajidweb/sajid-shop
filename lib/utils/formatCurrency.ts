export const formatCurrency = (amount: number) => {
  return `₨${amount.toFixed(2)}`;
};

export const formatCurrencyToPKR = (amount: number) => {
  return `PKR ${amount.toFixed(2)}`;
};
