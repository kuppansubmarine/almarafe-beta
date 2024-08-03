"use client"
import React, { useState, useRef } from 'react';
import { MagnifyingGlassIcon, UserCircleIcon, ArrowDownTrayIcon, ExclamationCircleIcon, MagnifyingGlassCircleIcon } from '@heroicons/react/24/outline';
import { SparklesIcon, HeartIcon, StarIcon, PaperAirplaneIcon, ClipboardDocumentIcon, ArrowUturnLeftIcon, MapPinIcon, MapIcon, ChartBarIcon, CakeIcon, DocumentTextIcon, EnvelopeIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import Image from "next/image";
import logo from '@/Images/ALMARALOGO.png';
import AnalyzingPage from './Analyzing';
import ErrorPage from './Error';


const InputChat = () => {
  const [step, setStep] = useState(0);
  const [diseaseType, setDiseaseType] = useState(''); // To manage the type of disease
  const [selectedType, setSelectedType] = useState(''); // To track selected condition type
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



  // Health Overview state variables
  const [biomarkers, setBiomarkers] = useState('');
  const [otherConditions, setOtherConditions] = useState('');
  const [ecogScore, setEcogScore] = useState('');
  const [previousCancer, setPreviousCancer] = useState('');
  const [previousCancerType, setPreviousCancerType] = useState('');
  const [previousCancerStage, setPreviousCancerStage] = useState('');

  // Previous Treatments state variables
  const [treatmentTypes, setTreatmentTypes] = useState<string[]>([]);
  const [treatmentResponse, setTreatmentResponse] = useState('');
  const [adverseEffects, setAdverseEffects] = useState('');
  const [otherTreatment, setOtherTreatment] = useState('');

  const topRef = useRef<HTMLDivElement>(null);

  const handleNextStep = () => {
    setStep(step + 1);
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    setStep(step - 1);
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

  const handleSubmit = async () => {

    try {
      // Check for required fields
      if (!condition) {
        toast.error("Fill in Condition!");
        throw new Error("Empty Condition!");
      }
      if (!age) {
        toast.error("Fill in Age!");
        throw new Error("Empty Age!");
      }
      if (!sex) {
        toast.error("Select your Biological Sex!");
        throw new Error("Empty Biological Sex!");
      }

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
        'patient_id': "patient",
        'patient_info': inputTrim,
        'condition': conditionTrim,
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
      };

      // Log the request body
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
      toast.success("Success!")
      const data = await response.json();
      const search_id = data['searchID']
      console.log(data)
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
          <div className="flex flex-col  items-center justify-center h-screen p-6">
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
          <div className="flex flex-col justify-center gap-3 mt-4 p-6">
            <h1 className="text-2xl max-w-100 text-left pb-10 font-medium flex items-center mt-8">
              <UserCircleIcon className="mr-2 h-6 w-6 text-gray-500" /> General Information
            </h1>
            
            <label className="block text-lg mb-2 font-medium">What is your condition?</label>
            <input
              type="text"
              className="bg-gray-200/50 text-black h-10 focus:outline-none p-4 mb-5 rounded-2xl text-sm"
              placeholder="ex. Chronic Lymphocytic Leukemia"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              required
            />
            
            <label className="block text-lg mb-2 font-medium">What is your age?</label>
            <input
              type="number"
              className="bg-gray-200/50 text-black h-10 focus:outline-none p-4 mb-5 rounded-2xl text-sm"
              placeholder="ex. 67"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
            
            <label className="block text-lg mb-2 font-medium">What is your biological sex?</label>
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

        {step === 2 && (
          <div className="flex flex-col justify-center gap-3 mt-4 p-6">
            <h1 className="text-2xl max-w-100 text-left pb-10 font-medium flex items-center mt-8">
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

        {step === 3 && (
          <div className="flex flex-col justify-center gap-3 mt-4 p-6">
            <h1 className="text-2xl max-w-100 text-left pb-10 font-medium flex items-center mt-8">
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

        {step === 4 && (
          <div className="flex flex-col justify-center gap-3 mt-4 p-6">
            <h1 className="text-2xl max-w-100 text-left pb-10 font-medium mt-8">Additional Information (Optional)</h1>
            
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
          {step > 0 && step < 4 && (
            <button
              type="button"
              onClick={handleNextStep}
              className="bg-blue-500 py-2 px-6 text-white rounded-full hover:scale-95 hover:bg-blue-800 cursor-pointer transition-all duration-200 ease-in-out"
            >
              Next
            </button>
          )}
          {step === 4 && (
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
    </div>
    )}
 </div>
    );

        
};

export default InputChat;
