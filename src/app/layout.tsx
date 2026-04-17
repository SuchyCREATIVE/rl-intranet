import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import fs from "fs";
import path from "path";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Räderlogistik Intranet",
  description: "Internes Portal für Räderlogistik-Mitarbeiter",
};

// CSS wird server-seitig inlined, da nginx .css-Dateien nicht weiterleitet.
// Einmalig gecacht pro Server-Prozess.
let _inlinedCSS: string | null = null;

function getInlinedCSS(): string {
  if (_inlinedCSS !== null) return _inlinedCSS;
  try {
    const chunksDir = path.join(process.cwd(), ".next", "static", "chunks");
    if (!fs.existsSync(chunksDir)) { _inlinedCSS = ""; return ""; }
    const cssFiles = fs.readdirSync(chunksDir).filter((f) => f.endsWith(".css"));
    _inlinedCSS = cssFiles
      .map((f) => fs.readFileSync(path.join(chunksDir, f), "utf-8"))
      .join("\n");
    return _inlinedCSS;
  } catch {
    _inlinedCSS = "";
    return "";
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const css = getInlinedCSS();
  return (
    <html
      lang="de"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {css && <style dangerouslySetInnerHTML={{ __html: css }} />}
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
