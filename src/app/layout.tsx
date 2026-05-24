import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { InstallBanner } from "@/components/install-banner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Catálogo Digital",
  description:
    "Catálogo de productos digital. Compartí, navegá y consultá precios por WhatsApp.",
  openGraph: {
    type: "website",
    siteName: "Catálogo Digital",
    title: "Catálogo Digital",
    description:
      "Catálogo de productos digital. Compartí, navegá y consultá precios por WhatsApp.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} h-full antialiased font-sans`}
    >
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        {children}
        <InstallBanner />
      </body>
    </html>
  );
}
