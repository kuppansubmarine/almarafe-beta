import Image from 'next/image';
import logo from '@/Images/ALMARALOGO.png'




const AnalyzingPage = () => {

  
  return (
    <div className="h-screen bg-gray-50 flex flex-col items-center justify-center">
    
    <Image className="h-30 w-30 sm:w-40 sm:h-40 mb-3" alt="logo" src={logo}></Image>
    <h1 className='mb-1 text-2xl text-gray-500 font-medium'>Analyzing...</h1>
    <p className='mb-10  text-gray-400 font-medium'>Estimated time: 5-10 minutes</p>

   <div className="loader"></div>
   </div>
   
  )
};

export default AnalyzingPage;
