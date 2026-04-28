"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [data, setData] = useState<any[]>([]);
  const [kategoriStats, setKategoriStats] = useState<any[]>([]);

  const router = useRouter();

  useEffect(() => {
    fetchData();
    fetchKategoriStats();
  }, []);

  // ================= FETCH DATA =================
  const fetchData = async () => {
    const { data } = await supabase
      .from("evaluations")
      .select("*")
      .order("created_at", { ascending: false });

    setData(data || []);
  };

  // ================= FETCH KATEGORI =================
  const fetchKategoriStats = async () => {
    const { data } = await supabase
      .from("jawaban")
      .select(`
        nilai,
        pertanyaan (kategori)
      `);

    const map: any = {};

    data?.forEach((j: any) => {
      if (!j.nilai) return;

      const k = j.pertanyaan.kategori;

      if (!map[k]) map[k] = [];
      map[k].push(j.nilai);
    });

    const result = Object.keys(map).map((k) => {
      const values = map[k];
      const mean =
        values.reduce((a: number, b: number) => a + b, 0) /
        values.length;

      return {
        kategori: k,
        mean,
        percent: (mean / 4) * 100,
      };
    });

    setKategoriStats(result);
  };

  // ================= LABEL =================
  const kategoriLabel = (score: number) => {
    if (score >= 80) return "Sangat Baik";
    if (score >= 60) return "Baik";
    if (score >= 40) return "Cukup";
    return "Buruk";
  };

  // ================= WARNA =================
  const kategoriColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-700";
    if (score >= 60) return "bg-blue-100 text-blue-700";
    if (score >= 40) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  const progressColor = (percent: number) => {
    if (percent >= 60) return "bg-blue-600";
    return "bg-orange-500";
  };

  // ================= SUMMARY =================
  const total = data.length;

  const avg =
    data.reduce((a, b) => a + b.mean_score, 0) /
    (data.length || 1);

  const percent =
    data.reduce((a, b) => a + b.percentage, 0) /
    (data.length || 1);

  // ================= ANALISIS =================
  const sorted = [...kategoriStats].sort(
    (a, b) => b.mean - a.mean
  );

  const terbaik = sorted[0];
  const terburuk = sorted[sorted.length - 1];

  return (
    <div className="p-6">
      {/* HEADER */}
      <h1 className="text-2xl font-bold mb-6">
        Dashboard Admin
      </h1>

      {/* SUMMARY */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <p>Total Responden</p>
          <h2 className="text-xl font-bold">{total}</h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p>Rata-rata Keseluruhan</p>
          <h2>{avg.toFixed(2)}</h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p>Kategori</p>
          <span className={`px-3 py-1 rounded-full text-sm ${kategoriColor(percent)}`}>
            {kategoriLabel(percent)}
          </span>
        </div>
      </div>

      {/* PER KATEGORI */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="font-semibold mb-4">
          Rata-rata Tiap Kategori
        </h2>

        {kategoriStats.length === 0 ? (
          <p className="text-gray-400">Belum ada data</p>
        ) : (
          kategoriStats.map((item) => (
            <div key={item.kategori} className="mb-5">
              <div className="flex justify-between mb-1">
                <span>{item.kategori}</span>
                <span className="text-sm">
                  {item.percent.toFixed(1)}%
                </span>
              </div>

              <div className="w-full bg-gray-200 h-2 rounded-full">
                <div
                  className={`h-2 rounded-full ${progressColor(item.percent)}`}
                  style={{ width: `${item.percent}%` }}
                />
              </div>

              <p className="text-sm mt-1">
                Mean: {item.mean.toFixed(2)}
              </p>
            </div>
          ))
        )}
      </div>

      {/* ANALISIS */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <p>Kategori Tertinggi</p>
          <h2 className="text-blue-600 font-bold">
            {terbaik?.kategori || "-"}
          </h2>
          <p>{terbaik?.percent?.toFixed(1)}%</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p>Kategori Terendah</p>
          <h2 className="text-red-500 font-bold">
            {terburuk?.kategori || "-"}
          </h2>
          <p>{terburuk?.percent?.toFixed(1)}%</p>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="mb-4 font-semibold">
          Data Responden
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b text-gray-500">
              <tr>
                <th className="text-left py-3">No</th>
                <th className="text-left py-3">Nama</th>
                <th className="text-left py-3">NPM</th>
                <th className="text-left py-3">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {data.map((d, index) => (
                <tr key={d.id} className="border-b hover:bg-gray-50">
                  <td className="py-3">{index + 1}</td>
                  <td className="py-3 font-medium">{d.student_name}</td>
                  <td className="py-3">{d.student_id}</td>
                  <td className="py-3">
                    <button
                      onClick={() => router.push(`/admin/result/${d.id}`)}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}

              {data.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-400">
                    Belum ada data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}