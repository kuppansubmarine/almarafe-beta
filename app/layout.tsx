import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import InputChat from "@/components/InputChat";

const ubuntu = Inter({ subsets: ['latin'], weight: ['300','400','500','600','700','800','900'] });

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
      <body className={`${ubuntu.className} h-screen w-screen overflow-hidden`}>
        <div className="h-full w-full flex flex-col overflow-hidden">
          <NavBar />
          <div className="flex-grow overflow-auto">
            {children}
          </div>
  
        </div>
      </body>
    </html>
  );
}
