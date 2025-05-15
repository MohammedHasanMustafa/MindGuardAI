import { motion } from "framer-motion";
import { useMemo } from "react";
import { Brain } from "lucide-react";

const OrbitingSymbols = () => {
  const orbitingSymbols = useMemo(
    () =>
      [...Array(6)].map((_, i) => ({
        id: `symbol-${i}`,
        rotate: i * 60, 
        symbol: ["Z", "≡", "∼", "⋆", "✧", "⚛" ,][i % 6], 
        radius: 140 + Math.random() * 40, 
        duration: Math.random() * 4 + 6, 
        size: 24 + Math.random() * 15, 
      })),
    []
  );

  return (
    <div className="relative flex items-center justify-center w-full h-full">
      <div className="relative w-80 h-80 md:w-96 md:h-96 -mt-97 -mr-180">
        {/* Orbiting Symbols */}
        {orbitingSymbols.map((symbol) => (
          <motion.div
            key={symbol.id}
            className="absolute text-blue-800 font-bold"
            style={{
              width: `${symbol.size}px`,
              height: `${symbol.size}px`,
              top: "50%",
              left: "10%",
              transformOrigin: `${symbol.radius}px`,
              fontSize: `${symbol.size}px`,
                
            }}
            
            animate={{
              rotate: [symbol.rotate, symbol.rotate + 360], 
              scale: [0.95, 1.05, 0.95],
            }}
            transition={{
              duration: symbol.duration,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {symbol.symbol}
          </motion.div>
        ))}

        {/* Brain Icon */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{
            scale: [1, 1.05, 1], 
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Brain size={240} className="text-blue-300" strokeWidth={1} />
        </motion.div>
      </div>
    </div>
  );
};

export default OrbitingSymbols;
