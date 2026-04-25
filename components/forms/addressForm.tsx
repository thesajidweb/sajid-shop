"use client";

import { useState } from "react";

export default function AddressForm() {
  const [form, setForm] = useState({
    label: "",
    fullName: "",
    phone: "",
    address: "",
    city: "",
    province: "",
    zipCode: "",
    country: "",
  });

  const handleSubmit = async () => {
    await fetch("/api/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": "123", // 👈 replace with auth
      },
      body: JSON.stringify({
        userId: "123",
        address: form,
      }),
    });

    alert("Address Saved");
  };

  return (
    <div className="space-y-2">
      <input
        placeholder="Label"
        onChange={(e) => setForm({ ...form, label: e.target.value })}
      />
      <input
        placeholder="Full Name"
        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
      />
      <input
        placeholder="Phone"
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />
      <input
        placeholder="Address"
        onChange={(e) => setForm({ ...form, address: e.target.value })}
      />
      <input
        placeholder="City"
        onChange={(e) => setForm({ ...form, city: e.target.value })}
      />
      <input
        placeholder="Province"
        onChange={(e) => setForm({ ...form, province: e.target.value })}
      />
      <input
        placeholder="Country"
        onChange={(e) => setForm({ ...form, country: e.target.value })}
      />

      <button onClick={handleSubmit}>Save</button>
    </div>
  );
}
