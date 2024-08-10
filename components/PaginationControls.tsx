'use client'

import { FC } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface PaginationControlsProps {
    hasNextPage: boolean
    hasPrevPage: boolean
    searchID: string
    dataLength: number
}

const PaginationControls: FC<PaginationControlsProps> = (
    {
        hasNextPage,
        hasPrevPage,
        searchID,
        dataLength
    }
) => {
    const router = useRouter()
    const searchParams = useSearchParams()

    const page = searchParams.get('page') ?? '1'
    const per_page = searchParams.get('per_page') ?? '10'

    return (
        <div className="flex items-center justify-center gap-12">
            <button
                className={`bg-[#dfe3e5] rounded-lg transition-all duration-200 text-black px-3  mb-10 py-2 ${!hasPrevPage ? 'cursor-not-allowed opacity-15' : 'hover:bg-slate-300'}`}
                disabled={!hasPrevPage}
                onClick={() => {
                    if (hasPrevPage) {
                        router.push(`/results/${searchID}/?page=${Number(page) - 1}&per_page=${per_page}`);
                    }
                }}
            >
                Back
            </button>

            <div className="text-center text-lg mb-10 font-semibold">
                {page} / {Math.ceil(dataLength / Number(per_page))}
            </div>

            <button
                className={`bg-[#ba0c2f] text-white px-3 py-2 transition-all duration-200 mb-10 rounded-lg ${!hasNextPage ? 'cursor-not-allowed opacity-25' : 'hover:bg-[#70071c]'}`}
                disabled={!hasNextPage}
                onClick={() => {
                    if (hasNextPage) {
                        router.push(`/results/${searchID}/?page=${Number(page) + 1}&per_page=${per_page}`);
                    }
                }}
            >
                Next
            </button>
        </div>
    );
};



export default PaginationControls;