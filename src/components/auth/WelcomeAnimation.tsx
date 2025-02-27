
import { useEffect, useState } from 'react';

const WelcomeAnimation = () => {
  // Array of pet characters to randomly choose from
  const petCharacters = ['🐱', '🐶', '🐕', '🐈', '🐩', '🐱‍👤'];
  const [selectedPet, setSelectedPet] = useState('');

  useEffect(() => {
    // Prevent scrolling during animation
    document.body.style.overflow = 'hidden';
    
    // Randomly select a pet character when component mounts
    const randomIndex = Math.floor(Math.random() * petCharacters.length);
    setSelectedPet(petCharacters[randomIndex]);

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 overflow-hidden">
      <div className="text-center space-y-6 animate-fade-up">
        {/* Pet Character Container */}
        <div className="relative w-48 h-48 mx-auto">
          {/* Circle background with gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-200 to-blue-200 rounded-full animate-pulse" />
          
          {/* Pet character display */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-7xl animate-bounce" role="img" aria-label="pet character">
              {selectedPet}
            </span>
          </div>
        </div>

        {/* Logo Container */}
        <div className="w-32 h-32 mx-auto bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-2xl flex items-center justify-center mb-6 animate-scale-in">
          <span className="text-5xl font-bold text-white">RC</span>
        </div>

        {/* Welcome Text */}
        <div className="space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent animate-fade-in">
            RideCompare
          </h1>
          <p className="text-2xl text-purple-600 font-semibold animate-fade-in opacity-0 animation-delay-300">
            Welcome Back!
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-ping" />
          <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-blue-400 rounded-full animate-ping animation-delay-200" />
          <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-purple-400 rounded-full animate-ping animation-delay-300" />
        </div>
      </div>
    </div>
  );
};

export default WelcomeAnimation;
