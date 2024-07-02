
import { FaCheckCircle, FaMinusCircle, FaExclamationCircle, FaRegClock } from 'react-icons/fa';
import { HiOutlineUserGroup } from 'react-icons/hi';
import { FaHandHoldingMedical } from "react-icons/fa6";
import { Toaster, toast } from 'react-hot-toast';
import LoadingPage from '@/components/Analyzing';
import ErrorPage from '@/components/Error';
import ViewButton from '@/components/ViewButton';
import AnalyzingPage from '@/components/Analyzing';




type Props = {
  search_id: string | null
};

type Trial = {
  NCTID: string;
  briefTitle: string;
  score: number;
  enrollment: number;
  phase: string;
  disease: string;
};

const get_results = async (searchID: String) => {
  try {
    const response = await fetch('api/results', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': 'true',
      },
      body: JSON.stringify({
        'search_id': searchID
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
    throw error; // Re-throw the error to be handled by the calling function
  }
};

const Trials = async ({ params }: { params: { id: string } }) => {
  const { id: search_id } = params;

  let trials: Trial[] | null = null;
  let processing = false;
  let error = '';

  try {
    if (search_id) {
      const result = await get_results(search_id);
      if (result.status === 'processing') {
        processing = true;
      } else if (result.status == 'ready') {
        trials = result.data;
        processing = false;
      } else {
        throw new Error('Unknown status');
      }
    } else {
      error = 'Invalid search parameters!';
    }
  } catch (err) {
    error = 'Error fetching results!';
  }

  if (error) {
    return <ErrorPage />;
  }

  if (processing) {
    return (
      <>
        <AnalyzingPage />
        <meta http-equiv="refresh" content="15" />
      </>
    );
  }


  return (

    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 p-4">
      <h1 className="text-3xl text-black-500 font-semibold mt-5 mb-6">Your Results</h1>
      <Toaster position='top-right' />
      {trials?.map((trial) => (
        <div key={trial.NCTID} className=" border-2 rounded-lg p-10 w-full max-w-3xl mb-6 relative">
          <h2 className="text-2xl font-bold mb-1 truncate">{trial.NCTID}</h2>
          <p className="mb-4 text-gray-600 truncate">{trial.briefTitle}</p>

          <div className="flex items-center mb-4">
            <div className={`mr-4 rounded-md px-2 py-1 flex items-center ${trial.score >= 70 ? 'bg-green-200 text-green-700' : trial.score >= 40 ? 'bg-yellow-200 text-yellow-700' : 'bg-red-200 text-red-700'}`}>
              {trial.score >= 70 ? <FaCheckCircle className="inline-block mr-1" /> : trial.score >= 40 ? <FaMinusCircle className="inline-block mr-1" /> : <FaExclamationCircle className="inline-block mr-1" />}
              <span className='text-sm whitespace-nowrap'>Match Score: {trial.score}</span>
            </div>
            <div className="rounded-md px-2 py-1 flex mr-3 items-center bg-blue-200 truncate">
              <FaHandHoldingMedical className="mr-1 text-blue-900 flex-shrink-0" />
              <span className="text-blue-900 text-sm text-ellipsis overflow-hidden">Condition: {trial.disease}</span>
            </div>
          </div>

          <div className="flex items-center mb-4 ">
            <div className="rounded-md px-2 py-1 flex mr-3 items-center bg-orange-200">
              <HiOutlineUserGroup className="mr-1 text-orange-800" />
              <span className="text-orange-800 text-sm">Enrollment: {trial.enrollment}</span>
            </div>
            <div className="rounded-md px-2 py-1 flex items-center bg-purple-200">
              <FaRegClock className="mr-1 text-purple-900" />
              <span className="text-purple-900 text-sm">Phase: {trial.phase}</span>
            </div>
          </div>
          <div className="absolute bottom-5 right-4">
           <ViewButton search_ID={search_id} NCTID={trial.NCTID} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Trials;
