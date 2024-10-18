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

const Patient = () => {
  // page states
  const [step, setStep] = useState(1);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);

  // search states
  const [condition, setCondition] = useState("");
  const [age, setAge] = useState("");
  const [stage, setStage] = useState("");
  const [sex, setSex] = useState("");
  const [biomarkers, setBiomarkers] = useState("");
  const [otherConditions, setOtherConditions] = useState("");
  const [previousCancer, setPreviousCancer] = useState("");
  const [previousCancerType, setPreviousCancerType] = useState("");
  const [otherTreatment, setOtherTreatment] = useState("");
  const [state, setState] = useState("");
  const [hadTreatment, setHadTreatment] = useState("");
  const [treatmentTypes, setTreatmentTypes] = useState<string[]>([]);
  const [interestedTreatment, setInterestedTreatment] = useState("");
  const [interestedTreatmentVals, setInterestedTreatmentVals] = useState<string[]>([]);
  const [otherInterested, setOtherInterested] = useState("");
  const [notTreatment, setNotTreatment] = useState("");
  const [notTreatmentVals, setNotTreatmentVals] = useState<string[]>([]);
  const [otherNotInterested, setOtherNotInterested] = useState("");
  const [recurrent, setRecurrent] = useState("");
  const [otherStates, setOtherStates] = useState("");

  // details "(i)"
  const [illnessOpen, setIllnessOpen] = useState(false);
  const [stageOpen, setStageOpen] = useState(false);
  const [biomarkersOpen, setBiomarkersOpen] = useState(false);

  useEffect(() => {
    const storedCondition = localStorage.getItem("condition");
    const storedAge = localStorage.getItem("age");
    const storedStage = localStorage.getItem("stage");
    const storedSex = localStorage.getItem("sex");
    const storedState = localStorage.getItem("state");
    const storedOtherStates = localStorage.getItem("otherStates");

    if (storedCondition) setCondition(storedCondition);
    if (storedAge) setAge(storedAge);
    if (storedStage) setStage(storedStage);
    if (storedSex) setSex(storedSex);
    if (storedState) setState(storedState);
    if(storedOtherStates) setOtherStates(storedOtherStates);
  }, []);



  const handleNextStep = () => {
    if (step === 1 && (!condition || !age || !sex)) {
      toast.error("Please fill in all required fields before proceeding!");
      return;
    }
    const nextStep = step + 1;
    setStep(nextStep);
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handlePrevStep = () => {
    router.push("/patient-general");
  }

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

  const handleTreatmentTypeSelection = (type: string, varState: any) => {
    varState((prev: string[]) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleSubmit = async () => {
    if (!condition || !age || !sex) {
      toast.error("Please fill in all required fields!");
      return;
    }

    try {
      toast("Inputting Info...", { position: "top-center" });

      const conditionTrim = condition.trim();
      const stageTrim = stage.trim();
      const send_age = age;
      const stateTrim = state.trim();
      const otherStatesTrim = otherStates.trim()

      setCondition("");
      setAge("");
      setStage("");
      // TODO: removing phisician mode
      const requestBody = {
        // parameters in all searches
        userType: "patient",
        condition: conditionTrim,
        age: send_age,
        sex: sex,
        spread: stageTrim,
        spread_loc: otherStates,
        biomarkers: biomarkers.trim(),
        otherConditions: otherConditions.trim(),
        previousCancer: previousCancer,
        previousCancerType: previousCancerType.trim(),
        recurrent: recurrent,
        previousTreatments: treatmentTypes.includes("Other")
          ? [...treatmentTypes.filter((t) => t !== "Other"), otherTreatment.trim()]
          : treatmentTypes,
        treatmentsInterested: interestedTreatmentVals.includes("Other")
          ? [...treatmentTypes.filter((t) => t !== "Other"), otherInterested.trim()]
          : treatmentTypes,
        treatmentsNotInterested: notTreatmentVals.includes("Other")
          ? [...notTreatmentVals.filter((t) => t !== "Other"), otherNotInterested.trim()]
          : notTreatmentVals,
        state: stateTrim
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
    // main page
    <>
      <div>
        {isLoading ? (
          <AnalyzingPage />
        ) : error ? (
          <ErrorPage />
        ) : (
          <div className={`flex flex-col p-3 w-full max-w-4xl mx-auto`}>
            <div ref={topRef}>
              <Toaster position="top-center" />
            </div>
            <div className="rounded-xl flex flex-col justify-center">


              <div className="flex flex-col justify-center gap-3 mt-4 p-6">

                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="bg-gray-400 p-3 max-w-24 text-white rounded-full hover:scale-95  hover:bg-gray-800 cursor-pointer transition-all duration-200 ease-in-out flex items-center justify-center"
                >
                  <ArrowUturnLeftIcon className="h-5 w-5 font-extrabold" />
                </button>

                <h1 className="text-xl md:text-2xl text-left pb-10 font-medium flex items-center mt-8">
                  <HeartIconSolid className="mr-2 h-5 md:h-6 w-5 md:w-6 text-red-500" /> Medical History
                </h1>



                <label onClick={() => toggleState(biomarkersOpen, setBiomarkersOpen)} className="block text-base md:text-lg mb-2 font-medium">
                  Has your doctor mentioned any special tests, genes, or markers about your condition? <span className="text-slate-400">(Optional)</span>
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
                  </svg>
                </label>
                <div
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${biomarkersOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <label
                    style={{ height: stageOpen ? 'auto' : '0' }}
                    className="block text-base md:text-sm mb-10 font-small italic"
                  >
                    <span>These could include things like genes or proteins that doctors check to see what treatment works best. For example, in lung cancer, they might look for a gene called EGFR, or in breast cancer, a gene called BRCA</span>
                  </label>
                </div>
                <input
                  type="text"
                  className="border-2 border-gray-300 focus:ring-blue-300 focus:border-blue-300 text-black h-12 focus:outline-none p-3 md:p-4 mb-5 rounded-lg text-sm"
                  placeholder="e.g. BRCA, EGFR, HER2"
                  value={biomarkers}
                  onChange={(e) => setBiomarkers(e.target.value)}
                />
                <label className="block text-base md:text-lg mb-2 font-medium">
                  Do you have other health conditions? <span className="text-slate-400">(Optional)</span>
                </label>
                <input
                  type="text"
                  className="border-2 border-gray-300 focus:ring-blue-300 focus:border-blue-300 text-black h-12 focus:outline-none p-3 md:p-4 mb-5 rounded-lg text-sm"
                  placeholder="e.g. Autoimmune disorders, diabetes, high blood presure"
                  value={otherConditions}
                  onChange={(e) => setOtherConditions(e.target.value)}
                />

                <label className="block text-base md:text-lg mb-2 font-medium">
                  Has this cancer come back? <span className="text-slate-400">(Optional)</span>
                </label>
                <div className="button-group flex gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setRecurrent("Yes")}
                    className={`h-12 focus:outline-none p-3 md:p-4 rounded-lg ${recurrent === "Yes" ? "bg-gray-800 text-white" : "bg-gray-200 text-black"
                      }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setRecurrent("No")}
                    className={`h-12 focus:outline-none p-3 md:p-4 rounded-lg ${recurrent === "No" ? "bg-gray-800 text-white" : "bg-gray-200 text-black"
                      }`}
                  >
                    No
                  </button>
                </div>

                <label className="block text-base md:text-lg mb-2 font-medium">
                  Have you had any other cancers before? <span className="text-slate-400">(Optional)</span>
                </label>
                <div className="button-group flex gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setPreviousCancer("Yes")}
                    className={`h-12 focus:outline-none p-3 md:p-4 rounded-lg ${previousCancer === "Yes" ? "bg-gray-800 text-white" : "bg-gray-200 text-black"
                      }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviousCancer("No")}
                    className={`h-12 focus:outline-none p-3 md:p-4 rounded-lg ${previousCancer === "No" ? "bg-gray-800 text-white" : "bg-gray-200 text-black"
                      }`}
                  >
                    No
                  </button>
                </div>

                {previousCancer === "Yes" && (
                  <>
                    <label className="block text-base md:text-lg mb-2 font-medium">What type of cancer? You can list more than one.</label> <span className="text-slate-400">(Optional)</span>
                    <input
                      type="text"
                      className="border-2 border-gray-300 focus:ring-blue-300 focus:border-blue-300 text-black h-12 focus:outline-none p-3 md:p-4 mb-5 rounded-lg text-sm"
                      placeholder="e.g., Lung Cancer"
                      value={previousCancerType}
                      onChange={(e) => setPreviousCancerType(e.target.value)}
                    />
                  </>
                )}


                <label className="block text-base md:text-lg mb-2 font-medium">
                  Are you currently getting treatment for your cancer? <span className="text-slate-400">(Optional)</span>
                </label>
                <div className="button-group flex gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setHadTreatment("Yes")}
                    className={`h-12 focus:outline-none p-3 md:p-4 rounded-lg ${hadTreatment === "Yes" ? "bg-gray-800 text-white" : "bg-gray-200 text-black"
                      }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setHadTreatment("No")}
                    className={`h-12 focus:outline-none p-3 md:p-4 rounded-lg ${hadTreatment === "No" ? "bg-gray-800 text-white" : "bg-gray-200 text-black"
                      }`}
                  >
                    No
                  </button>
                </div>
                {hadTreatment === "Yes" && (
                  <div className="flex flex-col gap-2 mb-5">
                    {["Chemotherapy (strong medicine to kill cancer cells)", "Hormone Therapy (blocks hormones to slow down cancer)", "Hyperthemia (heats part of the body to kill cancer cells)", "Immunotherapy (helps your immune system fight cancer)", "Photodynamic Therapy (uses light-activated drugs to kill cancer cells)", "Radiation Therapy (uses high-energy rays to kill cancer cells)", "Stem Cell Transplant (replaces blood cells after strong treatments)", "Surgery (removes cancer from your body)", "Targeted Therapy (focuses on specific changes in cancer cells)"].map(
                      (treatment) => (
                        <label key={treatment} className="inline-flex items-center">
                          <input
                            type="checkbox"
                            className="form-checkbox"
                            checked={treatmentTypes.includes(treatment)}
                            onChange={() => handleTreatmentTypeSelection(treatment, setTreatmentTypes)}
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
                        onChange={() => handleTreatmentTypeSelection("Other", setTreatmentTypes)}
                      />
                      <span className="ml-2">Other</span>
                    </label>
                    {treatmentTypes.includes("Other") && (
                      <input
                        type="text"
                        className="border-2 border-gray-300 focus:ring-blue-300 focus:border-blue-300 text-black h-12 focus:outline-none p-3 md:p-4 mb-5 rounded-lg text-sm"
                        placeholder="Please specify"
                        value={otherTreatment}
                        onChange={(e) => setOtherTreatment(e.target.value)}
                      />
                    )}
                  </div>
                )}


                <label className="block text-base md:text-lg mb-2 font-medium">
                  Are there any treatments your doctor has advised against? <span className="text-slate-400">(Optional)</span>
                </label>
                <div className="button-group flex gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setNotTreatment("Yes")}
                    className={`h-12 focus:outline-none p-3 md:p-4 rounded-lg ${notTreatment === "Yes" ? "bg-gray-800 text-white" : "bg-gray-200 text-black"
                      }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setNotTreatment("No")}
                    className={`h-12 focus:outline-none p-3 md:p-4 rounded-lg ${notTreatment === "No" ? "bg-gray-800 text-white" : "bg-gray-200 text-black"
                      }`}
                  >
                    No
                  </button>
                </div>
                {notTreatment === "Yes" && (
                  <div className="flex flex-col gap-2 mb-5">
                    {["Chemotherapy (strong medicine to kill cancer cells)", "Hormone Therapy (blocks hormones to slow down cancer)", "Hyperthemia (heats part of the body to kill cancer cells)", "Immunotherapy (helps your immune system fight cancer)", "Photodynamic Therapy (uses light-activated drugs to kill cancer cells)", "Radiation Therapy (uses high-energy rays to kill cancer cells)", "Stem Cell Transplant (replaces blood cells after strong treatments)", "Surgery (removes cancer from your body)", "Targeted Therapy (focuses on specific changes in cancer cells)"].map(
                      (treatment) => (
                        <label key={treatment} className="inline-flex items-center">
                          <input
                            type="checkbox"
                            className="form-checkbox"
                            checked={notTreatmentVals.includes(treatment)}
                            onChange={() => handleTreatmentTypeSelection(treatment, setNotTreatmentVals)}
                          />
                          <span className="ml-2">{treatment}</span>
                        </label>
                      )
                    )}
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox"
                        checked={notTreatmentVals.includes("Other")}
                        onChange={() => handleTreatmentTypeSelection("Other", setNotTreatmentVals)}
                      />
                      <span className="ml-2">Other</span>
                    </label>
                    {otherNotInterested.includes("Other") && (
                      <input
                        type="text"
                        className="border-2 border-gray-300 focus:ring-blue-300 focus:border-blue-300 text-black h-12 focus:outline-none p-3 md:p-4 mb-5 rounded-lg text-sm"
                        placeholder="Please specify"
                        value={otherNotInterested}
                        onChange={(e) => setOtherNotInterested(e.target.value)}
                      />
                    )}
                  </div>
                )}

              </div>






              <button
                type="button"
                onClick={handleSubmit}
                className="bg-[#67a2e1] py-3 px-4 md:text-xl md:px-6 text-white rounded-lg hover:scale-95 hover:bg-[#5a91c4] cursor-pointer transition-all mb-10 duration-200 ease-in-out"
              >

                Submit
              </button>

            </div>
          </div>



        )}
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

export default Patient