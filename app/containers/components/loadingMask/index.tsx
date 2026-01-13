'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { MorphingText } from '@/components/ui/morphing-text';

type Step = 'initial' | 'replacing' | 'waiting' | 'expanding' | 'opening' | 'finished';

const LoadingMask = ({ onAnimationComplete }: { onAnimationComplete?: () => void }) => {
  const [step, setStep] = useState<Step>('initial');

  const texts = ["Newbie Village", "Department Ceremony"];

  const handleClick = () => {
    if (step === 'initial') {
      setStep('replacing');
    } else if (step === 'waiting') {
      setStep('expanding');
    }
  };

  const handleTextComplete = () => {
    setStep('waiting');
  };

  const handleExpandComplete = () => {
    setStep('opening');
  };

  const handleOpenComplete = () => {
    setStep('finished');
    if (onAnimationComplete) {
      onAnimationComplete();
    }
  };

  if (step === 'finished') {
    return null;
  }

  return (
    <motion.div
      className="fixed inset-0 z-[100] cursor-pointer isolation-isolate"
      onClick={handleClick}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* White Background Layer */}
      <div className="absolute inset-0 bg-white flex items-center justify-center">
        {/* Text Layer */}
        <div className="z-10 relative w-full">
          <MorphingText
            texts={texts}
            start={step !== 'initial'}
            loop={false}
            onFinish={handleTextComplete}
            className="text-black max-w-none w-full whitespace-nowrap leading-tight"
          />
        </div>
      </div>

      {/* Hole Puncher (The "Curtain") */}
      <motion.div
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-black mix-blend-destination-out pointer-events-none"
        initial={{ width: 0, height: '10px' }}
        animate={
          step === 'expanding'
            ? { width: '100vw', height: '10px' }
            : step === 'opening'
              ? { width: '100vw', height: '100vh' }
              : { width: 0, height: '10px' }
        }
        transition={{
          duration: step === 'opening' ? 0.8 : 0.5,
          ease: "easeInOut"
        }}
        onAnimationComplete={() => {
          if (step === 'expanding') {
            handleExpandComplete();
          } else if (step === 'opening') {
            handleOpenComplete();
          }
        }}
      />
    </motion.div>
  );
};

export default LoadingMask;
