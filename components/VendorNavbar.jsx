"use client";
import {  useRouter } from "next/navigation";
import React from "react";
import Image from "next/image";
import Logo from ".././assets/dabbaXpress-logo-black.png"
import { LogOut } from "lucide-react";
const VendorNavbar = () => {
  const router = useRouter();

  const handleLogOut = ()=>{
      localStorage.removeItem("vendorSession");
      router.push("/onboardingvendor/login");
  }
  return (
    <div className="flex justify-between gap-x-5 shadow-xl pb-2">
        <Image src={Logo} alt="Logo" className="w-[150px] ml-16"/>
        <p
                onClick={() => handleLogOut()}
                className="justify-start flex cursor-pointer duration-200 mt-8 mr-10"
              >
                <LogOut  className="mr-3 "/>
                Log out
              </p>
    </div>
  );
};

export default VendorNavbar;
