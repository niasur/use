"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Hasil() {
  const [avg, setAvg] = useState(0);

  useEffect(() => {
    supabase.from("jawaban").select("nilai").then(res => {
      const data = res.data || [];
      const total = data.reduce((a, b) => a + b.nilai, 0) / (data.length || 1);
      setAvg(total);
    });
  }, []);

  const kategori =
    avg >= 4 ? "Sangat Baik" :
    avg >= 3 ? "Baik" :
    avg >= 2 ? "Cukup" : "Kurang";

  return (
    <div className="p-6">
      <h1 className="font-bold text-xl">Hasil</h1>
      <p>Rata-rata: {avg.toFixed(2)}</p>
      <p>Kategori: {kategori}</p>
    </div>
  );
}