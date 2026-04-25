import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type CheckoutHeaderProps = {
  isAddressValid: boolean;
  currentStep: number;
  handleStep: (step: number) => void;
};
const CheckoutHeader = ({
  isAddressValid,
  currentStep = 1,
  handleStep,
}: CheckoutHeaderProps) => {
  const handleCurrentStep = (step: number) => {
    if (step === currentStep) return;
    if (isAddressValid) handleStep(step);
  };
  return (
    <div className="mb-6 sm:mb-8">
      <Link
        href="/cart"
        className="inline-flex items-center text-sm  hover:text-chart-2 text-primary transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Cart
      </Link>

      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-2 sm:mt-3">
        Checkout
      </h1>

      {/* Step Indicator */}
      <div className="flex items-center gap-2 sm:gap-4 mt-4 sm:mt-6">
        {/* Step 1 - Address */}
        <div className="flex items-center">
          <button
            onClick={() => handleCurrentStep(1)}
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm sm:text-base font-medium ${
              currentStep >= 1
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            1
          </button>
          <span className="ml-2 text-xs sm:text-sm font-medium hidden sm:inline">
            Address
          </span>
        </div>

        {/* Line 1 */}
        <div className="w-12 sm:w-16 h-0.5 bg-muted">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: currentStep >= 2 ? "100%" : "0%" }}
          />
        </div>

        {/* Step 2 - Shipping */}
        <div className="flex items-center">
          <button
            onClick={() => handleCurrentStep(2)}
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm sm:text-base font-medium ${
              currentStep >= 2
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            2
          </button>
          <span className="ml-2 text-xs sm:text-sm font-medium hidden sm:inline">
            Shipping
          </span>
        </div>

        {/* Line 2 */}
        <div className="w-12 sm:w-16 h-0.5 bg-muted">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: currentStep >= 3 ? "100%" : "0%" }}
          />
        </div>

        {/* Step 3 - Payment */}
        <div className="flex items-center">
          <button
            onClick={() => handleCurrentStep(3)}
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm sm:text-base font-medium ${
              currentStep >= 3
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            3
          </button>
          <span className="ml-2 text-xs sm:text-sm font-medium hidden sm:inline">
            Payment
          </span>
        </div>
      </div>
    </div>
  );
};

export default CheckoutHeader;
