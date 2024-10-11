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
import im from '@/Images/close.png';
import Image from "next/image";
import { FaUserMd, FaUser, FaSearch, FaBookMedical, FaTimes } from "react-icons/fa";
import { IoSearchCircle } from "react-icons/io5";
import { HeartIcon as HeartIconSolid, ClipboardDocumentIcon } from "@heroicons/react/24/solid";
import { MdTune } from "react-icons/md";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import AnalyzingPage from "./Analyzing";
import ErrorPage from "./Error";
import Popup from "@/components/Popup";
import Feedback from "./Feedback";

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
  const [biomarkers, setBiomarkers] = useState("");
  const [otherConditions, setOtherConditions] = useState("");
  const [previousCancer, setPreviousCancer] = useState("");
  const [previousCancerType, setPreviousCancerType] = useState("");
  const [previousCancerStage, setPreviousCancerStage] = useState("");
  const [treatmentTypes, setTreatmentTypes] = useState<string[]>([]);
  const [otherTreatment, setOtherTreatment] = useState("");
  const [PI, setPI] = useState("");
  const [protocolID, setProtocolID] = useState("");
  const [intervention, setIntervention] = useState("");
  const [drug, setDrug] = useState("");
  const [phases, setPhases] = useState("");
  const [allowSubmit, setAllowSubmit] = useState(false);
  const [excludedTherapy, setExcludedTherapy] = useState("");
  const [excludedTherapies, setExcludedTherapies] = useState<string[]>([]);
  const [priorTherapy, setPriorTherapy] = useState("");
  const [priorTherapies, setPriorTherapies] = useState<string[]>([]);
  const [relapsed, setRelapsed] = useState('null');
  const [refractory, setRefractory] = useState('null');
  const [healthProblems, setHealthProblems] = useState("");

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
      setBiomarkers("");
      setOtherConditions("");
      setPreviousCancer("");
      setPreviousCancerType("");
      setPreviousCancerStage("");
      setOtherTreatment("");
      setPI("");
      setProtocolID("");
    }

    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };


  const handleRadioClick = (value: any, stateSetter: { (value: React.SetStateAction<string>): void; (value: React.SetStateAction<string>): void; (value: React.SetStateAction<string>): void; (value: React.SetStateAction<string>): void; (arg0: (prevRelapsed: any) => any): void; }) => {
    // Toggle between the value and null (deselect)
    stateSetter((prevRelapsed) => prevRelapsed === value ? 'null' : value);
  };

  const handleSexSelection = (selectedSex: string) => {
    setSex(selectedSex);
  };

  const handleTreatmentTypeSelection = (type: string, varState: any) => {
    varState((prev: string[]) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleAddItem = (therapy: string, setTherapy: any, setTherapyArray: any) => {
    if (therapy.length > 0) {
      setTherapyArray((prev: string[]) =>
        prev.includes(therapy) ? prev.filter((t) => t !== therapy) : [...prev, therapy]
      );
      setTherapy("");
    }
  }

  const handleClose = (therapy: string, setTherapyArray: any) => {
    setTherapyArray((prev: string[]) => prev.filter((t) => t !== therapy));
  }

  const HandlePatientMode = () => {
    router.push(`/patient`);
  };
  // massive function to submit patient information from patient or phisician mode
  const handleSubmit = async () => {
    if (isFilterOpen) {
      if (!(condition || protocolID || PI || drug || intervention || biomarkers)) {
        toast.error("Please fill in at least one of the following:\n\nCondition, Biomarkers, Intervention, Study Drug, Protocol ID, PI");
        return;
      }
      if ((condition || intervention || biomarkers || drug) && protocolID) {
        toast.error("You can only search by [Condition, Intervention, Biomarkers, Drug] or Protocol ID, not both!");
        return;
      }
    }

    try {
      toast("Inputting Info...", { position: "top-center" });

      setInput("");
      setCondition("");

      // TODO: removing phisician mode
      const requestBody = {
        // parameters in all searches

        userType: userType,
        patient_id: "patient",

        // strings
        condition: condition.trim(),
        biomarkers: biomarkers.trim(),
        intervention: intervention.trim(),
        drug: drug.trim(),
        protocolID: protocolID.trim(),
        pi: PI.trim(),
        otherConditions: otherConditions.trim(),
        // string arrays
        phases: phases,
        excludedTherapies: excludedTherapies,
        priorTherapies: priorTherapies,
        // boolean
        relapsed: relapsed,
        refractory: refractory,




        general: general.trim(),
      };
      console.log(requestBody);

      // make actual request
      setIsLoading(true);
      const response = await fetch("http://127.0.0.1:5000/api/search", {
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
                <div className="flex flex-col items-center justify-center mt-12 md:mt-24 mb-10 md:mb-30 p-6">
                  <h1 className="text-4xl md:text-6xl font-bold text-[#313131]">Almara</h1>
                  <h2 className="text-md md:text-2xl text-gray-500 mt-2">
                    AI Search Engine for <span className="text-[#67a2e1] font-semibold">Clinical Trials</span>
                  </h2>

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
                          className="ml-1 max-w-[300px] md:ml-2 md:mt-0 flex items-center content-center text-white bg-[#67a2e1] hover:bg-[#5a91c4] p-2 rounded-lg"

                          onClick={() => { setIsFilterOpen(true), setUserType("Physician"); }}
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
                          setGeneral("I’m looking for clinical trials as a 47-year-old woman with advanced breast cancer that has come back after chemotherapy. My current treatment includes hormone therapy, but I’m interested in new treatments that could help alongside it.")
                          setAllowSubmit(true);
                        }
                        }
                      >
                        <div className="flex gap-2 items-center">
                          <IoSearchCircle className=" h-5 w-5" />
                          <span className="font-semibold text-sm">Example</span>
                        </div>
                        <h2 className="mt-3 text-sm">I’m looking for clinical trials as a <b>47-year-old woman</b> with <b>advanced breast cancer</b> that has come back after <b>chemotherapy</b>. My current treatment includes <b>hormone therapy</b>, but I’m interested in new treatments that could help alongside it. I’m hoping to find options that may better <b>control the cancer</b>.</h2>
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
                        <h2 className="mt-3 text-sm">Give me <b>Phase I or Phase II</b> trials for <b>Acute myeloid leukemia</b>, <b>relapsed</b> after bone marrow transplant, with <b>FLT3-ITD mutation</b> and <b>secondary resistance to midostaurin</b>. Interested in trials involving novel <b>FLT3 inhibitors</b> or <b>combination therapies</b> targeting secondary resistance mechanisms.</h2>
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
          className={`fixed top-0 right-0 h-full bg-white shadow-xl z-50 transform ${isFilterOpen ? 'translate-x-0' : 'translate-x-full'
            } transition-transform duration-300 ease-in-out`}
          style={{ width: '375px' }}
        >
          <div className="p-4 flex justify-between items-center shadow">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <MdTune className="text-2xl" />
              Advanced
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


          <div className="p-4 overflow-y-auto h-4/5">

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Condition</label>
              <input
                type="text"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="ex. Stage IV Breast Cancer"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Biomarkers</label>
              <input
                type="text"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="ex. CA549"
                value={biomarkers}
                onChange={(e) => setBiomarkers(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Intervention</label>
              <input
                type="text"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="ex. Surgery"
                value={intervention}
                onChange={(e) => setIntervention(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Phase</label>
              <input
                type="text"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="ex. III or 1b/1a"
                value={phases}
                onChange={(e) => setPhases(e.target.value)}
              />
            </div>



            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Study Drug</label>
              <input
                type="text"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="ex. Dostarlimab"
                value={drug}
                onChange={(e) => setDrug(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Excluded Therapies</label>
              <div className="flex items-center content-center">
                <input
                  type="text"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="ex. Chemotherapy"
                  value={excludedTherapy}
                  onChange={(e) => setExcludedTherapy(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && excludedTherapy.length > 0) {
                      handleAddItem(excludedTherapy, setExcludedTherapy, setExcludedTherapies);
                    }
                  }}
                />
                <button
                  onClick={() => excludedTherapy.length > 0 && handleAddItem(excludedTherapy, setExcludedTherapy, setExcludedTherapies)}
                  className={`w-20 h-8 rounded-md shadow-sm transition-colors duration-200 m-2 ${excludedTherapy.length > 0
                      ? 'bg-[#67a2e1] text-white hover:bg-[#5590ce]'
                      : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    }`}
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3"> {/* Added flex-wrap and gap for better layout */}
                {excludedTherapies.map((treatment, key) => (
                  <div
                    className="flex justify-between items-center p-2 border rounded-md bg-gray-100"
                    key={key}
                    style={{ maxWidth: '280px' }} // Set a max width for wrapping
                  >
                    <p className="italic truncate pr-2">{treatment}</p> {/* Added truncate for long text */}
                    <p onClick={() => handleClose(treatment, setExcludedTherapies)} className="cursor-pointer ml-2">
                      <Image className="w-3 h-3 mr-2" src={im} alt="close" />
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Prior Lines of Therapy</label>
              <div className="flex items-center content-center">
                <input
                  type="text"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="ex. Chemotherapy"
                  value={priorTherapy}
                  onChange={(e) => setPriorTherapy(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && priorTherapy.length > 0) {
                      handleAddItem(priorTherapy, setPriorTherapy, setPriorTherapies);
                    }
                  }}
                />
                <button
                  onClick={() => priorTherapy.length > 0 && handleAddItem(priorTherapy, setPriorTherapy, setPriorTherapies)}
                  className={`w-20 h-8 rounded-md shadow-sm transition-colors duration-200 m-2 ${priorTherapy.length > 0
                      ? 'bg-[#67a2e1] text-white hover:bg-[#5590ce]'
                      : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    }`}
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3"> {/* Added flex-wrap and gap for better layout */}
                {priorTherapies.map((treatment, key) => (
                  <div
                    className="flex justify-between items-center p-2 border rounded-md bg-gray-100"
                    key={key}
                    style={{ maxWidth: '280px' }} // Set a max width for wrapping
                  >
                    <p className="italic truncate pr-2">{treatment}</p> {/* Added truncate for long text */}
                    <p onClick={() => handleClose(treatment, setPriorTherapies)} className="cursor-pointer ml-2">
                      <Image className="w-3 h-3 mr-2" src={im} alt="close" />
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex w-full">
              <div className="w-full">
                <label className="text-sm font-medium text-gray-700">Relapsed?</label>
                <div className="flex flex-row flex-wrap gap-2 mb-5">
                  <div className="flex w-fit px-2">
                    <label className="flex items-center">
                      <input
                        onClick={() => handleRadioClick('true', setRelapsed)} // Toggles to true or deselect
                        type="radio"
                        className="form-radio"
                        checked={relapsed === 'true'} // Checks if refractory is true
                      />
                      <span className="ml-2">Yes</span>
                    </label>

                    <label className="flex items-center ml-4">
                      <input
                        onClick={() => handleRadioClick('false', setRelapsed)} // Toggles to false or deselect
                        type="radio"
                        className="form-radio"
                        checked={relapsed === 'false'} // Checks if refractory is false
                      />
                      <span className="ml-2">No</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="w-full">
                <label className="text-sm font-medium text-gray-700">Refractory?</label>
                <div className="flex flex-row flex-wrap gap-2 mb-5">
                  <div className="flex w-fit px-2">
                    <label className="flex items-center">
                      <input
                        onClick={() => handleRadioClick('true', setRefractory)} // Toggles to true or deselect
                        type="radio"
                        className="form-radio"
                        checked={refractory === 'true'} // Checks if refractory is true
                      />
                      <span className="ml-2">Yes</span>
                    </label>

                    <label className="flex items-center ml-4">
                      <input
                        onClick={() => handleRadioClick('false', setRefractory)} // Toggles to false or deselect
                        type="radio"
                        className="form-radio"
                        checked={refractory === 'false'} // Checks if refractory is false
                      />
                      <span className="ml-2">No</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>


            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Other health problems</label>
              <textarea
                className="mt-1 p-2 block w-full h-20 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="ex. Diabetes"
                value={otherConditions}
                onChange={(e) => setOtherConditions(e.target.value)}
              />
            </div>

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
            <Feedback />
          </div>


          {/* Handle search button for advanced search */}

          <div className="h-full p-2"
            style={{ boxShadow: "0 -4px 6px rgba(0, 0, 0, 0.1)" }}>
            <button
              onClick={() => {
                if (protocolID && PI) {
                  toast.error("Please search by either Protocol ID or PI, not both.");
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