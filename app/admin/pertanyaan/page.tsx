"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Pencil, Trash2 } from "lucide-react";

export default function PertanyaanPage() {
  const [data, setData] = useState<any[]>([]);
  const [isi, setIsi] = useState("");
  const [kategori, setKategori] = useState("Usefulness");
  const [open, setOpen] = useState(false);

  const [editId, setEditId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  const kategoriList = [
    "Usefulness",
    "Ease of Use",
    "Ease of Learning",
    "Satisfaction"
  ];

  // ================= FETCH =================
const fetchData = async () => {
  const { data } = await supabase
    .from("pertanyaan")
    .select("*");

  // URUTAN KATEGORI USE QUESTIONNAIRE
  const urutanKategori = [
    "Usefulness",
    "Ease of Use",
    "Ease of Learning",
    "Satisfaction",
  ];

  // SORT DATA
  const sorted = (data || []).sort((a, b) => {

    // SORT KATEGORI
    const kategoriA =
      urutanKategori.indexOf(a.kategori);

    const kategoriB =
      urutanKategori.indexOf(b.kategori);

    if (kategoriA !== kategoriB) {
      return kategoriA - kategoriB;
    }

    // SORT ID (LAMA → BARU)
    return a.id - b.id;
  });

  // AUTO NOMOR PER KATEGORI
  const kategoriCounter: Record<string, number> = {};

  const finalData = sorted.map((item) => {

    if (!kategoriCounter[item.kategori]) {
      kategoriCounter[item.kategori] = 1;
    } else {
      kategoriCounter[item.kategori]++;
    }

    return {
      ...item,
      urutan: kategoriCounter[item.kategori],
    };
  });

  setData(finalData);
};

useEffect(() => {
  fetchData();
}, []);

  // ================= TAMBAH =================
  const tambah = async () => {
    if (!isi.trim()) return alert("Isi dulu!");

    // AUTO TIPE
    const tipe = "likert";

    // AMBIL JUMLAH ITEM DALAM KATEGORI
    const filtered = data.filter((d) => d.kategori === kategori);

    // AUTO URUTAN
    const urutan = filtered.length + 1;

    const { error } = await supabase.from("pertanyaan").insert([
      {
        isi_pertanyaan: isi,
        kategori,
        tipe,
        urutan
      }
    ]);

    if (error) return alert(error.message);

    setIsi("");
    fetchData();
  };

  // ================= HAPUS =================
  const hapus = async (id: number) => {
    if (!confirm("Yakin hapus?")) return;

    await supabase
      .from("pertanyaan")
      .delete()
      .eq("id", id);

    fetchData();
  };

  // ================= EDIT =================
  const mulaiEdit = (d: any) => {
    setEditId(d.id);
    setEditText(d.isi_pertanyaan);
  };

  const simpanEdit = async () => {
    if (!editText.trim()) return;

    const item = data.find((d) => d.id === editId);

    const tipe = "likert";

    await supabase
      .from("pertanyaan")
      .update({
        isi_pertanyaan: editText,
        tipe
      })
      .eq("id", editId);

    setEditId(null);
    setEditText("");

    fetchData();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 w-full max-w-6xl">

      {/* ================= FORM ================= */}
      <div className="mb-6 flex flex-col md:flex-row gap-3">

        <input
          value={isi}
          onChange={(e) => setIsi(e.target.value)}
          placeholder="Isi pertanyaan"
          className="border px-3 py-2 rounded-lg text-sm flex-1"
        />

        {/* DROPDOWN */}
        <div className="relative w-full md:w-52">
          <button
            onClick={() => setOpen(!open)}
            className="w-full border px-3 py-2 rounded-lg text-sm text-left bg-white flex justify-between"
          >
            {kategori}
            <span>▼</span>
          </button>

          {open && (
            <div className="absolute z-20 mt-1 w-full bg-white border rounded-lg shadow max-h-48 overflow-auto">
              {kategoriList.map((item) => (
                <div
                  key={item}
                  onClick={() => {
                    setKategori(item);
                    setOpen(false);
                  }}
                  className={`px-3 py-2 text-sm cursor-pointer hover:bg-blue-100 ${
                    kategori === item
                      ? "bg-blue-50 font-medium"
                      : ""
                  }`}
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={tambah}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
        >
          Tambah
        </button>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">

          <thead className="border-b bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left w-12">
                No
              </th>

              <th className="px-4 py-3 text-left">
                Kategori
              </th>

              <th className="px-4 py-3 text-left">
                Pertanyaan
              </th>

              <th className="px-4 py-3 text-left w-28">
                Aksi
              </th>
            </tr>
          </thead>

          <tbody>
            {data.map((d) => {

              // NOMOR RESET PER KATEGORI
              const nomor = d.urutan;

              return (
                <tr
                  key={d.id}
                  className="border-b hover:bg-gray-50"
                >

                  {/* NO */}
                  <td className="px-4 py-3">
                    {nomor}
                  </td>

                  {/* KATEGORI */}
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        d.kategori === "Saran"
                          ? "bg-purple-100 text-purple-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {d.kategori}
                    </span>
                  </td>

                  {/* PERTANYAAN */}
                  <td className="px-4 py-3">
                    {editId === d.id ? (
                      <input
                        value={editText}
                        onChange={(e) =>
                          setEditText(e.target.value)
                        }
                        className="border px-2 py-1 rounded w-full text-sm"
                      />
                    ) : (
                      d.isi_pertanyaan
                    )}
                  </td>

                  {/* AKSI */}
                  <td className="px-4 py-3">
                    <div className="flex gap-2">

                      {editId === d.id ? (
                        <>
                          <button
                            onClick={simpanEdit}
                            className="text-green-600 text-xs"
                          >
                            Simpan
                          </button>

                          <button
                            onClick={() => setEditId(null)}
                            className="text-gray-500 text-xs"
                          >
                            Batal
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => mulaiEdit(d)}
                            className="text-blue-600 hover:bg-blue-50 p-1.5 rounded"
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            onClick={() => hapus(d.id)}
                            className="text-red-500 hover:bg-red-50 p-1.5 rounded"
                            title="Hapus"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}

                    </div>
                  </td>

                </tr>
              );
            })}

            {data.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-6 text-gray-400"
                >
                  Belum ada data
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
}