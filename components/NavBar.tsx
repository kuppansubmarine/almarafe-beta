"use client"
import { useRouter } from "next/navigation";
import { CubeIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import logo from '@/Images/ALMARALOGO.png'

function NavBar() {
    const router = useRouter();
    const HomeButton = () => {
        router.push(`/`);
    };
    return (
        <div className="navbar bg-base-200/10 border-b-2">
            <div className="flex-none ml-4 p-2 rounded-xl ">
              <Image className=" w-7 h-7 mr-1" alt="logo" src={logo}></Image>
                <span className="font-semibold ml-1 rounded-lg">Almara <span className="text-sky-600">Beta</span></span>
            </div>
            <div className="flex-1">
         
            </div>
            <div className="flex-none">
                <button className="btn btn-square btn-ghost" onClick={HomeButton}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
  <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
  <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
</svg>

                </button>
            </div>
        </div>
    )
}

export default NavBar
