"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

import {
  type ShippingAddress,
  shippingAddressSchema,
} from "@/lib/types/shippingAddressType";
import { PAKISTAN_PROVINCES, PAKISTAN_CITIES } from "@/lib/constants/shipping";

interface AddressFormCardProps {
  initialAddress?: Partial<ShippingAddress>;
  onAddressChange?: (address: ShippingAddress) => void;
  onSaveAddressChange?: (save: boolean) => void;
  onValidityChange?: (isValid: boolean) => void;
}

export function AddressForm({
  initialAddress = {},
  onAddressChange,
  onSaveAddressChange,
  onValidityChange,
}: AddressFormCardProps) {
  const {
    control,
    formState: { errors, isValid },
  } = useForm<ShippingAddress>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      landmark: "",
      city: "",
      province: "",
      zipCode: "",
      country: "PK",
      label: "", // Added missing label field
      ...initialAddress,
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const [saveAddress, setSaveAddress] = useState(true);

  // Use useWatch instead of watch(callback) - React Compiler friendly
  const formValues = useWatch({ control }) as ShippingAddress;
  const selectedProvince = useWatch({
    control,
    name: "province",
  });

  // Get available cities based on selected province
  const availableCities = selectedProvince
    ? PAKISTAN_CITIES[selectedProvince as keyof typeof PAKISTAN_CITIES] || []
    : [];

  // Notify parent of address changes - using useWatch
  useEffect(() => {
    if (onAddressChange && Object.keys(formValues).length > 0) {
      onAddressChange(formValues);
    }
  }, [formValues, onAddressChange]);

  // Notify parent of form validity
  useEffect(() => {
    onValidityChange?.(isValid);
  }, [isValid, onValidityChange]);

  const handleSaveAddressChange = useCallback(
    (checked: boolean) => {
      setSaveAddress(checked);
      onSaveAddressChange?.(checked);
    },
    [onSaveAddressChange],
  );

  // Simple helper - no useCallback needed
  const getFieldError = (fieldName: keyof ShippingAddress) =>
    errors[fieldName]?.message;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="px-4 sm:px-6 py-4 sm:py-5">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" />
          <span className="truncate">Shipping Address</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-6 sm:pb-8">
        <div className="grid grid-cols-1 gap-4 sm:gap-5">
          {/* Label/Name for address (Home, Office etc) */}
          <div className="col-span-1 space-y-1.5 sm:space-y-2">
            <Label
              htmlFor="label"
              className="flex items-center gap-1 text-sm sm:text-base"
            >
              Label <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="label"
              control={control}
              render={({ field }) => (
                <div>
                  <Input
                    id="label"
                    placeholder="Home, Office etc..."
                    className={`w-full text-sm sm:text-base ${
                      getFieldError("label") ? "border-red-500" : ""
                    }`}
                    value={field.value || ""} // Ensure value is never undefined
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    ref={field.ref}
                  />
                  {getFieldError("label") && (
                    <p className="text-xs sm:text-sm text-red-500 mt-1">
                      {getFieldError("label")}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          {/* Full Name */}
          <div className="col-span-1 space-y-1.5 sm:space-y-2">
            <Label
              htmlFor="fullName"
              className="flex items-center gap-1 text-sm sm:text-base"
            >
              Full Name <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="fullName"
              control={control}
              render={({ field }) => (
                <div>
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    className={`w-full text-sm sm:text-base ${
                      getFieldError("fullName") ? "border-red-500" : ""
                    }`}
                    value={field.value || ""} // Ensure value is never undefined
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    ref={field.ref}
                  />
                  {getFieldError("fullName") && (
                    <p className="text-xs sm:text-sm text-red-500 mt-1">
                      {getFieldError("fullName")}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          {/* Email and Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div className="space-y-1.5 sm:space-y-2">
              <Label
                htmlFor="email"
                className="flex items-center gap-1 text-sm sm:text-base"
              >
                Email <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <div>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      className={`w-full text-sm sm:text-base ${
                        getFieldError("email") ? "border-red-500" : ""
                      }`}
                      inputMode="email"
                      value={field.value || ""} // Ensure value is never undefined
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      ref={field.ref}
                    />
                    {getFieldError("email") && (
                      <p className="text-xs sm:text-sm text-red-500 mt-1">
                        {getFieldError("email")}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <Label
                htmlFor="phone"
                className="flex items-center gap-1 text-sm sm:text-base"
              >
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <div>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="03XX-XXXXXXX"
                      className={`w-full text-sm sm:text-base ${
                        getFieldError("phone") ? "border-red-500" : ""
                      }`}
                      inputMode="numeric"
                      value={field.value || ""} // Ensure value is never undefined
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      ref={field.ref}
                    />
                    {getFieldError("phone") && (
                      <p className="text-xs sm:text-sm text-red-500 mt-1">
                        {getFieldError("phone")}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
          </div>

          {/* Street Address */}
          <div className="col-span-1 space-y-1.5 sm:space-y-2">
            <Label
              htmlFor="address"
              className="flex items-center gap-1 text-sm sm:text-base"
            >
              Street Address <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <div>
                  <Input
                    id="address"
                    placeholder="House #, Street, Sector/Area"
                    className={`w-full text-sm sm:text-base ${
                      getFieldError("address") ? "border-red-500" : ""
                    }`}
                    value={field.value || ""} // Ensure value is never undefined
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    ref={field.ref}
                  />
                  {getFieldError("address") && (
                    <p className="text-xs sm:text-sm text-red-500 mt-1">
                      {getFieldError("address")}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          {/* Landmark */}
          <div className="col-span-1 space-y-1.5 sm:space-y-2">
            <Label htmlFor="landmark" className="text-sm sm:text-base">
              Landmark (Optional)
            </Label>
            <Controller
              name="landmark"
              control={control}
              render={({ field }) => (
                <Input
                  id="landmark"
                  placeholder="Near Market, Mosque, etc."
                  className="w-full text-sm sm:text-base"
                  value={field.value || ""} // Ensure value is never undefined
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  ref={field.ref}
                />
              )}
            />
          </div>

          {/* Province, City, Postal Code */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            <div className="space-y-1.5 sm:space-y-2">
              <Label
                htmlFor="province"
                className="flex items-center gap-1 text-sm sm:text-base"
              >
                Province <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="province"
                control={control}
                render={({ field }) => (
                  <div>
                    <Select
                      value={field.value || ""} // Use empty string instead of undefined
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        className={`w-full text-sm sm:text-base ${
                          getFieldError("province") ? "border-red-500" : ""
                        }`}
                      >
                        <SelectValue placeholder="Select province" />
                      </SelectTrigger>
                      <SelectContent>
                        {PAKISTAN_PROVINCES.map((province) => (
                          <SelectItem
                            key={province.value}
                            value={province.value}
                            className="text-sm sm:text-base"
                          >
                            {province.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {getFieldError("province") && (
                      <p className="text-xs sm:text-sm text-red-500 mt-1">
                        {getFieldError("province")}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <Label
                htmlFor="city"
                className="flex items-center gap-1 text-sm sm:text-base"
              >
                City <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <div>
                    <Select
                      value={field.value || ""} // Use empty string instead of undefined
                      onValueChange={field.onChange}
                      disabled={!selectedProvince}
                    >
                      <SelectTrigger
                        className={`w-full text-sm sm:text-base ${
                          getFieldError("city") ? "border-red-500" : ""
                        }`}
                      >
                        <SelectValue
                          placeholder={
                            selectedProvince
                              ? "Select city"
                              : "Select province first"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCities.map((city) => (
                          <SelectItem
                            key={city}
                            value={city}
                            className="text-sm sm:text-base"
                          >
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {getFieldError("city") && (
                      <p className="text-xs sm:text-sm text-red-500 mt-1">
                        {getFieldError("city")}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="zipCode" className="text-sm sm:text-base">
                Postal Code
              </Label>
              <Controller
                name="zipCode"
                control={control}
                render={({ field }) => (
                  <div>
                    <Input
                      id="zipCode"
                      placeholder="54000"
                      className={`w-full text-sm sm:text-base ${
                        getFieldError("zipCode") ? "border-red-500" : ""
                      }`}
                      inputMode="numeric"
                      value={field.value || ""} // Ensure value is never undefined
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      ref={field.ref}
                    />
                    {getFieldError("zipCode") && (
                      <p className="text-xs sm:text-sm text-red-500 mt-1">
                        {getFieldError("zipCode")}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
          </div>

          {/* Country */}
          <div className="col-span-1 space-y-1.5 sm:space-y-2">
            <Label htmlFor="country" className="text-sm sm:text-base">
              Country
            </Label>
            <Input
              id="country"
              value="Pakistan"
              disabled
              className="w-full text-sm sm:text-base bg-muted"
            />
          </div>
        </div>

        {/* Save Address Checkbox */}
        <div className="flex items-center space-x-2 mt-6 sm:mt-8">
          <Checkbox
            id="saveAddress"
            checked={saveAddress}
            onCheckedChange={handleSaveAddressChange}
            className="h-4 w-4 sm:h-5 sm:w-5"
          />
          <Label
            htmlFor="saveAddress"
            className="text-sm sm:text-base font-normal"
          >
            Save this address for future orders
          </Label>
        </div>
      </CardContent>
    </Card>
  );
}
