"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import Link from "next/link";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import LoadingState from "./loading";
import getClientAuth from "@/lib/auth/getClientAuth";

export default function ProfilePage() {
  const { session, user, isLoading } = getClientAuth();
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  // ✅ Skeleton Loading UI
  if (isLoading) {
    return <LoadingState />;
  }

  return !session ? (
    <div className="flex items-center justify-center min-h-[60vh] text-center">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">You are not logged in</h2>
        <p className="text-muted-foreground text-sm">
          Please login to view your profile
        </p>
        <Link href="/sign-in">
          <button className="btn btn-primary">Login</button>
        </Link>
      </div>
    </div>
  ) : (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <Card className="rounded-2xl shadow-sm border bg-background">
        {/* Header */}
        <CardHeader className="flex flex-col items-center text-center gap-3">
          {user?.image ? (
            <Image
              src={user.image}
              alt="profile"
              width={96}
              height={96}
              className="rounded-full border shadow-sm"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center text-xl font-bold">
              {user?.name?.charAt(0)}
            </div>
          )}

          <CardTitle className="text-xl">{user?.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </CardHeader>

        {/* Content */}
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 p-3 rounded-lg border">
            <span className="text-sm text-muted-foreground">Name</span>
            <span className="font-medium">{user?.name}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 p-3 rounded-lg border">
            <span className="text-sm text-muted-foreground">Email</span>
            <span className="font-medium break-all">{user?.email}</span>
          </div>
          <Button
            className=" w-full p-2 cursor-pointer bg-primary hover:bg-primary/50"
            onClick={handleBack}
          >
            {" "}
            Back
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
