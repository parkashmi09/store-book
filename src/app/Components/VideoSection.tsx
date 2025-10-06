"use client";

import { useState } from "react";

export default function VideoSection() {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <>
      {/* Video Section */}
      <div className="w-full py-8">
        <div className="relative group cursor-pointer" onClick={() => setShowVideo(true)}>
          <img 
            src="//store.targetboard.co/cdn/shop/files/S.png?v=1759132307&width=3840" 
            alt="Load video" 
            srcSet="//store.targetboard.co/cdn/shop/files/S.png?v=1759132307&width=375 375w, //store.targetboard.co/cdn/shop/files/S.png?v=1759132307&width=750 750w, //store.targetboard.co/cdn/shop/files/S.png?v=1759132307&width=1100 1100w, //store.targetboard.co/cdn/shop/files/S.png?v=1759132307&width=1500 1500w, //store.targetboard.co/cdn/shop/files/S.png?v=1759132307&width=1780 1780w, //store.targetboard.co/cdn/shop/files/S.png?v=1759132307&width=2000 2000w, //store.targetboard.co/cdn/shop/files/S.png?v=1759132307&width=3000 3000w, //store.targetboard.co/cdn/shop/files/S.png?v=1759132307&width=3840 3840w" 
            width="3840" 
            height="2160" 
            loading="lazy" 
            sizes="100vw"
            className="w-full h-auto object-cover"
          />
          {/* Play Button Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white rounded-full p-6 shadow-2xl transform hover:scale-110 transition-transform duration-300">
              <svg className="w-12 h-12 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {showVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-4xl">
            <button
              onClick={() => setShowVideo(false)}
              className="absolute -top-12 right-0 text-white text-4xl hover:text-gray-300 transition-colors"
            >
              ×
            </button>
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src="https://www.youtube.com/embed/GU98XRv9NzM?enablejsapi=1&autoplay=1"
                className="absolute top-0 left-0 w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
                title="Video"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
