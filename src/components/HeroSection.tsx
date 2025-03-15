
import React, { useEffect, useRef } from 'react';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  imageSrc: string;
  smallText?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ 
  title, 
  subtitle,
  imageSrc,
  smallText
}) => {
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const blurElement = imageRef.current;
    if (!blurElement) return;

    const img = new Image();
    img.src = imageSrc;
    
    img.onload = () => {
      if (blurElement) {
        blurElement.classList.add('loaded');
      }
    };
  }, [imageSrc]);

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with blur-load effect */}
      <div 
        ref={imageRef}
        className="blur-load absolute inset-0 before:absolute before:inset-0 before:bg-black/30"
        style={{ backgroundImage: `url(${imageSrc}?blur=true&w=100)` }}
      >
        <img 
          src={imageSrc} 
          alt="Hero background" 
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      
      {/* Content */}
      <div className="container-custom relative z-10 text-white mt-20">
        {smallText && (
          <div className="inline-block px-3 py-1 mb-6 text-xs font-medium tracking-wider uppercase bg-white/10 backdrop-blur-sm rounded-full animate-fade-in-up">
            {smallText}
          </div>
        )}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight max-w-3xl animate-fade-in-up" style={{animationDelay: '100ms'}}>
          {title}
        </h1>
        {subtitle && (
          <p className="mt-6 text-lg md:text-xl text-white/90 max-w-xl animate-fade-in-up" style={{animationDelay: '200ms'}}>
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
