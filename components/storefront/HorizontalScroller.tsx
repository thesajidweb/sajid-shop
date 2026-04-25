"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRef } from "react";

import ProductCard from "./products/ProductCard";
import { ProductType } from "@/lib/types/ProductType";
import { CollectionType } from "@/lib/types/collectionType";
import CollectionCard from "./collections/collectionCard";

type ProductScrollerProps = {
  type: "products";
  items: ProductType[];
};

type CollectionScrollerProps = {
  type: "collections";
  items: CollectionType[];
};

type HorizontalScrollerProps = ProductScrollerProps | CollectionScrollerProps;
export default function HorizontalScroller(props: HorizontalScrollerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    const scrollAmount = scrollRef.current.offsetWidth * 0.8;

    scrollRef.current.scrollBy({
      left: direction === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative w-full">
      {/* Desktop arrows */}
      <button
        className="hidden md:flex absolute left-1  top-1/2 -translate-y-1/2 z-10 border rounded-full p-2 hover:bg-primary/80 text-primary hover:text-white"
        onClick={() => scroll("left")}
      >
        <ArrowLeft className="h-4 w-4" />
      </button>

      <button
        className="hidden md:flex absolute right-1  top-1/2 -translate-y-1/2 z-10 border rounded-full p-2  hover:bg-primary/80 text-primary hover:text-white"
        onClick={() => scroll("right")}
      >
        <ArrowRight className="h-4 w-4" />
      </button>

      {/* Scroll area */}
      <div
        ref={scrollRef}
        className="flex gap-1 md:gap-3 overflow-x-auto scroll-smooth no-scrollbar py-2 px-1"
      >
        {/* PRODUCTS */}
        {props.type === "products" &&
          props.items.map((product) => (
            <div
              key={product._id}
              className="
        shrink-0
        w-[40%]
        sm:w-[31%]
        md:w-[24%]
        lg:w-[18%]
        xl:w-[15%]
      "
            >
              <ProductCard product={product} />
            </div>
          ))}

        {/* COLLECTIONS */}
        {props.type === "collections" &&
          props.items.map((collection) => (
            <div
              key={collection._id}
              className="
        shrink-0
        w-[48%]
       
        sm:w-[33%]
        md:w-[35%]
        lg:w-[25%]
        xl:w-[22%]
      "
            >
              <CollectionCard collection={collection} />
            </div>
          ))}
      </div>
    </div>
  );
}
