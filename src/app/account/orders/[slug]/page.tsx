import Navbar from "@/app/Components/Navbar";
import Footer from "@/app/Components/Footer";
import Order from "@/app/account/orders/[slug]/Order";

const Page = () => {

    return(
        <>
            <Navbar/>
                <Order/>
            <Footer/>
        </>
    )
}
export default Page;
