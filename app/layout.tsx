import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import InputChat from "@/components/InputChat";

const ubuntu = Inter({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800', '900'] });

export const metadata: Metadata = {
  title: "Almara",
  description: "Matching Patients to Clinical Trials",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${ubuntu.className} h-screen w-screen overflow-hidden`}>
        <div className="flex flex-col h-full mb-20">
          <NavBar />
          <main className="flex-grow overflow-auto">
            {children}
          </main>
     
        </div>
      </body>
    </html>
  );
}
