"use client";
import React, { useState, useRef, useEffect } from "react";
import { BsSearchHeartFill } from "react-icons/bs";
import {
  MagnifyingGlassIcon,
  UserCircleIcon,
  ArrowUturnLeftIcon,
  HeartIcon as HeartIconOutline,
  EyeDropperIcon,
} from "@heroicons/react/24/outline";
import { FaUserMd, FaUser, FaSearch, FaBookMedical, FaTimes } from "react-icons/fa";
import { IoSearchCircle } from "react-icons/io5";
import { HeartIcon as HeartIconSolid, ClipboardDocumentIcon } from "@heroicons/react/24/solid";
import { MdTune } from "react-icons/md";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import AnalyzingPage from "./Analyzing";
import ErrorPage from "./Error";
import Popup from "@/components/Popup";

const InputChat = () => {
  const [submittedByExample, setSubmittedByExample] = useState(false);
  const [step, setStep] = useState(0);
  const [userType, setUserType] = useState("");
  const [general, setGeneral] = useState("");
  const [isAccordionOpen1, setIsAccordionOpen1] = useState(false);
  const [isAccordionOpen2, setIsAccordionOpen2] = useState(false);
  const router = useRouter();
  const [input, setInput] = useState("");
  const [condition, setCondition] = useState("");
  const [age, setAge] = useState("");
  const [stage, setStage] = useState("");
  const [error, setError] = useState(false);
  const [email, setEmail] = useState("");
  const [sex, setSex] = useState("");
  const [ethnicity, setEthnicity] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [biomarkers, setBiomarkers] = useState("");
  const [otherConditions, setOtherConditions] = useState("");
  const [ecogScore, setEcogScore] = useState("");
  const [previousCancer, setPreviousCancer] = useState("");
  const [previousCancerType, setPreviousCancerType] = useState("");
  const [previousCancerStage, setPreviousCancerStage] = useState("");
  const [treatmentTypes, setTreatmentTypes] = useState<string[]>([]);
  const [treatmentResponse, setTreatmentResponse] = useState("");
  const [adverseEffects, setAdverseEffects] = useState("");
  const [otherTreatment, setOtherTreatment] = useState("");
  const [otherKeywords, setOtherKeywords] = useState("");
  const [PI, setPI] = useState("");
  const [protocolID, setProtocolID] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false); 
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (submittedByExample && general) {
      handleSubmit();
      setSubmittedByExample(false); 
    }
  }, [general, submittedByExample]);

  const handleNextStep = () => {
    if (step === 1 && userType === "Patient" && (!condition || !age || !sex)) {
      toast.error("Please fill in all required fields before proceeding!");
      return;
    }
    setStep(step + 1);
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handlePrevStep = () => {
    if (step === 1) {
      setAge("");
      setInput("");
      setUserType("");
      setCondition("");
      setStage("");
      setEmail("");
      setSex("");
      setEthnicity("");
      setBiomarkers("");
      setOtherConditions("");
      setEcogScore("");
      setPreviousCancer("");
      setPreviousCancerType("");
      setPreviousCancerStage("");
      setTreatmentResponse("");
      setAdverseEffects("");
      setOtherTreatment("");
      setOtherKeywords("");
      setPI("");
      setProtocolID("");
    }

    if (step === 2 && userType === "Physician") {
      setAge("");
      setInput("");
      setUserType("");
      setCondition("");
      setStage("");
      setEmail("");
      setSex("");
      setEthnicity("");
      setBiomarkers("");
      setOtherConditions("");
      setEcogScore("");
      setPreviousCancer("");
      setPreviousCancerType("");
      setPreviousCancerStage("");
      setTreatmentResponse("");
      setAdverseEffects("");
      setOtherTreatment("");
      setOtherKeywords("");
      setPI("");
      setProtocolID("");
      setStep(0);
    } else {
      setStep(step - 1);
    }

    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSexSelection = (selectedSex: string) => {
    setSex(selectedSex);
  };

  const handleTreatmentTypeSelection = (type: string) => {
    setTreatmentTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleUserTypeSelection = (type: string) => {
    setUserType(type);
    setIsFilterOpen(false);
    if (type === "Patient") {
      setStep(1);
    } else if (type === "Physician") {
      setStep(2);
    }
  };

 

  const toggleAccordion1 = () => setIsAccordionOpen1(!isAccordionOpen1);
  const toggleAccordion2 = () => setIsAccordionOpen2(!isAccordionOpen2);

  const handleSubmit = async () => {

    if (isFilterOpen) {
      setUserType("Physician");
    }
  
    if (userType === "Patient" && (!condition || !age || !sex)) {
      toast.error("Please fill in all required fields!");
      return;
    }

    if (userType === "Physician" && !condition && !protocolID && !PI) {
      toast.error("Condition or Protocol ID or PI must be filled in to search!");
      return;
    }

    if (userType === "Physician" && condition && protocolID) {
      toast.error("You can only search by Condition or Protocol ID, not both!");
      return;
    }

    try {
      toast("Inputting Info...", { position: "top-center" });

      const inputTrim = input.trim();
      const conditionTrim = condition.trim();
      const stageTrim = stage.trim();
      const emailTrim = email.trim();
      const send_age = age;

      setInput("");
      setCondition("");
      setAge("");
      setStage("");
      setEmail("");

      const requestBody = {
        userType: userType,
        condition: conditionTrim,
        ...(userType === "Patient" && {
          patient_id: "patient",
          patient_info: inputTrim,
          email: emailTrim,
          stage: stageTrim,
          age: send_age,
          sex: sex,
          ethnicity: ethnicity,
          biomarkers: biomarkers.trim(),
          otherConditions: otherConditions.trim(),
          ecogScore: ecogScore,
          previousCancer: previousCancer,
          previousCancerType: previousCancerType.trim(),
          previousCancerStage: previousCancerStage,
          previousTreatments: treatmentTypes.includes("Other")
            ? [...treatmentTypes.filter((t) => t !== "Other"), otherTreatment.trim()]
            : treatmentTypes,
          treatmentResponse: treatmentResponse.trim(),
          adverseEffects: adverseEffects.trim(),
        }),
        ...(userType === "Physician" && {
          age: age,
          sex: sex,
          otherKeywords: otherKeywords.trim(),
          patient_info: inputTrim,
          protocolID: protocolID.trim(),
          pi: PI.trim(),
        }),
        ...((userType !== "Physician" && userType !== "Patient") && {
          age: age,
          sex: sex,
          otherKeywords: otherKeywords.trim(),
          patient_info: inputTrim,
          general: general.trim(),
          protocolID: protocolID.trim(),
          pi: PI.trim(),
        }),
      };

      console.log(requestBody);
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

  const handleExampleClick1 = () => {
    setSubmittedByExample(true);
    setGeneral("Show me trials for Breast Cancer with HER2 Mutation");
  };

  const handleExampleClick2 = () => {
    setSubmittedByExample(true);
    setGeneral("Search for trials for Melanoma that metastasized to the lungs");
  };



  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const filterSidebar = document.getElementById("filter-sidebar");
      if (isFilterOpen && filterSidebar && !filterSidebar.contains(event.target as Node)) {
        setProtocolID('');
        setPI('');
        setIsFilterOpen(false);
        setUserType("");
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFilterOpen]);

  return (
    <>
      <div>
        <Popup />
        {isLoading ? (
          <AnalyzingPage />
        ) : error ? (
          <ErrorPage />
        ) : (
          <div className={`flex flex-col p-3 w-full max-w-5xl mx-auto ${isFilterOpen ? "pointer-events-none" : ""}`}>
            <div ref={topRef}>
              <Toaster position="top-center" />
            </div>
            <div className="rounded-xl flex flex-col justify-center">
              {step === 0 && (
                <div className="flex flex-col items-left justify-center mt-12 md:mt-24 mb-10 md:mb-30 p-6">
                  <h1 className="text-4xl md:text-6xl font-bold text-[#313131]">Almara</h1>
                  <h2 className="text-md md:text-2xl text-gray-500 mt-2">
                    AI Search Engine for <span className="text-[#67a2e1] font-semibold">Clinical Trials</span>
                  </h2>

                  <div className="flex flex-col items-left mt-7 w-full  md:px-0">
                    <div className="relative w-full md:w-[50rem] mb-4">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaBookMedical className="w-6 md:w-6 h-6 md:h-6 text-[#5299e6]" />
                      </div>
                      <input
                        type="text"
                        className="bg-white border border-gray-300 focus:border-[#67a2e1] focus:ring-2 focus:ring-[#67a2e1] text-black h-10 md:h-12 w-full focus:outline-none pl-14 md:pl-16 pr-8 md:pr-12 rounded-xl text-sm md:text-lg transition duration-200"
                        placeholder="Search for Clinical Trials | More details for better results"
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

                      {general && (
                        <div
                          className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                          onClick={handleSubmit}
                        >
                          <MagnifyingGlassIcon className="h-5 md:h-6 w-5 md:w-6 text-blue-500" />
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 md:gap-4">
                      <div className="flex gap-4 md:gap-6">
                        <button
                          type="button"
                          onClick={() => handleUserTypeSelection("Patient")}
                          className="bg-white border border-gray-300 py-2 px-4 md:px-6 text-black rounded-full hover:scale-95 hover:bg-gray-200 cursor-pointer transition-all duration-200 ease-in-out flex items-center gap-2"
                        >
                          <FaUser className="sm:text-xl flex-shrink-0 flex-grow-0" />
                          <p className="text-sm sm:text-md">Patient Mode</p>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUserTypeSelection("Physician")}
                          className="bg-white border border-gray-300 py-2 px-4 md:px-6 text-black rounded-full hover:scale-95 hover:bg-gray-200 cursor-pointer transition-all duration-200 ease-in-out flex items-center gap-2"
                        >
                          <FaUserMd className="sm:text-xl" />
                          <p className="text-sm sm:text-md">Physician Mode</p>
                        </button>
                      </div>
                      <button
                        className="ml-2 flex items-center text-white bg-[#67a2e1] hover:bg-[#5a91c4] p-2 rounded-lg"
                        
                        onClick={() => {setIsFilterOpen(true), setUserType("Physician");}}
                        
                      >
                        <FaSearch className="mr-2" /> Advanced
                      </button>
                    </div>
                    <div className="flex gap-5">
                    <div
          className="flex flex-col mt-12 bg-slate-50 rounded-xl p-4 max-w-64 hover-effect"
          onClick={handleExampleClick1}
        >
                        <div className="flex gap-2 items-center">
                          <IoSearchCircle className=" h-5 w-5" />
                          <span className="font-semibold text-sm">Example</span>
                        </div>
                        <h2 className="mt-3 text-sm">Show me trials for Breast Cancer with HER2 Mutation</h2>
                      </div>

                      <div
          className="flex flex-col mt-12 bg-slate-50 rounded-xl p-4 max-w-64 hover-effect"
          onClick={handleExampleClick2}
        >
                        <div className="flex gap-2 items-center">
                          <IoSearchCircle className=" h-5 w-5" />
                          <span className="font-semibold text-sm">Example</span>
                        </div>
                        <h2 className="mt-3 text-sm">Search for trials for Melanoma that metastasized to the lungs</h2>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 1 && userType === "Patient" && (
                <div className="flex flex-col justify-center gap-3 mt-4 p-6">
                  <h1 className="text-xl md:text-2xl text-left pb-10 font-medium flex items-center mt-8">
                    <UserCircleIcon className="mr-2 h-5 md:h-6 w-5 md:w-6 text-gray-500" /> General Information
                  </h1>

                  <p className="text-xs md:text-sm text-red-500 mb-4">* Indicates a required field</p>

                  <label className="block text-base md:text-lg mb-2 font-medium">
                    What is your condition? <span className="text-red-500">*</span>
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
                    What is your age? <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    className="bg-gray-200/50 text-black h-8 md:h-10 focus:outline-none p-3 md:p-4 mb-5 rounded-2xl text-sm"
                    placeholder="ex. 67"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                  />

                  <label className="block text-base md:text-lg mb-2 font-medium">
                    What is your biological sex? <span className="text-red-500">*</span>
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

                  <label className="block text-base md:text-lg mb-2 font-medium">
                    What is your ethnicity? (optional)
                  </label>
                  <select
                    className="bg-gray-200/50 text-black h-8 md:h-10 focus:outline-none p-2 md:p-2 rounded-2xl text-sm mb-4"
                    value={ethnicity}
                    onChange={(e) => setEthnicity(e.target.value)}
                  >
                    <option value="" disabled>
                      Select your ethnicity
                    </option>
                    <option value="American Indian or Alaska Native">American Indian or Alaska Native</option>
                    <option value="Asian">Asian</option>
                    <option value="Black">Black</option>
                    <option value="Hispanic, Latino or Spanish origin">Hispanic, Latino or Spanish origin</option>
                    <option value="Middle Eastern or North African">Middle Eastern or North African</option>
                    <option value="Native Hawaiian or Other Pacific Islander">Native Hawaiian or Other Pacific Islander</option>
                    <option value="White">White</option>
                    <option value="More than one race/ethnicity">More than one race/ethnicity</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>

                  <label className="block text-base md:text-lg mb-2 font-medium">What is your email? (optional)</label>
                  <input
                    type="email"
                    className="bg-gray-200/50 text-black h-8 md:h-10 focus:outline-none p-3 md:p-4 mb-5 rounded-2xl text-sm"
                    placeholder="ex. email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              )}

              {step === 2 && userType === "Physician" && (
                <div className="flex flex-col justify-center gap-3 mt-4 p-6">
                  <h1 className="text-xl md:text-2xl text-left mb-5 font-medium flex items-center mt-8">
                    <EyeDropperIcon className="mr-2 h-5 md:h-6 w-5 md:w-6 text-gray-500" /> Physician Mode
                  </h1>

                  <label className="block text-base md:text-lg mb-2 font-medium">
                    What is the patient's condition?{" "}
                  </label>
                  <input
                    type="text"
                    className="bg-gray-200/50 text-black h-8 md:h-10 focus:outline-none p-3 md:p-4 mb-5 rounded-2xl text-sm"
                    placeholder="ex. Breast Cancer"
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    required
                  />

                  <label className="block text-base md:text-lg mb-2 font-medium">
                    Any other relevant terms?{" "}
                  </label>
                  <input
                    type="text"
                    className="bg-gray-200/50 text-black h-8 md:h-10 focus:outline-none p-3 md:p-4 mb-5 rounded-2xl text-sm"
                    placeholder="ex. HER2, Stage IV"
                    value={otherKeywords}
                    onChange={(e) => setOtherKeywords(e.target.value)}
                  />

                  <label className="block text-base md:text-lg mb-2 font-medium">Protocol Number</label>
                  <input
                    type="text"
                    className="bg-gray-200/50 text-black h-8 md:h-10 focus:outline-none p-3 md:p-4 mb-5 max-w-md rounded-2xl text-sm"
                    placeholder="ex. OSU-22167"
                    value={protocolID}
                    onChange={(e) => setProtocolID(e.target.value)}
                  />

                  <label className="block text-base md:text-lg mb-2 font-medium">Principal Investigator </label>
                  <input
                    type="text"
                    className="bg-gray-200/50 text-black h-8 md:h-10 focus:outline-none p-3 md:p-4 mb-5 max-w-md rounded-2xl text-sm"
                    placeholder="Last Name, First name"
                    value={PI}
                    onChange={(e) => setPI(e.target.value)}
                  />

                  <div className="accordion">
                    <button
                      onClick={toggleAccordion1}
                      className="border-2 text-black py-2 px-4 font-medium rounded-lg"
                    >
                      Demographics {isAccordionOpen1 ? "-" : "+"}
                    </button>
                    {isAccordionOpen1 && (
                      <div className="accordion-content p-4 mt-2 rounded-lg">
                        <label className="block text-base md:text-lg mb-2 font-medium">Age</label>
                        <input
                          type="number"
                          className="bg-gray-200/50 text-black h-8 md:h-10 focus:outline-none p-3 md:p-4 mb-5 rounded-2xl text-sm"
                          placeholder="ex. 67"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                        />
                        <label className="block text-base md:text-lg mb-2 font-medium">Sex</label>
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
                      </div>
                    )}
                  </div>

                  <div className="accordion mt-4">
                    <button
                      onClick={toggleAccordion2}
                      className="border-2 text-black py-2 font-medium px-4 rounded-lg"
                    >
                      Patient Note {isAccordionOpen2 ? "-" : "+"}
                    </button>
                    {isAccordionOpen2 && (
                      <div className="accordion-content p-4 mt-2 rounded-lg">
                        <label className="block text-base md:text-lg mb-2 font-medium">Patient Note</label>
                        <textarea
                          className="bg-gray-200/50 text-black h-40 md:h-72 w-full md:text-sm focus:outline-none mb-5 p-3 md:p-4 text-xs resize-none rounded-2xl"
                          placeholder="Enter any relevant information or notes..."
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                        ></textarea>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {step === 2 && userType === "Patient" && (
                <div className="flex flex-col justify-center gap-3 mt-4 p-6">
                  <h1 className="text-xl md:text-2xl text-left pb-10 font-medium flex items-center mt-8">
                    <HeartIconSolid className="mr-2 h-5 md:h-6 w-5 md:w-6 text-red-500" /> Health Overview
                  </h1>

                  <label className="block text-base md:text-lg mb-2 font-medium">What is your current stage condition?</label>
                  <select
                    className="bg-gray-200/50 text-black h-8 md:h-10 focus:outline-none p-2 md:p-2 rounded-2xl text-sm mb-4"
                    value={stage}
                    onChange={(e) => setStage(e.target.value)}
                  >
                    <option value="" disabled>
                      Select your stage
                    </option>
                    <option value="Stage 0">Stage 0</option>
                    <option value="Stage I">Stage I</option>
                    <option value="Stage II">Stage II</option>
                    <option value="Stage III">Stage III</option>
                    <option value="Stage IV">Stage IV</option>
                  </select>

                  <label className="block text-base md:text-lg mb-2 font-medium">
                    Are there any biomarkers or genetic mutations associated with the cancer (e.g., BRCA, EGFR, HER2)?
                  </label>
                  <input
                    type="text"
                    className="bg-gray-200/50 text-black h-8 md:h-10 focus:outline-none p-3 md:p-4 mb-5 rounded-2xl text-sm"
                    placeholder="e.g., BRCA, EGFR, HER2"
                    value={biomarkers}
                    onChange={(e) => setBiomarkers(e.target.value)}
                  />

                  <label className="block text-base md:text-lg mb-2 font-medium">
                    Any other significant health conditions (Ex. Autoimmune disorders)
                  </label>
                  <input
                    type="text"
                    className="bg-gray-200/50 text-black h-8 md:h-10 focus:outline-none p-3 md:p-4 mb-5 rounded-2xl text-sm"
                    placeholder="e.g., Autoimmune disorders"
                    value={otherConditions}
                    onChange={(e) => setOtherConditions(e.target.value)}
                  />

                  <label className="block text-base md:text-lg mb-2 font-medium">What is your Ecog score?</label>
                  <select
                    className="bg-gray-200/50 text-black h-8 md:h-10 focus:outline-none p-2 md:p-2 rounded-2xl text-sm mb-4"
                    value={ecogScore}
                    onChange={(e) => setEcogScore(e.target.value)}
                  >
                    <option value="" disabled>
                      Select your Ecog score
                    </option>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>

                  <label className="block text-base md:text-lg mb-2 font-medium">
                    Have you been previously diagnosed with other cancer?
                  </label>
                  <div className="button-group flex gap-2 mb-4">
                    <button
                      type="button"
                      onClick={() => setPreviousCancer("Yes")}
                      className={`h-8 md:h-10 focus:outline-none p-3 md:p-4 rounded-2xl ${
                        previousCancer === "Yes" ? "bg-gray-800 text-white" : "bg-gray-200 text-black"
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviousCancer("No")}
                      className={`h-8 md:h-10 focus:outline-none p-3 md:p-4 rounded-2xl ${
                        previousCancer === "No" ? "bg-gray-800 text-white" : "bg-gray-200 text-black"
                      }`}
                    >
                      No
                    </button>
                  </div>

                  {previousCancer === "Yes" && (
                    <>
                      <label className="block text-base md:text-lg mb-2 font-medium">What type of cancer?</label>
                      <input
                        type="text"
                        className="bg-gray-200/50 text-black h-8 md:h-10 focus:outline-none p-3 md:p-4 mb-5 rounded-2xl text-sm"
                        placeholder="e.g., Lung Cancer"
                        value={previousCancerType}
                        onChange={(e) => setPreviousCancerType(e.target.value)}
                      />
                      <label className="block text-base md:text-lg mb-2 font-medium">What was the stage?</label>
                      <select
                        className="bg-gray-200/50 text-black h-8 md:h-10 focus:outline-none p-2 md:p-2 rounded-2xl text-sm mb-4"
                        value={previousCancerStage}
                        onChange={(e) => setPreviousCancerStage(e.target.value)}
                      >
                        <option value="" disabled>
                          Select the stage
                        </option>
                        <option value="Stage 0">Stage 0</option>
                        <option value="Stage I">Stage I</option>
                        <option value="Stage II">Stage II</option>
                        <option value="Stage III">Stage III</option>
                        <option value="Stage IV">Stage IV</option>
                      </select>
                    </>
                  )}
                </div>
              )}

              {step === 3 && userType === "Patient" && (
                <div className="flex flex-col justify-center gap-3 mt-4 p-6">
                  <h1 className="text-xl md:text-2xl text-left pb-10 font-medium flex items-center mt-8">
                    <ClipboardDocumentIcon className="mr-2 h-5 md:h-6 w-5 md:w-6 text-gray-500" />
                    <span>Previous Treatments</span>
                  </h1>

                  <label className="block text-base md:text-lg mb-2 font-medium">
                    Have you received any of the following treatments? Check all that apply
                  </label>
                  <div className="flex flex-col gap-2 mb-5">
                    {["Chemotherapy", "Immunotherapy", "Surgery", "Radiation", "Targeted Cancer Therapy"].map(
                      (treatment) => (
                        <label key={treatment} className="inline-flex items-center">
                          <input
                            type="checkbox"
                            className="form-checkbox"
                            checked={treatmentTypes.includes(treatment)}
                            onChange={() => handleTreatmentTypeSelection(treatment)}
                          />
                          <span className="ml-2">{treatment}</span>
                        </label>
                      )
                    )}
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox"
                        checked={treatmentTypes.includes("Other")}
                        onChange={() => handleTreatmentTypeSelection("Other")}
                      />
                      <span className="ml-2">Other</span>
                    </label>
                    {treatmentTypes.includes("Other") && (
                      <input
                        type="text"
                        className="bg-gray-200/50 text-black h-8 md:h-10 focus:outline-none p-3 md:p-4 mb-5 rounded-2xl text-sm"
                        placeholder="Please specify"
                        value={otherTreatment}
                        onChange={(e) => setOtherTreatment(e.target.value)}
                      />
                    )}
                  </div>

                  {treatmentTypes.length > 0 && (
                    <>
                      <label className="block text-base md:text-lg mb-2 font-medium">
                        How did the cancer respond to previous treatments?
                      </label>
                      <input
                        type="text"
                        className="bg-gray-200/50 text-black h-8 md:h-10 focus:outline-none p-3 md:p-4 mb-5 rounded-2xl text-sm"
                        placeholder="e.g., Stable, Improved"
                        value={treatmentResponse}
                        onChange={(e) => setTreatmentResponse(e.target.value)}
                      />
                    </>
                  )}

                  <label className="block text-base md:text-lg mb-2 font-medium">
                    Do you have any adverse effects or allergies to certain treatments?
                  </label>
                  <input
                    type="text"
                    className="bg-gray-200/50 text-black h-8 md:h-10 focus:outline-none p-3 md:p-4 mb-5 rounded-2xl text-sm"
                    placeholder="e.g., Nausea, Rash"
                    value={adverseEffects}
                    onChange={(e) => setAdverseEffects(e.target.value)}
                  />
                </div>
              )}

              {step === 4 && userType === "Patient" && (
                <div className="flex flex-col justify-center gap-3 mt-4 p-6">
                  <h1 className="text-xl md:text-2xl text-left pb-10 font-medium mt-8">Additional Information (Optional)</h1>

                  <label className="block text-base md:text-lg mb-2 font-medium">
                    Any other relevant information to improve match precision
                  </label>
                  <textarea
                    className="bg-gray-200/50 text-black h-40 md:h-72 md:text-sm focus:outline-none mb-5 p-3 md:p-4 text-xs resize-none rounded-2xl flex-grow"
                    placeholder="Enter any other relevant information..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  ></textarea>
                </div>
              )}

              <div className="flex justify-between mt-4 p-6">
                {step > 0 && (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="bg-gray-400 py-2 px-4 md:px-6 text-white rounded-full hover:scale-95 mb-10 hover:bg-gray-800 cursor-pointer transition-all duration-200 ease-in-out"
                  >
                    <ArrowUturnLeftIcon className="h-5 w-5 font-extrabold" />
                  </button>
                )}
                {step > 0 && step < 4 && userType === "Patient" && (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="bg-[#67a2e1] py-2 px-4 md:px-6 text-white rounded-full hover:scale-95 hover:bg-[#5a91c4] cursor-pointer transition-all mb-10 duration-200 ease-in-out"
                  >
                    Next
                  </button>
                )}
                {step === 2 && userType === "Physician" && (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="bg-blue-500 py-2 px-4 md:px-6 mb-10 text-white rounded-full hover:scale-95 hover:bg-blue-800 cursor-pointer transition-all duration-200 ease-in-out"
                  >
                    Submit
                  </button>
                )}
                {step === 4 && userType === "Patient" && (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="bg-blue-500 py-2 px-4 md:px-6 mb-10 text-white rounded-full hover:scale-95 hover:bg-blue-800 cursor-pointer transition-all duration-200 ease-in-out"
                  >
                    Submit
                  </button>
                )}
              </div>
            </div>
          </div>
          
        )}
      </div>

      {isFilterOpen && (
        <div className="fixed inset-0 bg-black opacity-50 z-40" onClick={() => setIsFilterOpen(false)}></div>
      )}

      {/* Filter Sidebar Integrated Here */}
      {isFilterOpen && (
        <div
          id="filter-sidebar"
          className={`fixed top-0 right-0 h-full bg-white shadow-xl z-50 transform ${
            isFilterOpen ? 'translate-x-0' : 'translate-x-full'
          } transition-transform duration-300 ease-in-out`}
          style={{ width: '375px' }}
        >
          <div className="p-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <MdTune className="text-2xl" />
              Advanced Search
            </h2>
            <button
  onClick={() => {
    setProtocolID('');
    setPI('');
    setIsFilterOpen(false);
    setUserType(""); // Reset userType when the filter is closed
  }}
>
  <FaTimes />
</button>

          </div>
          <div className="p-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Protocol Number</label>
              <input
                type="text"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="ex. OSU-22167"
                value={protocolID}
                onChange={(e) => setProtocolID(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Principal Investigator</label>
              <input
                type="text"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Last Name, First name"
                value={PI}
                onChange={(e) => setPI(e.target.value)}
              />
            </div>
            {(protocolID.trim() !== '' || PI.trim() !== '') && (
              <div className="mt-4">
                <button
                  onClick={() => {
                    if (protocolID && PI) {
                      toast.error("Please search by either Protocol ID or PI, not both.");
                      return;
                    }

                    if (!protocolID && !PI) {
                      toast.error("Please provide either a Protocol ID or a PI.");
                      return;
                    }

                    handleSubmit(); 
                    setIsFilterOpen(false);  
                  }}
                  className="w-full bg-[#67a2e1] text-white py-2 rounded-md shadow-sm hover:bg-[#5590ce] transition-colors duration-200"
                >
                  Search
                </button>
              </div>
            )}
          </div>
        </div>
      )}

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
};

export default InputChat;