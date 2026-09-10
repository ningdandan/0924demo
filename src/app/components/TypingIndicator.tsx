import { motion } from "motion/react";

export function TypingIndicator() {
  return (
    <div className="flex gap-[4px] items-start max-w-[70%]">
      <div className="bg-white border border-gray-200 rounded-[16px] px-[20px] py-[16px]">
        <div className="flex gap-[6px] items-center">
          <motion.div
            className="w-[8px] h-[8px] bg-gray-400 rounded-full"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
          />
          <motion.div
            className="w-[8px] h-[8px] bg-gray-400 rounded-full"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
          />
          <motion.div
            className="w-[8px] h-[8px] bg-gray-400 rounded-full"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
          />
        </div>
      </div>
    </div>
  );
}
