import React from 'react';
import { motion } from 'motion/react';

interface EmoBuddyProps {
  mood?: 'cheerful' | 'calm' | 'listening' | 'breathing' | 'celebrating';
  speech?: string;
  size?: 'sm' | 'md' | 'lg';
  showSpeechBubble?: boolean;
}

export const EmoBuddy: React.FC<EmoBuddyProps> = ({
  mood = 'cheerful',
  speech,
  size = 'md',
  showSpeechBubble = true,
}) => {
  const sizeMap = {
    sm: { box: 'w-24 h-24', ears: 'h-10', body: 'w-20' },
    md: { box: 'w-36 h-36 md:w-44 md:h-44', ears: 'h-14 md:h-18', body: 'w-32 md:w-36' },
    lg: { box: 'w-48 h-48 md:w-56 md:h-56', ears: 'h-20 md:h-24', body: 'w-40 md:w-48' },
  };

  return (
    <div className="flex flex-col items-center justify-center relative select-none">
      {/* Speech bubble */}
      {showSpeechBubble && speech && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="mb-3 max-w-sm md:max-w-md bg-white border-2 border-emerald-200 shadow-md rounded-2xl px-5 py-3 text-center relative"
        >
          <p className="text-lg md:text-xl font-bold text-emerald-900 leading-snug font-['Fredoka',sans-serif]">
            {speech}
          </p>
          {/* Bubble beak */}
          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r-2 border-b-2 border-emerald-200 rotate-45" />
        </motion.div>
      )}

      {/* Bunny Character Illustration */}
      <motion.div
        animate={
          mood === 'breathing'
            ? { scale: [0.95, 1.05, 0.95] }
            : mood === 'celebrating'
            ? { y: [0, -10, 0], rotate: [-2, 2, -2] }
            : { y: [0, -4, 0] }
        }
        transition={{
          duration: mood === 'breathing' ? 4 : mood === 'celebrating' ? 1.5 : 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className={`relative ${sizeMap[size].box} flex items-center justify-center`}
      >
        <svg
          viewBox="0 0 200 220"
          className="w-full h-full drop-shadow-sm filter"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="bunnyBody" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#F5F0E6" />
            </linearGradient>
            <linearGradient id="innerEar" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FED7E2" />
              <stop offset="100%" stopColor="#FBB6CE" />
            </linearGradient>
            <linearGradient id="scarfGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#A7F3D0" />
              <stop offset="100%" stopColor="#6EE7B7" />
            </linearGradient>
          </defs>

          {/* Left Ear */}
          <motion.path
            d="M 68 85 C 45 40 40 10 65 8 C 85 6 88 40 82 85 Z"
            fill="url(#bunnyBody)"
            stroke="#E2E8F0"
            strokeWidth="3"
            animate={{ rotate: mood === 'listening' ? [0, -6, 0] : [0, -3, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '70px 85px' }}
          />
          {/* Left Ear Inner */}
          <path
            d="M 67 75 C 53 45 50 22 66 18 C 78 14 78 40 76 75 Z"
            fill="url(#innerEar)"
            opacity="0.85"
          />

          {/* Right Ear */}
          <motion.path
            d="M 132 85 C 155 40 160 10 135 8 C 115 6 112 40 118 85 Z"
            fill="url(#bunnyBody)"
            stroke="#E2E8F0"
            strokeWidth="3"
            animate={{ rotate: mood === 'listening' ? [0, 6, 0] : [0, 3, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
            style={{ transformOrigin: '130px 85px' }}
          />
          {/* Right Ear Inner */}
          <path
            d="M 133 75 C 147 45 150 22 134 18 C 122 14 122 40 124 75 Z"
            fill="url(#innerEar)"
            opacity="0.85"
          />

          {/* Bunny Head & Body */}
          <ellipse
            cx="100"
            cy="125"
            rx="58"
            ry="52"
            fill="url(#bunnyBody)"
            stroke="#E2E8F0"
            strokeWidth="3"
          />

          {/* Soft Cheeks */}
          <ellipse cx="66" cy="138" rx="10" ry="6" fill="#FBCFE8" opacity="0.75" />
          <ellipse cx="134" cy="138" rx="10" ry="6" fill="#FBCFE8" opacity="0.75" />

          {/* Eyes according to mood */}
          {mood === 'calm' || mood === 'breathing' ? (
            // Relaxed happy sleeping curved eyes
            <>
              <path
                d="M 72 126 Q 80 120 88 126"
                fill="none"
                stroke="#4A5568"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M 112 126 Q 120 120 128 126"
                fill="none"
                stroke="#4A5568"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </>
          ) : (
            // Big friendly sparkly eyes
            <>
              <ellipse cx="80" cy="124" rx="6.5" ry="8" fill="#2D3748" />
              <ellipse cx="120" cy="124" rx="6.5" ry="8" fill="#2D3748" />
              {/* Eye sparkle */}
              <circle cx="78" cy="121" r="2.5" fill="#FFFFFF" />
              <circle cx="118" cy="121" r="2.5" fill="#FFFFFF" />
            </>
          )}

          {/* Nose */}
          <polygon
            points="96,134 104,134 100,139"
            fill="#F472B6"
            stroke="#F472B6"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Mouth */}
          <path
            d="M 94 140 Q 100 146 106 140"
            fill="none"
            stroke="#4A5568"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Little Calm Mint Scarf/Bandana */}
          <path
            d="M 65 165 Q 100 182 135 165 Q 100 160 65 165 Z"
            fill="url(#scarfGrad)"
            stroke="#34D399"
            strokeWidth="2"
          />
          {/* Little leafy badge */}
          <circle cx="100" cy="170" r="5" fill="#10B981" />
          <circle cx="100" cy="170" r="2" fill="#ECFDF5" />
        </svg>

        {/* Small badge label */}
        <div className="absolute -bottom-1 bg-emerald-100/90 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full border border-emerald-300 shadow-sm">
          Emo-Buddy
        </div>
      </motion.div>
    </div>
  );
};
