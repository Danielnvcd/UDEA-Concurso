import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    días: 0,
    horas: 0,
    minutos: 0,
    segundos: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          días: Math.floor(difference / (1000 * 60 * 60 * 24)),
          horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutos: Math.floor((difference / 1000 / 60) % 60),
          segundos: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="grid grid-cols-2 md:flex gap-4 md:gap-6 justify-center items-center my-10">
      {Object.entries(timeLeft).map(([unit, value], idx, arr) => (
        <div key={unit} className="flex items-center gap-4 md:gap-6">
          <div className="flex flex-col items-center">
            <div className="bg-white/15 backdrop-blur-md rounded-2xl w-20 h-20 md:w-24 md:h-24 flex items-center justify-center border border-white/20 shadow-sm overflow-hidden relative">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={value}
                  initial={{ y: -20, opacity: 0, filter: 'blur(4px)' }}
                  animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                  exit={{ y: 20, opacity: 0, filter: 'blur(4px)' }}
                  transition={{ duration: 0.3 }}
                  className="text-4xl md:text-5xl font-black text-white absolute"
                >
                  {value.toString().padStart(2, '0')}
                </motion.span>
              </AnimatePresence>
            </div>
            <span className="text-xs md:text-sm text-sky-200 mt-3 uppercase tracking-widest font-bold">
              {unit}
            </span>
          </div>
          {idx < arr.length - 1 && (
            <span className="text-sky-300 text-4xl font-black mb-8 hidden md:block opacity-50">:</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default CountdownTimer;
