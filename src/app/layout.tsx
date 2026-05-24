import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { InstallBanner } from "@/components/install-banner";
import { ThemeProvider } from "@/components/theme-provider";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const theme = headersList.get("x-theme") || "shopify";

  return (
    <html
      lang="es"
      data-theme={theme}
      className={`${inter.variable} h-full antialiased font-sans`}
    >
      <body className="min-h-full flex flex-col bg-canvas text-ink">
        <ThemeProvider>
          {children}
          <InstallBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}
