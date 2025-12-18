import React from 'react';
import InstagramGallery from '../src/components/InstagramGallery';

const InstagramFeed: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl text-gray-900 mb-4">
            Instagram Gallery
          </h1>
          <p className="text-gray-600 text-lg">
            Follow our latest work and behind-the-scenes moments
          </p>
          <a 
            href="https://instagram.com/maeliew_atelier" 
            target="_blank" 
            rel="noreferrer"
            className="inline-block mt-6 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
          >
            Follow @maeliew_atelier
          </a>
        </div>
        
        <InstagramGallery 
          className="rounded-xl overflow-hidden shadow-2xl"
          style={{ 
            minHeight: '600px',
            maxWidth: '100%'
          }}
        />
      </div>
    </div>
  );
};

export default InstagramFeed;