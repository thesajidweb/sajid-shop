import { Star } from "lucide-react";

const ReviewForm = () => {
  return (
    <div className="lg:col-span-5">
      <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm sticky top-24">
        <h3 className="text-lg sm:text-xl font-bold mb-2">Write a Review</h3>
        <p className="text-xs sm:text-sm text-muted-foreground mb-6">
          Share your experience to help others make informed decisions.
        </p>

        <form className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Your Rating
            </label>
            <div className="flex gap-1 bg-secondary/30 p-2 rounded-lg w-fit">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground hover:text-primary transition-colors" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Your Review
            </label>
            <textarea
              className="flex min-h-[120px] sm:min-h-[150px] w-full rounded-lg border border-input 
                        bg-background px-4 py-3 text-sm shadow-sm placeholder:text-muted-foreground 
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring 
                        focus-visible:border-input disabled:cursor-not-allowed disabled:opacity-50 
                        resize-none transition-all"
              placeholder="What did you like or dislike? Share your experience..."
            />
          </div>

          <button
            type="submit"
            className="w-full h-11 font-semibold bg-primary text-primary-foreground 
                      hover:bg-primary/90 rounded-lg px-4 transition-colors
                      focus:ring-2 focus:ring-primary/20 focus:outline-none"
          >
            Submit Review
          </button>

          <p className="text-xs text-center text-muted-foreground">
            <a
              href="/login"
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </a>{" "}
            to write a review and earn rewards.
          </p>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;
