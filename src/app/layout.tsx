import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { InstallBanner } from "@/components/install-banner";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider, ToastContainer } from "@/components/ui/Toast";

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

// Public catalog is luxury-only: default the browser chrome (mobile theme-color)
// to the luxury espresso-black canvas so SSR pages don't flash light chrome.
// Admin routes override this at runtime via ThemeProvider's dynamic meta sync.
export const viewport: Viewport = {
  themeColor: "#0F0D0C",
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
      <head>
        {/* Google Fonts for theme registry (Inter + Geist + Luxury) */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col bg-canvas text-ink">
        <ToastProvider>
          <ThemeProvider>
            {children}
            <InstallBanner />
          </ThemeProvider>
          <ToastContainer />
        </ToastProvider>
      </body>
    </html>
  );
}
