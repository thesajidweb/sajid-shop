"use client";

import Link from "next/link";
import Image from "next/image";
import { getImageKitUrl } from "@/lib/imagekit/imagekit";

type CollectionCardProps = {
  collection: {
    _id?: string;
    title: string;
    description: string;
    image: {
      url: string;
    };
  };
};

const CollectionCard = ({ collection }: CollectionCardProps) => {
  return (
    <article
      className="h-full"
      itemScope
      itemType="https://schema.org/Collection"
    >
      <Link
        href={`/collections/${collection._id}`}
        title={`View ${collection.title} collection`}
        aria-label={`Open ${collection.title} collection`}
        className="group flex h-full flex-col overflow-hidden rounded-xl border bg-background transition hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {/* Image */}
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={getImageKitUrl(collection.image.url, {
              width: 800,
              height: 450,
              quality: 80,
            })}
            alt={`${collection.title} collection cover image`}
            fill
            priority={false}
            unoptimized
            sizes="(max-width: 640px) 100vw,
                   (max-width: 1024px) 50vw,
                   33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            itemProp="image"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col  p-2 min-h-[70px]">
          <h3
            className="h2-text capitalize font-semibold leading-tight line-clamp-1"
            itemProp="name"
          >
            {collection.title}
          </h3>

          <p
            className="mt-1  p2-text text-muted-foreground line-clamp-2"
            itemProp="description"
          >
            {collection.description}
          </p>
        </div>
      </Link>
    </article>
  );
};

export default CollectionCard;
