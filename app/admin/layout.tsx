"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [username, setUsername] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("admin_username");
    setUsername(user || "Administrator");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin_username");
    router.push("/");
  };

  const toggleSidebar = () => {
    setOpen(!open);
  };

  // ================= TITLE DINAMIS =================
  const titles: Record<string, string> = {
    "/admin": "Dashboard Admin",
    "/admin/pertanyaan": "Kelola Pertanyaan",
  };

  const title = titles[pathname] || "Admin";

  return (
    <div className="flex">

      {/* ================= SIDEBAR ================= */}
      <div
        className={`
          fixed top-0 left-0 z-50 h-screen w-64
          bg-blue-600 text-white p-5 flex flex-col
          overflow-y-auto
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <h1 className="text-xl font-bold mb-8">
          Evaluasi KRS
        </h1>

        {/* MENU */}
        <div className="space-y-2">
          <button
            onClick={() => {
              router.push("/admin");
              setOpen(false);
            }}
            className={`w-full text-left p-3 rounded-lg ${
              pathname === "/admin"
                ? "bg-blue-800"
                : "hover:bg-blue-500"
            }`}
          >
            Dashboard
          </button>

          <button
            onClick={() => {
              router.push("/admin/pertanyaan");
              setOpen(false);
            }}
            className={`w-full text-left p-3 rounded-lg ${
              pathname === "/admin/pertanyaan"
                ? "bg-blue-800"
                : "hover:bg-blue-500"
            }`}
          >
            Kelola Pertanyaan
          </button>
        </div>

        {/* FOOTER */}
        <div className="mt-auto pt-6 border-t border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              👤
            </div>

            <div>
              <p className="font-semibold">{username}</p>
              <p className="text-sm text-white/70">Admin</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-xl hover:bg-white/10 transition"
          >
            <LogOut size={18} />
            Keluar
          </button>
        </div>
      </div>

      {/* ================= OVERLAY ================= */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* ================= CONTENT ================= */}
      <div className="flex-1 md:ml-64 bg-gray-50 min-h-screen">

        {/* ================= TOPBAR ================= */}
        <div className="flex items-center gap-3 px-4 py-3 border-b bg-white">

          <button
            onClick={toggleSidebar}
            className="text-xl p-2 rounded hover:bg-gray-100"
          >
            ☰
          </button>

          <span className="font-semibold text-lg">
            {title}
          </span>

        </div>

        {/* ================= PAGE CONTENT ================= */}
        <div className="p-6">
          {children}
        </div>

      </div>
    </div>
  );
}