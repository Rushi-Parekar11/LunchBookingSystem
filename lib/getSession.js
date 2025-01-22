// import { auth } from "@/auth";
import { auth } from "../app/api/auth/[...nextauth]/auth";
import { cache } from "react";

export const getSession = cache(async () => {
  const session = await auth();
  return session;
});