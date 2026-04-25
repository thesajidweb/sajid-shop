"use client";

import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { CollectionType } from "@/lib/types/collectionType";
import { getImageKitUrl } from "@/lib/imagekit/imagekit";
import Link from "next/link";

export default function HeroCarousel({
  collections,
}: {
  collections: CollectionType[];
}) {
  return (
    <div className="w-full px-2 sm:px-4 md:px-0">
      <div className="relative w-full">
        <Carousel
          className="w-full"
          opts={{ loop: true, duration: 50 }}
          plugins={[
            Autoplay({
              delay: 5000,
              stopOnInteraction: false,
              stopOnMouseEnter: true,
              stopOnFocusIn: true,
            }),
          ]}
        >
          <CarouselContent>
            {collections.map((col) => (
              <CarouselItem key={col._id}>
                <div className="relative h-[40vh] sm:h-[45vh] md:h-[60vh] lg:h-[70vh] xl:h-[75vh] overflow-hidden rounded-lg sm:rounded-xl">
                  <Image
                    src={getImageKitUrl(col.image.url, {
                      width: 1200,
                      height: 600,
                      quality: 80,
                    })}
                    alt={col.title}
                    fill
                    className="object-cover rounded-lg sm:rounded-xl"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
                    priority
                    unoptimized
                  />

                  {/* With Shop Now button */}
                  <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 via-black/50 to-transparent p-3 sm:p-4 md:p-6">
                    <div className="max-w-2xl">
                      <h1 className="capitalize text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white shadow-lg mb-1 sm:mb-2">
                        {col.title}
                      </h1>
                      {col.description && (
                        <p className="text-white/80 text-xs sm:text-sm md:text-base line-clamp-2 sm:line-clamp-3 max-w-lg mb-2 sm:mb-3">
                          {col.description}
                        </p>
                      )}
                      <Link
                        href={`/collections/${col._id}`}
                        className="px-2 py-1 sm:px-4 sm:py-2 bg-white/95 text-primary text-xs sm:text-sm font-medium rounded-full hover:bg-gray-100 transition-colors"
                      >
                        Shop Now →
                      </Link>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation buttons */}
          <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-3">
            <CarouselPrevious className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-black/50 hover:bg-black/70 text-white border-0 flex items-center justify-center cursor-pointer backdrop-blur-sm" />
            <CarouselNext className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-black/50 hover:bg-black/70 text-white border-0 flex items-center justify-center cursor-pointer backdrop-blur-sm" />
          </div>

          {/* Collection counter for mobile */}
          <div className="absolute top-3 right-3 sm:hidden bg-black/50 backdrop-blur-sm rounded-full px-2 py-0.5">
            <span className="text-white text-xs font-medium">
              {collections.length} Collections
            </span>
          </div>
        </Carousel>
      </div>
    </div>
  );
}
