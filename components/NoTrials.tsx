import Image from 'next/image';
import logo from '@/Images/ALMARALOGO.png'




const NoTrialsPage = () => {
  return (
    <div className="h-screen bg-gray-50 flex flex-col items-center justify-center">
    
    <Image className="h-32 w-32 sm:w-40 sm:h-40 mb-2" alt="logo" src={logo}></Image>

    <h1 className="text-black text-xl md:text-3xl p-2 font-semibold"><span className ="text-blue-500">Sorry</span>, no trials found.</h1>
    <p className="text-gray-700">If you filtered, then refresh the page to view original results</p>
   </div>
   
  )
};

export default NoTrialsPage

