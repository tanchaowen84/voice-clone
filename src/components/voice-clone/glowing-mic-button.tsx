'use client';

import { Mic, MicOff, Square } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlowingMicButtonProps {
  isRecording: boolean;
  isListening: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Glowing Microphone Button Component
 * Features shimmer effects, pulse animations, and neumorphic design
 */
export function GlowingMicButton({
  isRecording,
  isListening,
  onStartRecording,
  onStopRecording,
  disabled = false,
  className
}: GlowingMicButtonProps) {
  const handleClick = () => {
    if (disabled) return;
    
    if (isRecording) {
      onStopRecording();
    } else {
      onStartRecording();
    }
  };

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {/* Outer Glow Ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          scale: isRecording ? [1, 1.2, 1] : 1,
          opacity: isRecording ? [0.3, 0.6, 0.3] : 0,
        }}
        transition={{
          duration: 2,
          repeat: isRecording ? Infinity : 0,
          ease: "easeInOut"
        }}
        style={{
          background: isRecording 
            ? 'radial-gradient(circle, rgba(239, 68, 68, 0.4) 0%, rgba(239, 68, 68, 0.1) 50%, transparent 70%)'
            : 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, rgba(139, 92, 246, 0.1) 50%, transparent 70%)'
        }}
      />

      {/* Shimmer Ring */}
      <motion.div
        className="absolute inset-2 rounded-full"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          background: `conic-gradient(from 0deg, transparent 0deg, ${
            isRecording ? '#ef4444' : '#8b5cf6'
          } 60deg, transparent 120deg, ${
            isRecording ? '#ef4444' : '#8b5cf6'
          } 180deg, transparent 240deg, ${
            isRecording ? '#ef4444' : '#8b5cf6'
          } 300deg, transparent 360deg)`,
          opacity: isListening || isRecording ? 0.6 : 0.3
        }}
      />

      {/* Main Button */}
      <motion.button
        onClick={handleClick}
        disabled={disabled}
        className={cn(
          "relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300",
          "bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800",
          "shadow-[8px_8px_16px_#d1d5db,-8px_-8px_16px_#ffffff] dark:shadow-[8px_8px_16px_#1e293b,-8px_-8px_16px_#475569]",
          "hover:shadow-[6px_6px_12px_#d1d5db,-6px_-6px_12px_#ffffff] dark:hover:shadow-[6px_6px_12px_#1e293b,-6px_-6px_12px_#475569]",
          "active:shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff] dark:active:shadow-[inset_4px_4px_8px_#1e293b,inset_-4px_-4px_8px_#475569]",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        whileHover={!disabled ? { scale: 1.05 } : {}}
        whileTap={!disabled ? { scale: 0.95 } : {}}
        animate={{
          scale: isRecording ? [1, 1.1, 1] : 1,
        }}
        transition={{
          duration: 1,
          repeat: isRecording ? Infinity : 0,
          ease: "easeInOut"
        }}
      >
        {/* Inner Glow */}
        <motion.div
          className="absolute inset-2 rounded-full"
          animate={{
            opacity: isRecording ? [0.2, 0.5, 0.2] : isListening ? 0.3 : 0.1,
          }}
          transition={{
            duration: 1.5,
            repeat: isRecording ? Infinity : 0,
            ease: "easeInOut"
          }}
          style={{
            background: isRecording 
              ? 'radial-gradient(circle, rgba(239, 68, 68, 0.3) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)'
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
            repeat: isRecording ? Infinity : 0,
            ease: "easeInOut"
          }}
        >
          {isRecording ? (
            <Square 
              className={cn(
                "w-6 h-6 fill-current transition-colors duration-300",
                "text-red-500 dark:text-red-400"
              )} 
            />
          ) : disabled ? (
            <MicOff 
              className={cn(
                "w-6 h-6 transition-colors duration-300",
                "text-slate-400 dark:text-slate-500"
              )} 
            />
          ) : (
            <Mic 
              className={cn(
                "w-6 h-6 transition-colors duration-300",
                isListening 
                  ? "text-purple-600 dark:text-purple-400" 
                  : "text-slate-600 dark:text-slate-300"
              )} 
            />
          )}
        </motion.div>
      </motion.button>

      {/* Pulse Rings for Recording */}
      {isRecording && (
        <>
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-red-400"
            animate={{
              scale: [1, 1.5, 2],
              opacity: [0.6, 0.3, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut"
            }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-red-400"
            animate={{
              scale: [1, 1.5, 2],
              opacity: [0.6, 0.3, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
              delay: 0.5
            }}
          />
        </>
      )}
    </div>
  );
}
