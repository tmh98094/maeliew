import React, { useEffect, useRef } from 'react';

interface InstagramGalleryProps {
  feedId?: string;
  className?: string;
  style?: React.CSSProperties;
}

const InstagramGallery: React.FC<InstagramGalleryProps> = ({ 
  feedId = "449b93d4-9af6-4687-9f61-8b8744eaa332",
  className = "",
  style = {}
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    // Load the iframe bridge script if not already loaded
    if (!scriptLoadedRef.current) {
      const existingScript = document.querySelector('script[src*="iframe-bridge"]');
      
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@mirrorapp/iframe-bridge@latest/dist/index.umd.js';
        script.async = true;
        document.head.appendChild(script);
      }
      
      scriptLoadedRef.current = true;
    }

    // Setup iframe when component mounts
    const iframe = iframeRef.current;
    if (iframe) {
      // Define the iFrameSetup function globally if it doesn't exist
      if (!(window as any).iFrameSetup) {
        (window as any).iFrameSetup = (iframe: HTMLIFrameElement) => {
          // This function will be called when the iframe loads
          console.log('Instagram gallery iframe loaded');
        };
      }
    }
  }, []);

  const defaultStyle: React.CSSProperties = {
    width: '100%',
    border: 'none',
    overflow: 'hidden',
    minHeight: '400px',
    ...style
  };

  return (
    <div className={`instagram-gallery-container ${className}`}>
      <iframe
        ref={iframeRef}
        src={`https://app.mirror-app.com/feed-instagram/${feedId}/preview`}
        style={defaultStyle}
        scrolling="no"
        onLoad={(e) => {
          const iframe = e.currentTarget;
          if ((window as any).iFrameSetup) {
            (window as any).iFrameSetup(iframe);
          }
        }}
        title="Instagram Gallery"
      />
    </div>
  );
};

export default InstagramGallery;