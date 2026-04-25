"use client";

import { useEffect, useState } from "react";

export default function AddressList() {
  const [data, setData] = useState<any>(null);

  const fetchData = async () => {
    const res = await fetch("/api/profile", {
      headers: { "x-user-id": "123" },
    });
    const json = await res.json();
    setData(json);
  };

  useEffect(() => {
    function handleStorageChange() {
      fetchData();
    }
    handleStorageChange();
  }, []);

  const deleteAddress = async (id: string) => {
    await fetch(`/api/profile/address/${id}`, {
      method: "DELETE",
      headers: { "x-user-id": "123" },
    });
    fetchData();
  };

  return (
    <div>
      {data?.addresses?.map((addr: any) => (
        <div key={addr._id} className="border p-2 my-2">
          <p>{addr.fullName}</p>
          <p>{addr.address}</p>
          <button onClick={() => deleteAddress(addr._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
