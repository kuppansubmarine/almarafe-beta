
import { QuestionMarkCircleIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, SparklesIcon, ExclamationCircleIcon, InformationCircleIcon, DocumentTextIcon, BeakerIcon, HeartIcon, ExclamationTriangleIcon, MinusCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import ErrorPage from '@/components/Error';
import LoadingPage from '@/components/Analyzing';
import PrintButton from '@/components/PrintButton';



type Reasonings = {
    criteria: string;
    reasoning: string;
    status: string;
};

type Trial = {
    brief_title: string;
    title: string;
    trial_text: string;
    phase: string;
    drugs: [];
    diseases: [];
    enrollment: string;
    inclusion: string;
    exclusion: string;
    brief_summary: string;
    treatment_type: string;
    osu_id: string;
    contact_name: string;
    contact_email: string;
    contact_phone: string;
    pi: string;
    min_age: number;
    max_age: number;
    sex: string;
    NCTID: string;
};

const get_results = async (searchID: string, NCTID: string) => {
    try {
        const response = await fetch('https://almarabeta.azurewebsites.net/api/study', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
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
        if (nctid) {
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
    }

    const studyLink = `https://clinicaltrials.gov/study/${trial?.NCTID}`;
    const cleanLine = (line: string): string => {
        return line
            .replace(/^(?:\d+(\.\d+)*\.|\(i+\)|\(ii+\)|\-\s*|\([A-Za-z]+\)\s*)/, '')   // Remove leading numbers with periods, "i.", "ii.", "-", or "(any letter)" followed by whitespace
            .replace(/[\\\*\u2022]/g, '')  // Remove backslashes, asterisks, and bullet points
            .trim();
    };

    const inclusion = trial?.inclusion?.split('\n')
        .map(cleanLine)
        .filter(item => item !== '' && !item.includes('Inclusion Criteria'));

    const exclusion = trial?.exclusion?.split('\n')
        .map(cleanLine)
        .filter(item => item !== '' && !item.includes('Exclusion Criteria'));

    return (
        <>
        <div className="min-h-screen bg-gray-50 p-8 flex items-start justify-center">

            <div className="p-1 md:p-5 lg:p-8 md:bg-white md:border-2 rounded-lg max-w-6xl w-full">

                <h1 className="font-bold text-3xl md:text-4xl mb-6">{trial?.osu_id}</h1>
                <hr className="border-gray-200 mb-10 border-2"></hr>
                <div className="rounded-md px-3 py-2 inline-flex mr-3 mb-8 items-center ">
                    <BeakerIcon className="mr-1 h-10 w-10 text-purple-800" />
                    <span className="text-purple-800 font-bold text-2xl"> Trial Overview</span>
                </div>
                <div className="mb-10">
                    <p className="text-black md:text-xl  mb-2 font-semibold"> Phase {trial?.phase}</p>
                    <p className="text-gray-900 mt-3 max-w-2xl font:md:text-xl">{trial?.title}</p>
                </div>

                <p className="md:text-xl font-semibold">Summary</p>
                <div className="flex items-center mb-10 max-w-2xl">
                    <p className="mt-3 text-gray-900"> {trial?.brief_summary}</p>
                </div>


                <hr className="border-gray-200 border-2"></hr>
                <div className="rounded-md mt-10 px-3 py-2 mb-8 inline-flex mr-3 items-center">
                    <DocumentTextIcon className="mr-1 h-10 w-10 text-pink-800" />
                    <span className="text-pink-800 text-2xl font-bold">Eligibility</span>
                </div>
                <h3 className="text-xl  font-semibold mb-3">Inclusion</h3>
                <ul className="list-none space-y-2">
                    {inclusion?.map((item, index) =>
                        <li className="flex items-center py-3 md:max-w-2xl" key={index}>
                            <span className="bullet-point"></span>
                            <span className="ml-2 text-sm">{item}</span>
                        </li>
                    )}
                </ul>




                <h3 className="text-xl font-semibold mt-10 mb-3">Exclusion</h3>
                <ul className="list-none space-y-2">
                    {exclusion?.map((item, index) =>
                        <li className="flex items-center py-3 md:max-w-2xl" key={index}>
                            <span className="bullet-point"></span>
                            <span className="ml-2  text-sm">{item}</span>
                        </li>
                    )}
                </ul>


                <hr className="border-gray-200 mt-10 mb-10 border-2"></hr>
                <div className="rounded-md px-3 py-2 inline-flex mr-3 mb-8 items-center0">
                    <HeartIcon className="mr-1 h-10 w-10 text-blue-800" />
                    <span className="text-blue-800 font-bold text-2xl">Interested in this Trial?</span>
                </div>

                <p className="md:text-xl font-semibold">Contact Information</p>
                <div className="flex items-center  max-w-2xl">
                    <p className="mt-3  mb-10 text-gray-900">Please email or call these contacts if you want to participate in this trial.
                        <br />
                        <br /><span className='text-black'>Contact Name: <span className='font-semibold'>{trial?.contact_name}</span>
                            <br />Contact Email:  <span className='font-semibold'>{trial?.contact_email}</span>
                            <br />Contact Phone: <span className='font-semibold'>{trial?.contact_phone}</span>
                            <br />PI Name: <span className='font-semibold'>{trial?.pi}</span>

                        </span></p>

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
                <PrintButton />
                <p className="md:text-xl font-semibold">Having issues?</p>
                <div className="flex items-center  max-w-2xl">
                    <p className="mt-3  mb-10 text-gray-900">Please reach out to us if you have any questions! We are always willing to help.
                        <br /><span className='font-semibold text-black'>
                            contact@almara.tech</span></p>

                </div>

            </div>


        </div>
        </>

    );
};

export default TrialPage;
