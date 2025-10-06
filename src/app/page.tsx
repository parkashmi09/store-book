import Navbar from "@/app/Components/Navbar";
import Slider from "@/app/Components/Slider";
import Section from "@/app/Components/Section";
import VideoTestimonialSwiper from "@/app/Components/VideoTestimonialSwiper";
import TestimonialCarousel from "./Components/TestimonialCarousel";
import Footer from "@/app/Components/Footer";
import banner1 from "@/app/Assets/Banner-1.webp";
import banner2 from "@/app/Assets/Banner-2.webp";
import banner3 from "@/app/Assets/Banner-3.webp";
import Banner from "./Components/Banner";
import VideoSection from "./Components/VideoSection";


export default function Home() {
  return (
    <>
      <main className="bg-gray-100">
        <Navbar />
        <Slider />
        <Banner imagePath={banner1} action="/products" />
        <Section />
        <Banner imagePath={banner2} action="/products" />
        <VideoTestimonialSwiper />
     
        <VideoSection />
      
          <TestimonialCarousel />
        <Footer />
      </main>
    </>
  );
}
