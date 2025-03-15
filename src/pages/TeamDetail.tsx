
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';
import { TeamMemberType } from '../components/TeamMember';
import { ArrowLeft } from 'lucide-react';

const TeamDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { content } = useAdmin();
  
  // Find the team member
  const member = content.find(item => item.id === id) as TeamMemberType | undefined;
  
  // Redirect if member not found
  useEffect(() => {
    if (!member) {
      navigate('/team', { replace: true });
    }
  }, [member, navigate]);
  
  if (!member) {
    return null;
  }

  return (
    <div className="page-transition pt-20">
      <div className="container-custom section-spacing">
        <button 
          onClick={() => navigate('/team')}
          className="flex items-center text-gray-600 hover:text-black mb-8 transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Team
        </button>
        
        <div className="grid grid-cols-1 md:grid-cols-[1fr,2fr] gap-12">
          <div>
            <div className="aspect-[3/4] overflow-hidden rounded-lg animate-fade-in-up">
              <img 
                src={member.imageSrc} 
                alt={member.name} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="animate-fade-in-up" style={{animationDelay: '100ms'}}>
            <div className="inline-block px-3 py-1 mb-4 text-xs font-medium tracking-wider uppercase bg-gray-100 rounded-full">
              {member.role}
            </div>
            <h1 className="text-3xl md:text-4xl font-medium mb-6">{member.name}</h1>
            <div className="prose max-w-none text-gray-600">
              <p>{member.bio}</p>
            </div>
            
            {member.projects && member.projects.length > 0 && (
              <div className="mt-12">
                <h2 className="text-xl font-medium mb-6">Featured Projects</h2>
                <div className="space-y-8">
                  {member.projects.map(project => (
                    <div key={project.id} className="animate-fade-in-up">
                      <div className="aspect-video overflow-hidden rounded-lg mb-4">
                        <img 
                          src={project.imageSrc} 
                          alt={project.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="text-lg font-medium mb-2">{project.title}</h3>
                      <p className="text-gray-600">{project.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDetail;
