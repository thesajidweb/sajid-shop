// todo this is used in only client components do not use it on server side

import { authClient } from "../auth-client";

type ExtendedUser = {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  role?: string; //  add this
};
const getClientAuth = () => {
  const authSession = authClient.useSession();
  const user = authSession?.data?.user as ExtendedUser | undefined;
  const role = user?.role;

  return {
    session: authSession?.data?.session,
    user: user,
    isLoading: authSession.isPending,
    role,
  };
};

export default getClientAuth;
