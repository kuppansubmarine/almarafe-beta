import Image from "next/image";
import logo from '../../Images/ALMARALOGO.png';
import { Inter } from 'next/font/google'
import InputChat from "../../components/InputChat";

const ubuntu = Inter({ subsets: ['latin'], weight: ['300','400','500','600','700','800','900'] })

export default function Home() {
  return (
   <main className ={ubuntu.className}>
   
  

      <InputChat/>
    
  

   </main>
  );
}
