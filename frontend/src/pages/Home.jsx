import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import About from '../pages/About.jsx';
import Feature from '../components/Feature.jsx';
import UserSteps from '../components/Steps';
import Footer from '../components/Footer.jsx';
import OrbitingSymbols from '../components/OrbitingSymbols.jsx';
import VideoSequence from '../components/VideoSequence.jsx';

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

 
    const handleGetStarted = () => {
      navigate("/login"); 
    };
    
  

  const stars = useMemo(() => [...Array(40)].map((_, i) => ({
    id: `star-${i}`,
    top: `${Math.random() * 100}vh`,
    left: `${Math.random() * 100}vw`,
    duration: Math.random() * 5 + 5,
    delay: Math.random() * 5,
  })), []);

const starlinks = useMemo(() => [...Array(10)].map((_, i) => ({
    id: `starlink-${i}`,
    top: `${Math.random() * 100}vh`,
    left: `${Math.random() * 100}vw`,
    rotate: `${Math.random() * 360}deg`,
    duration: Math.random() * 3 + 3,
    delay: Math.random() * 5,
  })), []);

const glowingParticles = useMemo(() => [...Array(20)].map((_, i) => ({
    id: `glow-${i}`,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    x: Math.random() * 100 - 50,
    y: Math.random() * 100 - 50,
    duration: 4 + Math.random() * 2
})), []);


return (
  <div className="w-full overflow-x-hidden">
    <div className="relative w-full flex flex-col items-start justify-center text-gray-800 pb-40 min-h-screen pl-10">
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-[#297194] via-[#D1E1F7] to-[#E7F2F7]"
        animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
        transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
      />

      {/* Stars and Starlinks */}
      <div className="absolute inset-0 overflow-hidden">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{ top: star.top, left: star.left }}
            animate={{ y: ['0vh', '100vh'], opacity: [1, 0] }}
            transition={{ duration: star.duration, repeat: Infinity, ease: 'linear', delay: star.delay }}
          />
        ))}

        {starlinks.map((star) => (
          <motion.div
            key={star.id}
            className="absolute w-0.5 h-6  rounded-full shadow-lg"
            style={{ top: star.top, left: star.left, rotate: star.rotate ,backgroundColor: '#E0F7FF'}}
          
            animate={{ y: ['-10vh', '110vh'], opacity: [0, 1, 0] }}
            transition={{ duration: star.duration, repeat: Infinity, ease: 'linear', delay: star.delay }}
          />
        ))}

        {/* Glowing Particles */}
        {glowingParticles.map((particle) => (
  <motion.div
    key={particle.id}
    className="absolute w-2 h-2 bg-blue-800 rounded-full shadow-lg"
    animate={{
      x: [particle.x, particle.x * -1, 0], 
      y: [particle.y, particle.y * -1, 0],
      boxShadow: [
        "0px 0px 10px rgba(41,113,148,0.9)",
        "0px 0px 15px rgba(41,113,148,0.7)",
        "0px 0px 20px rgba(41,113,148,0.5)",
      ],
    }}
    transition={{
      duration: particle.duration,
      repeat: Infinity,
      ease: "easeInOut",
    }}
    style={{
      top: particle.top,
      left: particle.left,
    }}
  />
))}

      </div>

        <motion.div 
          className="relative z-10 text-left p-6 mt-28 max-w-lg"
          animate={{ y: [-10, 0, -10] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        >
          <motion.h3
  className="text-4xl md:text-6xl font-bold mt-0 whitespace-nowrap text-gray-900"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: [0, -5, 0] }}
  transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
>
  Welcome to <span className="text-gray-900">MindGuard</span>
  <img src="/logo.png" alt="MindGuard Logo" className="w-12 h-12 md:w-16 md:h-16 inline" />
</motion.h3>


          <motion.p className="mt-4 text-lg md:text-xl">Neuro-Linguistic Psychometric Adversarial Prognosis</motion.p>

          <motion.p className="mt-2 text-md md:text-lg">
            Empowering minds with cutting-edge AI. MindGuard combines Neuro-Linguistic Processing,
            Psychometric Analysis, and Deep Learning to provide real-time mental health insights,
            early risk detection, and proactive emotional support.
          </motion.p>

         <motion.button
  className="mt-6 px-8 py-3 bg-gradient-to-r from-[#297194] via-[#D1E1F7] to-[#E7F2F7] text-gray-900 font-semibold rounded-full shadow-lg hover:from-[#E7F2F7] hover:to-[#297194] transition-all duration-300 relative overflow-hidden"
  initial={{ scale: 0 }}
  animate={{ scale: 1 }}
  transition={{ duration: 0.5, delay: 0.2 }}
  whileHover={{
    scale: 1.15,
    rotate: 2,
    y: -3,
    boxShadow:"#ffff"
  }}
  onClick={handleGetStarted}
>
  <span className="absolute inset-0 bg-gradient-to-r from-[#297194] to-[#D1E1F7] opacity-0 hover:opacity-30 transition-all duration-500 rounded-full"></span>
  <span className="relative z-10">Get Started</span>
</motion.button>

        </motion.div>

      <OrbitingSymbols/>
 
    
<VideoSequence/>

        <div className="absolute bottom-[-5px] left-0 w-full">
          <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path
              fill="white"
              fillOpacity="1"
              d="M0,192L48,186.7C96,181,192,171,288,176C384,181,480,203,576,197.3C672,192,768,160,864,165.3C960,171,1056,213,1152,224C1248,235,1344,213,1392,202.7L1440,192V320H0Z"
            ></path>
          </svg>
        </div>
      </div>

      <About />
      <Feature />
      <UserSteps />
      <Footer />
    </div>
  );
}

export default Home;