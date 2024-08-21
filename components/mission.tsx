import React from "react";
import Image from "next/image";
import missionImage from "@/Images/AlmaraTeam.jpeg";

const mission = () => {
  return (
    <div className="flex flex-col items-center bg-transparent p-8 mb-12">
      <h1 className="text-3xl font-bold text-center mb-10">Our Mission</h1>
      <Image
        src={missionImage}
        alt="Almara Team"
        width={400}
        height={400}
        className="mb-10"
      />
      <p className="text-lg text-center">
        Almara is a group of undergraduate students from the Ohio State
        University looking to transform clinical trials with a groundbreaking
        platform. The focus is on connecting patients with clinical trials
        while taking care to address healthcare disparities, especially in
        underprivileged communities.
      </p>
    </div>
  );
};

export default mission;
