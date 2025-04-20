import Navbar from "@/app/Components/Navbar";
import Footer from "@/app/Components/Footer";
// import MyBag from "@/app/bag/Components/MyBag";
import dynamic from "next/dynamic";

const MyBag = dynamic(() => import("./Components/MyBag"), { ssr: false });

const Page = () => {
  return(
      <>
            <Navbar/>
                <MyBag/>
            <Footer/>
      </>
  )
}
export default Page;
