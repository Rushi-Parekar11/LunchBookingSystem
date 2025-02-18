"use client";
import { useParams, usePathname, useRouter } from "next/navigation";
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
import WortheatIMG from "../assets/NoBG.svg";

const Navbar = () => {
  const { customerId } = useParams();
  const router = useRouter();
  const pathname = usePathname(); // Get current route

  const [userName, setUsername] = useState("");
  const [email, setEmail] = useState("");

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

        if (!resUserExists.ok) {
          toast.error(`Error: ${resUserExists.status}`);
        }

        const text = await resUserExists.text();
        const userData = text ? JSON.parse(text) : null;

        setUsername(userData?.user.firstName + " " + userData?.user.lastName);
        setEmail(userData?.user.email);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    getUserInfo();
  }, [customerId]);

  const handleLogOut = () => {
    localStorage.removeItem("customer");
    router.push("/onboardingcustomer/login");
  };

  const handleNavigation = (route) => {
    if(route === "myOrders" ){
      router.push(`/${route}/${customerId}`);
      return;
    }
    router.push(`${route}`);
  };

  return (
    <div className="flex justify-between md:gap-x-5 shadow-xl pb-2 overflow-x-hidden">
      <Image
        src={WortheatIMG}
        alt="Logo"
        className="w-[110px] md:w-[150px] md:ml-16 mt-2"
      />
      <div className="py-2 mt-6 md:mr-14 text-black flex">
        {["breakfast", "snacks", "weeklymenu", "myOrders"].map((route) => (
          <button
            key={route}
            className={`text-[14px] md:text-lg mr-5 md:mr-10 cursor-pointer mb-2  ${
              pathname.includes(route) ? "bg-orange-500 text-white p-1 rounded-lg" : ""
            }`}
            onClick={() => handleNavigation(route)}
          >
            {route.charAt(0).toUpperCase() + route.slice(1)}
          </button>
        ))}
        {customerId && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <p className="text-black flex text-[14px] md:text-lg cursor-pointer duration-150 mr-5">
                {userName} <ChevronDown className="md:ml-1 size-30" />
              </p>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-24 md:w-52">
              <DropdownMenuLabel>{"Email : " + email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="hover:bg-slate-100">
                <p
                  onClick={handleLogOut}
                  className="justify-start flex cursor-pointer duration-200"
                >
                  <LogOut className="mr-3" />
                  Log out
                </p>
              </DropdownMenuLabel>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

export default Navbar;
