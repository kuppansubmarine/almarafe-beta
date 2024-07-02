import Image from 'next/image';
import logo from '@/Images/ALMARALOGO.png'


{/* Replace this Loading Page because it shouldn't be like this! */}
const ErrorPage = () => {
  return (
    <div className="h-screen bg-gray-50 flex flex-col items-center justify-center">
    
    <Image className="h-32 w-32 sm:w-40 sm:h-40 mb-2" alt="logo" src={logo}></Image>

    <h1 className="text-black text-xl md:text-3xl p-2 font-semibold"><span className ="text-blue-500">Sorry</span>, there's been an error.</h1>
    <p className="text-gray-700">Email this problem to contact@almara.tech</p>
   </div>
   
  )
};

export default ErrorPage
