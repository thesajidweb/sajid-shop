import { UsersTable } from "./UsersTable";

import SearchComponent from "./SearchComponent";
import HeaderStyle from "@/components/shared/HeaderStyle";
import { getUsers } from "@/lib/actions/user/getUsers";
import ErrorBox from "@/components/shared/ErrorBox";

interface UsersProps {
  searchParams: {
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    page?: string;
    limit?: string;
  };
}

const AdminUserManagement = async ({ searchParams }: UsersProps) => {
  const params = await searchParams;

  // clean params - only keep defined values
  const query = Object.entries(params || {})
    .filter(
      ([, value]) => value !== undefined && value !== null && value !== "",
    )
    .map(([key, value]) => [key, value.toString()]); // safe cast

  const queryString = new URLSearchParams(query).toString();

  const res = await getUsers(queryString);

  if (!res.success) {
    return (
      <ErrorBox
        title="Failed to fetch [dashboard users page] users"
        message={res.error}
      />
    );
  }

  const { users, currentPage, totalPages, totalItems, itemsPerPage } = res.data;

  return (
    <div className="container mx-auto py-2 px-1">
      <HeaderStyle title="Admin User Management" />
      <div className="space-y-4">
        <SearchComponent
          totalPages={totalPages}
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
        />
        {users.length > 0 && <UsersTable users={users} />}
      </div>
    </div>
  );
};
export default AdminUserManagement;
