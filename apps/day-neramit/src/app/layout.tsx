import type { Metadata, Viewport } from "next";
import { Geist_Mono, Prompt, Sarabun } from "next/font/google";
import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const prompt = Prompt({
  variable: "--font-prompt",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
});

const sarabun = Sarabun({
  variable: "--font-sarabun",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI-BOS Document Studio | Day Neramit",
  description:
    "ระบบจัดทำใบเสนอราคา ใบเสร็จรับเงิน/ใบรับเงิน และใบรับประกัน ของ Day Neramit Smart Repair & Renovation — ธีม Luxury Gold-Black ใช้งานได้แบบออฟไลน์ (PWA)",
  manifest: "/manifest.json",
  applicationName: "Day Neramit",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Day Neramit",
  },
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${prompt.variable} ${sarabun.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-doc-paper-muted">
        <ServiceWorkerRegister />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
