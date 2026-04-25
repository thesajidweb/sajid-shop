export const shippingDays = {
  standard: 7,
  express: 3,
  premium: 1,
};
// Helper function to get estimated delivery (5 days from order date)
export const estimatedDeliveryDate = (
  createdAt: string,
  shippingMethod: string,
) => {
  const deliveryDate = new Date(createdAt);
  let daysToAdd;
  if (shippingMethod === "express") daysToAdd = shippingDays.express;
  else if (shippingMethod === "premium") daysToAdd = shippingDays.premium;
  else daysToAdd = shippingDays.standard;
  deliveryDate.setDate(deliveryDate.getDate() + daysToAdd);
  return deliveryDate.toISOString();
};
