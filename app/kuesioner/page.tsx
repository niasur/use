"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function KuesionerPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const router = useRouter();

  const mahasiswa_id =
    typeof window !== "undefined"
      ? localStorage.getItem("mahasiswa_id")
      : null;

  const nama =
    typeof window !== "undefined"
      ? localStorage.getItem("nama")
      : null;

  const npm =
    typeof window !== "undefined"
      ? localStorage.getItem("npm")
      : null;

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    const { data } = await supabase
      .from("pertanyaan")
      .select("*");

    setQuestions(data || []);
  };

  const handleChange = (qid: string, value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [qid]: value
    }));
  };

  // ======================
  // SUBMIT
  // ======================
  const handleSubmit = async () => {
    if (!mahasiswa_id || !nama || !npm) {
      alert("Session tidak ditemukan");
      return;
    }

    const totalQuestions = questions.length;

    // 🔥 exclude saran dari validasi
    const answeredCount = Object.keys(answers).filter(
      (k) => k !== "saran"
    ).length;

    if (answeredCount !== totalQuestions) {
      alert("Semua pertanyaan harus diisi!");
      return;
    }

    // ======================
    // SIMPAN JAWABAN
    // ======================
    const jawabanData = Object.entries(answers)
      .filter(([k]) => k !== "saran")
      .map(([pertanyaan_id, nilai]) => ({
        mahasiswa_id,
        pertanyaan_id,
        nilai
      }));

    const { error: jawabanError } = await supabase
      .from("jawaban")
      .insert(jawabanData);

    if (jawabanError) {
      alert("Gagal simpan jawaban");
      return;
    }

    // ======================
    // HITUNG NILAI
    // ======================
    const values = Object.entries(answers)
      .filter(([k]) => k !== "saran")
      .map(([_, v]) => Number(v));

    const mean =
      values.reduce((a, b) => a + b, 0) / values.length;

    const percentage = (mean / 5) * 100;

    // ======================
    // SIMPAN EVALUATION
    // ======================
    const { error: evalError } = await supabase
      .from("evaluations")
      .insert([
        {
          student_name: nama,
          student_id: npm,
          answers,
          mean_score: mean,
          percentage
        }
      ]);

    if (evalError) {
      alert("Gagal simpan hasil");
      return;
    }

    // ======================
    // SIMPAN SARAN
    // ======================
    const saranText = answers.saran;

    if (saranText) {
      await supabase.from("saran").insert([
        {
          mahasiswa_id,
          isi_saran: saranText
        }
      ]);
    }

    alert("Berhasil submit!");
    localStorage.clear();
    router.push("/");
  };

  // ======================
  // UI
  // ======================
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">
        USE Questionnaire
      </h1>

      <p className="text-gray-500 mb-6">
        Kuesioner ini dirancang untuk mengevaluasi tingkat kegunaan (usability) dari Sistem Informasi Akademik, khususnya pada fitur Kartu Rencana Studi (KRS). Silakan pilih nilai yang paling sesuai dengan pengalaman Anda.
      </p>

      {/* SKALA */}
<div className="border border-blue-200 rounded-xl p-4 mb-6 bg-blue-50">
  {/* JUDUL */}
  <p className="text-sm font-semibold text-blue-700 mb-1">
    Petunjuk Pengisian
  </p>

  <p className="text-xs text-blue-600 mb-3">
    Pilih angka dari skala 1 sampai 5:
  </p>

  {/* SKALA */}
  <div className="flex gap-2 flex-wrap">
    {[
      "Sangat Tidak Setuju",
      "Tidak Setuju",
      "Netral",
      "Setuju",
      "Sangat Setuju",
    ].map((label, index) => (
      <div
        key={label}
        className="px-3 py-2 rounded-md border bg-white text-xs text-blue-700 font-medium shadow-sm"
      >
        {index + 1}: {label}
      </div>
    ))}
  </div>
</div>

      {/* GROUP PER KATEGORI */}
      {["Usefulness", "Ease of Use", "Ease of Learning", "Satisfaction"]
        .map((kategori) => {
          const filtered = questions.filter(
            (q) => q.kategori === kategori
          );

          if (filtered.length === 0) return null;

          return (
            <div
              key={kategori}
              className="border rounded-xl p-4 mb-6"
            >
              <h2 className="font-semibold text-blue-600 mb-4">
                {kategori}
              </h2>

              {filtered.map((q, i) => (
                <div
                  key={q.id}
                  className="flex justify-between items-center border-b py-3"
                >
                  <p className="text-sm w-2/3">
                    {i + 1}. {q.isi_pertanyaan}
                  </p>

                  <div className="flex gap-4">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <label
                        key={n}
                        className="flex flex-col items-center text-xs"
                      >
                        <input
                          type="radio"
                          name={q.id}
                          onChange={() => handleChange(q.id, n)}
                          className="accent-blue-600"
                        />
                        {n}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          );
        })}

      {/* SARAN */}
      <textarea
        placeholder="Saran / masukan (opsional)"
        className="w-full border p-3 rounded-xl mb-6"
        onChange={(e) =>
          setAnswers({
            ...answers,
            saran: e.target.value
          })
        }
      />

      {/* BUTTON */}
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700"
      >
        Submit
      </button>
    </div>
  );
}