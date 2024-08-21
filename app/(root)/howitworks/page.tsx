import React from "react";
import { FaUserMd, FaUser, FaSearch, FaHandsHelping } from "react-icons/fa";

const HowItWorks = () => {
  return (
    <div className="w-full p-8 text-black rounded-lg shadow-lg mb-8 md:flex md:justify-between md:gap-20">
      <div className="md:w-1/2">
        <h2 className="text-3xl font-semibold text-center md:text-left mt-12 mb-8 tracking-wide">
          Choose Your Role
        </h2>
        <div className="mb-12">
          <div className="flex items-center mb-4">
            <FaUser className="text-2xl text-black mr-4" />
            <h3 className="text-2xl font-semibold">Patient Mode</h3>
          </div>
          <p className="text-lg text-black-200">
            Patients can use the service to find clinical trials that match
            their condition and demographic information, allowing them to
            explore potential treatment options tailored to their specific
            health needs.
          </p>
        </div>
        <div>
          <div className="flex items-center mb-4">
            <FaUserMd className="text-2xl text-black mr-4" />
            <h3 className="text-2xl font-semibold">Physician Mode</h3>
          </div>
          <p className="text-lg text-black-200">
            Physicians can use the service to match clinical trials based on
            desired conditions, sex, age, and other relevant criteria,
            facilitating the identification of appropriate trials for their
            patients.
          </p>
        </div>
      </div>

      <div className="md:w-1/2 mt-12">
        <h2 className="text-3xl font-semibold text-center md:text-left mb-8 tracking-wide">
          How It Works
        </h2>
        <div className="flex flex-col gap-12">
          <div className="flex items-start md:flex-row">
            <span className="text-4xl font-bold bg-white text-blue-600 rounded-full h-12 w-12 flex items-center justify-center mr-6">
              1
            </span>
            <p className="text-lg md:text-left">
              <strong>Identify Your Condition:</strong> Enter your medical
              condition and other relevant health information to begin the
              search.
            </p>
          </div>
          <div className="flex items-start md:flex-row">
            <span className="text-4xl font-bold bg-white text-blue-600 rounded-full h-12 w-12 flex items-center justify-center mr-6">
              2
            </span>
            <p className="text-lg md:text-left">
              <strong>Get Matched:</strong> Our platform uses advanced
              algorithms and Artificial Intelligence to match you with suitable
              clinical trials based on your provided information.
            </p>
          </div>
          <div className="flex items-start md:flex-row">
            <span className="text-4xl font-bold bg-white text-blue-600 rounded-full h-12 w-12 flex items-center justify-center mr-6">
              3
            </span>
            <p className="text-lg md:text-left">
              <strong>Connect with Trial Coordinators:</strong> Receive detailed
              information about matched trials and directly contact trial
              coordinators to learn more and participate.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
