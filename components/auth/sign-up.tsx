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

import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { SignUpInput, signUpSchema } from "@/lib/types/authType";
import { GoogleIcon } from "../icons";

const SignUp = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: SignUpInput) {
    try {
      setLoading(true);

      const res = await authClient.signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
        callbackURL: "/",
      });

      if (res.error) {
        if (res.error.message?.includes("already")) {
          toast.error("This email is already registered");
        } else {
          toast.error(res.error.message);
        }
        return;
      }

      if (res.data?.user) {
        toast.success("Account created successfully");
        router.refresh();
        router.push("/");
      }
    } catch (error) {
      if (error instanceof Error) toast.error("Signup failed");
    } finally {
      setLoading(false);
    }
  }
  // Google Sign In
  async function handleGoogleSignIn() {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Google sign in failed");
      }
    }
  }

  return (
    <section className="flex  items-center justify-center bg-background px-2 md:px-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-background p-4 md:p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-foreground">
          Create Account
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Sign up to start shopping
        </p>

        {/* Google Sign In */}

        <Button
          type="button"
          variant="outline"
          className="mt-6 w-full"
          onClick={handleGoogleSignIn}
        >
          <GoogleIcon className="w-5 h-5" />
          Continue with Google
        </Button>

        <div className="my-6 border-t border-border" />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            {/* Name */}

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>

                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>

                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>

                  <FormControl>
                    <div className="relative">
                      <Input
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
                          <Eye size={18} />
                        ) : (
                          <EyeOff size={18} />
                        )}
                      </button>
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>

                  <FormControl>
                    <Input type="password" placeholder="••••••" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit */}

            <Button className="w-full mt-3" disabled={loading}>
              {loading ? (
                <p className="flex items-center gap-2">
                  Creating Account <Loader2 className="h-4 w-4 animate-spin" />
                </p>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>

        {/* Sign In Link */}

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?
          <Link href="/sign-in" className="ml-2 font-medium text-primary">
            Sign In
          </Link>
        </p>
      </div>
    </section>
  );
};

export default SignUp;
