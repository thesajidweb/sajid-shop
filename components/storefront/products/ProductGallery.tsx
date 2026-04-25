"use client";

import { getImageKitUrl } from "@/lib/imagekit/imagekit";
import { ProductType } from "@/lib/types/ProductType";

import Image from "next/image";
import { useState } from "react";

const ProductGallery = ({ gallery }: { gallery: ProductType["gallery"] }) => {
  const [mainImage, setMainImage] = useState(gallery?.[0]?.url ?? "");

  if (!gallery || gallery.length === 0) return null;
  const handleClick = (image: string) => {
    setMainImage(image);
  };
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative w-80 md:w-78 lg:w-96 xl:w-[400px] 2xl:w-[500px] aspect-square rounded-2xl overflow-hidden  shadow-sm group">
        <Image
          src={getImageKitUrl(mainImage, {
            width: 1000,
            height: 1000,
            quality: 90,
          })}
          alt="productImage"
          fill
          priority
          sizes="(min-width: 1024px) 500px, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      {gallery.length > 1 && (
        <div className="w-full max-w-[500px]">
          <div className="flex w-full flex-nowrap overflow-x-auto gap-3 pb-2 no-scrollbar">
            {gallery.map((image, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleClick(image.url as string)}
                className="relative shrink-0 w-20 sm:w-24 md:w-28 aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-muted group"
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
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
