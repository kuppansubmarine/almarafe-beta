
import { QuestionMarkCircleIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon, DocumentTextIcon, BeakerIcon, HeartIcon, ExclamationTriangleIcon, MinusCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import ErrorPage from '@/components/Error';
import LoadingPage from '@/components/Analyzing';
import PrintButton from '@/components/PrintButton'



type Reasonings = {
  criteria: string;
  reasoning: string;
  status: string;
};

type Trial = {
  NCTID: string;
  phase: string;
  briefTitle: string;
  briefSummary: string;
  relevance_message: string;
  inclusion_criteria: Reasonings[];
  exclusion_criteria: Reasonings[];
};

const get_results = async (searchID: string, NCTID: string) => {
  try {
    const response = await fetch('api/get_trialInfo', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': 'true',
      },
      body: JSON.stringify({
        search_id: searchID,
        trial_id: NCTID
      }),
    });

    if (response.status === 200) {
      const data = await response.json();
      return { status: 'ready', data }; // Return the successful response data
    } else if (response.status === 202) {
      return { status: 'processing' }; // Indicate that results are still processing
    } else {
      const data = await response.json();
      throw new Error(data[0].error);
    }
  } catch (error) {
    console.error('Error fetching results:', error);
    throw error; // Re-throw the error to be handled by the calling function
  }
};

