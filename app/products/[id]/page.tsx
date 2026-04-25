import AddToCart from "@/components/storefront/products/AddToCart";
import ProductGallery from "@/components/storefront/products/ProductGallery";

import WarrantyInfo from "@/components/storefront/products/WarrantyInfo";

import { ProductType } from "@/lib/types/ProductType";
import { calculateTotalStock } from "@/lib/utils/getStockInfo";

import { Star, Truck } from "lucide-react";

import NavHeader from "./NavHeader";

import { defaultConfig } from "@/lib/utils/cartTotalsCalculation";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import WishlistButton from "@/components/storefront/profile/WishlistButton";
import { ShareButton } from "@/components/storefront/ShareButton";
import { Metadata, ResolvingMetadata } from "next";
import { getSingleProduct } from "@/lib/actions/product/getSingleProduct";
import ErrorBox from "@/components/shared/ErrorBox";

// meta data
export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { id } = await params;

  const productRes = await getSingleProduct(id);
  if (!productRes.success) {
    console.error("Error generating metadata:", productRes.error);
    return {
      title: "Product Not Found",
      description: "The product you're looking for could not be found.",
      robots: { index: false },
    };
  }

  const product: ProductType = productRes.data;
  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://yourdomain.com";
  const productUrl = `${baseUrl}/products/${id}`;
  const finalPrice = product.finalPrice || product.price;
  const savings =
    product.discount?.type !== "none"
      ? Math.round(((product.price - finalPrice) / product.price) * 100)
      : 0;

  // Generate structured data for rich snippets
  const structuredData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: product.gallery?.[0]?.url,
    description: product.shortDescription || product.description,
    sku: product._id,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "PKR",
      price: finalPrice,

      availability:
        calculateTotalStock(product.variants) > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Your Store Name",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.averageRating,
      reviewCount: product.ratingsCount,
    },
  };

  return {
    title: `${product.name} | ${product.brand} | Buy Online at Best Price`,
    description:
      product.shortDescription ||
      product.description ||
      `Shop ${product.name} by ${product.brand} at the best price. ${product.discount?.type !== "none" ? `Save ${savings}% today! ` : ""}Free shipping available.`,
    keywords: [
      product.name,
      product.brand,
      product.category,
      product.subcategory,
      "online shopping",
      "best price",
      ...(product.variants?.map((v) => v.colorName) || []),
    ].join(", "),

    // Open Graph (Facebook, LinkedIn, etc.)
    openGraph: {
      title: `${product.name} - ${product.brand}`,
      description:
        product.shortDescription ||
        `Shop ${product.name} at the best price. ${product.discount?.type !== "none" ? `Save ${savings}% today!` : ""}`,
      url: productUrl,
      siteName: "Your Store Name",
      images: [
        {
          url: product.gallery?.[0]?.url || "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
      locale: "en_US",
      type: "website",
    },

    // Twitter Card
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | ${product.brand}`,
      description:
        product.shortDescription || `Shop ${product.name} at the best price.`,
      images: [product.gallery?.[0]?.url || "/og-image.jpg"],
      site: "@sajidshop",
      creator: "@sajidshop",
    },

    // Additional SEO
    alternates: {
      canonical: productUrl,
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    // Product-specific metadata
    other: {
      "product:name": product.name,
      "product:price:amount": finalPrice.toString(),
      "product:price:currency": "PKR",
      "product:availability":
        calculateTotalStock(product.variants) > 0 ? "in stock" : "out of stock",
      "product:condition": "new",
      "product:category": product.category,
      structured_data: JSON.stringify(structuredData),
    },
  };
}

const ProductDetail = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const id = (await params).id;

  const productRes = await getSingleProduct(id);
  if (!productRes.success) {
    return (
      <ErrorBox
        title="Error to fetch {Frontend Single} product"
        message={productRes.error}
      />
    );
  }

  const product: ProductType = productRes.data;
  const finalPrice = product.finalPrice;
  const saving = (
    finalPrice ? ((product.price - finalPrice) / product.price) * 100 : 0
  ).toFixed(2);
  const totalStock = calculateTotalStock(product.variants);
  const stars = Array.from(
    { length: Math.floor(product.averageRating) },
    (_, i) => i + 1,
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-4  max-w-7xl">
        <NavHeader productName={product.name} />

        {/* Main Product Section */}
        <div
          className="
  grid 
  grid-cols-1 
  md:grid-cols-2 
  lg:grid-cols-2 
  
  gap-4 
  lg:gap-10 
  xl:gap-16
"
        >
          {/* LEFT COLUMN: Product Images */}

          {product.gallery && <ProductGallery gallery={product.gallery} />}

          {/* RIGHT COLUMN: Product Details (unchanged) */}
          <div className="space-y-1 lg:space-y-2">
            {/* Header Section */}

            <div>
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h1 className="h2-text font-bold tracking-tight text-foreground">
                    {product.name}
                  </h1>
                  <p className="text-primary/80 font-medium text-sm sm:text-base">
                    by {product.brand || "Brand Name N/A"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <div className="flex flex-col justify-center items-center">
                    <ShareButton
                      title={product.name}
                      text={`Check out ${product.name} on our store!`}
                      url={`${process.env.NEXT_PUBLIC_URL}/products/${product._id}`}
                    />
                    <p className="p2-text">Share</p>
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <WishlistButton productId={product._id as string} />
                    <p className="p2-text">Wishlist</p>
                  </div>
                </div>
              </div>

              {/* Rating & Stock Info */}
              <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-2 md:mt-3">
                <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-full">
                  <div className="flex gap-0.5">
                    {stars.map((star) => (
                      <Star
                        key={star}
                        className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-chart-2 text-chart-2"
                      />
                    ))}
                  </div>
                  <span className="p-text font-medium ml-1">
                    {product.averageRating}
                  </span>
                  <span className="p-text text-muted-foreground">
                    ({product.ratingsCount} reviews)
                  </span>
                </div>
                <span className="text-border hidden sm:inline">|</span>
                <div className="p2-text flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${totalStock > 0 ? "bg-green-500" : "bg-red-500"}`}
                  />
                  <span
                    className={` font-medium ${totalStock > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                  >
                    {totalStock > 0 ? `${totalStock} in stock` : "Out of stock"}
                  </span>
                </div>
              </div>
            </div>

            {/* Price Block */}
            <div className="flex flex-wrap items-baseline gap-3 bg-secondary/30 p-2 sm:p-3 rounded-xl">
              <span className="p-text font-bold text-primary">
                {formatCurrency(finalPrice || product.price)}
              </span>
              {product.discount?.type !== "none" && saving && (
                <>
                  <span className="p2-text text-muted-foreground line-through">
                    {formatCurrency(product.price)}
                  </span>
                  <span className="p2-text  not-first:bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1  font-bold rounded-full">
                    Save {saving}%
                  </span>
                </>
              )}
            </div>

            {/* Variant Selection UI */}
            {product._id && finalPrice && (
              <AddToCart
                id={product._id}
                name={product.name}
                priceAtPurchase={finalPrice}
                warranty={product.warranty}
                variant={product.variants}
                image={product.gallery?.[0]?.url ?? "/placeholder.jpg"}
              />
            )}
            {/* ================= VALUE PROPS ================= */}
            <div className="pt-2 md:pt-3">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-1 rounded-xl bg-secondary/30 border border-border w-full">
                {/* Warranty */}
                <WarrantyInfo
                  warranty={product.warranty}
                  className="flex items-center gap-2"
                />

                {/* Divider for desktop */}
                <div className="hidden sm:block h-6 w-px bg-border" />

                {/* Shipping */}
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-primary shrink-0" />
                  <span className="p2-text">
                    Free shipping over ₨{defaultConfig.shipping?.threshold}
                  </span>
                </div>
              </div>
            </div>
            {/* Description */}
            <div className="pt-6 border-t border-border">
              <h3 className="text-lg font-bold mb-3">About this item</h3>
              <p className="text-muted-foreground leading-relaxed p-text">
                {product.description ||
                  "Product description goes here. This premium item is designed with attention to detail and crafted from high-quality materials for lasting durability and performance."}
              </p>
            </div>
          </div>
        </div>

        {/* REVIEWS SECTION */}
        {/* <ProductReviews /> */}
      </div>
    </div>
  );
};

export default ProductDetail;
