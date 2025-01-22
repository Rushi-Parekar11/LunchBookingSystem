"use client"
import Image from "next/image";
import React from "react";

const SelectionCard = ({ image, text}) => {
  return (
    <div
      className={` p-2 mx-5 md:mx-0 md:p-4 border rounded-lg cursor-pointer shadow-md transition md:w-[450px]`}
    >
      <div className="">
        <div className="flex justify-center">
          <Image src={image} alt={text} className="w-40 h-40 object-cover rounded-md" />
        </div>
        <p className="text-black flex justify-center mt-5 text-xl md:text-2xl font-semibold">{text}</p>
      </div>
    </div>
  );
};

export default SelectionCard;
