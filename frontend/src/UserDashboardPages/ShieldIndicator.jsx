import { motion } from "framer-motion";

const ShieldIndicator = ({ level, label }) => {
  const styles = {
    low: { bgColor: "green", icon: "✔️" },
    medium: { bgColor: "orange", icon: "⚠️" },
    high: { bgColor: "red", icon: "❌" },
  };

  // Normalize the level prop
  const normalizedLevel =
    typeof level === "string" ? level.toLowerCase() : "low";

  

  const currentStyle = styles[normalizedLevel] || styles.low;

  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="flex flex-col items-center justify-center text-center transition-all"
    >
      {/* Shield background */}
      <div
        className="relative w-20 h-28"
        style={{
          backgroundImage: `url('/shield.png')`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        {/* Icon inside shield */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            color: "white",
            fontSize: "24px",
          }}
        >
          <motion.span
            className="w-8 h-8 flex items-center justify-center rounded-full"
            style={{
              backgroundColor: currentStyle.bgColor,
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
            }}
            whileHover={{ rotate: 10 }}
          >
            {currentStyle.icon}
          </motion.span>
        </div>
      </div>

      {/* Label below the shield */}
      <motion.span
        className="mt-2 text-lg font-semibold"
        style={{ color: currentStyle.bgColor }}
        whileHover={{ scale: 1.05 }}
      >
        {label}
      </motion.span>
    </motion.div>
  );
};

export default ShieldIndicator;
