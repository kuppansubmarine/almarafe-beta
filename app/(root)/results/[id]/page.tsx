'use client'
import { useState, useEffect } from 'react';
import { FaCheckCircle, FaMinusCircle, FaExclamationCircle, FaRegClock } from 'react-icons/fa';
import { HiOutlineUserGroup } from 'react-icons/hi';
import { FaHandHoldingMedical } from "react-icons/fa6";
import { MdOutlinePersonPinCircle } from "react-icons/md";
import { Toaster, toast } from 'react-hot-toast';
import LoadingPage from '@/components/Analyzing';
import ErrorPage from '@/components/Error';
import ViewButton from '@/components/ViewButton';
import AnalyzingPage from '@/components/Analyzing';
import NoTrialsPage from '@/components/NoTrials';
import PaginationControls from '@/components/PaginationControls';

type Props = {
  search_id: string | null
};

type Trial = {
  NCTID: string;
  briefTitle: string;
  enrollment: number;
  phase: string;
  treatment_type: string;
  pi: string;
  osu_id: string;
};

const get_results = async (searchID: String) => {
  try {
    const response = await fetch('https://almarabeta.azurewebsites.net/api/results', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
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


const Trials = ({ params, searchParams }: { params: { id: string }, searchParams: { [key: string]: string | string[] | undefined }}) => {

  const [treatmentType, setTreatmentType] = useState('');
  const [phaseNum, setPhaseNum] = useState('');
  const [data, setData] = useState<Trial[] | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const { id: search_id } = params;
  const page = searchParams['page'] ?? '1'
  const per_page = searchParams['per_page'] ?? '10'

  const start = (Number(page) - 1) * Number(per_page)
  const end = start + Number(per_page)

  const handlePhaseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPhaseNum(e.target.value);
  };

  const handleTreatmentTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTreatmentType(e.target.value);
  };
  
  useEffect(() => {
    const fetchData = async () => {
      if (search_id) {
        try {
          const result = await get_results(search_id);
          if (result.status === 'processing') {
            setProcessing(true);
          } else if (result.status == 'ready') {
            setData(result.data);
            setProcessing(false);
          } else {
            throw new Error('Unknown status');
          }
        } catch (err) {
          setError('Error fetching results!');
        }
      } else {
        setError('Invalid search parameters!');
      }
    };

    fetchData();
  }, [search_id]);

  if (error) {
    return <ErrorPage />;
  }

  if (processing) {
    return (
      <>
        <AnalyzingPage />
      </>
    );
  }

  if (data && data.length === 0) {
    return <NoTrialsPage />;
  }

  const trials = data?.slice(start, end) || [];

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 p-4">
      <h1 className="text-3xl text-black-500 font-semibold mt-5 mb-2">Your Results</h1>
      <h3 className='mb-3'> We have found <span className='font-bold'>{data?.length}</span> clinical trials. </h3>
      <p className='mb-6 text-sm px-10 text-center text-slate-500'>Disclaimer: These trials are ranked by relevancy. Subsequent pages may include less relevant trials.</p>
      <Toaster position='top-right' />

      <div className="border-2 bg-white rounded-sm p-10 w-full max-w-3xl mb-6 relative">
        <h2 className="text-xl font-semibold mb-1">Filter</h2>
        <label className="block text-lg mb-2 font-medium">Phase</label>
        <select
          className="bg-gray-200/50 text-black h-10 focus:outline-none p-2 rounded-2xl text-sm mb-4"
          value={phaseNum}
          onChange={(e) => setPhaseNum(e.target.value)}>

          <option value="">All</option>
          <option value="I">I</option>
          <option value="II">II</option>
          <option value="III">III</option>
          <option value="II/III">IV</option>
          <option value="I/II">I/II</option>
          <option value="II/III">II/III</option>
          <option value="II/III">III/IV</option>
        </select>

        <label className="block text-lg mb-2 font-medium">Treatment Type</label>
        <select
          className="bg-gray-200/50 text-black h-10 focus:outline-none p-2 rounded-2xl text-sm mb-4"
          value={treatmentType}
          onChange={(e) => setTreatmentType(e.target.value)}>

          <option value="">All</option>
          <option value="Treatment">Treatment</option>
          <option value="Screening">Screening</option>
          <option value="Prevention">Prevention</option>
          <option value="Diagnostic">Diagnostic</option>
          <option value="Supportive Care">Supportive Care</option>
          <option value="Health Services Research">Health Services Research</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {trials.map((trial) => (
        <div key={trial.NCTID} className="border-2 bg-white rounded-sm p-10 w-full max-w-3xl mb-6 relative">
          <h2 className="text-xl font-semibold mb-1">{trial?.osu_id}</h2>
          <p className="mb-4 text-sm text-gray-600 ">{trial.briefTitle}</p>

          <div className="flex items-center mb-4 ">
            <div className="rounded-md px-2 py-1 flex mr-3 items-center bg-pink-200 ">
              <FaRegClock className="mr-1 text-[0.63rem] md:text-[0.75rem] text-orange-800" />
              <span className="text-pink-800 text-[0.63rem] md:text-sm">Phase: {trial.phase}</span>
            </div>

            <div className="rounded-md px-2 py-1 flex mr-3 items-center bg-blue-200 truncate">
              <FaHandHoldingMedical className="mr-1 text-[0.63rem] md:text-[0.75rem] text-blue-900 flex-shrink-0" />
              <span className="text-blue-900 text-[0.63rem] md:text-sm text-ellipsis overflow-hidden">Type: {trial.treatment_type}</span>
            </div>
          </div>

          <div className="flex items-center mb-9">
            <div className="rounded-md px-2 py-1 flex mr-3 items-center bg-yellow-200">
              <HiOutlineUserGroup className="mr-1 text-yellow-800 text-[0.63rem] md:text-[0.9rem]" />
              <span className="text-yellow-800 text-[0.63rem] md:text-sm">Enrollment: {trial.enrollment}</span>
            </div>
            <div className="rounded-md px-2 py-1 flex items-center bg-purple-200">
              <MdOutlinePersonPinCircle className="mr-1 text-[0.8rem] md:text-[1.2rem] text-purple-900" />
              <span className="text-purple-900 text-[0.63rem] md:text-sm">PI: {trial.pi}</span>
            </div>
          </div>
          <div className="absolute bottom-5 right-4">
            <ViewButton NCTID={trial.NCTID} />
          </div>
        </div>
      ))}
      <div className='mb-7'>
        <PaginationControls hasNextPage={end < (data ?? []).length} hasPrevPage={start > 0} searchID={search_id} dataLength={(data ?? []).length} />
      </div>
    </div>
  );
};

export default Trials;
