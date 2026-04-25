import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import { TooltipContent } from "@radix-ui/react-tooltip";
import { ArrowRight, Gift, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Recommended products (could be fetched based on order items)
const RECOMMENDED_PRODUCTS = [
  {
    id: "rec1",
    name: "Leather Sneakers",
    price: 129.99,
    image: "/placeholder.jpg",
    slug: "leather-sneakers",
  },
  {
    id: "rec2",
    name: "Wool Sweater",
    price: 89.99,
    image: "/placeholder.jpg",
    slug: "wool-sweater",
  },
  {
    id: "rec3",
    name: "Denim Jacket",
    price: 149.99,
    image: "/placeholder.jpg",
    slug: "denim-jacket",
  },
  {
    id: "rec4",
    name: "Canvas Backpack",
    price: 79.99,
    image: "/placeholder.jpg",
    slug: "canvas-backpack",
  },
];

const RecommendedProducts = () => {
  const handleAddToWishlist = (id: string) => {
    alert(id + "...Added to wishlist");
  };
  return (
    <div>
      {/* RecommendedProducts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Gift className="h-5 w-5 text-primary" />
            You Might Also Like
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {RECOMMENDED_PRODUCTS.map((product) => (
            <div key={product.id} className="flex items-center gap-3 group">
              <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted shrink-0">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex-1">
                <Link
                  href={`/products/${product.slug}`}
                  className="text-sm font-medium hover:text-primary transition-colors line-clamp-1"
                >
                  {product.name}
                </Link>
                <p className="text-xs text-muted-foreground">{product.price}</p>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleAddToWishlist(product.id)}
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Add to wishlist</TooltipContent>
              </Tooltip>
            </div>
          ))}

          <Button variant="link" className="w-full mt-2" asChild>
            <Link href="/recommendations">
              View More Recommendations
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecommendedProducts;
