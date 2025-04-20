import Navbar from "@/app/Components/Navbar";
import Footer from "@/app/Components/Footer";
import Products from "@/app/product/category/[slug]/Products";

const Page = () => {

    return(<>
        <Navbar/>
        <Products/>
        <Footer/>
     </>)
}
export default Page;
