// admin dashboard all fields
export const dashboardProductFields = {
  _id: 1,
  name: 1,
  price: 1,
  cost: 1,
  category: 1,
  subcategory: 1,
  brand: 1,
  gallery: 1,
  shortDescription: 1,
  description: 1,
  variants: 1,
  status: 1,
  isFeatured: 1,
  warranty: 1,
  discount: 1,
  salesCount: 1,
  lastSoldAt: 1,
  shippingWeight: 1,
  ratingsCount: 1,
  averageRating: 1,
  createdAt: 1,
  updatedAt: 1,
};

// storefront only public info
export const storefrontProductFields = {
  _id: 1,
  name: 1,
  price: 1,
  category: 1,
  subcategory: 1,
  brand: 1,
  gallery: 1,
  shortDescription: 1,
  variants: 1,
  isFeatured: 1,
  discount: 1,
  warranty: 1,
  ratingsCount: 1,
  averageRating: 1,
};

export function projectionToSelect(projection: Record<string, number>) {
  return Object.keys(projection).join(" ");
}
