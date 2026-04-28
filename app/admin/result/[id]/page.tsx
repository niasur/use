"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";

export default function ResultDetailPage() {
  const { id } = useParams();

  const [evaluation, setEvaluation] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  useEffect(() => {
    if (id) fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    // 1️⃣ Ambil evaluation
    const { data: evalData } = await supabase
      .from("evaluations")
      .select("*")
      .eq("id", id)
      .single();

    if (!evalData) return;
    setEvaluation(evalData);

    // 2️⃣ Ambil semua pertanyaan
    const { data: qData } = await supabase
      .from("pertanyaan")
      .select("*");

    setQuestions(qData || []);

    // 3️⃣ Ambil mahasiswa
    const { data: mahasiswa } = await supabase
      .from("mahasiswa")
      .select("id")
      .eq("npm", evalData.student_id)
      .single();

    if (!mahasiswa) return;

    // 4️⃣ Ambil jawaban
    const { data: jawabanData } = await supabase
      .from("jawaban")
      .select("*")
      .eq("mahasiswa_id", mahasiswa.id);

    const map: Record<string, number> = {};
    jawabanData?.forEach((j: any) => {
      map[j.pertanyaan_id] = j.nilai;
    });

    setAnswers(map);
  };

  if (!evaluation) return <p className="p-6">Loading...</p>;

  // ======================
  // GROUP BY KATEGORI
  // ======================
  const groupedQuestions = questions.reduce((acc: any, q: any) => {
    if (!acc[q.kategori]) acc[q.kategori] = [];
    acc[q.kategori].push(q);
    return acc;
  }, {});

  return (
    <div className="p-6 max-w-3xl mx-auto">

      <h1 className="text-xl font-bold mb-4">
        Detail Hasil Kuesioner
      </h1>

      {/* INFO */}
      <div className="mb-6 border p-4 rounded-xl bg-gray-50">
        <p><b>Nama:</b> {evaluation.student_name}</p>
        <p><b>NPM:</b> {evaluation.student_id}</p>
        <p><b>Mean:</b> {evaluation.mean_score.toFixed(2)}</p>
        <p><b>Persentase:</b> {evaluation.percentage.toFixed(1)}%</p>
      </div>

      {/* ======================
          LOOP PER KATEGORI
      ====================== */}
      {Object.keys(groupedQuestions).map((kategori) => (
        <div key={kategori} className="mb-6">

          {/* TITLE */}
          <h2 className="font-semibold text-blue-600 mb-3">
            {kategori}
          </h2>

          {/* LIST PERTANYAAN */}
          {groupedQuestions[kategori].map((q: any, i: number) => (
            <div
              key={q.id}
              className="mb-4 border p-3 rounded-xl"
            >
              <p className="mb-2">
                {i + 1}. {q.isi_pertanyaan}
              </p>

              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((n) => (
                  <label key={n} className="flex items-center gap-1">
                    <input
                      type="radio"
                      checked={answers[q.id] === n}
                      readOnly
                    />
                    {n}
                  </label>
                ))}
              </div>
            </div>
          ))}

        </div>
      ))}

    </div>
  );
}