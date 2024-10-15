"use client";
import React, { useState, useRef, useEffect } from "react";
import { BsSearchHeartFill } from "react-icons/bs";
import {
  MagnifyingGlassIcon,
  UserCircleIcon,
  HeartIcon as HeartIconOutline,
  EyeDropperIcon,
} from "@heroicons/react/24/outline";
import { FaUserMd, FaUser, FaSearch, FaBookMedical, FaTimes } from "react-icons/fa";
import { IoSearchCircle } from "react-icons/io5";
import { HeartIcon as HeartIconSolid, ClipboardDocumentIcon } from "@heroicons/react/24/solid";
import { MdTune } from "react-icons/md";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import AnalyzingPage from "../../../components/Analyzing";
import ErrorPage from "../../../components/Error";
import Popup from "@/components/Popup";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/outline";

const PatientInfo = () => {
  // page states
  const router = useRouter();
  const topRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);

  // search states
  const [condition, setCondition] = useState("");
  const [age, setAge] = useState("");
  const [stage, setStage] = useState("");
  const [otherStates, setOtherStates] = useState("");
  const [sex, setSex] = useState("");
  const [state, setState] = useState("");


  // details "(i)"
  const [illnessOpen, setIllnessOpen] = useState(false);
  const [stageOpen, setStageOpen] = useState(false);

  // Function to store values in localStorage before routing
  const handleSaveAndNavigate = () => {
    if (!condition || !age || !sex) {
      toast.error("Please fill in all required fields before proceeding!");
      return;
    }
    // Save the values to localStorage
    localStorage.setItem("condition", condition);
    localStorage.setItem("age", age);
    localStorage.setItem("stage", stage);
    localStorage.setItem("sex", sex);
    localStorage.setItem("state", JSON.stringify(state));

    // Navigate to the new page
    router.push("/patient");
  };

  useEffect(() => {
    const storedCondition = localStorage.getItem("condition");
    const storedAge = localStorage.getItem("age");
    const storedStage = localStorage.getItem("stage");
    const storedSex = localStorage.getItem("sex");
    const storedState = localStorage.getItem("state");

    if (storedCondition) setCondition(storedCondition);
    if (storedAge) setAge(storedAge);
    if (storedStage) setStage(storedStage);
    if (storedSex) setSex(storedSex);
    if (storedState) setState(JSON.parse(storedState));
  }, []);

