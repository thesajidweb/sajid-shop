"use server";

import { AppError } from "@/lib/app-error";
import { getServerAuth } from "@/lib/auth/getServerAuth";
import { connectToDB } from "@/lib/db/connect";
import { safeAction } from "@/lib/safe-action";
import { fetchUsers } from "@/lib/services/user/fetchUsers";
import { ResultType } from "@/lib/types/resultType";
import { User } from "@/lib/types/userType";

type UsersResponseSerialized = {
  users: User[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  isSearchMode: boolean;
};
export const getUsers = async (
  queryString: string,
): Promise<ResultType<UsersResponseSerialized>> => {
  return safeAction(async () => {
    await connectToDB();
    const authSession = await getServerAuth("VIEW_USERS");

    if (!authSession) {
      throw new AppError("Unauthorized", 401);
    }

    return await fetchUsers(queryString);
  });
};
