"use client"
import React, { useState } from "react";
import SelectionCard from "./SelectionCard";
import UserIcon from "../assets/UserIcon.png"
import { useRouter } from "next/navigation";
import Image from "next/image";
import Logo from ".././assets/dabbaXpress-logo-black.png"

const OptionModal = () => {
  const [selectedText, setSelectedText] = useState("");
  const router = useRouter()

  const handleCardClick = (text) => {
    setSelectedText(text);
  };

  const handleNavigationLogin = () => {
        router.replace("/onboardingcustomer/login")
  }
  const handleNavigationRegistration = () => {
        router.replace("/onboardingcustomer/register")
  }
  
  return (
    <div className="flex justify-center items-center md:min-h-screen bg-white my-3 mx-5 md:mx-3 overflow-x-hidden mt-20 md:mt-0">
      <div className="border-2 border-gray-500 rounded-3xl md:p-10 md:py-10 md:max-w-3xl">
      <div className="flex justify-center"><Image src={Logo} alt="logo" className="w-[200px] mb-5"/></div>
        <div className="w-80 md:w-full">
          <SelectionCard
            image={UserIcon}
            text="Employee"
          />
        </div>

        <div className="my-5 md:mt-8 flex justify-center"> 
          <div className="flex justify-evenly">
            <button
            className="px-6 py-2 rounded-md text-white bg-green-500 border-2  border-green-500 font-medium hover:bg-white hover:text-green-500 mr-5"
            onClick={handleNavigationLogin}
          >
            Login
          </button>
            <button
            className="px-6 py-2 rounded-md  text-white bg-blue-500  border border-blue-500 font-medium hover:bg-white hover:text-blue-500"
            onClick={handleNavigationRegistration}
          >
            Register
          </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptionModal;
