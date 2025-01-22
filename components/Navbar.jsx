"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ChevronDown, LogOut } from "lucide-react";
import Image from "next/image";
import Logo from ".././assets/dabbaXpress-logo-black.png"
const Navbar = () => {
  const { customerId } = useParams();
  const [userName, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [empId, setEmpId] = useState("");
  const router = useRouter();
  useEffect(() => {
    const getUserInfo = async () => {
      if (!customerId) return;
      
      try {
        const resUserExists = await fetch(
          `/api/getUserInfo?customerId=${customerId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // Check if response is ok
        if (!resUserExists.ok) {
          toast.error(`Error: ${resUserExists.status}`);
        }

        // Handle empty response
        const text = await resUserExists.text();
        const userData = text ? JSON.parse(text) : null;

        setUsername(userData?.user.firstName + " " + userData?.user.lastName);
        setEmail(userData?.user.email);
        setEmpId(userData?.user.empId);
        // console.log(user.email)
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    getUserInfo();
  }, [customerId]); // Include customerId as dependency

  const handleLogOut = ()=>{
      localStorage.removeItem("customer");
      router.push("/onboardingcustomer/login");
  }
  return (
    <div className="flex justify-between md:gap-x-5 shadow-xl pb-2 overflow-x-hidden">
        <Image src={Logo} alt="Logo" className="w-[110px] md:w-[150px] md:ml-16"/>
      <div className="py-2 mt-6  md:mr-14 text-black flex">
        <p className=" text-[14px] md:text-lg mr-5 md:mr-10  underline decoration-orange-500 decoration-2 md:decoration-4 ">Order Lunch</p>
        {customerId && <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <p className=" text-black flex text-[14px] md:text-lg cursor-pointer duration-150 mr-5">{userName}{" "}<span><ChevronDown className="md:ml-1 size-30"/></span></p>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-24 md:w-52">
            <DropdownMenuLabel>{"Email : "+email}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="hover:bg-slate-100">
              <p
                onClick={() => handleLogOut()}
                className="justify-start flex cursor-pointer duration-200"
              >
                <LogOut  className="mr-3 "/>
                Log out
              </p>
            </DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>}
      </div>
    </div>
  );
};

export default Navbar;
