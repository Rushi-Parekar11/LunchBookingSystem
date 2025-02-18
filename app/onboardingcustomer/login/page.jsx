"use client"
import LoginForm from "../../../components/LoginForm";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const customer = JSON.parse(localStorage.getItem("customer"));
    if (customer && customer.customerId) {
      router.push(`/booking/${customer.customerId}/weeklymenu`);
    }
  }, [router]);

  return (
    <main>
      <LoginForm />
    </main>
  );
}
