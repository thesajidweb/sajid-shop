import ReviewForm from "@/components/storefront/products/ReviewForm";
import ReviewList from "@/components/storefront/products/ReviewList";

const ProductReviews = () => {
  return (
    <div className="mt-8 lg:mt-15">
      <div className="flex items-center justify-between mb-8">
        <h2 className="h2-text font-bold flex items-center gap-3">
          Customer Reviews
          <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full p-text ">
            128
          </span>
        </h2>
        <button className="p-text font-medium text-primary hover:underline">
          View all reviews
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* LIST OF REVIEWS */}

        <ReviewList />
        {/* WRITE REVIEW FORM */}
        <ReviewForm />
      </div>
    </div>
  );
};

export default ProductReviews;
