"use client";

import LoginForm from "@/components/login-form";
import { GraduationCap, BarChart3, ShieldCheck, Database } from "lucide-react";

function BrandIcon() {
  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
      <GraduationCap className="text-white w-7 h-7" />
    </div>
  );
}

function Feature({ icon: Icon, title, desc }: any) {
  return (
    <div className="flex items-start gap-4 rounded-2xl bg-white/10 backdrop-blur p-4 border border-white/10">
      <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <h2 className="font-semibold text-white">{title}</h2>
        <p className="text-blue-100 text-sm">{desc}</p>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="grid min-h-screen lg:grid-cols-[1fr_1.2fr]">

        {/* LEFT */}
        <section className="relative bg-gradient-to-br from-blue-700 to-blue-500 text-white p-12 flex flex-col overflow-hidden">

          {/* subtle glow */}
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />

          <div className="relative z-10 flex items-center gap-4">
            <BrandIcon />
            <div>
              <p className="text-2xl font-bold">Evaluasi Usability</p>
              <p className="text-blue-200">Sistem KRS Online</p>
            </div>
          </div>

          <div className="relative z-10 mt-12">
            <h1 className="text-4xl font-bold leading-tight">
              Evaluasi Pengalaman Pengguna dengan USE Questionnaire
            </h1>

            <p className="mt-6 text-blue-100 max-w-lg">
              Sistem evaluasi usability berbasis USE Questionnaire untuk mengukur pengalaman pengguna
              terhadap fitur Kartu Rencana Studi pada SIAKAD UNIPEM.
            </p>
          </div>

          <div className="relative z-10 mt-10 space-y-4">
            <Feature
              icon={BarChart3}
              title="4 Kategori Evaluasi"
              desc="Usefulness, Ease of Use, Ease of Learning, Satisfaction"
            />
            <Feature
              icon={ShieldCheck}
              title="Skala Likert 1–5"
              desc="Pengukuran kuantitatif terstandarisasi"
            />
            <Feature
              icon={Database}
              title="Data Teragregasi"
              desc="Hasil evaluasi lengkap per responden"
            />
          </div>
          
          <div className="mt-10 text-blue-200 text-sm">
            <p>Dibangun untuk kebutuhan penelitian skripsi</p>
            <p className="mt-2">Metode USE Questionnaire</p>
            </div>
        </section>

        {/* RIGHT */}
        <aside className="flex items-center justify-center p-10 bg-gray-50">
          <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border">
            <LoginForm />
          </div>
        </aside>

      </div>
    </main>
  );
}