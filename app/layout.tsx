import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import InputChat from "@/components/InputChat";

const ubuntu = Inter({ subsets: ['latin'], weight: ['300','400','500','600','700','800','900'] })

export const metadata: Metadata = {
  title: "Almara",
  description: "Matching Patients to ClinicalTrials",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    
    
      <body className={ubuntu.className}>
        
        {children}
        </body>
   
    </html>
  );
}
