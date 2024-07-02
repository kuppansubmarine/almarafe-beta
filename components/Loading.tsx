import Image from 'next/image';
import logo from '@/Images/ALMARALOGO.png'




const LoadingPage = () => {

  
  return (
    <div className="h-screen bg-gray-50 flex flex-col items-center justify-center">
    
    <Image className="h-30 w-30 sm:w-40 sm:h-40 mb-3" alt="logo" src={logo}></Image>

  
   <div className="loader"></div>
   </div>
   
  )
};

export default LoadingPage
