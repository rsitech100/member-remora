import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Member Remora | Trading Platform",
  description: "Belajar cara profit jutaan di saham",
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
  openGraph: {
    title: "Login | Member Remora",
    description: "Mulai perjalanan trading Anda bersama Remora",
    images: ["/images/logo.png"],
    siteName: "Member Remora Trading",
  },
  twitter: {
    card: "summary_large_image",
    title: "Login | Member Remora",
    description: "Mulai perjalanan trading Anda bersama Remora",
    images: ["/images/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
