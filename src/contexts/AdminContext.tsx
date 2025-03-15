
import React, { createContext, useContext, useState, useEffect } from 'react';

// Types
export interface Content {
  id: string;
  type: 'about' | 'service' | 'team' | 'approach' | 'contact' | 'network' | 'hero';
  title: string;
  description?: string;
  imageSrc: string;
  name?: string;
  role?: string;
  bio?: string;
  email?: string;
  page?: 'home' | 'services' | 'team' | 'global';
  smallText?: string;
  steps?: {
    id: string;
    title: string;
    description: string;
  }[];
  regions?: string[];
  projects?: {
    id: string;
    title: string;
    description: string;
    imageSrc: string;
  }[];
}

interface AdminContextType {
  content: Content[];
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  updateContent: (updatedItem: Content) => void;
  addContent: (newItem: Content) => void;
  deleteContent: (id: string) => void;
}

// Sample initial data
const initialContent: Content[] = [
  {
    id: 'about',
    type: 'about',
    title: 'International Experts in Diverse Industries',
    description: 'At noievoi, we bring together specialists from around the globe to provide innovative solutions for complex challenges. Our extensive network of professionals spans multiple industries, ensuring that we deliver comprehensive expertise tailored to your specific needs.',
    imageSrc: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80',
    page: 'home'
  },
  {
    id: 'service-1',
    type: 'service',
    title: 'Strategic Consulting',
    description: 'Our strategic consulting services help businesses identify growth opportunities, optimize operations, and develop robust plans for the future.',
    imageSrc: 'https://images.unsplash.com/photo-1534551767192-78b8dd45b51b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    page: 'services'
  },
  {
    id: 'service-2',
    type: 'service',
    title: 'Digital Transformation',
    description: 'Navigate the digital landscape with confidence. We help organizations implement cutting-edge technologies and practices to stay competitive.',
    imageSrc: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    page: 'services'
  },
  {
    id: 'service-3',
    type: 'service',
    title: 'Market Entry Strategy',
    description: 'Expand your business into new markets with our comprehensive market entry strategies, tailored to regional nuances and opportunities.',
    imageSrc: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2015&q=80',
    page: 'services'
  },
  {
    id: 'team-1',
    type: 'team',
    title: 'Alex Morgan',
    name: 'Alex Morgan',
    role: 'CEO & Founder',
    imageSrc: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80',
    bio: 'Alex brings over 15 years of experience in international business development and strategic leadership. Before founding noievoi, he led global expansion efforts for several Fortune 500 companies.',
    page: 'team',
    projects: [
      {
        id: 'project-1',
        title: 'Global Market Expansion',
        description: 'Led a team that successfully entered 5 new international markets, resulting in 30% revenue growth within the first year.',
        imageSrc: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      },
    ],
  },
  {
    id: 'team-2',
    type: 'team',
    title: 'Sophia Chen',
    name: 'Sophia Chen',
    role: 'Chief Strategy Officer',
    imageSrc: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=988&q=80',
    bio: 'Sophia is a strategic thinker with a background in management consulting at top firms. She specializes in helping organizations navigate complex market challenges and identify growth opportunities.',
    page: 'team',
    projects: [
      {
        id: 'project-2',
        title: 'Digital Transformation Initiative',
        description: 'Developed and implemented a comprehensive digital transformation strategy for a traditional manufacturing company, leading to 40% efficiency improvements.',
        imageSrc: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      },
    ],
  },
  {
    id: 'team-3',
    type: 'team',
    title: 'Daniel Kim',
    name: 'Daniel Kim',
    role: 'Head of Technology',
    imageSrc: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80',
    bio: 'Daniel leads our technology initiatives with over a decade of experience in IT strategy and implementation. His expertise spans artificial intelligence, cloud computing, and cybersecurity.',
    page: 'team',
    projects: [
      {
        id: 'project-3',
        title: 'AI-Powered Analytics Platform',
        description: 'Developed a proprietary analytics platform that uses machine learning to provide predictive insights, now used by multiple Fortune 1000 clients.',
        imageSrc: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      },
    ],
  },
  {
    id: 'approach',
    type: 'approach',
    title: 'Our Approach',
    description: 'We believe in a collaborative approach that combines deep industry knowledge with innovative thinking. Our international network of experts allows us to tackle complex challenges from multiple perspectives, delivering solutions that are both comprehensive and tailored to your specific context.',
    imageSrc: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    page: 'home',
    steps: [
      {
        id: 'step-1',
        title: 'Analyze',
        description: 'We thoroughly analyze your business needs, challenges, and opportunities to establish a solid foundation for our work.'
      },
      {
        id: 'step-2',
        title: 'Strategize',
        description: 'Our team develops comprehensive strategies that align with your goals and leverage our global expertise.'
      },
      {
        id: 'step-3',
        title: 'Implement',
        description: 'We work with you to implement solutions, providing guidance and support throughout the entire process.'
      }
    ]
  },
  {
    id: 'network',
    type: 'network',
    title: 'Our Network',
    description: 'With contacts spanning across multiple continents and industries, we connect you to the right expertise when you need it most. Our global network includes specialists in technology, finance, healthcare, manufacturing, and more.',
    imageSrc: 'https://images.unsplash.com/photo-1599059813005-11265ba4b4ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    page: 'home',
    regions: ['North America', 'Europe', 'Asia Pacific', 'Middle East']
  },
  {
    id: 'contact',
    type: 'contact',
    title: 'Join Our Team',
    description: 'We\'re always looking for talented individuals who share our passion for excellence and innovation. If you\'re interested in joining our team, please reach out with your qualifications and areas of expertise.',
    imageSrc: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    page: 'team',
    email: 'careers@noievoi.com'
  },
  {
    id: 'home-hero',
    type: 'hero',
    title: 'International Experts in Diverse Industries',
    description: 'At noievoi, we bring together specialists from around the globe to provide innovative solutions for complex challenges.',
    smallText: 'ABOUT US',
    imageSrc: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80',
    page: 'home'
  },
  {
    id: 'services-hero',
    type: 'hero',
    title: 'Our Services',
    description: 'Tailored solutions to meet your business needs across various industries and challenges.',
    smallText: 'SERVICES',
    imageSrc: 'https://images.unsplash.com/photo-1661956602868-6ae368943878?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    page: 'services'
  },
  {
    id: 'team-hero',
    type: 'hero',
    title: 'Our Team',
    description: 'Meet our diverse group of experts with extensive experience across multiple industries.',
    smallText: 'TEAM',
    imageSrc: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    page: 'team'
  }
];

// Admin context
const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Admin credentials (in a real app, these would be securely stored server-side)
const ADMIN_EMAIL = 'admin@noievoi.com';
const ADMIN_PASSWORD = 'admin123';

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<Content[]>(() => {
    const savedContent = localStorage.getItem('noievoi-content');
    return savedContent ? JSON.parse(savedContent) : initialContent;
  });
  
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('noievoi-admin-auth') === 'true';
  });

  // Save content to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('noievoi-content', JSON.stringify(content));
  }, [content]);

  // Save authentication state
  useEffect(() => {
    localStorage.setItem('noievoi-admin-auth', isAuthenticated.toString());
  }, [isAuthenticated]);

  const login = (email: string, password: string): boolean => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const updateContent = (updatedItem: Content) => {
    setContent(prevContent => 
      prevContent.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      )
    );
  };

  const addContent = (newItem: Content) => {
    setContent(prevContent => [...prevContent, newItem]);
  };

  const deleteContent = (id: string) => {
    setContent(prevContent => prevContent.filter(item => item.id !== id));
  };

  return (
    <AdminContext.Provider 
      value={{ 
        content, 
        isAuthenticated, 
        login, 
        logout, 
        updateContent, 
        addContent, 
        deleteContent 
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
