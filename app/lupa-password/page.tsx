"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LupaPassword() {
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const router = useRouter();

  const handleReset = async () => {
    const { error } = await supabase
      .from("admin")
      .update({ password: newPassword })
      .eq("username", username);

    if (error) {
      alert("Gagal update password");
      return;
    }

    alert("Password berhasil diubah!");
    router.push("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-xl shadow w-full max-w-md">
        <h1 className="text-lg font-bold mb-4 text-center">
          Reset Password Admin
        </h1>

        <input
          placeholder="Username admin"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border p-3 mb-3 rounded-lg"
        />

        <input
          type="password"
          placeholder="Password baru"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full border p-3 mb-4 rounded-lg"
        />

        <button
          onClick={handleReset}
          className="w-full bg-blue-600 text-white p-3 rounded-lg"
        >
          Simpan Password
        </button>
      </div>
    </div>
  );
}