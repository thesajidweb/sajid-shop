"use client";
import getClientAuth from "@/lib/auth/getClientAuth";

const DemoRole = () => {
  const { session, role } = getClientAuth();

  if (!session) return null;
  return role === "demo" ? (
    <div className=" w-full p2-text text-center text-white bg-red-900">
      ⚠️ Demo Mode - Actions are restricted
    </div>
  ) : null;
};

export default DemoRole;

// demo@sajid.com  Demo1234
