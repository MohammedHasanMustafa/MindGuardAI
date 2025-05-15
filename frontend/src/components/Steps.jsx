import { motion } from "framer-motion";
import { User, FileText, Brain, BarChart, MessageCircle, ShieldCheck } from "lucide-react";

const steps = [
  { id: 1, title: "Sign Up / Login", description: "Users create an account or log in to access the platform.", icon: <User size={24} />, color: "bg-blue-500" },
  { id: 2, title: "Submit Mental Health Survey", description: "User fills out a short questionnaire about their mental state.", icon: <FileText size={24} />, color: "bg-green-500" },
  { id: 3, title: "AI Analysis & Prediction", description: "Our AI model analyzes user input and predicts mental health trends.", icon: <Brain size={24} />, color: "bg-purple-500" },
  { id: 4, title: "View Detailed Reports", description: "Users receive a detailed emotional analysis and trends.", icon: <BarChart size={24} />, color: "bg-yellow-500" },
  { id: 5, title: "Chat with AI Assistant", description: "Users can interact with the AI chatbot for mental health support.", icon: <MessageCircle size={24} />, color: "bg-red-500" },
  { id: 6, title: "Personalized Recommendations", description: "App suggests self-care tips, therapy resources, and mood tracking.", icon: <ShieldCheck size={24} />, color: "bg-indigo-500" },
];

const UserSteps = () => {
  return (
    <section className="relative bg-white py-20">
      {/* Wave Effect at the Top */}
      <div className="absolute top-0 left-0 w-full -mt-1">
        <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path
            fill="white"
            fillOpacity="1"
            d="M0,128L48,160C96,192,192,256,288,256C384,256,480,192,576,160C672,128,768,128,864,144C960,160,1056,192,1152,213.3C1248,235,1344,245,1392,250.7L1440,256V320H0V128Z"
          ></path>
        </svg>
      </div>

      {/* Section Title */}
      <div className="text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">How It Works</h2>
        <p className="mt-2 text-gray-600 text-lg">A simple process to get personalized mental health insights.</p>
        <div className="w-16 h-1 bg-blue-500 mx-auto mt-4"></div>
      </div>

      {/* Timeline */}
      <div className="container mx-auto mt-12 px-6 lg:px-20 relative">
        {/* Center Vertical Line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gray-300 h-full hidden md:block"></div>

        {steps.map((step, index) => (
          <div key={step.id} className="relative flex items-center justify-center">
            {/* Step Number on Center Line - Shifted */}
            <div
              className={`absolute w-12 h-12 flex items-center justify-center rounded-full bg-gray-800 text-white text-lg font-bold shadow-lg z-10 
              ${index % 2 === 0 ? "left-[47%] md:left-[46%]" : "left-[51%] md:left-[50%]"}`}
            >
              {step.id}
            </div>

            {/* Step Box - Alternating Left & Right */}
            <motion.div
              className={`relative flex items-center max-w-lg w-full p-6 rounded-lg shadow-lg text-white 
              ${index % 2 === 0 ? "md:mr-auto md:text-right flex-row-reverse" : "md:ml-auto md:text-left"} 
              ${step.color}`}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              {/* Icon Placement */}
              <div className={`${index % 2 === 0 ? "ml-4" : "mr-4"}`}>{step.icon}</div>

              {/* Step Content */}
              <div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-sm">{step.description}</p>
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default UserSteps;
