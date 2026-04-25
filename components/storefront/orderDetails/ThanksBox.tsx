import { CheckCircle } from "lucide-react";

const ThanksBox = () => {
  return (
    <div>
      {/* Success Icon */}
      <div className="inline-flex items-center justify-center h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-green-100 dark:bg-green-900/20 mb-4 sm:mb-6 animate-in fade-in zoom-in duration-500">
        <CheckCircle className="h-8 w-8 sm:h-10 sm:w-10 text-green-600 dark:text-green-400" />
      </div>

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-2 sm:mb-3 animate-in slide-in-from-top-4 duration-500">
        Thank You for Your Order!
      </h1>

      {/* Subtitle */}
      <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto animate-in slide-in-from-bottom-4 duration-500 delay-200 px-2">
        Your order has been confirmed and will be shipped shortly
      </p>
    </div>
  );
};

export default ThanksBox;
