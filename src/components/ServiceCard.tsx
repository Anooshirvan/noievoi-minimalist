
import React, { useEffect, useRef } from 'react';

interface ServiceCardProps {
  title: string;
  description: string;
  imageSrc: string;
  index: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  title, 
  description, 
  imageSrc,
  index
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
    <div 
      className="group relative overflow-hidden bg-white rounded-lg shadow-sm border border-gray-100 animate-fade-in-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Image */}
      <div 
        ref={imageRef}
        className="blur-load h-64 relative overflow-hidden"
        style={{ backgroundImage: `url(${imageSrc}?blur=true&w=100)` }}
      >
        <img 
          src={imageSrc} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 ease-smooth group-hover:scale-105"
          loading="lazy"
        />
      </div>
      
      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-medium">{title}</h3>
        <p className="mt-3 text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default ServiceCard;
