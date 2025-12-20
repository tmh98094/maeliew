/**
 * Loading Images Configuration
 * Manages the images used in the loading screen
 */

export interface LoadingImage {
  src: string;
  alt: string;
  position: {
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
    width: string;
    zIndex: number;
  };
}

export const loadingImages: LoadingImage[] = [
  {
    src: "/images/loading/Loading1.webp",
    alt: "Mae Liew Atelier Work 1",
    position: { top: '0%', left: '0%', width: '45vw', zIndex: 1 }
  },
  {
    src: "/images/loading/Loading2.webp", 
    alt: "Mae Liew Atelier Work 2",
    position: { top: '40%', right: '0%', width: '50vw', zIndex: 2 }
  },
  {
    src: "/images/loading/Loading3.webp",
    alt: "Mae Liew Atelier Work 3", 
    position: { bottom: '0%', left: '10%', width: '40vw', zIndex: 3 }
  },
  {
    src: "/images/loading/Loading4.webp",
    alt: "Mae Liew Atelier Work 4",
    position: { top: '20%', left: '35%', width: '30vw', zIndex: 4 }
  },
  {
    src: "/images/loading/Loading5.webp",
    alt: "Mae Liew Atelier Work 5", 
    position: { bottom: '10%', right: '15%', width: '35vw', zIndex: 5 }
  }
];

export const getLoadingImageSources = (): string[] => {
  return loadingImages.map(img => img.src);
};