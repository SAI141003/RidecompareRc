
const WelcomeAnimation = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="text-center animate-fade-up">
        <div className="w-32 h-32 mx-auto bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-2xl flex items-center justify-center mb-6 animate-scale-in">
          <span className="text-5xl font-bold text-white">RC</span>
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent animate-fade-in">
          RideCompare
        </h1>
      </div>
    </div>
  );
};

export default WelcomeAnimation;
