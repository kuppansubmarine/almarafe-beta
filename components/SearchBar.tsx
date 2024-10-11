import React from 'react'

import { FaUserMd, FaUser, FaSearch, FaBookMedical, FaTimes } from "react-icons/fa";
import {
    MagnifyingGlassIcon,
    UserCircleIcon,
    ArrowUturnLeftIcon,
    HeartIcon as HeartIconOutline,
    EyeDropperIcon,
  } from "@heroicons/react/24/outline";
import toast, { Toaster } from "react-hot-toast";
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";

interface SearchBarProps {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<boolean>>;
}

const SearchBar: React.FC<SearchBarProps> = ({ setIsLoading, setError }) => {
const [general, setGeneral] = useState("");
const [allowSubmit, setAllowSubmit] = useState(false);
const [input, setInput] = useState("");

const router = useRouter();

useEffect(() => {
    if (allowSubmit) {
      handleSubmit();
    }
  }, [allowSubmit]);

  const handleSubmit = async () => {
    

    try {
      toast("Loading new results...", { position: "top-center" });

      setInput("");
      
      // TODO: removing phisician mode
      const requestBody = {
        // parameters in all searches

        userType: "",
        patient_id: "patient",
        general: general.trim(),
      };
      console.log(requestBody);

      // make actual request
      setIsLoading(true);
      const response = await fetch("https://almarabeta.azurewebsites.net/api/search", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      if (!response.ok) {
        const data = await response.json();
        setError(true);
        toast.error("Couldn't process data!");
        setIsLoading(false);
        throw new Error(data[0].error);
      }
      toast.success("Redirecting to Results Page!");
      const data = await response.json();
      const search_id = data["searchID"];
      console.log(data);
      router.push(`/results/${search_id}`);
    } catch (error) {
      setIsLoading(false);
      console.error("Error submitting the input:", error);
      setError(true);
    }
  };
  return (
    <div className="flex flex-col items-center mt-7 w-full  md:px-0">
    <div className="relative w-full md:w-[50rem] mb-4">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FaBookMedical className="w-6 md:w-6 h-6 md:h-6 text-[#5299e6]" />
      </div>
      <input
        type="text"
        className="bg-white  border-2  focus:border-[#67a2e1] focus:ring-2  focus:ring-[#67a2e1] text-black h-12 md:h-14 w-full focus:outline-none pl-12 md:pl-12 pr-8 md:pr-12 rounded-xl text-sm md:text-lg transition duration-200"
        placeholder="Search for Clinical Trials..."
        value={general}
        onChange={(e) => setGeneral(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            if (general.trim().length === 0) {
              toast.error("Please enter details before searching!");
            } else {
              handleSubmit();
            }
          }
        }}
      />

      <div
        className={`absolute inset-y-0 right-0 pr-3 flex items-center ${general ? 'cursor-pointer' : 'cursor-not-allowed'
          }`}
        onClick={general ? handleSubmit : () => { }}
      >
        <MagnifyingGlassIcon
          className={`h-5 font-bold md:h-6 w-5 md:w-6 ${general ? 'text-blue-500' : 'text-gray-400'
            }`}
        />
      </div>

    </div>
    
    </div>
  )
}

export default SearchBar
