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
  // page states
  const [step, setStep] = useState(0);
  const [userType, setUserType] = useState("");
  const [general, setGeneral] = useState("");
  const router = useRouter();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false); 
  const topRef = useRef<HTMLDivElement>(null);

  // search states
  const [condition, setCondition] = useState("");
  const [age, setAge] = useState("");
  const [stage, setStage] = useState("");
  const [error, setError] = useState(false);
  const [email, setEmail] = useState("");
  const [sex, setSex] = useState("");
  const [ethnicity, setEthnicity] = useState("");
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

  const [allowSubmit, setAllowSubmit] = useState(false);

  useEffect(() => {
    if (allowSubmit) {
      handleSubmit();
    }
  }, [allowSubmit]);

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

  const HandlePatientMode = () => {
    router.push(`/patient`);
  };
  // massive function to submit patient information from patient or phisician mode
  const handleSubmit = async () => {
    if (isFilterOpen) {
      if (!condition && !protocolID && !PI) {
        toast.error("Condition, Protocol ID or PI must be filled in to search!");
        return;
      }
      if (condition && protocolID) {
        toast.error("You can only search by Condition or Protocol ID, not both!");
        return;
      }
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
      // TODO: removing phisician mode
      const requestBody = {
        // parameters in all searches
        userType: userType,
        condition: conditionTrim,
        age: send_age,
        sex: sex,
        patient_id: "patient",
        patient_info: inputTrim,
        email: emailTrim,
        stage: stageTrim,
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
        otherKeywords: otherKeywords.trim(),
        protocolID: protocolID.trim(),
        pi: PI.trim(),
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

  // handle closing of the popup
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const filterSidebar = document.getElementById("filter-sidebar");
      if (isFilterOpen && filterSidebar && !filterSidebar.contains(event.target as Node)) {
        setProtocolID('');
        setPI('');
        setUserType("");
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFilterOpen]);


  return (
    // main page
    <>
      <div>
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
                    <div className="flex flex-col md:flex-row md:gap-4">
                      <div className="flex gap-4 md:gap-6 content-center items-center">
                        <button
                          type="button"
                          onClick={() => HandlePatientMode()}
                          className="bg-white border border-gray-300 py-2 px-4 md:px-6 text-black rounded-full hover:scale-95 hover:bg-gray-200 cursor-pointer transition-all duration-200 ease-in-out flex items-center gap-2"
                        >
                          <FaUser className="sm:text-xl flex-shrink-0 flex-grow-0" />
                          <p className="text-sm sm:text-md">Patient Mode</p>
                        </button>
                        <button
                        className="ml-1 max-w-[110px] md:ml-2 md:mt-0 flex items-center content-center text-white bg-[#67a2e1] hover:bg-[#5a91c4] p-2 rounded-lg"
                        
                        onClick={() => {setIsFilterOpen(true), setUserType("Physician");}}
                      >
                        <FaSearch className=" mr-2 text-sm flex-shrink-0 flex-grow-0" /> 
                        <p className="flex items-center content-center text-sm sm:text-md">Advanced</p>
                      </button>
                      </div>
                    </div>
                    <div className="flex gap-5">
                    <div
          className="flex flex-col mt-12 bg-slate-50 rounded-xl p-4 max-w-120 hover-effect"
          onClick={() => {
            setGeneral("Show me trials for Stage 4 non-small cell lung cancer, positive for EGFR exon 19 deletion mutation, previously treated with osimertinib and chemotherapy. Looking for trials with alternative targeted therapies for EGFR-mutant tumors or immunotherapies with minimal off-target effects.")
            setAllowSubmit(true);
            }
          }
        >
                        <div className="flex gap-2 items-center">
                          <IoSearchCircle className=" h-5 w-5" />
                          <span className="font-semibold text-sm">Example</span>
                        </div>
                        <h2 className="mt-3 text-sm">Show me trials for Stage 4 non-small cell lung cancer, positive for EGFR exon 19 deletion mutation, previously treated with osimertinib and chemotherapy. Looking for trials with alternative targeted therapies for EGFR-mutant tumors or immunotherapies with minimal off-target effects.</h2>
                      </div>
                      <div
          className="flex flex-col mt-12 bg-slate-50 rounded-xl p-4 max-w-120 hover-effect"
          onClick={() => {
            setGeneral("Give me Phase I or Phase II trials for Acute myeloid leukemia, relapsed after bone marrow transplant, with FLT3-ITD mutation and secondary resistance to midostaurin. Interested in trials involving novel FLT3 inhibitors or combination therapies targeting secondary resistance mechanisms.")
            setAllowSubmit(true);
            }
          }
        >
                        <div className="flex gap-2 items-center">
                          <IoSearchCircle className=" h-5 w-5" />
                          <span className="font-semibold text-sm">Example</span>
                        </div>
                        <h2 className="mt-3 text-sm">Give me Phase I or Phase II trials for Acute myeloid leukemia, relapsed after bone marrow transplant, with FLT3-ITD mutation and secondary resistance to midostaurin. Interested in trials involving novel FLT3 inhibitors or combination therapies targeting secondary resistance mechanisms.</h2>
                      </div>
                    </div>
                  </div>
                </div>
              )}


              </div>
            </div>
      
          
        )}
      </div>

      {isFilterOpen && (
        <div className="fixed inset-0 bg-black opacity-50 z-40" onClick={() => setIsFilterOpen(false)}></div>
      )}


      {/* Advanced Search (filter sidebar) */}
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

            {/* Handle search button for advanced search */}
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