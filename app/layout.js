import Footer from "@/components/Footer";
import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "WorthEat",
  description: "Book lunch at your work-place today",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster />
        {children}
        <Footer/>
      </body>
    </html>
  );
}
