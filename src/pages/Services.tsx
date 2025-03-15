
import React from 'react';
import HeroSection from '../components/HeroSection';
import ServiceCard from '../components/ServiceCard';
import { useAdmin } from '../contexts/AdminContext';

const Services = () => {
  const { content } = useAdmin();
  
  // Get page-specific content
  const servicesPageContent = content.filter(item => 
    item.page === 'services' || (!item.page && item.type === 'service')
  );
  
  // Get hero content
  const heroContent = servicesPageContent.find(item => item.type === 'hero');
  
  // Get services
  const services = servicesPageContent.filter(item => item.type === 'service');
  
  // Get additional content (approach, process, etc.)
  const additionalSections = servicesPageContent.filter(item => 
    !['hero', 'service'].includes(item.type)
  );

  return (
    <div className="page-transition">
      <HeroSection 
        title={heroContent?.title || "Our Services"}
        subtitle={heroContent?.description || "Tailored solutions to meet your business needs across various industries and challenges."}
        imageSrc={heroContent?.imageSrc || "https://images.unsplash.com/photo-1661956602868-6ae368943878?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"}
        smallText={heroContent?.smallText || "SERVICES"}
      />
      
      <section className="section-spacing">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-medium">How We Can Help</h2>
            <p className="mt-6 text-gray-600 leading-relaxed">
              Our comprehensive range of services is designed to address complex business challenges and create sustainable value. Drawing on our international expertise and diverse industry knowledge, we deliver tailored solutions that drive real results.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ServiceCard
                key={service.id}
                title={service.title}
                description={service.description || ''}
                imageSrc={service.imageSrc}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Render additional content sections */}
      {additionalSections.map(section => (
        <section key={section.id} className="section-spacing bg-gray-50">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-medium">{section.title}</h2>
              <p className="mt-6 text-gray-600 leading-relaxed">
                {section.description}
              </p>
              
              {section.steps && section.steps.length > 0 && (
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                  {section.steps.map((step, index) => (
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
          </div>
        </section>
      ))}
      
      <section className="section-spacing bg-gray-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-medium">Our Process</h2>
            <p className="mt-6 text-gray-600 leading-relaxed">
              We follow a methodical approach to ensure that every engagement delivers maximum value and addresses your specific needs.
            </p>
          </div>
          
          <div className="mt-16 relative">
            {/* Timeline connector */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 transform -translate-x-1/2"></div>
            
            <div className="space-y-16 md:space-y-0">
              {/* Step 1 */}
              <div className="md:grid md:grid-cols-2 md:gap-8 relative">
                <div className="md:text-right md:pr-16 animate-fade-in-up">
                  <div className="hidden md:block absolute right-0 top-0 w-4 h-4 rounded-full bg-black transform translate-x-1/2"></div>
                  <h3 className="text-xl font-medium mb-3">Initial Consultation</h3>
                  <p className="text-gray-600">
                    We begin with a thorough consultation to understand your business, challenges, and objectives. This forms the foundation of our working relationship.
                  </p>
                </div>
                <div className="mt-4 md:mt-0"></div>
              </div>
              
              {/* Step 2 */}
              <div className="md:grid md:grid-cols-2 md:gap-8 relative">
                <div className="md:text-right md:pr-16 md:hidden"></div>
                <div className="md:pl-16 animate-fade-in-up" style={{animationDelay: '100ms'}}>
                  <div className="hidden md:block absolute left-0 top-0 w-4 h-4 rounded-full bg-black transform -translate-x-1/2"></div>
                  <h3 className="text-xl font-medium mb-3">Strategic Assessment</h3>
                  <p className="text-gray-600">
                    Our team analyzes your situation, identifies key areas for improvement, and develops a customized strategy to address your specific needs.
                  </p>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="md:grid md:grid-cols-2 md:gap-8 relative">
                <div className="md:text-right md:pr-16 animate-fade-in-up" style={{animationDelay: '200ms'}}>
                  <div className="hidden md:block absolute right-0 top-0 w-4 h-4 rounded-full bg-black transform translate-x-1/2"></div>
                  <h3 className="text-xl font-medium mb-3">Implementation & Execution</h3>
                  <p className="text-gray-600">
                    We work collaboratively with your team to implement the agreed-upon solutions, providing guidance and expertise throughout the process.
                  </p>
                </div>
                <div className="mt-4 md:mt-0"></div>
              </div>
              
              {/* Step 4 */}
              <div className="md:grid md:grid-cols-2 md:gap-8 relative">
                <div className="md:text-right md:pr-16 md:hidden"></div>
                <div className="md:pl-16 animate-fade-in-up" style={{animationDelay: '300ms'}}>
                  <div className="hidden md:block absolute left-0 top-0 w-4 h-4 rounded-full bg-black transform -translate-x-1/2"></div>
                  <h3 className="text-xl font-medium mb-3">Evaluation & Refinement</h3>
                  <p className="text-gray-600">
                    We continuously monitor progress, measure results against key performance indicators, and refine our approach to ensure optimal outcomes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
