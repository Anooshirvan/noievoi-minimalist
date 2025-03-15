
import React from 'react';
import HeroSection from '../components/HeroSection';
import TeamMember, { TeamMemberType } from '../components/TeamMember';
import { useAdmin } from '../contexts/AdminContext';

const Team = () => {
  const { content } = useAdmin();
  
  // Get team members
  const teamMembers = content.filter(item => 
    item.type === 'team' && item.name
  ) as unknown as TeamMemberType[];
  
  // Get contact content
  const contactContent = content.find(item => item.type === 'contact');

  return (
    <div className="page-transition">
      <HeroSection 
        title="Our Team"
        subtitle="Meet our diverse group of experts with extensive experience across multiple industries."
        imageSrc="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
        smallText="TEAM"
      />
      
      <section className="section-spacing">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-medium">Our Experts</h2>
            <p className="mt-6 text-gray-600 leading-relaxed">
              Our team brings together professionals with diverse backgrounds and expertise, united by a passion for delivering exceptional results. Each member contributes unique insights and skills to address complex challenges across various industries.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <TeamMember key={member.id} member={member} index={index} />
            ))}
          </div>
        </div>
      </section>
      
      <section className="section-spacing bg-gray-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-medium">{contactContent?.title || 'Join Our Team'}</h2>
            <p className="mt-6 text-gray-600 leading-relaxed">
              {contactContent?.description || 'We\'re always looking for talented individuals who share our passion for excellence and innovation. If you\'re interested in joining our team, please reach out with your qualifications and areas of expertise.'}
            </p>
            <a 
              href={`mailto:${contactContent?.email || 'careers@noievoi.com'}`} 
              className="inline-block mt-8 px-8 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Team;
