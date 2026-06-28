import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Phaneroo Constructions Ltd | Make Your Vision Possible",
  description:
    "Phaneroo Constructions Ltd — Malawi's trusted construction partner. Building services, concrete blocks, interlocking pavers, borehole drilling, and construction consultancy in Lilongwe.",
  keywords: "construction Malawi, concrete blocks Lilongwe, building contractor Malawi, Phaneroo Constructions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}