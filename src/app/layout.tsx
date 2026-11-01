import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DEV.OS — Ngo Anh Tuan",
  description: "Developer portfolio of Ngo Anh Tuan (Tuandaca).",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
