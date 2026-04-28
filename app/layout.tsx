import "./globals.css";

export const metadata = {
  title: "Evaluasi KRS",
  description: "USE Questionnaire",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}