import Link from "next/link";
import Image from "next/image";
import heroImage from "../assets/hero.jpg";
import WortheatIMG from "../assets/NoBG.svg";

export default function Page() {
  return (
    <>
    <div className="relative h-screen flex flex-col items-center justify-center text-center px-4">
      <Image
        src={heroImage}
        alt="Background"
        layout="fill"
        objectFit="cover"
        quality={100}
        priority
        className="-z-10"
      />
      <div>
        <Image src={WortheatIMG} alt="worthEAT_img" className="h-16 mt-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-black max-w-[90%] sm:max-w-[70%]">
        Order Food and Get it Delivered at Your
      </h1>
      <h1 className="text-4xl font-black text-black">Workplace</h1>

      <Link
        href="/onboardingcustomer/register"
        className="h-12 md:h-16 bg-[#e31836] mt-6 rounded-xl flex items-center justify-center text-3xl font-extrabold text-white px-6 hover:scale-105 duration-200"
      >
        Order Now
      </Link>
    </div>
    </>

  );
}
