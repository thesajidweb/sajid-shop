import { cookies } from "next/headers";

export async function getCookie() {
  const cookieStore = cookies();
  const cookieString = (await cookieStore).toString();

  return cookieString;
}
