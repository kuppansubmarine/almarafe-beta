import React from "react";
import Image from "next/image";
import missionImage from "@/Images/AlmaraTeam.jpeg";

const Mission = () => {
  return (
    <div className="flex flex-col items-center mt-8 p-8 mb-12 rounded-lg ">
      <h1 className="text-4xl font-semibold text-center mb-10 text-black">
        Our Mission
      </h1>
      <div className="relative w-80 h-80 mb-10 rounded-full overflow-hidden border-4 border-white shadow-lg">
        <Image
          src={missionImage}
          alt="Almara Team"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <p className="text-lg text-center max-w-4xl text-black leading-relaxed">
        Almara is a group of undergraduate students from the Ohio State
        University looking to transform clinical trials with a groundbreaking
        platform. The focus is on connecting patients with clinical trials
        while taking care to address healthcare disparities, especially in
        underprivileged communities.
      </p>
    </div>
  );
};

export default Mission;
