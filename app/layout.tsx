import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/ToastProvider";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || process.env.API_BASE_URL || ""),
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
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
