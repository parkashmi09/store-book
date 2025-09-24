"use client";

import React, { useState, useEffect } from "react";
import { 
  FaHeart, 
  FaThumbsUp, 
  FaSmile, 
  FaComment, 
  FaShare, 
  FaChevronLeft, 
  FaChevronRight, 
  FaPlay, 
  FaStar,
  FaPause
} from "react-icons/fa";

// TypeScript interface for API testimonial data
interface ApiVideoTestimonial {
  _id: string;
  title: string;
  desc: string;
  image: string;
  videoUrl?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// TypeScript interface for video testimonial data
interface VideoTestimonial {
  id: string;
  title: string;
  desc: string;
  image: string;
  videoUrl: string;
  rating: number;
  position: string;
  reactions?: {
    likes: number;
    hearts: number;
    smiles: number;
    comments: number;
    shares: number;
  };
}

interface VideoTestimonialSwiperProps {
  data?: VideoTestimonial[];
}

// Default YouTube video URLs for testimonials without videoUrl
const defaultVideoUrls = [
  "https://www.youtube.com/embed/dQw4w9WgXcQ",
  "https://www.youtube.com/embed/9bZkp7q19f0", 
  "https://www.youtube.com/embed/jNQXAC9IVRw",
  "https://www.youtube.com/embed/L_jWHffIx5E",
  "https://www.youtube.com/embed/fJ9rUzIMcZQ",
  "https://www.youtube.com/embed/ScMzIvxBSi4",
  "https://www.youtube.com/embed/3JZ_D3ELwOQ",
  "https://www.youtube.com/embed/1G4isv_Fylg"
];

// Empty array - will be populated from API
const sampleVideoTestimonials: VideoTestimonial[] = [];

const VideoTestimonialSwiper: React.FC<VideoTestimonialSwiperProps> = ({ data }) => {
  const [testimonials, setTestimonials] = useState<VideoTestimonial[]>(sampleVideoTestimonials);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [reactions, setReactions] = useState<{[key: string]: {[key: string]: boolean}}>({});
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Fetch testimonials from API
  useEffect(() => {
    const fetchVideoTestimonials = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://api.targetboardstore.com/testimonials');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const apiData: ApiVideoTestimonial[] = await response.json();
        
        // Transform API data to match our interface
        const transformedData: VideoTestimonial[] = apiData.map((item, index) => ({
          id: item._id,
          title: item.title,
          desc: item.desc,
          image: item.image,
          videoUrl: item.videoUrl || defaultVideoUrls[index % defaultVideoUrls.length],
          rating: 5, // Default rating
          position: "Customer", // Default position
          reactions: {
            likes: Math.floor(Math.random() * 50) + 10,
            hearts: Math.floor(Math.random() * 30) + 5,
            smiles: Math.floor(Math.random() * 20) + 3,
            comments: Math.floor(Math.random() * 15) + 2,
            shares: Math.floor(Math.random() * 10) + 1
          }
        }));
        
        setTestimonials(transformedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching video testimonials:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch video testimonials');
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if no data is provided as prop
    if (!data) {
      fetchVideoTestimonials();
    } else {
      setTestimonials(data);
      setLoading(false);
    }
  }, [data]);

  // Use provided data or fetched data
  const displayTestimonials = data || testimonials;

  // Auto-slide functionality
  useEffect(() => {
    if (!isAutoPlaying || displayTestimonials.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % displayTestimonials.length);
    }, 8000); // Auto-slide every 8 seconds for video content

    return () => clearInterval(interval);
  }, [isAutoPlaying, displayTestimonials.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % displayTestimonials.length);
    setIsAutoPlaying(false); // Pause auto-play when user manually navigates
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + displayTestimonials.length) % displayTestimonials.length);
    setIsAutoPlaying(false); // Pause auto-play when user manually navigates
  };

  const handleVideoPlay = (id: string) => {
    setIsPlaying(isPlaying === id ? null : id);
  };

  const handleReaction = (testimonialId: string, reactionType: string) => {
    setReactions(prev => ({
      ...prev,
      [testimonialId]: {
        ...prev[testimonialId],
        [reactionType]: !prev[testimonialId]?.[reactionType]
      }
    }));
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const getVisibleCards = () => {
    const cards = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentSlide + i) % displayTestimonials.length;
      cards.push({
        ...displayTestimonials[index],
        position: i === 0 ? 'left' : i === 1 ? 'center' : 'right'
      });
    }
    return cards;
  };

  return (
    <div className="bg-black py-20 px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/3 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-6 border border-white/20">
            <FaStar className="w-5 h-5 text-yellow-400" />
            <span className="text-white/90 font-medium">Customer Stories</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            What Our Customers Say
          </h2>
          <p className="text-white/80 text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed">
            Real experiences from book lovers who found their perfect reads with us
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-96">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
              <p className="text-white/80">Loading video testimonials...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <p className="text-red-400 mb-4">Error: {error}</p>
            <p className="text-gray-400">Unable to load video testimonials</p>
          </div>
        )}

        {/* Video Carousel - Responsive */}
        {!loading && !error && displayTestimonials.length > 0 && (
          <>
            {/* Carousel Container */}
            <div className="relative md:h-[600px] flex items-center justify-center">
              {getVisibleCards().map((testimonial, index) => {
                const cardPosition = testimonial.position;
                const isCenter = cardPosition === 'center';
                
                return (
                  <div
                    key={testimonial.id}
                    className={`${
                      // Only show the center card on mobile; show all on md+
                      isCenter ? 'block' : 'hidden md:block'
                    } md:absolute transition-all duration-700 ease-out ${
                      isCenter
                        ? 'md:z-30 md:scale-110'
                        : cardPosition === 'left'
                        ? 'md:z-20 md:-translate-x-80 md:scale-90 md:opacity-70'
                        : 'md:z-20 md:translate-x-80 md:scale-90 md:opacity-70'
                    }`}
                  >
                    <div className="bg-white backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200 p-6 md:p-8 w-full max-w-md md:w-96 md:h-[500px] relative overflow-hidden group hover:shadow-3xl transition-all duration-500">
                      {/* Subtle Overlay */}
                      <div className="absolute inset-0 bg-gray-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      {/* Video Section */}
                      <div className="relative mb-4 md:mb-6 h-40 md:h-48 rounded-2xl overflow-hidden shadow-lg">
                        {isPlaying === testimonial.id ? (
                          <iframe
                            className="w-full h-full"
                            src={`${testimonial.videoUrl}?autoplay=1&mute=1&loop=1&playlist=${testimonial.videoUrl.split('/').pop()}`}
                            title={`${testimonial.title} Testimonial`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : (
                          <div className="relative w-full h-full bg-gray-200">
                            <img
                              src={testimonial.image}
                              alt={testimonial.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                              <button
                                className="bg-white hover:bg-gray-100 rounded-full p-4 shadow-xl transition-all duration-300 hover:scale-110"
                                onClick={() => handleVideoPlay(testimonial.id)}
                              >
                                <FaPlay className="w-6 h-6 text-black ml-1" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Content Section */}
                      <div className="relative z-10 space-y-3 md:space-y-4">
                        {/* Stars */}
                        <div className="flex items-center gap-1 mb-2 md:mb-3">
                          {renderStars(testimonial.rating)}
                        </div>

                        {/* Quote */}
                        <div className="relative">
                          <span className="absolute -top-2 -left-1 text-5xl md:text-6xl text-gray-300 font-serif">"</span>
                          <p className="text-gray-700 text-base md:text-lg leading-relaxed pl-6 relative z-10 font-medium line-clamp-4 md:line-clamp-3 overflow-hidden text-ellipsis">
                            {testimonial.desc}
                          </p>
                        </div>

                        {/* Author */}
                        <div className="flex items-center gap-3 md:gap-4 pt-3 md:pt-4 border-t border-gray-200/50">
                          <div className="relative">
                            <img
                              src={testimonial.image}
                              alt={testimonial.title}
                              className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover shadow-lg ring-2 ring-gray-300"
                            />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                          </div>
                          <div>
                            <h4 className="text-gray-800 font-bold text-lg md:text-xl">
                              {testimonial.title}
                            </h4>
                            <p className="text-gray-600 text-xs md:text-sm font-medium">
                              {testimonial.position}
                            </p>
                          </div>
                        </div>

                        {/* Reaction Buttons */}
                        {/* {testimonial.reactions && (
                          <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-gray-200/50">
                            <div className="flex items-center gap-3 md:gap-4">
                              <button
                                onClick={() => handleReaction(testimonial.id, 'like')}
                                className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 ${
                                  reactions[testimonial.id]?.like
                                    ? 'bg-blue-100 text-blue-600'
                                    : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                                }`}
                              >
                                <FaThumbsUp className="w-4 h-4" />
                                <span className="text-sm font-medium">
                                  {(testimonial.reactions.likes || 0) + (reactions[testimonial.id]?.like ? 1 : 0)}
                                </span>
                              </button>

                              <button
                                onClick={() => handleReaction(testimonial.id, 'heart')}
                                className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 ${
                                  reactions[testimonial.id]?.heart
                                    ? 'bg-red-100 text-red-600'
                                    : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
                                }`}
                              >
                                <FaHeart className={`w-4 h-4 ${reactions[testimonial.id]?.heart ? 'fill-current' : ''}`} />
                                <span className="text-sm font-medium">
                                  {(testimonial.reactions.hearts || 0) + (reactions[testimonial.id]?.heart ? 1 : 0)}
                                </span>
                              </button>

                              <button
                                onClick={() => handleReaction(testimonial.id, 'smile')}
                                className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 ${
                                  reactions[testimonial.id]?.smile
                                    ? 'bg-yellow-100 text-yellow-600'
                                    : 'bg-gray-100 text-gray-600 hover:bg-yellow-50 hover:text-yellow-600'
                                }`}
                              >
                                <FaSmile className="w-4 h-4" />
                                <span className="text-sm font-medium">
                                  {(testimonial.reactions.smiles || 0) + (reactions[testimonial.id]?.smile ? 1 : 0)}
                                </span>
                              </button>
                            </div>

                            <div className="flex items-center gap-3">
                              <button className="flex items-center gap-2 px-3 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-300">
                                <FaComment className="w-4 h-4" />
                                <span className="text-sm font-medium">{testimonial.reactions.comments || 0}</span>
                              </button>

                              <button className="flex items-center gap-2 px-3 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-300">
                                <FaShare className="w-4 h-4" />
                                <span className="text-sm font-medium">{testimonial.reactions.shares || 0}</span>
                              </button>
                            </div>
                          </div>
                        )} */}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="flex justify-center items-center gap-8 mt-12">
              <button
                onClick={prevSlide}
                className="bg-white/10 hover:bg-white/20 text-white p-4 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-110 hover:shadow-2xl group"
              >
                <FaChevronLeft className="w-6 h-6 transition-transform group-hover:-translate-x-1" />
              </button>

              {/* Pagination Dots */}
              <div className="flex gap-3">
                {displayTestimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentSlide(index);
                      setIsAutoPlaying(false); // Pause auto-play when user clicks pagination
                    }}
                    className={`transition-all duration-300 rounded-full ${
                      index === currentSlide
                        ? 'w-12 h-3 bg-white shadow-lg'
                        : 'w-3 h-3 bg-white/40 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextSlide}
                className="bg-white/10 hover:bg-white/20 text-white p-4 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-110 hover:shadow-2xl group"
              >
                <FaChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* Auto-play controls */}
            <div className="text-center mt-8">
              <div className="inline-flex items-center gap-4 text-white/60 text-sm">
                <button
                  onClick={toggleAutoPlay}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20"
                >
                  {isAutoPlaying ? (
                    <>
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
                      <span>Auto-playing every 6 seconds</span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                      <span>Auto-play paused</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}

        {/* No testimonials message */}
        {!loading && !error && displayTestimonials.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">No video testimonials available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoTestimonialSwiper;