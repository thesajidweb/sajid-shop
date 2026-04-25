"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { SignInInput, signInSchema } from "@/lib/types/authType";
import { GoogleIcon } from "../icons";

const SignIn = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false); // 👈 Separate state for Google

  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInInput) => {
    try {
      setLoading(true);
      const res = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });

      if (!res?.data?.user) {
        toast.error("Invalid email or password");
        return;
      }

      toast.success("Signed in successfully");
      router.push("/");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  async function handleGoogleSignIn() {
    // Prevent multiple clicks
    if (googleLoading) return;

    try {
      setGoogleLoading(true);
      toast.info("Redirecting to Google...");

      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast.error(
        error instanceof Error ? error.message : "Google sign in failed",
      );
      setGoogleLoading(false); // Only reset on error (success will redirect)
    }
  }

  return (
    <section className="my-16 overflow-hidden flex items-center justify-center bg-background px-3 sm:px-4">
      <div
        className="w-full max-w-sm sm:max-w-md md:max-w-lg 
        rounded-xl border border-border bg-background 
        p-4 sm:p-6 md:p-8 shadow-sm space-y-4"
      >
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-semibold">Sign In</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Welcome back! Sign in to continue
          </p>
        </div>

        {/* Google Button with Loading State */}
        <Button
          type="button"
          variant="outline"
          className="w-full h-10 text-sm"
          onClick={handleGoogleSignIn}
          disabled={googleLoading} // 👈 Disable while loading
        >
          {googleLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Redirecting to Google...
            </>
          ) : (
            <>
              <GoogleIcon className="w-4 h-4 mr-2" />
              Continue with Google
            </>
          )}
        </Button>

        <div className="border-t border-border" />
        <div className=" w-full p-text text-center ">
          ⚠️ Demo Mode Email:{" "}
          <span className="text-bold text-green-500"> demo@sajid.com </span>{" "}
          Password: <span className="text-bold text-green-500"> Demo1234</span>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Email</FormLabel>
                  <FormControl>
                    <Input
                      className="h-10 text-sm"
                      type="email"
                      placeholder="you@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        className="h-10 text-sm pr-10"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      >
                        {showPassword ? (
                          <Eye size={16} />
                        ) : (
                          <EyeOff size={16} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full h-10 text-sm" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  Signing In <Loader2 className="h-4 w-4 animate-spin" />
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>

        <p className="text-center text-xs sm:text-sm text-muted-foreground">
          Don&apos;t have an account?
          <Link href="/sign-up" className="ml-1 font-medium text-primary">
            Create account
          </Link>
        </p>
      </div>
    </section>
  );
};

export default SignIn;
