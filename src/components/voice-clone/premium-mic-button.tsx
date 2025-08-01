'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Mic, Square } from 'lucide-react';

interface PremiumMicButtonProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  className?: string;
}

/**
 * Premium Microphone Button Component
 * Features shimmer effects, glow animations, and premium neumorphic design
 * Inspired by Magic UI and Aceternity UI design patterns
 */
export function PremiumMicButton({
  isRecording,
  onStartRecording,
  onStopRecording,
  className,
}: PremiumMicButtonProps) {
  const handleClick = () => {
    if (isRecording) {
      onStopRecording();
    } else {
      onStartRecording();
    }
  };

  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      {/* Outer Shimmer Ring */}
      <motion.div
        className="absolute w-20 h-20 rounded-full"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: 'linear',
        }}
        style={{
          background: `conic-gradient(from 0deg, transparent 0deg, ${
            isRecording ? '#ef4444' : '#8b5cf6'
          } 60deg, transparent 120deg, ${
            isRecording ? '#ef4444' : '#8b5cf6'
          } 180deg, transparent 240deg, ${
            isRecording ? '#ef4444' : '#8b5cf6'
          } 300deg, transparent 360deg)`,
          opacity: isRecording ? 0.9 : 0.6,
        }}
      />

      {/* Glow Effect */}
      <motion.div
        className="absolute w-18 h-18 rounded-full"
        animate={{
          opacity: isRecording ? [0.4, 0.8, 0.4] : [0.1, 0.4, 0.1],
          scale: isRecording ? [1, 1.1, 1] : [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: 'easeInOut',
        }}
        style={{
          background: isRecording
            ? 'radial-gradient(circle, rgba(239, 68, 68, 0.5) 0%, rgba(239, 68, 68, 0.2) 40%, transparent 70%)'
            : 'radial-gradient(circle, rgba(139, 92, 246, 0.5) 0%, rgba(139, 92, 246, 0.2) 40%, transparent 70%)',
          filter: 'blur(12px)',
        }}
      />

      {/* Secondary Glow */}
      <motion.div
        className="absolute w-16 h-16 rounded-full"
        animate={{
          opacity: isRecording ? [0.3, 0.6, 0.3] : [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 1.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: 'easeInOut',
          delay: 0.5,
        }}
        style={{
          background: isRecording
            ? 'radial-gradient(circle, rgba(239, 68, 68, 0.4) 0%, transparent 60%)'
            : 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 60%)',
          filter: 'blur(8px)',
        }}
      />

      {/* Main Button */}
      <motion.button
        onClick={handleClick}
        className={cn(
          'relative z-10 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300',
          // Premium gradient background
          'bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-slate-700 dark:via-slate-750 dark:to-slate-800',
          // Enhanced neumorphic shadows with inner highlights
          'shadow-[8px_8px_16px_#d1d5db,-8px_-8px_16px_#ffffff,inset_2px_2px_4px_rgba(255,255,255,0.9),inset_-1px_-1px_2px_rgba(0,0,0,0.1)] dark:shadow-[8px_8px_16px_#1e293b,-8px_-8px_16px_#475569,inset_2px_2px_4px_rgba(71,85,105,0.9),inset_-1px_-1px_2px_rgba(0,0,0,0.3)]',
          // Hover effects
          'hover:shadow-[6px_6px_12px_#d1d5db,-6px_-6px_12px_#ffffff,inset_3px_3px_6px_rgba(255,255,255,0.95),inset_-2px_-2px_4px_rgba(0,0,0,0.05)] dark:hover:shadow-[6px_6px_12px_#1e293b,-6px_-6px_12px_#475569,inset_3px_3px_6px_rgba(71,85,105,0.95),inset_-2px_-2px_4px_rgba(0,0,0,0.2)]',
          // Active/pressed effects
          'active:shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff,inset_1px_1px_2px_rgba(0,0,0,0.2)] dark:active:shadow-[inset_4px_4px_8px_#1e293b,inset_-4px_-4px_8px_#475569,inset_1px_1px_2px_rgba(0,0,0,0.4)]',
          // Border for definition
          'border border-white/30 dark:border-slate-600/30',
          // Backdrop blur for glass effect
          'backdrop-blur-sm'
        )}
        whileHover={{
          scale: 1.05,
          transition: { duration: 0.2 },
        }}
        whileTap={{
          scale: 0.95,
          transition: { duration: 0.1 },
        }}
        animate={{
          scale: isRecording ? [1, 1.08, 1] : 1,
        }}
        transition={{
          duration: 1,
          repeat: isRecording ? Number.POSITIVE_INFINITY : 0,
          ease: 'easeInOut',
        }}
      >
        {/* Inner Highlight Ring */}
        <motion.div
          className="absolute inset-1 rounded-full"
          animate={{
            opacity: isRecording ? [0.3, 0.6, 0.3] : [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
          }}
          style={{
            background: isRecording
              ? 'radial-gradient(circle, rgba(239, 68, 68, 0.2) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)',
          }}
        />

        {/* Icon */}
        <motion.div
          animate={{
            rotate: isRecording ? [0, 5, -5, 0] : 0,
            scale: isRecording ? 1.1 : 1,
          }}
          transition={{
            duration: 0.5,
            repeat: isRecording ? Number.POSITIVE_INFINITY : 0,
            ease: 'easeInOut',
          }}
        >
          {isRecording ? (
            <Square
              className={cn(
                'w-5 h-5 fill-current transition-colors duration-300',
                'text-red-500 dark:text-red-400 drop-shadow-sm'
              )}
            />
          ) : (
            <Mic
              className={cn(
                'w-5 h-5 transition-colors duration-300',
                'text-purple-600 dark:text-purple-400 drop-shadow-sm'
              )}
            />
          )}
        </motion.div>
      </motion.button>

      {/* Pulse Rings for Recording */}
      {isRecording && (
        <>
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-red-400/50"
            animate={{
              scale: [1, 1.5, 1.8],
              opacity: [0.6, 0.2, 0],
            }}
            transition={{
              duration: 3.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-red-400/30"
            animate={{
              scale: [1, 1.5, 1.8],
              opacity: [0.4, 0.15, 0],
            }}
            transition={{
              duration: 3.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
              delay: 1.75,
            }}
          />
        </>
      )}
    </div>
  );
}
