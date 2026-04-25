"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Star } from "lucide-react";

import AddToCart from "@/components/storefront/products/AddToCart";

import { ProductType } from "@/lib/types/ProductType";
import { calculateTotalStock } from "@/lib/utils/getStockInfo";

import { formatCurrency } from "@/lib/utils/formatCurrency";
import Image from "next/image";
import { getImageKitUrl } from "@/lib/imagekit/imagekit";

type Props = {
  product: ProductType;
  trigger: React.ReactNode;
};

export default function ProductModal({ product, trigger }: Props) {
  const price = Number(product.finalPrice ?? product.price ?? 0);
  const rating = product.averageRating ?? 0;
  const stock = calculateTotalStock(product.variants || []);

  const filled = Math.floor(rating);

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent
        className="max-w-4xl w-full p-2 md:p-6 max-h-[90vh] overflow-y-auto rounded-2xl [&>button]:bg-red-500 
  [&>button]:text-white 
  [&>button]:rounded 
  [&>button]:p-1"
      >
        <div className="grid gap-1">
          {/* Gallery */}
          {product?.gallery && (
            <div className=" flex w-full flex-nowrap overflow-x-auto gap-2 pb-2 no-scrollbar scroll-smooth">
              {product.gallery.map((image, index) => (
                <div
                  key={index}
                  className="relative shrink-0 w-36 md:w-40 lg:w-48 aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-muted group"
                >
                  <Image
                    src={getImageKitUrl(image.url as string, {
                      width: 200,
                      height: 200,
                      quality: 80,
                    })}
                    alt={`View ${index + 1}`}
                    fill
                    sizes="(min-width: 768px) 120px, 80px"
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Details */}
          <div className="flex flex-col gap-2">
            {/* Title */}
            <div>
              <h2 className="tracking-wide p-text font-semibold">
                {product.name}
              </h2>
              {/* Description */}
              <p className="p2-text text-muted-foreground leading-relaxed">
                {product.shortDescription || "No description available."}
              </p>

              <div className="flex items-center gap-4">
                <p className="p-text md:text-sm tracking-tight  ">
                  Brand :
                  <span className=" text-chart-2">
                    {" "}
                    {product.brand || "Brand N/A"}
                  </span>
                </p>
                <div className="flex gap-2 ">
                  {/* Rating */}
                  <div className="flex items-center gap-2 text-xs">
                    Total Ratings
                    <span className="text-chart-2 ">
                      ({product.ratingsCount ?? 0})
                    </span>
                  </div>
                  <div className="flex items-center ">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < filled
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-1 flex-wrap">
              <span className="p-text font-bold text-primary">
                {formatCurrency(price)}
              </span>

              {product.price > price && (
                <span className="text-sm line-through text-muted-foreground">
                  {formatCurrency(product.price)}
                </span>
              )}
              {/* Stock */}
              <p
                className={`p2-text ml-2 font-medium ${
                  stock ? "text-green-600" : "text-red-500"
                }`}
              >
                {stock ? `${stock} in stock` : "Out of stock"}
              </p>
            </div>

            {/* Add To Cart */}
            {stock > 0 && product._id && (
              <AddToCart
                id={product._id}
                name={product.name}
                priceAtPurchase={price}
                warranty={product.warranty}
                variant={product.variants}
                image={product.gallery?.[0]?.url || ""}
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
