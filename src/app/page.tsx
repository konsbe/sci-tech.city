import Image from "next/image";
import { Inter } from "next/font/google";
import HomeRoute from "@/src/routes/home";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div className="body-container">
      <HomeRoute />
    </div>
  );
}
