'use client';

import { useVoiceCloneStore } from '@/stores/voice-clone-store';
import { Mic, Upload } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Neumorphic Voice Mode Switch Component
 * Modern neumorphism design with smooth animations
 */
export function NeumorphicModeSwitch() {
  const { inputMode, setInputMode } = useVoiceCloneStore();

  return (
    <div className="flex items-center justify-center mb-8">
      <div className="relative">
        {/* Neumorphic Container */}
        <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-2 shadow-[8px_8px_16px_#d1d5db,-8px_-8px_16px_#ffffff] dark:shadow-[8px_8px_16px_#1e293b,-8px_-8px_16px_#334155]">
          
          {/* Background Slider */}
          <motion.div
            className="absolute top-2 h-12 bg-gradient-to-br from-white to-slate-50 dark:from-slate-700 dark:to-slate-600 rounded-xl shadow-[inset_2px_2px_4px_#d1d5db,inset_-2px_-2px_4px_#ffffff] dark:shadow-[inset_2px_2px_4px_#1e293b,inset_-2px_-2px_4px_#334155]"
            initial={false}
            animate={{
              x: inputMode === 'record' ? 2 : 'calc(100% + 4px)',
              width: inputMode === 'record' ? '120px' : '116px'
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
          />

          <div className="relative flex">
            {/* Record Button */}
            <motion.button
              onClick={() => setInputMode('record')}
              className={`
                relative flex items-center gap-3 px-6 py-3 rounded-xl text-base font-medium transition-all duration-300 z-10
                ${inputMode === 'record' 
                  ? 'text-purple-600 dark:text-purple-400' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                animate={{
                  rotate: inputMode === 'record' ? [0, -10, 10, 0] : 0,
                  scale: inputMode === 'record' ? 1.1 : 1
                }}
                transition={{
                  duration: 0.5,
                  ease: "easeInOut"
                }}
              >
                <Mic className="h-5 w-5" />
              </motion.div>
              Record
            </motion.button>

            {/* Upload Button */}
            <motion.button
              onClick={() => setInputMode('upload')}
              className={`
                relative flex items-center gap-3 px-6 py-3 rounded-xl text-base font-medium transition-all duration-300 z-10
                ${inputMode === 'upload' 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                animate={{
                  y: inputMode === 'upload' ? [0, -3, 0] : 0,
                  scale: inputMode === 'upload' ? 1.1 : 1
                }}
                transition={{
                  duration: 0.5,
                  ease: "easeInOut"
                }}
              >
                <Upload className="h-5 w-5" />
              </motion.div>
              Upload
            </motion.button>
          </div>
        </div>

        {/* Glow Effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0"
          animate={{
            opacity: inputMode === 'record' ? [0, 0.3, 0] : [0, 0.2, 0],
            boxShadow: inputMode === 'record' 
              ? ['0 0 0px #8b5cf6', '0 0 20px #8b5cf6', '0 0 0px #8b5cf6']
              : ['0 0 0px #3b82f6', '0 0 20px #3b82f6', '0 0 0px #3b82f6']
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </div>
  );
}
