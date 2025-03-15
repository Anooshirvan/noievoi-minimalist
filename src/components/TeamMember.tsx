
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export interface TeamMemberType {
  id: string;
  name: string;
  role: string;
  imageSrc: string;
  bio?: string;
  projects?: {
    id: string;
    title: string;
    description: string;
    imageSrc: string;
  }[];
}

interface TeamMemberProps {
  member: TeamMemberType;
  index: number;
}

const TeamMember: React.FC<TeamMemberProps> = ({ member, index }) => {
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const blurElement = imageRef.current;
    if (!blurElement) return;

    const img = new Image();
    img.src = member.imageSrc;
    
    img.onload = () => {
      if (blurElement) {
        blurElement.classList.add('loaded');
      }
    };
  }, [member.imageSrc]);

  return (
    <Link 
      to={`/team/${member.id}`}
      className="group block animate-fade-in-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div 
        ref={imageRef}
        className="blur-load relative aspect-[3/4] overflow-hidden rounded-lg"
        style={{ backgroundImage: `url(${member.imageSrc}?blur=true&w=100)` }}
      >
        <img 
          src={member.imageSrc} 
          alt={member.name} 
          className="w-full h-full object-cover transition-transform duration-700 ease-smooth group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 ease-out"></div>
      </div>
      
      <div className="mt-4">
        <h3 className="text-lg font-medium group-hover:text-black transition-colors">{member.name}</h3>
        <p className="text-gray-600">{member.role}</p>
      </div>
    </Link>
  );
};

export default TeamMember;
