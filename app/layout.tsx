import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display, Urbanist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GiftEm - AI-Powered Gift Planning",
  description: "AI-powered gift suggestions with savings goals that unlock your special moment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} ${urbanist.variable} h-full antialiased bg-gradient-to-br from-blue-50 via-pink-50 to-purple-50`}
    >
      <body className="min-h-full flex flex-col font-urbanist">{children}</body>
    </html>
  );
}
