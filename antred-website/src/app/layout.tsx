import type { Metadata } from "next";
import { montserrat, bontang } from "@/components/system/typography/fonts/font";
import "./globals.css";


export const metadata: Metadata = {
  title: "ANTRED",
  description: "Association Nationale Tiphaine pour la Recherche à l'Étranger des",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <html lang="en">
      <body className={`${montserrat.variable} ${bontang.variable}`}>{children}</body>
    </html>
  );
}
