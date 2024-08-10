"use client"
import React, { useState, useRef } from 'react';
import { MagnifyingGlassIcon, UserCircleIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/outline';
import { HeartIcon, ClipboardDocumentIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import Image from "next/image";
import logo from '@/Images/ALMARALOGO.png';
import missionImage from '@/Images/AlmaraTeam.png';
import AnalyzingPage from './Analyzing';
import ErrorPage from './Error';

const InputChat = () => {
  const [step, setStep] = useState(0);
  const [userType, setUserType] = useState(''); 
  const [diseaseType, setDiseaseType] = useState(''); 
  const [selectedType, setSelectedType] = useState(''); 
  const [isAccordionOpen1, setIsAccordionOpen1] = useState(false); 
  const [isAccordionOpen2, setIsAccordionOpen2] = useState(false);
  const router = useRouter();
  const [input, setInput] = useState('');
  const [condition, setCondition] = useState('');
  const [age, setAge] = useState('');
  const [stage, setStage] = useState('');
  const [error, setError] = useState(false);
  const [email, setEmail] = useState('');
  const [sex, setSex] = useState('');
  const [ethnicity, setEthnicity] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [biomarkers, setBiomarkers] = useState('');
  const [otherConditions, setOtherConditions] = useState('');
  const [ecogScore, setEcogScore] = useState('');
  const [previousCancer, setPreviousCancer] = useState('');
  const [previousCancerType, setPreviousCancerType] = useState('');
  const [previousCancerStage, setPreviousCancerStage] = useState('');

  const [treatmentTypes, setTreatmentTypes] = useState<string[]>([]);
  const [treatmentResponse, setTreatmentResponse] = useState('');
  const [adverseEffects, setAdverseEffects] = useState('');
  const [otherTreatment, setOtherTreatment] = useState('');

  const topRef = useRef<HTMLDivElement>(null);

  const handleNextStep = () => {
    if (step === 2 && userType === 'Patient' && (!condition || !age || !sex)) {
      toast.error("Please fill in all required fields before proceeding!");
      return; 
    }
    setStep(step + 1);
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    if (step === 3 && userType === 'Physician') {
      setStep(1); 
    } else {
      setStep(step - 1);
    }
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTypeSelection = (type: string) => {
    setDiseaseType(type);
    setSelectedType(type);
  }

  const handleSexSelection = (selectedSex: string) => {
    setSex(selectedSex);
  }

  const handleTreatmentTypeSelection = (type: string) => {
    setTreatmentTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  }

  const handleUserTypeSelection = (type: string) => {
    setUserType(type);
    if (type === 'Patient') {
      setStep(2); 
    } else if (type === 'Physician') {
      setStep(3); 
    }
  };

  const toggleAccordion1 = () => setIsAccordionOpen1(!isAccordionOpen1);
  const toggleAccordion2 = () => setIsAccordionOpen2(!isAccordionOpen2);

  const handleSubmit = async () => {
    if (!condition || (userType === 'Patient' && (!age || !sex))) {
      toast.error("Please fill in all required fields!");
      return;
    }

    try {
      toast('Inputting Info...', { position: "top-center" });

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
        'userType': userType,
        'condition': conditionTrim,
        'mode': userType.toLowerCase(), 
        ...(userType === 'Patient' && {
          'patient_id': "patient",
          'patient_info': inputTrim,
          'email': emailTrim,
          'stage': stageTrim,
          'age': send_age,
          'sex': sex,
          'ethnicity': ethnicity,
          'biomarkers': biomarkers.trim(),
          'otherConditions': otherConditions.trim(),
          'ecogScore': ecogScore,
          'previousCancer': previousCancer,
          'previousCancerType': previousCancerType.trim(),
          'previousCancerStage': previousCancerStage,
          'previousTreatments': treatmentTypes.includes('Other') ? [...treatmentTypes.filter(t => t !== 'Other'), otherTreatment.trim()] : treatmentTypes,
          'treatmentResponse': treatmentResponse.trim(),
          'adverseEffects': adverseEffects.trim()
        }),
        ...(userType === 'Physician' && {
          'age': age,
          'sex': sex,
          'otherConditions': otherConditions.trim(),
          'patientNote': inputTrim,
        })
      };

      console.log(requestBody);
      setIsLoading(true);
      const response = await fetch('https://almarabeta.azurewebsites.net/api/search', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      if (!response.ok) {
        const data = await response.json();
        setError(true);
        toast.error("Couldn't process data!")
        throw new Error(data[0].error);
      }
      toast.success("Redirecting to Results Page!")
      const data = await response.json();
      const search_id = data['searchID'];
      console.log(data);
      router.push(`/results/${search_id}`);
    } catch (error) {
      console.error('Error submitting the input:', error);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoading ? (
        <AnalyzingPage />
      ): error ? (
        <ErrorPage/>
      ) : (
        <div className="flex flex-col  p-3 w-full max-w-4xl mx-auto">
          <div ref={topRef}><Toaster position="top-center" /></div>
          <div className="rounded-xl flex flex-col justify-center">
            {step === 0 && (
              <div className="flex flex-col items-center justify-center h-screen p-6">
                <Image className="w-32 h-32 sm:w-40 sm:h-40" alt="logo" src={logo} priority></Image>
                <h1 className="text-2xl text-center mb-2 font-medium mt-3">Let's Discover</h1>
                <h1 className="text-2xl text-center mb-10 text-[#67a2e1] font-semibold">Clinical Trials</h1>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="flex items-center bg-base-100 justify-center mx-auto p-4 border-2 w-64 text-black text-base rounded-full hover:scale-95 cursor-pointer transition-all duration-200 ease-in-out"
                >
                  Begin new search <MagnifyingGlassIcon className="h-5 ml-3" />
                </button>
              </div>
            )}


            {step === 1 && (
              <div className="flex flex-col justify-center items-center h-screen p-6">
                <h1 className="text-2xl text-center mb-10 font-medium mt-3">Are you a</h1>
                <div className="flex flex-col gap-6">
                  <button
                    type="button"
                    onClick={() => handleUserTypeSelection('Patient')}
                    className="flex items-center bg-base-100 justify-center mx-auto p-4 border-2 w-64 text-black text-base rounded-full hover:scale-95 cursor-pointer transition-all duration-200 ease-in-out"
                  >
                    Patient
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUserTypeSelection('Physician')}
                    className="flex items-center bg-base-100 justify-center mx-auto p-4 border-2 w-64 text-black text-base rounded-full hover:scale-95 cursor-pointer transition-all duration-200 ease-in-out"
                  >
                    Physician
                  </button>
                </div>
              </div>
            )}

            {step === 2 && userType === 'Patient' && (
              <div className="flex flex-col justify-center gap-3 mt-4 p-6">
                <h1 className="text-2xl text-left pb-10 font-medium flex items-center mt-8">
                  <UserCircleIcon className="mr-2 h-6 w-6 text-gray-500" /> General Information
                </h1>
                
                <p className="text-sm text-red-500 mb-4">* Indicates a required field</p>
                
                <label className="block text-lg mb-2 font-medium">What is your condition? <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  className="bg-gray-200/50 text-black h-10 focus:outline-none p-4 mb-5 rounded-2xl text-sm"
                  placeholder="ex. Chronic Lymphocytic Leukemia"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  required
                />
                
                <label className="block text-lg mb-2 font-medium">What is your age? <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  className="bg-gray-200/50 text-black h-10 focus:outline-none p-4 mb-5 rounded-2xl text-sm"
                  placeholder="ex. 67"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                />
                
                <label className="block text-lg mb-2 font-medium">What is your biological sex? <span className="text-red-500">*</span></label>
                <div className="button-group flex gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => handleSexSelection('Male')}
                    className={`h-10 focus:outline-none p-4 rounded-2xl ${sex === 'Male' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'}`}
                  >
                    Male
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSexSelection('Female')}
                    className={`h-10 focus:outline-none p-4 rounded-2xl ${sex === 'Female' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'}`}
                  >
                    Female
                  </button>
                </div>
                
                <label className="block text-lg mb-2 font-medium">What is your ethnicity? (optional)</label>
                <select
                  className="bg-gray-200/50 text-black h-10 focus:outline-none p-2 rounded-2xl text-sm mb-4"
                  value={ethnicity}
                  onChange={(e) => setEthnicity(e.target.value)}
                >
                  <option value="" disabled>Select your ethnicity</option>
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

                <label className="block text-lg mb-2 font-medium">What is your email? (optional)</label>
                <input
                  type="email"
                  className="bg-gray-200/50 text-black h-10 focus:outline-none p-4 mb-5 rounded-2xl text-sm"
                  placeholder="ex. email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            )}

            {step === 3 && userType === 'Physician' && (
              <div className="flex flex-col justify-center gap-3 mt-4 p-6">
                <h1 className="text-2xl text-left pb-10 font-medium mt-8">Physician Information</h1>
                
                <p className="text-sm text-red-500 mb-4">* Indicates a required field</p>

                <label className="block text-lg mb-2 font-medium">What is the patient's condition? <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  className="bg-gray-200/50 text-black h-10 focus:outline-none p-4 mb-5 rounded-2xl text-sm"
                  placeholder="ex. Chronic Lymphocytic Leukemia"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  required
                />

                <label className="block text-lg mb-2 font-medium">Any other relevant terms or conditions? (optional)</label>
                <input
                  type="text"
                  className="bg-gray-200/50 text-black h-10 focus:outline-none p-4 mb-5 rounded-2xl text-sm"
                  placeholder="e.g., Autoimmune disorders"
                  value={otherConditions}
                  onChange={(e) => setOtherConditions(e.target.value)}
                />

                <div className="accordion">
                  <button onClick={toggleAccordion1} className="bg-gray-200 text-black py-2 px-4 rounded-lg">
                    Demographics {isAccordionOpen1 ? '-' : '+'}
                  </button>
                  {isAccordionOpen1 && (
                    <div className="accordion-content bg-gray-100 p-4 mt-2 rounded-lg">
                      <label className="block text-lg mb-2 font-medium">Age (optional)</label>
                      <input
                        type="number"
                        className="bg-gray-200/50 text-black h-10 focus:outline-none p-4 mb-5 rounded-2xl text-sm"
                        placeholder="ex. 67"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                      />
                      <label className="block text-lg mb-2 font-medium">Sex (optional)</label>
                      <div className="button-group flex gap-2 mb-4">
                        <button
                          type="button"
                          onClick={() => handleSexSelection('Male')}
                          className={`h-10 focus:outline-none p-4 rounded-2xl ${sex === 'Male' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'}`}
                        >
                          Male
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSexSelection('Female')}
                          className={`h-10 focus:outline-none p-4 rounded-2xl ${sex === 'Female' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'}`}
                        >
                          Female
                        </button>
                      </div>

                      
                    </div>
                  )}
                </div>

                <div className="accordion mt-4">
                  <button onClick={toggleAccordion2} className="bg-gray-200 text-black py-2 px-4 rounded-lg">
                    Patient Note {isAccordionOpen2 ? '-' : '+'}
                  </button>
                  {isAccordionOpen2 && (
                    <div className="accordion-content bg-gray-100 p-4 mt-2 rounded-lg">
                      <label className="block text-lg mb-2 font-medium">Patient Note (optional)</label>
                      <textarea
                        className="bg-gray-200/50 text-black h-72 w-full md:h-64 md:text-sm focus:outline-none mb-5 p-4 text-xs resize-none rounded-2xl"
                        placeholder="Enter any relevant information or notes..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                      ></textarea>
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 3 && userType === 'Patient' && (
              <div className="flex flex-col justify-center gap-3 mt-4 p-6">
                <h1 className="text-2xl text-left pb-10 font-medium flex items-center mt-8">
                <HeartIcon className="mr-2 h-6 w-6 text-red-500" /> Health Overview
                </h1>
                
                <label className="block text-lg mb-2 font-medium">What is your current stage condition?</label>
                <select
                  className="bg-gray-200/50 text-black h-10 focus:outline-none p-2 rounded-2xl text-sm mb-4"
                  value={stage}
                  onChange={(e) => setStage(e.target.value)}
                >
                  <option value="" disabled>Select your stage</option>
                  <option value="Stage 0">Stage 0</option>
                  <option value="Stage I">Stage I</option>
                  <option value="Stage II">Stage II</option>
                  <option value="Stage III">Stage III</option>
                  <option value="Stage IV">Stage IV</option>
                </select>
                
                <label className="block text-lg mb-2 font-medium">Are there any biomarkers or genetic mutations associated with the cancer (e.g., BRCA, EGFR, HER2)?</label>
                <input
                  type="text"
                  className="bg-gray-200/50 text-black h-10 focus:outline-none p-4 mb-5 rounded-2xl text-sm"
                  placeholder="e.g., BRCA, EGFR, HER2"
                  value={biomarkers}
                  onChange={(e) => setBiomarkers(e.target.value)}
                />
                
                <label className="block text-lg mb-2 font-medium">Any other significant health conditions (Ex. Autoimmune disorders)</label>
                <input
                  type="text"
                  className="bg-gray-200/50 text-black h-10 focus:outline-none p-4 mb-5 rounded-2xl text-sm"
                  placeholder="e.g., Autoimmune disorders"
                  value={otherConditions}
                  onChange={(e) => setOtherConditions(e.target.value)}
                />
                
                <label className="block text-lg mb-2 font-medium">What is your Ecog score?</label>
                <select
                  className="bg-gray-200/50 text-black h-10 focus:outline-none p-2 rounded-2xl text-sm mb-4"
                  value={ecogScore}
                  onChange={(e) => setEcogScore(e.target.value)}
                >
                  <option value="" disabled>Select your Ecog score</option>
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                
                <label className="block text-lg mb-2 font-medium">Have you been previously diagnosed with other cancer?</label>
                <div className="button-group flex gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setPreviousCancer('Yes')}
                    className={`h-10 focus:outline-none p-4 rounded-2xl ${previousCancer === 'Yes' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'}`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviousCancer('No')}
                    className={`h-10 focus:outline-none p-4 rounded-2xl ${previousCancer === 'No' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'}`}
                  >
                    No
                  </button>
                </div>
                
                {previousCancer === 'Yes' && (
                  <>
                    <label className="block text-lg mb-2 font-medium">What type of cancer?</label>
                    <input
                      type="text"
                      className="bg-gray-200/50 text-black h-10 focus:outline-none p-4 mb-5 rounded-2xl text-sm"
                      placeholder="e.g., Lung Cancer"
                      value={previousCancerType}
                      onChange={(e) => setPreviousCancerType(e.target.value)}
                    />
                    <label className="block text-lg mb-2 font-medium">What was the stage?</label>
                    <select
                      className="bg-gray-200/50 text-black h-10 focus:outline-none p-2 rounded-2xl text-sm mb-4"
                      value={previousCancerStage}
                      onChange={(e) => setPreviousCancerStage(e.target.value)}
                    >
                      <option value="" disabled>Select the stage</option>
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

            {step === 4 && userType === 'Patient' && (
              <div className="flex flex-col justify-center gap-3 mt-4 p-6">
                <h1 className="text-2xl text-left pb-10 font-medium flex items-center mt-8">
                    <ClipboardDocumentIcon className="mr-2 h-6 w-6 text-gray-500" />
                    <span>Previous Treatments</span>
                </h1>
                
                <label className="block text-lg mb-2 font-medium">Have you received any of the following treatments? Check all that apply</label>
                <div className="flex flex-col gap-2 mb-5">
                  {['Chemotherapy', 'Immunotherapy', 'Surgery', 'Radiation', 'Targeted Cancer Therapy'].map(treatment => (
                    <label key={treatment} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox"
                        checked={treatmentTypes.includes(treatment)}
                        onChange={() => handleTreatmentTypeSelection(treatment)}
                      />
                      <span className="ml-2">{treatment}</span>
                    </label>
                  ))}
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox"
                      checked={treatmentTypes.includes('Other')}
                      onChange={() => handleTreatmentTypeSelection('Other')}
                    />
                    <span className="ml-2">Other</span>
                  </label>
                  {treatmentTypes.includes('Other') && (
                    <input
                      type="text"
                      className="bg-gray-200/50 text-black h-10 focus:outline-none p-4 mb-5 rounded-2xl text-sm"
                      placeholder="Please specify"
                      value={otherTreatment}
                      onChange={(e) => setOtherTreatment(e.target.value)}
                    />
                  )}
                </div>
                
                {treatmentTypes.length > 0 && (
                  <>
                    <label className="block text-lg mb-2 font-medium">How did the cancer respond to previous treatments?</label>
                    <input
                      type="text"
                      className="bg-gray-200/50 text-black h-10 focus:outline-none p-4 mb-5 rounded-2xl text-sm"
                      placeholder="e.g., Stable, Improved"
                      value={treatmentResponse}
                      onChange={(e) => setTreatmentResponse(e.target.value)}
                    />
                  </>
                )}
                
                <label className="block text-lg mb-2 font-medium">Do you have any adverse effects or allergies to certain treatments?</label>
                <input
                  type="text"
                  className="bg-gray-200/50 text-black h-10 focus:outline-none p-4 mb-5 rounded-2xl text-sm"
                  placeholder="e.g., Nausea, Rash"
                  value={adverseEffects}
                  onChange={(e) => setAdverseEffects(e.target.value)}
                />
              </div>
            )}

            {step === 5 && userType === 'Patient' && (
              <div className="flex flex-col justify-center gap-3 mt-4 p-6">
                <h1 className="text-2xl text-left pb-10 font-medium mt-8">Additional Information (Optional)</h1>
                
                <label className="block text-lg mb-2 font-medium">Any other relevant information to improve match precision</label>
                <textarea
                  className="bg-gray-200/50 text-black h-72 md:h-64 md:text-sm focus:outline-none mb-5 p-4 text-xs resize-none rounded-2xl flex-grow"
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
                  className="bg-gray-400 py-2 px-6 text-white rounded-full hover:scale-95 hover:bg-gray-800 cursor-pointer transition-all duration-200 ease-in-out"
                >
                  <ArrowUturnLeftIcon className='h-5 w-5 font-extrabold' />
                </button>
              )}
              {step > 0 && step < 5 && userType === 'Patient' && (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="bg-blue-500 py-2 px-6 text-white rounded-full hover:scale-95 hover:bg-blue-800 cursor-pointer transition-all duration-200 ease-in-out"
                >
                  Next
                </button>
              )}
              {step === 3 && userType === 'Physician' && (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="bg-blue-500 py-2 px-6 text-white rounded-full hover:scale-95 hover:bg-blue-800 cursor-pointer transition-all duration-200 ease-in-out"
                >
                  Submit
                </button>
              )}
              {step === 5 && userType === 'Patient' && (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="bg-blue-500 py-2 px-6 text-white rounded-full hover:scale-95 hover:bg-blue-800 cursor-pointer transition-all duration-200 ease-in-out"
                >
                  Submit
                </button>
              )}
            </div>
          </div>

          {step === 0 && (
  <>
    <section className="flex flex-col items-center bg-transparent p-8 mb-4">
      <Image src={missionImage} alt="Almara Team" width={400} height={400} className="mb-4" />
      <h1 className="text-3xl font-bold text-center mb-4">Our Mission</h1>
      <p className="text-lg text-center">
        Almara is a cutting-edge health tech startup, transforming clinical trials with a groundbreaking platform.
        Our focus is on connecting patients with clinical trials while taking care to address healthcare disparities, especially
        in underprivileged communities.
      </p>
    </section>

    <hr className="border-gray-300" />


    <section className="w-full p-8 bg-white rounded-lg mb-4 md:flex md:justify-between md:gap-10">

      <div className="md:w-1/2">
        <h2 className="text-2xl font-bold text-center md:text-left mb-6">Choose Your Role</h2>
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-blue-600">Patient Mode</h3>
          <p className="text-lg text-gray-700">
            Patients can use the service to find clinical trials that match their condition and personal information, 
            allowing them to explore potential treatment options tailored to their specific health needs.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-blue-600">Physician Mode</h3>
          <p className="text-lg text-gray-700">
            Physicians can use the service to match clinical trials based on desired conditions, sex, age, and other relevant criteria,
            facilitating the identification of appropriate trials for their patients.
          </p>
        </div>
      </div>

      <div className="md:w-1/2">
  <h2 className="text-2xl font-bold text-center md:text-left mb-6">Steps</h2>
  <div className="flex flex-col gap-4">
    <div className="flex items-center md:flex-row">
      <span className="text-3xl font-bold text-blue-600 mr-4 md:mr-4">1</span>
      <p className="text-lg md:text-left">
        <strong>Identify Your Condition:</strong> Enter your medical condition and other relevant health information to begin the search.
      </p>
    </div>
    <div className="flex items-center md:flex-row">
      <span className="text-3xl font-bold text-blue-600 mr-4 md:mr-4">2</span>
      <p className="text-lg md:text-left">
        <strong>Get Matched:</strong> Our platform uses advanced algorithms to match you with suitable clinical trials based on your provided information.
      </p>
    </div>
    <div className="flex items-center md:flex-row">
      <span className="text-3xl font-bold text-blue-600 mr-4 md:mr-4">3</span>
      <p className="text-lg md:text-left">
        <strong>Connect with Trial Coordinators:</strong> Receive detailed information about matched trials and directly contact trial coordinators to learn more and participate.
      </p>
    </div>
  </div>
</div>
    </section>
  </>
)}




          <footer className="bg-gray-100 p-6 mt-10 w-full">
            <div className="flex flex-col items-center w-full">
              <Image src={logo} alt="Almara Logo" width={50} height={50} className="mb-2" />
              <p className="text-center text-sm text-gray-600">&copy; 2024 Almara LLC. All Rights Reserved.</p>
              <a href="mailto:contact@almara.tech" className="text-blue-500 text-sm mt-2 hover:underline">
                contact@almara.tech
              </a>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
};

export default InputChat;
