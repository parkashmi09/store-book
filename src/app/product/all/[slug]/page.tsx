import Products from "@/app/product/all/[slug]/Products";
import Navbar from "@/app/Components/Navbar";
import Footer from "@/app/Components/Footer";

const Page = () => {

    return(<>
        <Navbar/>
        <Products/>
        <Footer/>
     </>)
}
export default Page;
