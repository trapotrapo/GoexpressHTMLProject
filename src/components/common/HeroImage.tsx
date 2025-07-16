import React from 'react';

const HeroImage: React.FC = () => {
  return (
    <div className="w-full h-[500px] bg-cover bg-center">
      <img 
        src="https://images.unsplash.com/photo-1678182451047-196f22a4143e?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
        alt="Shipping containers" 
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default HeroImage;