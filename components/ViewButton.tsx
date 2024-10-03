
'use client';

import { useRouter } from 'next/navigation';

interface ViewButtonProps {
  NCTID: string;
}

const ViewButton: React.FC<ViewButtonProps> = ({ NCTID }) => {
  const router = useRouter();

  const handleViewTrial = () => {
    router.push(`/trials/${NCTID}`);
  };

  return (
    <button
      className="bg-[#ba0c2f]  hover:scale-90 hover:bg-[#70071c] cursor-pointer transition-all duration-200 ease-in-out text-white font-semibold py-2 px-3 text-sm md:text-[15px] rounded-md focus:outline-none"
      onClick={handleViewTrial}
    >
      View
    </button>
  );
};

export default ViewButton;
