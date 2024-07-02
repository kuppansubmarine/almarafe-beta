'use client';

import { useCallback } from "react";

const PrintButton = () => {
    const handlePrint = useCallback(() => {
      window.print();
    }, []);
  
    return (
      <button className='text-blue-600 mb-10  md:text-lg text-clip hover:text-blue-800  cursor-pointer font-semibold transition-all duration-200 ease-in-out' onClick={handlePrint}>
        Save or Print this Trial
      </button>
    );
  };

  export default PrintButton