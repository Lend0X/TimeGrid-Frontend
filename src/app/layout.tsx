import type { Metadata } from "next";
import { Tomorrow } from "next/font/google";
import "./globals.css";

const tomorrow = Tomorrow({
  weight: ["400", "500"],
  subsets: ["latin"],
});

const metadata: Metadata ={
  title: "TimeGrid",
  description: "Sistema de Grade Horária",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return(
    <html lang="pt-BR">
      <body className={tomorrow.className}>{children}</body>
    </html>
  )
}