const TrialPage = async ({ params }: { params: { id: string; nctid: string } }) => {
  const { id: search_id, nctid } = params;

  let trial: Trial | null = null;
  let processing = false;
  let error = '';

  try {
    if (search_id && nctid) {
      const result = await get_results(search_id, nctid);
      if (result.status === 'processing') {
        processing = true;
      } else {
        trial = result.data;
      }
    } else {
      error = 'Invalid search parameters!';
    }
  } catch (err) {
    error = 'Error fetching results!';
  } finally {
    if (processing) {
      return <LoadingPage />;
    }

    if (error) {
      return <ErrorPage />;
    }

    if (!trial) {
      return <div className='bg-gray-100 h-screen text-black p-5'>No results found!</div>;
    }

    const studyLink = `https://clinicaltrials.gov/study/${trial.NCTID}`;

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex items-start justify-center">

      <div className="p-10  rounded-lg max-w-6xl w-full">

        <h1 className="font-bold text-4xl md:text-6xl mb-6">{trial?.NCTID}</h1>
        <hr className="border-gray-200 mb-10 border-2"></hr>
        <div className="rounded-md px-3 py-2 inline-flex mr-3 mb-8 items-center ">
          <BeakerIcon className="mr-1 h-10 w-10 text-purple-800" />
          <span className="text-purple-800 font-bold text-2xl"> Trial Overview</span>
        </div>
        <div className="mb-10">
          <p className="text-black md:text-xl  mb-2 font-semibold">{trial?.phase}</p>
          <p className="text-gray-900 mt-3 max-w-2xl font:md:text-xl">{trial?.briefTitle}</p>
        </div>

        <p className="md:text-xl font-semibold">Summary</p>
        <div className="flex items-center mb-10 max-w-2xl">
          <p className="mt-3 text-gray-900"> {trial?.briefSummary}</p>
        </div>
        <p className="md:text-xl font-semibold">Relevancy</p>
        <div className="flex items-center  max-w-2xl">
          <p className="mt-3  mb-10 text-gray-900"> {trial?.relevance_message}</p>

        </div>

        <hr className="border-gray-200 border-2"></hr>
        <div className="rounded-md mt-10 px-3 py-2 mb-8 inline-flex mr-3 items-center">
          <DocumentTextIcon className="mr-1 h-10 w-10 text-pink-800" />
          <span className="text-pink-800 text-2xl font-bold">Our Pre-Screening</span>
        </div>
        <h3 className="text-xl  font-semibold mb-3">Inclusion</h3>
        <ul className="list-disc list-inside space-y-2">
          {trial?.inclusion_criteria.map((criteria, index) => (
            <li key={index} className="flex flex-col">
              <div className="flex items-center">
                {criteria.status == 'included' ? <CheckCircleIcon className="h-6 w-6 mr-2 text-green-700 flex-shrink-0" /> : criteria.status == 'likely included' ? <CheckCircleIcon className="h-6 w-6 text-[#a0cb8f] mr-2 flex-shrink-0" /> : criteria.status == 'not enough information' ? <ExclamationCircleIcon className="h-6 w-6 mr-2 text-yellow-500 flex-shrink-0" /> : criteria.status == 'not applicable' ? <MinusCircleIcon className="h-6 w-6 text-slate-700 mr-2 flex-shrink-0" /> : criteria.status == 'not included' ? <XCircleIcon className="h-6 w-6 mr-2 text-red-700 flex-shrink-0" /> : <QuestionMarkCircleIcon className="h-6 w-6 text-black mr-2 flex-shrink-0" />}
                <span className='md:max-w-3xl py-3'>
                  {criteria.criteria} <span className='font-bold bg-slate-200 p-1 rounded-md '>{criteria.status}</span>
                </span>
              </div>
              <span className="md:max-w-3xl mt-2 ml-8 text-sm bg-blue-100 p-2 rounded-xl text-blue-900">
                <strong className='font-bold'>Almara</strong>: {criteria.reasoning}
              </span>
            </li>
          ))}
        </ul>



        <h3 className="text-xl font-semibold mt-10 mb-3">Exclusion</h3>
        <ul className="list-disc list-inside space-y-2">
          {trial?.exclusion_criteria && trial.exclusion_criteria.length > 0 ? (
            trial?.exclusion_criteria.map((criteria, index) => (
              <li key={index} className="flex flex-col">
                <div className="flex items-center">
                  {criteria.status == 'not excluded' ? <CheckCircleIcon className="h-6 w-6 mr-2 text-green-700 flex-shrink-0" /> : criteria.status == 'potentially excluded' ? <XCircleIcon className="h-6 w-6 text-red-400 mr-2 flex-shrink-0" /> : criteria.status == 'not enough information' ? <ExclamationCircleIcon className="h-6 w-6 mr-2 text-yellow-500 flex-shrink-0" /> : criteria.status == 'excluded' ? <XCircleIcon className="h-6 w-6 text-red-700 mr-2 flex-shrink-0" /> : criteria.status == 'not applicable' ? <MinusCircleIcon className="h-6 w-6 text-slate-700 mr-2 flex-shrink-0" />: criteria.status == 'not mentioned' ? <CheckCircleIcon className="h-6 w-6 text-[#a0cb8f] mr-2 flex-shrink-0" /> : <QuestionMarkCircleIcon className="h-6 w-6 text-black mr-2 flex-shrink-0" />}
                  <span className='md:max-w-3xl py-3'>
                    {criteria.criteria} <span className='font-bold bg-slate-200 p-1 rounded-md'>{criteria.status}</span>
                  </span>
                </div>
                <span className="md:max-w-3xl mt-2 ml-8 text-sm bg-blue-100 p-2 rounded-xl text-blue-900">
                  <strong className='font-bold'>Almara</strong>: {criteria.reasoning}
                </span>
              </li>
            ))
          ) : (
            <div className="flex items-center">
              <CheckCircleIcon className="h-6 w-6 mr-2 text-green-700 flex-shrink-0" />
              <li className='flex flex-col'>No exclusion criteria for this trial</li>
            </div>
          )
          }
        </ul>

        <hr className="border-gray-200 mt-10 mb-10 border-2"></hr>
        <div className="rounded-md px-3 py-2 inline-flex mr-3 mb-8 items-center0">
          <HeartIcon className="mr-1 h-10 w-10 text-blue-800" />
          <span className="text-blue-800 font-bold text-2xl">Interested in this Trial?</span>
        </div>
        <div className="mb-10">
          <p className="text-black md:text-xl  mb-2 font-semibold">View Additional info</p>
          <p className="text-gray-900 mt-3 max-w-2xl mb-3 font:md:text-xl">Please click on the link to clinicaltrials.gov to view all locations, contacts, and any other information on this clinical trial. </p>
          <a className="text-blue-600 md:text-lg text-clip hover:text-blue-800  cursor-pointer font-semibold transition-all duration-200 ease-in-out" href={studyLink} target="_blank" rel="noopener noreferrer">
            View Here
          </a>
        </div>

        <p className="md:text-xl font-semibold">Email your Doctor</p>
        <div className="flex items-center mb-3 max-w-2xl">
          <p className="mt-3 text-gray-900"> Email this trial breakdown to your physician, or print it out and bring it to your next appointment. Inform your doctor that you have been matched with this clinical trial and would appreciate their input on participating in it.</p>
        </div>
        <PrintButton/>
        <p className="md:text-xl font-semibold">Contact Us</p>
        <div className="flex items-center  max-w-2xl">
          <p className="mt-3  mb-10 text-gray-900">Please reach out to us if you have any questions! We are always willing to help.
            <br /><span className='font-semibold text-black'>+1 440-502-0412
              <br />contact@almara.tech</span></p>

        </div>

      </div>


    </div>

  );
};
}
export default TrialPage;
