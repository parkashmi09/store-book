import Navbar from "@/app/Components/Navbar";
import Slider from "@/app/Components/Slider";
import Section from "@/app/Components/Section";
import VideoTestimonialSwiper from "@/app/Components/VideoTestimonialSwiper";
import TestimonialCarousel from "./Components/TestimonialCarousel";
import Footer from "@/app/Components/Footer";


export default function Home() {

  return (
    <>
      <main className="bg-gray-100">
        <Navbar />
        <Slider />

        <Section />
        <VideoTestimonialSwiper />
        <TestimonialCarousel />
        <Footer />
      </main>
    </>
  );
}
