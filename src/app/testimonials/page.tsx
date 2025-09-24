import React from 'react';
import TestimonialCarousel from '../Components/TestimonialCarousel';

const TestimonialsPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Customer Testimonials
          </h1>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
            See what our satisfied customers have to say about their book shopping experience
          </p>
        </div>
      </div>

      {/* Testimonial Carousel */}
      <TestimonialCarousel />

      {/* Additional Info Section */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Join Thousands of Happy Customers
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-4xl font-bold text-emerald-600 mb-2">10K+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-4xl font-bold text-emerald-600 mb-2">50K+</div>
              <div className="text-gray-600">Books Sold</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-4xl font-bold text-emerald-600 mb-2">4.9★</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsPage;
