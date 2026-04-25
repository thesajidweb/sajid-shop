import { Star } from "lucide-react";

const ReviewList = () => {
  return (
    <div className="lg:col-span-7 space-y-6">
      {[1, 2, 3].map((review) => (
        <div
          key={review}
          className="border-b border-border/50 pb-6 last:border-0"
        >
          <div className="flex items-start gap-4">
            <div
              className="h-10 w-10 rounded-full bg-linear-to-br from-primary to-primary/60 
                      text-primary-foreground flex items-center justify-center font-bold shadow-md shrink-0"
            >
              JD
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <h4 className="font-bold p-text text-foreground">John Doe</h4>
                <span className="text-xs text-muted-foreground">
                  January 15, 2024
                </span>
              </div>
              <div className="flex gap-0.5 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="h-3.5 w-3.5 fill-primary text-primary"
                  />
                ))}
              </div>
              <p className="text-muted-foreground p-text leading-relaxed">
                Great product! Really satisfied with the quality and
                performance. Would definitely recommend to others.
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
