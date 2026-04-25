"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { PAYMENT_METHODS } from "@/lib/constants/payment";

interface Props {
  loading?: boolean;
  handlePlaceOrder?: (method: string) => Promise<void>;
}

export function PaymentForm({ loading, handlePlaceOrder }: Props) {
  const [method, setMethod] = useState<string>("cod");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await handlePlaceOrder?.(method);
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Payment Method
            </CardTitle>
          </CardHeader>

          <CardContent>
            <RadioGroup
              value={method}
              onValueChange={setMethod}
              className="grid sm:grid-cols-2 gap-4"
            >
              {PAYMENT_METHODS.map((item) => {
                const selected = method === item.id;

                return (
                  <Label
                    key={item.id}
                    className={`border rounded-xl p-4 flex items-center gap-2 cursor-pointer ${
                      selected ? "border-green-500" : ""
                    }`}
                  >
                    <RadioGroupItem value={item.id} className="sr-only" />

                    <span>{item.name}</span>

                    {selected && (
                      <Check className="ml-auto h-4 w-4 text-green-600" />
                    )}
                  </Label>
                );
              })}
            </RadioGroup>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full mt-4" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Place Order
        </Button>
      </form>
    </div>
  );
}
