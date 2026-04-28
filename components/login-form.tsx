"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function LoginForm() {
  const [mode, setMode] = useState<"mahasiswa" | "admin">("mahasiswa");

  const [nama, setNama] = useState("");
  const [npm, setNpm] = useState("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

const handleLogin = async () => {
  if (mode === "mahasiswa") {
    if (!nama || !npm) {
      alert("Isi nama & NPM dulu!");
      return;
    }

    const { data: existingMahasiswa } = await supabase
      .from("mahasiswa")
      .select("*")
      .eq("npm", npm)
      .maybeSingle();

    let mahasiswa;

    if (existingMahasiswa) {
      mahasiswa = existingMahasiswa;
    } else {
      const { data, error } = await supabase
        .from("mahasiswa")
        .insert([{ nama, npm }])
        .select()
        .single();

      if (error) {
        alert("Gagal menyimpan data");
        return;
      }

      mahasiswa = data;
    }

    const { data: sudahIsi } = await supabase
      .from("evaluations")
      .select("id")
      .eq("student_id", npm)
      .maybeSingle();

    if (sudahIsi) {
      alert("Anda sudah mengisi kuesioner");
      return;
    }

    localStorage.setItem("mahasiswa_id", mahasiswa.id);
    localStorage.setItem("nama", mahasiswa.nama);
    localStorage.setItem("npm", mahasiswa.npm);

    router.push("/kuesioner");
  } else {
    // 🔒 ADMIN (tidak diubah)
    const { data, error } = await supabase
      .from("admin")
      .select("*")
      .eq("username", username)
      .eq("password", password)
      .single();

    if (error || !data) {
      alert("Username / Password salah");
    } else {
      localStorage.setItem("admin_username", data.username);
      router.push("/admin");
    }
  }
};

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-xl font-semibold text-center mb-6">
        Selamat Datang
      </h2>

{/* TOGGLE */}
<div className="flex w-full mb-6 bg-gray-200 rounded-lg p-1">

  <button
    onClick={() => setMode("mahasiswa")}
    className={`flex-1 text-center py-2 rounded-lg ${
      mode === "mahasiswa"
        ? "bg-blue-600 text-white"
        : "text-gray-600"
    }`}
  >
    Mahasiswa
  </button>

  <button
    onClick={() => setMode("admin")}
    className={`flex-1 text-center py-2 rounded-lg ${
      mode === "admin"
        ? "bg-blue-600 text-white"
        : "text-gray-600"
    }`}
  >
    Admin
  </button>
</div>

      {/* FORM */}
      {mode === "mahasiswa" ? (
        <div>
          <input
            placeholder="Nama Lengkap"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="w-full border p-3 mb-3 rounded-lg"
          />

          <input
            placeholder="NPM"
            value={npm}
            onChange={(e) => setNpm(e.target.value)}
            className="w-full border p-3 mb-4 rounded-lg"
          />
        </div>
      ) : (
        <div>
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border p-3 mb-3 rounded-lg"
          />

          {/* PASSWORD */}
          <div className="mb-2">
            <div className="flex items-center border rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500">

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 outline-none"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-blue-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            </div>
          </div>
        </div>
      )}

      {/* BUTTON */}
      <button
        onClick={handleLogin}
        className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 mt-3"
      >
        Masuk
      </button>

      {/* LUPA PASSWORD - PINDAH KE BAWAH */}
      {mode === "admin" && (
        <div className="mt-3 text-center">
          <button
            type="button"
            onClick={() => router.push("/lupa-password")}
            className="text-blue-600 text-sm hover:underline"
          >
            Lupa password?
          </button>
        </div>
      )}
    </div>
  );
}