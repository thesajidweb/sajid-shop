
import { headers } from "next/headers";
import { getAuth } from ".";

/* =========================
   Server Session
========================= */

export type SessionType = {
  session: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    expiresAt: Date;
    token: string;
    ipAddress?: string | null | undefined;
    userAgent?: string | null | undefined;
  };
  user: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string | null | undefined;
    role?: string | null | undefined;
  };
} | null;
export async function getServerSession() {
 
const auth = await getAuth();
const session: SessionType = await auth.api.getSession({
  headers: await headers(),
});
  return session;
}
