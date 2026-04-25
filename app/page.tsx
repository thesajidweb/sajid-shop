import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Suspense } from "react";

import { buttonVariants } from "@/components/ui/button";
import HeroCarousel from "@/components/storefront/HeroCarousel";
import HorizontalScroller from "@/components/storefront/HorizontalScroller";
import HeroProductScrollerSkeleton from "@/components/storefront/products/HeroProductScrollerSkeleton";

import { defaultConfig } from "@/lib/utils/cartTotalsCalculation";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import HeaderStyle from "@/components/shared/HeaderStyle";
import { getCollections } from "@/lib/actions/collection/getCollections";

import { CollectionType } from "@/lib/types/collectionType";

import ErrorBox from "@/components/shared/ErrorBox";

import { getFeaturedProducts } from "@/lib/actions/product/getFeaturedProducts";
import { ProductType } from "@/lib/types/ProductType";
import { headers } from "next/headers";

const HomePage = async () => {
  headers(); // ✅ MUST
  // Fetch data
  // 👇 Parallel fetching
  const [productsRes, collectionsRes] = await Promise.all([
    getFeaturedProducts(),
    getCollections(),
  ]);

  if (!productsRes.success) {
    return (
      <ErrorBox title="Error Loading Products" message={productsRes.error} />
    );
  }

  if (!collectionsRes.success) {
    return (
      <ErrorBox
        title="Error Loading Collections"
        message={collectionsRes.error}
      />
    );
  }
  const featuredProducts: ProductType[] = productsRes.data;

  const collections: CollectionType[] = collectionsRes.data;
  const carouselContent = collections.slice(0, 5);

  return (
    <div className="container mx-auto flex flex-col w-full px-1">
      {/* Hero Carousel */}
      <HeroCarousel collections={carouselContent} />

      {/* collections scroller */}
      <section className="py-4 md:py-6">
        <HeaderStyle
          title="Explore Collections"
          label="collections"
          subtitle="Explore all product collections available in our store, from the
              latest trends to everyday essentials."
          bottomLine={true}
        />

        <Suspense fallback={<HeroProductScrollerSkeleton />}>
          {collections && (
            <HorizontalScroller type="collections" items={collections} />
          )}
        </Suspense>
      </section>

      {/* Free Shipping Banner */}
      <div className="my-2  text-center bg-primary/5 rounded-lg py-2 md:py-4 px-2 md:px-4">
        <h3 className="h-text font-semibold text-foreground">
          Free Shipping on Orders Over{" "}
          {formatCurrency(defaultConfig.shipping?.threshold || 100000)}
        </h3>
        <p className="p-text text-muted-foreground mt-2 max-w-xl mx-auto">
          Browse our collections and find your perfect item today.
        </p>
      </div>

      {/* Trending Products */}
      <section className="py-4 md:py-6 relative">
        <HeaderStyle
          title="Trending Products"
          label="products"
          subtitle="Discover our most popular items right now, curated for you."
          bottomLine={true}
        />

        <div className=" hidden md:flex absolute p-text top-15 right-0 ">
          <Link
            href="/products"
            className={buttonVariants({
              variant: "link",
              className: "text-primary z-10 hidden md:flex items-center gap-2",
            })}
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <Suspense fallback={<HeroProductScrollerSkeleton />}>
          {featuredProducts && (
            <HorizontalScroller type="products" items={featuredProducts} />
          )}
        </Suspense>
      </section>
    </div>
  );
};

export default HomePage;
