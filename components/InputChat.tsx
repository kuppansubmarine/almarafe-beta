"use client"
import React, { useState } from 'react';
import { FormEvent } from 'react';
import { MagnifyingGlassIcon, ArrowDownTrayIcon, ExclamationCircleIcon, MagnifyingGlassCircleIcon } from '@heroicons/react/24/outline';
import { SparklesIcon, HeartIcon, StarIcon, PaperAirplaneIcon, ArrowUturnLeftIcon, MapPinIcon, MapIcon, ChartBarIcon, CakeIcon, DocumentTextIcon, EnvelopeIcon} from '@heroicons/react/24/solid';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import results_page from '@/app/(root)/results/[id]/page';
import toast, { Toaster } from 'react-hot-toast';
import Image from "next/image";
import logo from '@/Images/ALMARALOGO.png'
import { GiAges } from 'react-icons/gi';

/* Input Patient Data from the form */
const InputChat = () => {
  const [step, setStep] = useState(0);
  const [diseaseType, setDiseaseType] = useState(''); // To manage the type of disease
  //set up router to redirect user to loading or results page
  const router = useRouter();
  //set the initial states of the form values
  const [input, setInput] = useState('');
  const [condition, setCondition] = useState('');
  const [location, setLocation] = useState('');
  const [radiusPreference, setRadiusPreference] = useState('');
  const [age, setAge] = useState('');
  const [stage, setStage] = useState('');
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');

  const handleNextStep = () => setStep(step + 1);
  const handlePrevStep = () => setStep(step - 1);
  const handlePrevExtraStep = () => setStep(step - 2);
  //when patient/physician presses on search button, handle the submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      //if any of the fields are empty, than exit function!

      if (!condition) {
        toast.error("Fill in Condition!");
        throw new Error("Empty Condition!");
      }
      if (!location) {
        toast.error("Fill in Location!");
        throw new Error("Empty Location!");
      }
      if (!radiusPreference) {
        toast.error("Fill in How Much You are Willing to Travel!");
        throw new Error("Empty Radius!");
      }
      if (!age) {
        toast.error("Fill in Age!");
        throw new Error("Empty Age!");
      }

      if (!input) {
        toast.error("Fill in Medical Summary!");
        throw new Error("Empty Input!");
      }

      // trim all string values to remove whitespace
      const inputTrim = input.trim();
      const locationTrim = location.trim();
      const conditionTrim = condition.trim();
      const stageTrim = stage.trim();
      const emailTrim = email.trim();

      //store values before clearing
      const send_radiusPreference = radiusPreference
      const send_age = age


      //clear all values after retrieving data
      setInput("");
      setCondition("");
      setLocation("");
      setRadiusPreference("");
      setAge("");
      setStage("");
      setEmail("");


      //make an API call to backend to begin Almara
      const response = await fetch('https://almarabeta.azurewebsites.net/api/start_almara', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Credentials': 'true'
        },
        //send patient info in JSON format
        body: JSON.stringify({
          'patient_id': "patient",
          'patient_info': inputTrim,
          'condition': conditionTrim,
          'location': locationTrim,
          'radiusPreference': send_radiusPreference,
          'email': emailTrim,
          'stage': stageTrim,
          'age': send_age
        }),

      });
      //if the response is invalid
      if (!response.ok) {
        const data = await response.json();
        toast.error("Error! Check console!")
        throw new Error(data[0].error);
      }
      toast.success("Success! Processing has begun!")
      const data = await response.json();
      const search_id = data['search_id']
      console.log(data)
      //push to results page
      router.push(`/results/${search_id}`);

    } catch (error) {
      console.error('Error submitting the input:', error);
    }
  };


  return (
    <div>
      <div><Toaster position='top-right' /></div>
      <form onSubmit={handleSubmit} className="p-3 relative w-[22rem] md:w-[35rem] lg:w-[50rem]">
        <div className="rounded-xl flex flex-col justify-center">
          {step === 0 && (
            <>

              <div className="flex flex-col items-center justify-center">
                <Image className=" w-32 h-32 sm:w-40 sm:h-40" alt="logo" src={logo}></Image>
                <h1 className="text-3xl text-center mb-2 font-medium mt-3">Let's Discover</h1>
                <h1 className="text-3xl text-center mb-20 text-[#67a2e1] font-semibold">Clinical Trials</h1>

              </div>
              <button
                type="button"
                onClick={handleNextStep}
                className="flex items-center bg-base-100 justify-center mx-auto p-4 border-2  w-64 text-black text-lg rounded-full hover:scale-95  cursor-pointer transition-all duration-200 ease-in-out"
              >
                Begin new search <MagnifyingGlassIcon className="h-5 ml-3" />
              </button>
            </>
          )}

          {step === 1 && (
            <>
              <div className="flex flex-col justify-center gap-3">
                <h1 className="text-3xl max-w-100 text-left pb-10 font-medium">What's your <span className='font-semibold'>type</span> of condition?</h1>
                <button
                  type="button"
                  onClick={() => { setDiseaseType('cancer'); handleNextStep(); }}
                  className="bg-gray-200/50 text-black h-20 max-w-100  text-lg focus:outline-none p-4 mb-3 rounded-2xl flex items-center gap-2 hover:scale-95  cursor-pointer transition-all duration-200 ease-in-out"
                >
                  <SparklesIcon className="h-6 w-6" />
                  Cancer
                </button>
                <button
                  type="button"
                  onClick={() => { setDiseaseType('other'); handleNextStep(); }}
                  className="bg-gray-200/50 text-black h-20 max-w-100 text-lg focus:outline-none p-4 mb-3 rounded-2xl flex items-center gap-2 hover:scale-95  cursor-pointer transition-all duration-200 ease-in-out"
                >
                  <HeartIcon className="h-6 w-6" />
                  Other Condition
                </button>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="bg-gray-400 py-2 px-6 text-white rounded-full hover:scale-95 hover:bg-gray-800 cursor-pointer transition-all duration-200 ease-in-out"
                  >
                    <ArrowUturnLeftIcon className='h-5 w-5 font-extrabold' />
                  </button>
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="flex items-center">
                <StarIcon className="h-0 w-0 lg:h-6 lg:w-6 mr-2 text-[#67a2e1] flex-shrink-0" />
                <h1 className="text-3xl mb-2 max-w-100 text-left  font-medium mt-3">What <span className='font-semibold'>condition</span> are you facing?</h1>
              </div>
              <p className=" mb-2 max-w-96 text-left pb-10 text-gray-500 font-light">Please provide only the name of your condition without any additional details or abbreviations. For example, if you have Stage IV Lung Cancer, just enter <b>"Lung Cancer."</b></p>
              <input
                type="text"
                className="bg-gray-200/50 text-black h-12 focus:outline-none p-4 mb-5 rounded-2xl"
                placeholder="ex. Chronic Lymphocytic Leukemia"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
              />
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="bg-gray-400 py-2 px-6 text-white rounded-full hover:scale-95 hover:bg-gray-800 cursor-pointer transition-all duration-200 ease-in-out"
                >
                  <ArrowUturnLeftIcon className='h-5 w-5 font-extrabold' />
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="bg-blue-500 py-2 px-6 text-white rounded-full hover:scale-95 hover:bg-blue-800 cursor-pointer transition-all duration-200 ease-in-out"
                >

                  <PaperAirplaneIcon className='h-5 w-5' />
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="flex items-center">
                <MapPinIcon className="h-0 w-0 lg:h-6 lg:w-6 mr-2 text-[#67a2e1] flex-shrink-0" />
                <h1 className="text-3xl mb-2 max-w-100 text-left  font-medium mt-3">Where is your <span className='font-semibold'>location</span>?</h1>
              </div>
              <p className=" mb-2 max-w-96 text-left pb-10 text-gray-500 font-light">Please type in your city and state.</p>
              <input
                type="text"
                className="bg-gray-200/50 text-black h-12 focus:outline-none p-4 mb-5 rounded-2xl"
                placeholder="ex. Cleveland, Ohio"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="bg-gray-400 py-2 px-6 text-white rounded-full hover:scale-95 hover:bg-gray-800 cursor-pointer transition-all duration-200 ease-in-out"
                >
                  <ArrowUturnLeftIcon className='h-5 w-5 font-extrabold' />
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="bg-blue-500 py-2 px-6 text-white rounded-full hover:scale-95 hover:bg-blue-800 cursor-pointer transition-all duration-200 ease-in-out"
                >

                  <PaperAirplaneIcon className='h-5 w-5' />
                </button>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <div className="flex items-center">
                <MapIcon className="h-0 w-0 lg:h-6 lg:w-6 mr-2 text-[#67a2e1] flex-shrink-0" />
                <h1 className="text-3xl mb-2 max-w-100 text-left  font-medium mt-3">How far are you willing to <span className='font-semibold'>travel</span>?</h1>
              </div>
              <p className=" mb-2 max-w-96 text-left pb-10 text-gray-500 font-light">Please enter the miles you can travel from the location you entered.</p>
              <input
                type="number"
                className="bg-gray-200/50 text-black h-12 focus:outline-none p-4 mb-5 rounded-2xl"
                placeholder="ex. 50 miles"
                value={radiusPreference}
                onChange={(e) => setRadiusPreference(e.target.value)}
              />
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="bg-gray-400 py-2 px-6 text-white rounded-full hover:scale-95 hover:bg-gray-800 cursor-pointer transition-all duration-200 ease-in-out"
                >
                  <ArrowUturnLeftIcon className='h-5 w-5 font-extrabold' />
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="bg-blue-500 py-2 px-6 text-white rounded-full hover:scale-95 hover:bg-blue-800 cursor-pointer transition-all duration-200 ease-in-out"
                >

                  <PaperAirplaneIcon className='h-5 w-5' />
                </button>
              </div>
            </>
          )}

          {step === 5 && diseaseType === 'cancer' && (
            <>
              <div className="flex flex-col justify-center gap-3">
                <div className="flex items-center ">
                  <ChartBarIcon className="h-0 w-0 lg:h-6 lg:w-6 mr-2 text-[#67a2e1] flex-shrink-0" />
                  <h1 className="text-3xl max-w-100 text-left font-medium">What's the <span className='font-semibold'>stage</span> of your condition?</h1>
                </div>
                <p className=" max-w-96 text-left pb-10 text-gray-500 font-light">Please select the current stage of your condition. If you're unsure, select "I Don't Know".</p>


                <button
                  type="button"
                  onClick={() => { setStage('Stage I'); handleNextStep(); }}
                  className="bg-gray-200/50 text-black h-15 max-w-100  text-lg focus:outline-none p-4 mb-3 rounded-2xl flex items-center gap-2 hover:scale-95  cursor-pointer transition-all duration-200 ease-in-out"
                >

                  Stage I
                </button>
                <button
                  type="button"
                  onClick={() => { setStage('Stage II'); handleNextStep(); }}
                  className="bg-gray-200/50 text-black h-15 max-w-100 text-lg focus:outline-none p-4 mb-3 rounded-2xl flex items-center gap-2 hover:scale-95  cursor-pointer transition-all duration-200 ease-in-out"
                >

                  Stage II
                </button>
                <button
                  type="button"
                  onClick={() => { setStage('Stage III'); handleNextStep(); }}
                  className="bg-gray-200/50 text-black h-15 max-w-100  text-lg focus:outline-none p-4 mb-3 rounded-2xl flex items-center gap-2 hover:scale-95  cursor-pointer transition-all duration-200 ease-in-out"
                >

                  Stage III
                </button>
                <button
                  type="button"
                  onClick={() => { setStage('Stage IV'); handleNextStep(); }}
                  className="bg-gray-200/50 text-black h-15 max-w-100 text-lg focus:outline-none p-4 mb-3 rounded-2xl flex items-center gap-2 hover:scale-95  cursor-pointer transition-all duration-200 ease-in-out"
                >

                  Stage IV
                </button>
                <button
                  type="button"
                  onClick={() => { setStage(''); handleNextStep(); }}
                  className="bg-gray-200/50 text-black h-15 max-w-100 text-lg focus:outline-none p-4 mb-3 rounded-2xl flex items-center gap-2 hover:scale-95  cursor-pointer transition-all duration-200 ease-in-out"
                >

                  I Don't Know
                </button>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="bg-gray-400 py-2 px-6 text-white rounded-full hover:scale-95 hover:bg-gray-800 cursor-pointer transition-all duration-200 ease-in-out"
                  >
                    <ArrowUturnLeftIcon className='h-5 w-5 font-extrabold' />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="bg-blue-500 py-2 px-6 text-white rounded-full hover:scale-95 hover:bg-blue-800 cursor-pointer transition-all duration-200 ease-in-out"
                  >

                    <PaperAirplaneIcon className='h-5 w-5' />
                  </button>
                </div>
              </div>
            </>
          )}

          {step === 5 && diseaseType !== 'cancer' && (
            <>{handleNextStep()}</>
          )}

          {step === 6 && diseaseType == 'cancer' && (
            <>
              <div className="flex items-center">
                <CakeIcon className="h-0 w-0 lg:h-6 lg:w-6 mr-2 text-[#67a2e1] flex-shrink-0" />
                <h1 className="text-3xl mb-2 max-w-100 text-left  font-medium mt-3">What is your <span className='font-semibold'>age</span>?</h1>
              </div>
              <p className=" mb-2 max-w-96 text-left pb-10 text-gray-500 font-light">Some trials only allow patients in a certain age group.</p>
              <input
                type="number"
                className="bg-gray-200/50 text-black h-12 focus:outline-none p-4 mb-5 rounded-2xl"
                placeholder="ex. 67 years"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="bg-gray-400 py-2 px-6 text-white rounded-full hover:scale-95 hover:bg-gray-800 cursor-pointer transition-all duration-200 ease-in-out"
                >
                  <ArrowUturnLeftIcon className='h-5 w-5 font-extrabold' />
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="bg-blue-500 py-2 px-6 text-white rounded-full hover:scale-95 hover:bg-blue-800 cursor-pointer transition-all duration-200 ease-in-out"
                >

                  <PaperAirplaneIcon className='h-5 w-5' />
                </button>
              </div>
            </>
          )}

          {step === 6 && diseaseType !== 'cancer' && (
            <>
              <div className="flex items-center">
                <CakeIcon className="h-0 w-0 lg:h-6 lg:w-6 mr-2 text-[#67a2e1] flex-shrink-0" />
                <h1 className="text-3xl mb-2 max-w-100 text-left  font-medium mt-3">What is your <span className='font-semibold'>age</span>?</h1>
              </div>
              <p className=" mb-2 max-w-96 text-left pb-10 text-gray-500 font-light">Some trials only allow patients in a certain age group.</p>
              <input
                type="number"
                className="bg-gray-200/50 text-black h-12 focus:outline-none p-4 mb-5 rounded-2xl"
                placeholder="ex. 67 years"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handlePrevExtraStep}
                  className="bg-gray-400 py-2 px-6 text-white rounded-full hover:scale-95 hover:bg-gray-800 cursor-pointer transition-all duration-200 ease-in-out"
                >
                  <ArrowUturnLeftIcon className='h-5 w-5 font-extrabold' />
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="bg-blue-500 py-2 px-6 text-white rounded-full hover:scale-95 hover:bg-blue-800 cursor-pointer transition-all duration-200 ease-in-out"
                >

                  <PaperAirplaneIcon className='h-5 w-5' />
                </button>
              </div>
            </>
          )}

          {step === 7 && (
            <>
              <div className="flex items-center">
                <EnvelopeIcon className="h-0 w-0 lg:h-6 lg:w-6 mr-2 text-[#67a2e1] flex-shrink-0" />
                <h1 className="text-3xl mb-2 max-w-100 text-left  font-medium mt-3">What is your <span className='font-semibold'>email</span>? (optional)</h1>
              </div>
              <p className=" mb-2 max-w-96 text-left pb-10 text-gray-500 font-light">We value your privacy and promise never to spam you. By providing your email, you will receive updates and opportunities to participate in clinical trials that are right for you. Feel free to leave this blank if you don't want to share your email.</p>
              
              <input
                type="text"
                className="bg-gray-200/50 text-black h-12 focus:outline-none p-4 mb-5 rounded-2xl"
                placeholder="johndoe@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="bg-gray-400 py-2 px-6 text-white rounded-full hover:scale-95 hover:bg-gray-800 cursor-pointer transition-all duration-200 ease-in-out"
                >
                  <ArrowUturnLeftIcon className='h-5 w-5 font-extrabold' />
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="bg-blue-500 py-2 px-6 text-white rounded-full hover:scale-95 hover:bg-blue-800 cursor-pointer transition-all duration-200 ease-in-out"
                >

                  <PaperAirplaneIcon className='h-5 w-5' />
                </button>
              </div>
            </>
          )}

          {step === 8 && diseaseType == 'cancer' && (
            <>
              <div className="flex items-center">
                <DocumentTextIcon className="h-0 w-0 lg:h-6 lg:w-6 mr-2 text-[#67a2e1] flex-shrink-0" />
                <h1 className="text-xl md:text-2xl mb-2 max-w-100 text-left  font-medium mt-3">Enter your  <span className='font-semibold'>Medical Summary</span>.</h1>

              </div>
              <p className="max-w-100 text-xs md:text-sm text-left pb-10 text-gray-500 font-light">It would be helpful to copy & paste your doctor's note, your MyChart Medical Summary, or request a medical summary from your physician. Please feel to include as much or as little information as you feel comfortable. The more information you include, the better the match we can make. Information can be copy-pasted into this textbox.

                Details to include in your summary (It is perfectly normal if you do not know a certain detail):
                <br></br>
                <br></br>
                Where did your cancer originate?

                What is the cancer's cell type? (this info can be found in your pathology report)

                If your tumor is solid, what is its size and location(s)?

                Have you had cancer before, and if so, where?

                What is your current ECOG score?

                Have you had previous treatments for your condition?

                What are your bone marrow function test results? (White Blood Cell, Platelet Count, Hemoglobin/Hematocrit)

                What are your liver function test results? (Bilirubin, Transaminases)

                What are your renal function test results? (Serum Creatinine)

              </p>
              <div className="flex flex-col md:flex-row gap-4">

                <textarea
                  className="bg-gray-200/50 text-black h-72 md:h-64 md:text-sm focus:outline-none mb-5 p-4 text-xs resize-none rounded-2xl flex-grow"
                  placeholder="Enter your Medical Summary..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                ></textarea>

              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="bg-gray-400 py-2 px-6 text-white rounded-full hover:scale-95 hover:bg-gray-800 cursor-pointer transition-all duration-200 ease-in-out"
                >
                  <ArrowUturnLeftIcon className='h-5 w-5 font-extrabold' />
                </button>
                <button
                  type="submit"

                  className="bg-blue-500 py-2 px-6 text-white rounded-full hover:scale-95 hover:bg-blue-800 cursor-pointer transition-all duration-200 ease-in-out"
                >

                  Submit
                </button>
              </div>
            </>
          )}

          {step === 8 && diseaseType != 'cancer' && (
            <>
              <div className="flex items-center">
                <DocumentTextIcon className="h-0 w-0 lg:h-6 lg:w-6 mr-2 text-[#67a2e1] flex-shrink-0" />
                <h1 className="text-xl md:text-2xl mb-2 max-w-100 text-left  font-medium mt-3">Enter your  <span className='font-semibold'>Medical Summary</span>.</h1>

              </div>
              <p className="max-w-100 text-xs md:text-sm text-left pb-10 text-gray-500 font-light">It would be helpful to copy & paste your doctor's note, your MyChart Medical Summary, or request a medical summary from your physician.

                Please feel to include as much or as little information as you feel comfortable. The more information you include, the better the match we can make. Information can be copy-pasted into this textbox, or uploaded to the next question.

                Details to include in your summary (It is perfectly normal if you do not know a certain detail):

                <br></br>
                <br></br>
                Current and past symptoms of the disease/condition?

                When were you diagnosed with your disease/condition and when did symptoms start?

                What mutation(s) or chromosomal abnormalities have caused your disease and what type of mutation/abnormalities?

                What treatment(s) have you been given so far to manage your treatment (Corticosteroids, Beta-blockers, gene therapy, cell therapy, surgery, etc.)?

                Clinical features of your disease/condition (Muscle weakness, recurring infections, difficulty eating, infertility, easy bruising, etc.)?

                Do you have any active infections, tumors (also include past tumors), other illnesses besides the one that you're trying to get treatment?

                Projected life expectancy?

                Is your family trying to actively have a child?

              </p>
              <div className="flex flex-col md:flex-row gap-4">

                <textarea
                  className="bg-gray-200/50 text-black h-72 md:h-64 md:text-sm focus:outline-none mb-5 p-4 text-xs resize-none rounded-2xl flex-grow"
                  placeholder="Enter your Medical Summary..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                ></textarea>

              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="bg-gray-400 py-2 px-6 text-white rounded-full hover:scale-95 hover:bg-gray-800 cursor-pointer transition-all duration-200 ease-in-out"
                >
                  <ArrowUturnLeftIcon className='h-5 w-5 font-extrabold' />
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 py-2 px-6 text-white rounded-full hover:scale-95 hover:bg-blue-800 cursor-pointer transition-all duration-200 ease-in-out"
                >

                  Submit
                </button>
              </div>
            </>
          )}
        </div>
      </form >
    </div >
  );
};

export default InputChat;
