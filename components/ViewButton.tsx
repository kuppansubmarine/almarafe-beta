
'use client';

import { useRouter } from 'next/navigation';

interface ViewButtonProps {
  search_ID: string;
  NCTID: string;
}

const ViewButton: React.FC<ViewButtonProps> = ({ search_ID, NCTID }) => {
  const router = useRouter();

  const handleViewTrial = () => {
    router.push(`/trials/${search_ID}/${NCTID}`);
  };

  return (
    <button
      className="bg-blue-500 hover:scale-90 hover:bg-blue-800 cursor-pointer transition-all duration-200 ease-in-out text-white font-semibold py-2 px-4 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500"
      onClick={handleViewTrial}
    >
      View
    </button>
  );
};

export default ViewButton;