const handleAge = (ageVal: string) => {
  const parsedAge = parseInt(ageVal);

  if (ageVal === "") {
    setAge(ageVal);
  } else if (isNaN(parsedAge)) {
    toast.error("Age must be a number");
  } else if (parsedAge > 0 && parsedAge < 100) {
    setAge(ageVal);
  } else {
    toast.error("Age must be between 0 and 100");
  }
};


  const handleTreatmentTypeSelection = (type: string, varState: any) => {
    varState((prev: string[]) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

function toggleState(state: any, stateFunc: any) {
  if (state == false) {
    stateFunc(true);
  } else {
    stateFunc(false);
  }
}

const handleSexSelection = (selectedSex: string) => {
    setSex(selectedSex);
  };

      return (
        // main page
        <>
          <div>

              <div className={`flex flex-col p-3 w-full max-w-5xl mx-auto`}>
                <div ref={topRef}>
                  <Toaster position="top-center" />
                </div>
                <div className="rounded-xl flex flex-col justify-center">
                  
                    <div className="flex flex-col justify-center gap-3 mt-4 p-6">
                      <h1 className="text-xl md:text-2xl text-left pb-10 font-medium flex items-center mt-8">
                        <UserCircleIcon className="mr-2 h-5 md:h-6 w-5 md:w-6 text-gray-500" /> General Information
                      </h1>
    
                      <p className="text-xs md:text-sm text-red-500 mb-4">* Indicates a required field</p>

                      <label onClick={() => toggleState(illnessOpen, setIllnessOpen)} className="cursor-pointer block text-base md:text-lg mb-2 font-medium">
        What is the type of cancer you have? 
        <span className="text-red-500">* </span>
      </label>
                      
                      <input
                        type="text"
                        className="bg-gray-200/50 text-black h-8 md:h-10 focus:outline-none p-3 md:p-4 mb-5 rounded-2xl text-sm"
                        placeholder="ex. Chronic Lymphocytic Leukemia"
                        value={condition}
                        onChange={(e) => setCondition(e.target.value)}
                        required
                      />
                     <label className="block text-base md:text-lg mb-2 font-medium">
                        What is the current state of your illness? <span className="text-slate-400">(Optional)</span>
                      </label>
                      <div className="flex flex-col gap-2">
                      <select
                                                className={`bg-gray-200/50 h-8 md:h-10 focus:outline-none p-2 md:p-2 rounded-2xl text-sm mb-4 ${
                                                  !stage ? "text-gray-500" : "text-black"
                                                }`}
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                      >
                        <option className="text-slate-300" value="" disabled>
                          Select your state
                        </option>
                        {["I don't know", "In remission", "Stable", "Progressing", "Relapsed", "In treatment", "Other"].map(
                          (option) => (
                            <option key={option} value={option}>{option}</option>
                          )
                        )}
                      </select>
                        {(state == "Other" ) && (
                          <>
                      <label className="block text-base md:text-md mb-2 font-medium ml-8">
                        Please Specify 
                      </label>
                          <input
                            type="text"
                            className="bg-gray-200/50 text-black h-8 md:h-10 focus:outline-none p-3 md:p-4 mb-5 rounded-2xl text-sm mx-8"
                            placeholder="Please specify"
                            value={otherStates}
                            onChange={(e) => setOtherStates(e.target.value)}
                          />
                          </>
                        )}
                      </div>
    
                      <label className="block text-base md:text-lg mb-2 font-medium">
                        How old are you? <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        className="bg-gray-200/50 text-black h-8 md:h-10 focus:outline-none p-3 md:p-4 mb-5 rounded-2xl text-sm"
                        placeholder="e.g. 67"
                        value={age}
                        onChange={(e) => handleAge(e.target.value)}
                        required
                      />
    
                      <label className="block text-base md:text-lg mb-2 font-medium">
                        What is your gender? <span className="text-red-500">*</span>
                      </label>
                      <div className="button-group flex gap-2 mb-4">
                        <button
                          type="button"
                          onClick={() => handleSexSelection("Male")}
                          className={`h-8 md:h-10 focus:outline-none p-3 md:p-4 rounded-2xl ${
                            sex === "Male" ? "bg-gray-800 text-white" : "bg-gray-200 text-black"
                          }`}
                        >
                          Male
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSexSelection("Female")}
                          className={`h-8 md:h-10 focus:outline-none p-3 md:p-4 rounded-2xl ${
                            sex === "Female" ? "bg-gray-800 text-white" : "bg-gray-200 text-black"
                          }`}
                        >
                          Female
                        </button>
                        </div>
                        <label onClick={() => toggleState(stageOpen, setStageOpen)} className="block text-base md:text-lg mb-2 font-medium">Has your disease spread to other locations?
                        <svg
          className="inline x-1 y-1"
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width="15"
          height="15"
          viewBox="0 0 24 24"
        >
          <path d="M 12 2 C 6.4919555 2 2 6.4919596 2 12 C 2 17.50804 6.4919555 22 12 22 C 17.508045 22 22 17.50804 22 12 C 22 6.4919596 17.508045 2 12 2 z M 12 7 C 12.69 7 13.25 7.56 13.25 8.25 C 13.25 8.94 12.69 9.5 12 9.5 C 11.31 9.5 10.75 8.94 10.75 8.25 C 10.75 7.56 11.31 7 12 7 z M 12 11.009766 C 12.663 11.009766 13.201172 11.547938 13.201172 12.210938 L 13.201172 16.810547 C 13.201172 17.473547 12.663 18.011719 12 18.011719 C 11.337 18.011719 10.798828 17.473547 10.798828 16.810547 L 10.798828 12.210938 C 10.798828 11.547937 11.337 11.009766 12 11.009766 z"></path>
        </svg><span className="text-slate-400">(Optional)</span>
        </label>
                        <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${stageOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <label
          style={{ height: stageOpen ? 'auto' : '0' }}
          className="block text-base md:text-sm mb-2 font-small italic py-2"
        >
          <span>May not apply to your cancer. </span>
        </label>
      </div>
                      <select
                        className={`bg-gray-200/50 h-8 md:h-10 focus:outline-none p-2 md:p-2 rounded-2xl text-sm mb-4 ${
                          !stage ? "text-gray-500" : "text-black"
                        }`}
                        value={stage}
                        onChange={(e) => setStage(e.target.value)}
                      >
                        <option className="text-gray-500" value="" disabled selected>
                          Please specify
                        </option>
                        <option value="I don't know">I don't know</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                      {(stage == "Yes" ) && (
                          <>
                      <label className="block text-base md:text-md mb-2 font-medium ml-8">
                        Where did it spread? 
                      </label>
                          <input
                            type="text"
                            className="bg-gray-200/50 text-black h-8 md:h-10 focus:outline-none p-3 md:p-4 mb-5 rounded-2xl text-sm mx-8"
                            placeholder="Please specify"
                            value={otherStates}
                            onChange={(e) => setOtherStates(e.target.value)}
                          />
                          </>
                        )}
                    </div>



                    <button
                        type="button"
                        onClick={handleSaveAndNavigate}
                        className="bg-[#67a2e1] py-2 px-4 md:px-6 text-white rounded-full hover:scale-95 hover:bg-[#5a91c4] cursor-pointer transition-all mb-10 duration-200 ease-in-out"
                      >
                        Next
                      </button>
                  </div>
                </div>  
            
          </div>
    
          <style jsx>{`
            .hover-effect {
              transition: all 0.2s ease-in-out;
              cursor: grab;
            }
    
            .hover-effect:hover {
              color: #333;
              cursor: grabbing;
              background-color: #e0e0e0;
            }
          `}</style>
        </>
      );
}

export default PatientInfo