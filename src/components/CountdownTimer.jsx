import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = +new Date(targetDate) - +new Date();
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          mins: Math.floor((diff / 1000 / 60) % 60),
          secs: Math.floor((diff / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 });
      }
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const units = [
    { label: 'Dias', value: timeLeft.days },
    { label: 'Horas', value: timeLeft.hours },
    { label: 'Min', value: timeLeft.mins },
    { label: 'Seg', value: timeLeft.secs },
  ];

  return (
    <div className="flex gap-1.5 sm:gap-3 md:gap-5 justify-center items-center my-8 sm:my-10">
      {units.map((unit, idx) => (
        <div key={unit.label} className="flex items-center gap-1.5 sm:gap-3 md:gap-5">
          <div className="flex flex-col items-center">
            <div className="liquid-glass rounded-xl sm:rounded-2xl w-[3.25rem] h-[3.25rem] sm:w-[4.5rem] sm:h-[4.5rem] md:w-24 md:h-24 flex items-center justify-center">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={unit.value}
                  initial={{ y: -24, opacity: 0, filter: 'blur(6px)' }}
                  animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                  exit={{ y: 24, opacity: 0, filter: 'blur(6px)' }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="text-2xl sm:text-3xl md:text-5xl font-medium text-white absolute tabular-nums"
                  style={{ fontFamily: "'Instrument Serif', serif" }}
                >
                  {unit.value.toString().padStart(2, '0')}
                </motion.span>
              </AnimatePresence>
            </div>
            <span className="text-[0.6rem] sm:text-[0.65rem] md:text-xs text-white/65 mt-2 sm:mt-2.5 uppercase tracking-[0.18em] sm:tracking-[0.22em] font-medium">
              {unit.label}
            </span>
          </div>
          {idx < units.length - 1 && (
            <span className="text-white/20 text-base sm:text-2xl md:text-3xl font-light mb-5 sm:mb-6">:</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default CountdownTimer;
