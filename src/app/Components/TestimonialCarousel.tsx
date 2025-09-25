"use client";

import React, { useState, useEffect } from "react";

// TypeScript interface for API testimonial data
interface ApiTestimonial {
  _id: string;
  title: string;
  desc: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// TypeScript interface for testimonial data
interface Testimonial {
  id: string;
  title: string;
  desc: string;
  image: string;
}

interface TestimonialData {
  data: Testimonial[];
}

interface TestimonialCarouselProps {
  data?: TestimonialData;
}

// Empty array - will be populated from API
const sampleTestimonials: Testimonial[] = [];

const TestimonialCarousel: React.FC<TestimonialCarouselProps> = ({ data }) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(sampleTestimonials);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Fetch testimonials from API
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://api.targetboardstore.com/testimonials');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const apiData: ApiTestimonial[] = await response.json();
        
        // Transform API data to match our interface
        const transformedData: Testimonial[] = apiData.map((item) => ({
          id: item._id,
          title: item.title,
          desc: item.desc,
          image: item.image,
        }));
        
        setTestimonials(transformedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching testimonials:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch testimonials');
        // Keep empty array on error - no fallback data
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if no data is provided as prop
    if (!data) {
      fetchTestimonials();
    } else {
      setTestimonials(data.data);
      setLoading(false);
    }
  }, [data]);

  // Ensure dynamic style is only rendered on the client to prevent hydration mismatch
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Use provided data or fetched data
  const displayTestimonials = data?.data || testimonials;

  return (
    <div className="bg-black py-8 md:py-16 overflow-hidden">
      {isHydrated && (
        <style suppressHydrationWarning>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap');

        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-280px * ${displayTestimonials.length} - 1.5rem * ${displayTestimonials.length}))}
        }

        @keyframes scrollRight {
          0% { transform: translateX(calc(-280px * ${displayTestimonials.length} - 1.5rem * ${displayTestimonials.length}))}
          100% { transform: translateX(0); }
        }

        @media (max-width: 1024px) {
          @keyframes scrollLeft {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-260px * ${displayTestimonials.length} - 1.5rem * ${displayTestimonials.length}))}
          }
          @keyframes scrollRight {
            0% { transform: translateX(calc(-260px * ${displayTestimonials.length} - 1.5rem * ${displayTestimonials.length}))}
            100% { transform: translateX(0); }
          }
        }

        @media (max-width: 768px) {
          @keyframes scrollLeft {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-240px * ${displayTestimonials.length} - 1rem * ${displayTestimonials.length}))}
          }
          @keyframes scrollRight {
            0% { transform: translateX(calc(-240px * ${displayTestimonials.length} - 1rem * ${displayTestimonials.length}))}
            100% { transform: translateX(0); }
          }
        }

        @media (max-width: 640px) {
          @keyframes scrollLeft {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-200px * ${displayTestimonials.length} - 1rem * ${displayTestimonials.length}))}
          }
          @keyframes scrollRight {
            0% { transform: translateX(calc(-200px * ${displayTestimonials.length} - 1rem * ${displayTestimonials.length}))}
            100% { transform: translateX(0); }
          }
        }

        @media (max-width: 480px) {
          @keyframes scrollLeft {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-180px * ${displayTestimonials.length} - 0.75rem * ${displayTestimonials.length}))}
          }
          @keyframes scrollRight {
            0% { transform: translateX(calc(-180px * ${displayTestimonials.length} - 0.75rem * ${displayTestimonials.length}))}
            100% { transform: translateX(0); }
          }
        }

        @media (max-width: 360px) {
          @keyframes scrollLeft {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-160px * ${displayTestimonials.length} - 0.75rem * ${displayTestimonials.length}))}
          }
          @keyframes scrollRight {
            0% { transform: translateX(calc(-160px * ${displayTestimonials.length} - 0.75rem * ${displayTestimonials.length}))}
            100% { transform: translateX(0); }
          }
        }

        .scroll-left {
          animation: scrollLeft 20s linear infinite;
        }

        .scroll-right {
          animation: scrollRight 20s linear infinite;
        }

        .card {
          min-width: 280px;
          max-width: 320px;
          flex-shrink: 0;
        }

        @media (max-width: 1024px) {
          .card {
            min-width: 260px;
            max-width: 300px;
          }
        }

        @media (max-width: 768px) {
          .card {
            min-width: 240px;
            max-width: 280px;
          }
        }

        @media (max-width: 640px) {
          .card {
            min-width: 200px;
            max-width: 240px;
          }
        }

        @media (max-width: 480px) {
          .card {
            min-width: 180px;
            max-width: 220px;
          }
        }

        @media (max-width: 360px) {
          .card {
            min-width: 160px;
            max-width: 200px;
          }
        }

        .quicksand {
          font-family: 'Quicksand', sans-serif;
        }

        /* Mobile-specific improvements */
        @media (max-width: 768px) {
          .card {
            padding: 1rem 0.75rem;
            padding-top: 0.5rem;
          }
          
          .card p {
            font-size: 0.875rem;
            line-height: 1.4;
            margin-bottom: 1rem;
          }
          
          .card img {
            width: 2rem;
            height: 2rem;
          }
          
          .card span {
            font-size: 0.75rem;
          }
        }

        @media (max-width: 480px) {
          .card {
            padding: 0.75rem 0.5rem;
            padding-top: 0.5rem;
          }
          
          .card p {
            font-size: 0.8rem;
            line-height: 1.3;
            margin-bottom: 0.75rem;
          }
          
          .card img {
            width: 1.75rem;
            height: 1.75rem;
          }
          
          .card span {
            font-size: 0.7rem;
          }
        }
      `}
      </style>
      )}

      {/* Loading State with Skeleton */}
      {loading && (
        <div className="py-8 md:py-16">
          {/* Upper Row Skeleton */}
          <div className="mb-4 md:mb-8 relative overflow-hidden">
            <div className="flex gap-3 md:gap-6">
              {[...Array(6)].map((_, index) => (
                <div
                  key={`skeleton-upper-${index}`}
                  className="card p-8 pt-4 overflow-hidden bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 animate-pulse"
                  style={{ borderRadius: "24px" }}
                >
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-600 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-600 rounded w-2/3"></div>
                  </div>
                  <div className="flex items-center gap-3 mt-6">
                    <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
                    <div className="h-4 bg-gray-600 rounded w-24"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lower Row Skeleton */}
          <div className="relative overflow-hidden">
            <div className="flex gap-3 md:gap-6">
              {[...Array(6)].map((_, index) => (
                <div
                  key={`skeleton-lower-${index}`}
                  className="card p-8 pt-4 overflow-hidden bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 animate-pulse"
                  style={{ borderRadius: "24px" }}
                >
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-600 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-600 rounded w-2/3"></div>
                  </div>
                  <div className="flex items-center gap-3 mt-6">
                    <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
                    <div className="h-4 bg-gray-600 rounded w-24"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-16">
          <p className="text-red-400 mb-4">Error: {error}</p>
          <p className="text-gray-400">Unable to load testimonials</p>
        </div>
      )}

      {/* Only show carousel if we have testimonials and not loading */}
      {!loading && !error && displayTestimonials.length > 0 && (
        <>
      {/* Upper Row - Left to Right */}
      <div className="mb-4 md:mb-8 relative overflow-hidden">
        <div className="flex gap-3 md:gap-6 scroll-left quicksand">
          {/* Original cards */}
          {displayTestimonials.map((card, index) => (
            <div
              key={`original-${index}`}
              className="card p-8 pt-4 overflow-hidden bg-gradient-to-r from-[#505A66] via-[#435561] to-[#292B3A]"
              style={{ borderRadius: "24px" }}
            >
              <p className="text-white text-lg mb-6">{card.desc}</p>
              <div className="flex items-center gap-3">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-10 h-10 rounded-full"
                />
                <span className="text-gray-400">{card.title}</span>
              </div>
            </div>
          ))}
          {/* Duplicated cards for seamless loop */}
          {displayTestimonials.map((card, index) => (
            <div
              key={`duplicate-${index}`}
              className="card p-8 pt-4 overflow-hidden bg-gradient-to-r from-[#505A66] via-[#435561] to-[#292B3A]"
              style={{ borderRadius: "24px" }}
            >
              <p className="text-white text-lg mb-6">{card.desc}</p>
              <div className="flex items-center gap-3">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-10 h-10 rounded-full"
                />
                <span className="text-gray-400">{card.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lower Row - Right to Left */}
      <div className="relative overflow-hidden">
        <div className="flex gap-3 md:gap-6 scroll-right quicksand">
          {/* Original cards */}
          {displayTestimonials.map((card, index) => (
            <div
              key={`original-${index}`}
              className="card p-8 pt-4 overflow-hidden bg-gradient-to-r from-[#505A66] via-[#435561] to-[#292B3A]"
              style={{ borderRadius: "24px" }}
            >
              <p className="text-white text-lg mb-6">{card.desc}</p>
              <div className="flex items-center gap-3">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-10 h-10 rounded-full"
                />
                <span className="text-gray-400">{card.title}</span>
              </div>
            </div>
          ))}
          {/* Duplicated cards for seamless loop */}
          {displayTestimonials.map((card, index) => (
            <div
              key={`duplicate-${index}`}
              className="card p-8 pt-4 overflow-hidden bg-gradient-to-r from-[#505A66] via-[#435561] to-[#292B3A]"
              style={{ borderRadius: "24px" }}
            >
              <p className="text-white text-lg mb-6">{card.desc}</p>
              <div className="flex items-center gap-3">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-10 h-10 rounded-full"
                />
                <span className="text-gray-400">{card.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
        </>
      )}

      {/* No testimonials message */}
      {!loading && !error && displayTestimonials.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg">No testimonials available at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default TestimonialCarousel;

