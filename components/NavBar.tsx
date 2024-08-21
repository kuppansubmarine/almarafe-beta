"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import logo from '@/Images/ALMARALOGO.png';

function NavBar() {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navigateTo = (path: string) => {
        router.push(path);
        setIsMenuOpen(false); // Close menu on navigation
    };

    const redirectToLinkedIn = () => {
        window.location.href = "https://www.linkedin.com/company/almarahealth/";
    };

    return (
        <nav className="navbar bg-base-200/10 border-b-2 flex items-center justify-between px-4 py-2">
            <div className="flex items-center">
                <Image className="w-7 h-7 mr-1" alt="logo" src={logo} />
                <span className="font-semibold ml-1 rounded-lg text-lg sm:text-xl">
                    Almara <span className="text-sky-600">Beta</span>
                </span>
            </div>
            
            <div className="hidden md:flex flex-1 justify-center items-center">
                <button className="btn btn-ghost mx-2 text-sm sm:text-base" onClick={() => navigateTo("/mission")}>
                    Our Mission
                </button>
                <button className="btn btn-ghost mx-2 text-sm sm:text-base" onClick={() => navigateTo("/howitworks")}>
                    How It Works
                </button>
            </div>

            <div className="flex items-center">
                <button className="btn btn-square btn-ghost mr-2" onClick={redirectToLinkedIn}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.2c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 10.2h-3v-4.5c0-1.11-.9-2-2-2s-2 .89-2 2v4.5h-3v-9h3v1.351c.901-.835 2.12-1.351 3.5-1.351 2.481 0 4.5 2.02 4.5 4.5v4.5z"/>
                    </svg>
                </button>
                <button className="btn btn-square btn-ghost" onClick={() => navigateTo("/")}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
                        <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
                    </svg>
                </button>
                <button className="md:hidden btn btn-square btn-ghost ml-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                    </svg>
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-lg z-10">
                    <button className="w-full py-2 px-4 text-left" onClick={() => navigateTo("/mission")}>
                        Our Mission
                    </button>
                    <button className="w-full py-2 px-4 text-left" onClick={() => navigateTo("/howitworks")}>
                        How It Works
                    </button>
                </div>
            )}
        </nav>
    );
}

export default NavBar;
