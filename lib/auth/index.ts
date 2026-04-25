import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { connectToDB } from "../db/connect";

let authInstance: any = null;
let authPromise: Promise<any> | null = null;

// Helper to detect if we're in build phase
const isBuildTime = () => {
  return process.env.NEXT_PHASE === "phase-production-build";
};

export async function getAuth() {
  // During build time, return a mock auth object
  if (isBuildTime()) {
    console.log("Build time detected - returning mock auth");
    return {
      api: {
        getSession: async () => null,
      },
    };
  }

  if (authInstance) return authInstance;

  if (!authPromise) {
    authPromise = (async () => {
      const conn = await connectToDB();
      if (!conn) throw new Error("Failed to connect to database");

      const auth = betterAuth({
        database: mongodbAdapter(conn.db!),
        secret: process.env.BETTER_AUTH_SECRET!,
        baseURL: process.env.NEXT_PUBLIC_URL || "http://localhost:3000",
        trustedOrigins: [process.env.NEXT_PUBLIC_URL!],
        emailAndPassword: { enabled: true },
        user: {
          additionalFields: {
            role: {
              type: "string",
              required: false,
              defaultValue: "customer",
              input: false,
            },
          },
        },
        socialProviders: {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            redirectURI: `${process.env.NEXT_PUBLIC_URL}/api/auth/callback/google`,
          },
        },
        session: {
          expiresIn: 60 * 60 * 24 * 7,
          updateAge: 60 * 60 * 24,
          cookieCache: { enabled: true, maxAge: 60 * 5 },
        },
        plugins: [nextCookies()],
      });

      authInstance = auth;
      return auth;
    })();
  }

  return await authPromise;
}
