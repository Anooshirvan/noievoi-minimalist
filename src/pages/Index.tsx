
import React from 'react';
import HeroSection from '../components/HeroSection';
import { useAdmin } from '../contexts/AdminContext';

const Index = () => {
  const { content } = useAdmin();
  const aboutContent = content.find(item => item.type === 'about');
  const approachContent = content.find(item => item.type === 'approach');
  const networkContent = content.find(item => item.type === 'network');

  if (!aboutContent) {
    return <div>Loading...</div>;
  }

  return (
    <div className="page-transition">
      <HeroSection 
        title={aboutContent.title}
        subtitle={aboutContent.description}
        imageSrc={aboutContent.imageSrc}
        smallText="ABOUT US"
      />
      
      <section className="section-spacing">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-medium">{approachContent?.title || 'Our Approach'}</h2>
            <p className="mt-6 text-gray-600 leading-relaxed">
              {approachContent?.description || 'We believe in a collaborative approach that combines deep industry knowledge with innovative thinking. Our international network of experts allows us to tackle complex challenges from multiple perspectives, delivering solutions that are both comprehensive and tailored to your specific context.'}
            </p>
          </div>
          
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            {approachContent?.steps?.map((step, index) => (
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
        </div>
      </section>
      
      <section className="section-spacing bg-gray-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-medium">{networkContent?.title || 'Our Network'}</h2>
            <p className="mt-6 text-gray-600 leading-relaxed">
              {networkContent?.description || 'With contacts spanning across multiple continents and industries, we connect you to the right expertise when you need it most. Our global network includes specialists in technology, finance, healthcare, manufacturing, and more.'}
            </p>
          </div>
          
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
            {(networkContent?.regions || ['North America', 'Europe', 'Asia Pacific', 'Middle East']).map((region, index) => (
              <div key={region} className="text-center animate-fade-in-up" style={{animationDelay: `${index * 100}ms`}}>
                <div className="text-4xl font-light mb-2">{region}</div>
                <p className="text-gray-600">Regional expertise</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
