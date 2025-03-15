
import React from 'react';
import HeroSection from '../components/HeroSection';
import { useAdmin } from '../contexts/AdminContext';

const Index = () => {
  const { content } = useAdmin();
  
  // Get page-specific content
  const homePageContent = content.filter(item => 
    item.page === 'home' || (!item.page && (item.type === 'about' || item.type === 'approach' || item.type === 'network'))
  );
  
  // Get specific sections
  const heroContent = homePageContent.find(item => item.type === 'hero') || 
    homePageContent.find(item => item.type === 'about'); // Fallback to about content
  
  const aboutContent = homePageContent.find(item => item.type === 'about');
  const approachContent = homePageContent.find(item => item.type === 'approach');
  const networkContent = homePageContent.find(item => item.type === 'network');
  
  // Find additional content sections
  const additionalSections = homePageContent.filter(item => 
    !['hero', 'about', 'approach', 'network'].includes(item.type)
  );

  if (!aboutContent) {
    return <div>Loading...</div>;
  }

  return (
    <div className="page-transition">
      <HeroSection 
        title={heroContent?.title || aboutContent.title}
        subtitle={heroContent?.description || aboutContent.description}
        imageSrc={heroContent?.imageSrc || aboutContent.imageSrc}
        smallText={heroContent?.smallText || "ABOUT US"}
      />
      
      {approachContent && (
        <section className="section-spacing">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-medium">{approachContent.title}</h2>
              <p className="mt-6 text-gray-600 leading-relaxed">
                {approachContent.description}
              </p>
            </div>
            
            {approachContent.steps && approachContent.steps.length > 0 && (
              <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
                {approachContent.steps.map((step, index) => (
                  <div key={step.id} className="text-center animate-fade-in-up" style={{animationDelay: `${index * 100}ms`}}>
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
                      <span className="text-2xl font-medium">{(index + 1).toString().padStart(2, '0')}</span>
                    </div>
                    <h3 className="text-xl font-medium mb-3">{step.title}</h3>
                    <p className="text-gray-600">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
      
      {/* Render additional content sections */}
      {additionalSections.map(section => (
        <section key={section.id} className="section-spacing">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-medium">{section.title}</h2>
              <p className="mt-6 text-gray-600 leading-relaxed">
                {section.description}
              </p>
            </div>
          </div>
        </section>
      ))}
      
      {networkContent && (
        <section className="section-spacing bg-gray-50">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-medium">{networkContent.title}</h2>
              <p className="mt-6 text-gray-600 leading-relaxed">
                {networkContent.description}
              </p>
            </div>
            
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
              {(networkContent.regions || ['North America', 'Europe', 'Asia Pacific', 'Middle East']).map((region, index) => (
                <div key={region} className="text-center animate-fade-in-up" style={{animationDelay: `${index * 100}ms`}}>
                  <div className="text-4xl font-light mb-2">{region}</div>
                  <p className="text-gray-600">Regional expertise</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Index;
