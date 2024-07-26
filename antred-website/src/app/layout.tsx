import type { Metadata } from "next";
import { montserrat, bontang } from "@/components/system/typography/fonts/font";
import { ThemeProvider } from "@/style/themes";
import "../style/globals.css";


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
      <body className={`${montserrat.variable} ${bontang.variable}`}>
        <ThemeProvider
        attribute="class"
         defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >

        {children}
        </ThemeProvider>
        </body>
    </html>
  );
}
