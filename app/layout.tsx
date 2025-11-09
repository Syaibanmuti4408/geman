import "./globals.css";
import { type ReactNode, Suspense } from "react";
import { Outfit, Roboto_Mono } from "next/font/google";
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

import Header from "@/components/header";
import { Footer } from "@/components/footer";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${robotoMono.variable} font-sans antialiased h-screen flex flex-col bg-gray-50`}
        suppressHydrationWarning
      >
        <Header />
        <main className="flex relative flex-col items-center flex-1 m-auto w-full max-w-6xl p-4">
          <Suspense fallback={null}>{children}</Suspense>
        </main>
        <Footer />
      </body>
    </html>
  );
}
