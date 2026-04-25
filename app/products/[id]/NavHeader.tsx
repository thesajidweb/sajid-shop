import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

const NavHeader = ({ productName }: { productName: string }) => {
  return (
    <div>
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6 lg:mb-8 overflow-x-auto pb-2 whitespace-nowrap">
        <Link
          href="/"
          className="hover:text-primary transition-colors flex items-center gap-1 shrink-0"
        >
          <Home className="h-4 w-4" />
          <span className="hidden sm:inline">Home</span>
        </Link>
        <ChevronRight className="h-4 w-4 shrink-0" />
        <Link
          href="/products"
          className="hover:text-primary transition-colors shrink-0"
        >
          Products
        </Link>
        <ChevronRight className="h-4 w-4 shrink-0" />
        <span className="text-foreground font-medium truncate max-w-[150px] sm:max-w-[200px] md:max-w-[300px]">
          {productName}
        </span>
      </nav>
    </div>
  );
};

export default NavHeader;
